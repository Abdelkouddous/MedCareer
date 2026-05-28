import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard Security & Layout", () => {
  test.beforeEach(async ({ page }) => {
    // Start at home
    await page.goto("/");
  });

  test("guest user attempting to visit admin dashboard should redirect to login", async ({ page }) => {
    await page.goto("/dashboard/admin");
    // Should immediately bounce to login
    await expect(page).toHaveURL(/.*login/);
  });

  test("standard recruiter attempting to visit admin dashboard should redirect to /dashboard with toast", async ({ page }) => {
    // 1. Log in as a standard recruiter
    await page.goto("/login");
    await page.fill('input[name="email"]', "employer2@VitalWork.dz");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect to default recruiter dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Direct navigation attempt to admin dashboard
    await page.goto("/dashboard/admin");

    // 3. Verify bounce to /dashboard
    await expect(page).toHaveURL(/\/dashboard$/);

    // 4. Verify access denied toast is visible
    await expect(page.locator("text=Access Denied: Administrators only.")).toBeVisible();
  });

  test("admin user visiting admin dashboard should load layout and allow switching tabs", async ({ page }) => {
    // 1. Log in as administrator
    await page.goto("/login");
    await page.fill('input[name="email"]', "abdelkouddoushamel@vitalwork.dz");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Navigate to admin dashboard
    await page.goto("/dashboard/admin");
    await expect(page).toHaveURL(/.*dashboard\/admin/);

    // 3. Verify custom layout components are loaded
    await expect(page.locator("text=VitalWork CEO Hub")).toBeVisible();
    await expect(page.locator("text=CEO Command Centre")).toBeVisible();

    // Verify custom sidebar links
    const bigSidebar = page.locator("aside").nth(1);
    await expect(bigSidebar.locator("text=Overview")).toBeVisible();
    const financialLink = bigSidebar.locator('button:has-text("Financial Engine")');
    await expect(financialLink).toBeVisible();
    await expect(bigSidebar.locator("text=Recruiters")).toBeVisible();
    await expect(bigSidebar.locator("text=Professionals")).toBeVisible();
    await expect(bigSidebar.locator("text=Health & Insights")).toBeVisible();
    await expect(bigSidebar.locator("text=Recruiter Portal")).toBeVisible();

    // 4. Click tabs and verify content changes
    await financialLink.click();
    await expect(page.locator("text=Financial Engine KPI Summary")).toBeVisible();

    // Click recruiters tab
    const recruitersLink = bigSidebar.locator('button:has-text("Recruiters")');
    await recruitersLink.click();
    await expect(page.locator("text=Recruiter Accounts Registry")).toBeVisible();

    // 5. Verify logout dropdown works
    await page.click('nav button:has-text("VitalWork")');
    const logoutBtn = page.locator('button:has-text("Logout Session")');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Verify redirect to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator("text=Session ended successfully")).toBeVisible();
  });
});
