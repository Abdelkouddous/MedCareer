import { chromium } from "playwright";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "/Users/morsistoredz/.gemini/antigravity/brain/51d828d2-0e83-47bf-8353-9825e0a0aa39";
const BASE_URL = "http://localhost:5173";
const MONGO_URL = "mongodb+srv://abdelkouddoushamel:secret12345@cluster1.lxsq5.mongodb.net/";

// Generate paths for outputs
const getPath = (name) => path.join(ARTIFACTS_DIR, name);

async function activateUserInDb(email, collection) {
  console.log(`Connecting to MongoDB to activate ${email}...`);
  const conn = await mongoose.createConnection(MONGO_URL).asPromise();
  
  const schema = new mongoose.Schema({
    email: String,
    isConfirmed: Boolean,
  }, { strict: false });

  const Model = conn.model("UserActivation", schema, collection);
  const res = await Model.updateOne({ email: email.toLowerCase() }, { isConfirmed: true });
  console.log(`DB Activation status for ${email}:`, res);
  
  await conn.close();
}

async function captureScreens() {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({
    headless: true,
  });

  // 1. Desktop Context (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // High resolution retina scale
  });
  const desktopPage = await desktopContext.newPage();

  console.log("1. Capturing Landing Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/`);
  await desktopPage.waitForTimeout(2000); // Allow animations to settle
  await desktopPage.screenshot({ path: getPath("raw_landing_desktop.png") });

  console.log("2. Capturing Employer Login Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/login`);
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: getPath("raw_login_employer.png") });

  console.log("3. Capturing Employer Forgot Password Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/forgot-password`);
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: getPath("raw_forgot_password_employer.png") });

  console.log("4. Capturing Job Seeker Login Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/job-seekers/login`);
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: getPath("raw_login_seeker.png") });

  console.log("5. Capturing Job Seeker Forgot Password Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/job-seekers/forgot-password`);
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: getPath("raw_forgot_password_seeker.png") });

  // --- Authenticate Employer ---
  console.log("Authenticating Employer...");
  await desktopPage.goto(`${BASE_URL}/login`);
  await desktopPage.fill('input[name="email"]', "test.employer@example.com");
  await desktopPage.fill('input[name="password"]', "password123");
  await desktopPage.click('button[type="submit"]');
  
  // Wait for redirect to dashboard
  try {
    await desktopPage.waitForURL(url => url.pathname.startsWith('/dashboard') && !url.pathname.includes('/login'), { timeout: 5000 });
    console.log("Login successful! Redirected to Employer Dashboard.");
  } catch (err) {
    console.log("Employer login failed or timed out. Attempting to register new test employer...");
    await desktopPage.goto(`${BASE_URL}/register`);
    await desktopPage.fill('input[name="name"]', "Dr. Portfolio");
    await desktopPage.fill('input[name="lastName"]', "Employer");
    await desktopPage.fill('input[name="location"]', "Algiers, Algeria");
    await desktopPage.fill('input[name="email"]', "test.employer@example.com");
    await desktopPage.fill('input[name="password"]', "password123");
    await desktopPage.fill('input[name="confirmPassword"]', "password123");
    await desktopPage.click('button[type="submit"]');
    
    // Wait for redirect to OTP page
    try {
      await desktopPage.waitForURL(/\/confirm-account/, { timeout: 5000 });
      console.log("Registered! Hit confirm-account page.");
    } catch (e) {
      console.log("Not on confirm-account page, proceeding...");
    }

    // Direct DB activation
    await activateUserInDb("test.employer@example.com", "employers");

    // Navigate to login again and login
    console.log("Logging in as newly registered/activated Employer...");
    await desktopPage.goto(`${BASE_URL}/login`);
    await desktopPage.fill('input[name="email"]', "test.employer@example.com");
    await desktopPage.fill('input[name="password"]', "password123");
    await desktopPage.click('button[type="submit"]');
    await desktopPage.waitForURL(url => url.pathname.startsWith('/dashboard') && !url.pathname.includes('/login'), { timeout: 8000 });
  }

  console.log("6. Capturing Employer Dashboard - Add Job (Desktop)...");
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_employer_addjob.png") });

  console.log("7. Capturing Employer My Jobs (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/dashboard/my-jobs`);
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_employer_myjobs.png") });

  console.log("8. Capturing Employer Profile Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/dashboard/profile`);
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_employer_profile.png") });

  // Logout Employer
  await desktopPage.goto(`${BASE_URL}/`);
  await desktopContext.clearCookies();

  // --- Authenticate Job Seeker ---
  console.log("Authenticating Job Seeker...");
  await desktopPage.goto(`${BASE_URL}/job-seekers/login`);
  await desktopPage.fill('input[name="email"]', "test.jobseeker@example.com");
  await desktopPage.fill('input[name="password"]', "password123");
  await desktopPage.click('button[type="submit"]');

  try {
    await desktopPage.waitForURL(url => url.pathname.startsWith('/job-seekers') && !url.pathname.includes('/login'), { timeout: 5000 });
    console.log("Login successful! Redirected to Job Seeker Dashboard.");
  } catch (err) {
    console.log("Job Seeker login failed or timed out. Attempting to register new test seeker...");
    await desktopPage.goto(`${BASE_URL}/job-seekers/register`);
    await desktopPage.fill('input[name="name"]', "Dr. Portfolio");
    await desktopPage.fill('input[name="lastName"]', "JobSeeker");
    await desktopPage.fill('input[name="email"]', "test.jobseeker@example.com");
    await desktopPage.fill('input[name="password"]', "password123");
    await desktopPage.selectOption('select[name="location"]', "Alger");
    await desktopPage.fill('input[name="phoneNumber"]', "+213555555555");
    await desktopPage.click('button[type="submit"]');

    // Wait for OTP page
    try {
      await desktopPage.waitForURL(/\/job-seekers\/confirm-account/, { timeout: 5000 });
      console.log("Registered! Hit job-seekers confirm-account page.");
    } catch (e) {
      console.log("Not on seeker confirm-account page, proceeding...");
    }

    // Direct DB activation
    await activateUserInDb("test.jobseeker@example.com", "jobseekers");

    // Login
    console.log("Logging in as newly registered/activated Job Seeker...");
    await desktopPage.goto(`${BASE_URL}/job-seekers/login`);
    await desktopPage.fill('input[name="email"]', "test.jobseeker@example.com");
    await desktopPage.fill('input[name="password"]', "password123");
    await desktopPage.click('button[type="submit"]');
    await desktopPage.waitForURL(url => url.pathname.startsWith('/job-seekers') && !url.pathname.includes('/login'), { timeout: 8000 });
  }

  console.log("9. Capturing Job Seeker Dashboard (Desktop)...");
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_seeker_dashboard.png") });

  console.log("10. Capturing Job Seeker Profile (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/job-seekers/profile`);
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_seeker_profile.png") });

  console.log("11. Capturing Job Seeker Jobs Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/job-seekers/jobs`);
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_seeker_jobs.png") });

  console.log("12. Capturing Job Seeker Inbox Page (Desktop)...");
  await desktopPage.goto(`${BASE_URL}/job-seekers/inbox`);
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({ path: getPath("raw_seeker_inbox.png") });

  // Close desktop context
  await desktopContext.close();

  // 2. Mobile Context (375x812)
  console.log("Launching Mobile viewport...");
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3, // Very sharp mobile display scale
  });
  const mobilePage = await mobileContext.newPage();

  console.log("13. Capturing Landing Page (Mobile)...");
  await mobilePage.goto(`${BASE_URL}/`);
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: getPath("raw_landing_mobile.png") });

  console.log("14. Capturing Job Seeker Login (Mobile)...");
  await mobilePage.goto(`${BASE_URL}/job-seekers/login`);
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: getPath("raw_login_seeker_mobile.png") });

  await mobileContext.close();
  await browser.close();
  console.log("Screenshots captured successfully!");
}

captureScreens().catch(err => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
