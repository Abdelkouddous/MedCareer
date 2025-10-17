import { test, expect } from "@playwright/test";

test.describe("MedCareer E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto("/");
  });

  test.describe("Landing Page", () => {
    test("should display landing page correctly", async ({ page }) => {
      // Check if main elements are visible
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("text=MedCareer")).toBeVisible();

      // Check navigation links
      await expect(page.locator('a[href*="jobs"]')).toBeVisible();
      await expect(page.locator('a[href*="login"]')).toBeVisible();
      await expect(page.locator('a[href*="register"]')).toBeVisible();
    });

    test("should navigate to job listings", async ({ page }) => {
      await page.click('a[href*="jobs"]');
      await expect(page).toHaveURL(/.*jobs/);
      await expect(page.locator("text=Available Jobs")).toBeVisible();
    });
  });

  test.describe("Authentication Flow", () => {
    test("should complete employer registration flow", async ({ page }) => {
      // Navigate to registration
      await page.click('a[href*="register"]');
      await expect(page).toHaveURL(/.*register/);

      // Fill registration form
      await page.fill('input[name="name"]', "Dr. Test Employer");
      await page.fill('input[name="lastName"]', "Smith");
      await page.fill('input[name="email"]', "test.employer@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="location"]', "Algiers, Algeria");
      await page.selectOption('select[name="specialty"]', "Cardiologist");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(page.locator("text=Registration successful")).toBeVisible();
    });

    test("should complete employer login flow", async ({ page }) => {
      // Navigate to login
      await page.click('a[href*="login"]');
      await expect(page).toHaveURL(/.*login/);

      // Fill login form
      await page.fill('input[name="email"]', "test.employer@example.com");
      await page.fill('input[name="password"]', "password123");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for successful login (redirect to dashboard)
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator("text=Welcome")).toBeVisible();
    });

    test("should complete job seeker registration flow", async ({ page }) => {
      // Navigate to job seeker registration
      await page.click('a[href*="job-seekers/register"]');
      await expect(page).toHaveURL(/.*job-seekers.*register/);

      // Fill registration form
      await page.fill('input[name="name"]', "Dr. Test JobSeeker");
      await page.fill('input[name="lastName"]', "Johnson");
      await page.fill('input[name="email"]', "test.jobseeker@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="location"]', "Oran, Algeria");
      await page.selectOption('select[name="specialty"]', "Pediatrician");
      await page.fill('input[name="experience"]', "5 years");
      await page.fill('input[name="education"]', "MD");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(page.locator("text=Registration successful")).toBeVisible();
    });
  });

  test.describe("Job Management", () => {
    test.beforeEach(async ({ page }) => {
      // Login as employer before each job management test
      await page.goto("/login");
      await page.fill('input[name="email"]', "test.employer@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*dashboard/);
    });

    test("should create a new job posting", async ({ page }) => {
      // Navigate to add job page
      await page.click('a[href*="add-job"]');
      await expect(page).toHaveURL(/.*add-job/);

      // Fill job form
      await page.fill('input[name="position"]', "Senior Cardiologist");
      await page.fill('input[name="company"]', "Heart Hospital");
      await page.fill('input[name="jobLocation"]', "Algiers, Algeria");
      await page.selectOption('select[name="jobType"]', "full-time");
      await page.fill(
        'textarea[name="description"]',
        "Looking for an experienced cardiologist..."
      );
      await page.fill(
        'textarea[name="requirements"]',
        "MD degree, 5+ years experience"
      );
      await page.fill('input[name="salary"]', "150000-200000 DZD");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(page.locator("text=Job created successfully")).toBeVisible();
    });

    test("should edit an existing job", async ({ page }) => {
      // Navigate to jobs list
      await page.click('a[href*="jobs"]');
      await expect(page).toHaveURL(/.*jobs/);

      // Click edit button on first job
      await page.click('button:has-text("Edit")');
      await expect(page).toHaveURL(/.*edit-job/);

      // Update job details
      await page.fill(
        'input[name="position"]',
        "Senior Cardiologist - Updated"
      );
      await page.fill('input[name="salary"]', "160000-210000 DZD");

      // Submit form
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(page.locator("text=Job updated successfully")).toBeVisible();
    });

    test("should delete a job", async ({ page }) => {
      // Navigate to jobs list
      await page.click('a[href*="jobs"]');
      await expect(page).toHaveURL(/.*jobs/);

      // Click delete button on first job
      await page.click('button:has-text("Delete")');

      // Confirm deletion
      await page.click('button:has-text("Confirm")');

      // Check for success message
      await expect(page.locator("text=Job deleted successfully")).toBeVisible();
    });
  });

  test.describe("Job Search and Application", () => {
    test("should search for jobs", async ({ page }) => {
      // Navigate to jobs page
      await page.click('a[href*="jobs"]');
      await expect(page).toHaveURL(/.*jobs/);

      // Use search functionality
      await page.fill('input[placeholder*="search"]', "cardiologist");
      await page.click('button:has-text("Search")');

      // Check if results are filtered
      await expect(page.locator(".job-card")).toBeVisible();
    });

    test("should apply for a job as job seeker", async ({ page }) => {
      // Login as job seeker
      await page.goto("/job-seekers/login");
      await page.fill('input[name="email"]', "test.jobseeker@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForURL(/.*job-seekers.*dashboard/);

      // Navigate to jobs
      await page.click('a[href*="jobs"]');
      await expect(page).toHaveURL(/.*jobs/);

      // Click apply button on first job
      await page.click('button:has-text("Apply")');

      // Fill application form
      await page.fill(
        'textarea[name="coverLetter"]',
        "I am very interested in this position..."
      );
      await page.setInputFiles('input[type="file"]', "test-resume.pdf");

      // Submit application
      await page.click('button[type="submit"]');

      // Check for success message
      await expect(
        page.locator("text=Application submitted successfully")
      ).toBeVisible();
    });
  });

  test.describe("Responsive Design", () => {
    test("should work on mobile devices", async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check if mobile navigation works
      await page.click('button[aria-label="Toggle menu"]');
      await expect(page.locator(".mobile-menu")).toBeVisible();

      // Check if main content is visible
      await expect(page.locator("h1")).toBeVisible();
    });

    test("should work on tablet devices", async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check if layout adapts properly
      await expect(page.locator(".main-content")).toBeVisible();
      await expect(page.locator(".sidebar")).toBeVisible();
    });
  });

  test.describe("Error Handling", () => {
    test("should handle invalid login credentials", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "invalid@example.com");
      await page.fill('input[name="password"]', "wrongpassword");
      await page.click('button[type="submit"]');

      // Check for error message
      await expect(page.locator("text=Invalid credentials")).toBeVisible();
    });

    test("should handle network errors gracefully", async ({ page }) => {
      // Simulate network failure
      await page.route("**/api/**", (route) => route.abort());

      await page.goto("/jobs");

      // Check if error message is displayed
      await expect(page.locator("text=Unable to load jobs")).toBeVisible();
    });
  });
});

