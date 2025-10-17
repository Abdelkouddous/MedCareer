# MedCareer Testing Documentation

## Overview

This document provides comprehensive information about the testing automation setup for the MedCareer medical recruitment application. The testing framework includes unit tests, integration tests, end-to-end (E2E) tests, and performance tests.

## Testing Architecture

### Test Types

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test API endpoints and database interactions
3. **E2E Tests** - Test complete user workflows using Playwright
4. **Performance Tests** - Load testing using Artillery
5. **Frontend Tests** - React component testing using Vitest and Testing Library

### Test Structure

```
tests/
├── unit/                 # Unit tests for controllers, models, utilities
├── integration/         # API integration tests
├── e2e/                # End-to-end tests
├── performance/         # Load and performance tests
├── fixtures/           # Test data and fixtures
├── utils/              # Test utilities and helpers
└── setup.js           # Test setup and configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (or MongoDB Memory Server for tests)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm run setup-project
```

2. Install testing dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

### Quick Start

Use the automated test runner:

```bash
./test-runner.sh
```

### Individual Test Commands

#### Backend Tests

```bash
# Run all backend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration

# Run tests for CI
npm run test:ci
```

#### Frontend Tests

```bash
cd client

# Run frontend tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

#### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

#### Performance Tests

```bash
# Run performance tests
artillery run tests/performance/load-test.yml
```

## Test Configuration

### Jest Configuration

The Jest configuration is defined in `jest.config.js`:

- **Test Environment**: Node.js
- **Coverage**: Includes controllers, middleware, models, routes, and utils
- **Setup**: Uses MongoDB Memory Server for database tests
- **Timeout**: 10 seconds per test

### Playwright Configuration

The Playwright configuration is defined in `playwright.config.js`:

- **Browsers**: Chrome, Firefox, Safari
- **Base URL**: http://localhost:3000
- **Parallel**: Tests run in parallel
- **Retries**: 2 retries on CI

### Vitest Configuration

The Vitest configuration is defined in `client/vitest.config.js`:

- **Environment**: jsdom
- **Setup**: Includes testing library setup
- **CSS**: CSS files are processed

## Writing Tests

### Unit Tests

Unit tests should be placed in the `tests/unit/` directory and follow this naming convention: `*.test.js`

Example:

```javascript
import { register } from "../../controllers/authController.js";
import { testUsers } from "../fixtures/testData.js";

describe("Authentication Controller", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(testUsers.employer)
      .expect(201);

    expect(response.body.msg).toBe("User registered successfully");
  });
});
```

### Integration Tests

Integration tests should be placed in the `tests/integration/` directory and test complete API workflows.

Example:

```javascript
describe("Job Management Flow", () => {
  it("should create, read, update, and delete a job", async () => {
    // Test complete CRUD operations
  });
});
```

### E2E Tests

E2E tests should be placed in the `tests/e2e/` directory and test complete user workflows.

Example:

```javascript
test("should complete employer registration flow", async ({ page }) => {
  await page.click('a[href*="register"]');
  await page.fill('input[name="name"]', "Dr. Test Employer");
  // ... complete workflow
});
```

### Frontend Tests

Frontend tests should be placed in the `client/src/test/` directory and test React components.

Example:

```javascript
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders landing page", () => {
  render(<App />);
  expect(screen.getByText(/MedCareer/i)).toBeInTheDocument();
});
```

## Test Data Management

### Fixtures

Test data is managed through fixtures in `tests/fixtures/testData.js`:

```javascript
export const testUsers = {
  admin: {
    name: "Admin User",
    email: "admin@medcareer.com",
    password: "password123",
    role: "admin",
  },
};
```

### Database Setup

Tests use MongoDB Memory Server for isolated database testing:

- Each test gets a fresh database
- Collections are cleared between tests
- No external database dependencies

## CI/CD Integration

### GitHub Actions

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and includes:

1. **Backend Tests** - Unit and integration tests
2. **Frontend Tests** - Component tests and build verification
3. **E2E Tests** - Complete user workflow tests
4. **Security Tests** - Dependency vulnerability scanning
5. **Performance Tests** - Load testing
6. **Deployment** - Automated deployment on main branch

### Pipeline Stages

1. **Install Dependencies** - Install all required packages
2. **Linting** - Code quality checks
3. **Unit Tests** - Fast feedback on code changes
4. **Integration Tests** - API and database testing
5. **E2E Tests** - Complete user journey testing
6. **Security Audit** - Vulnerability scanning
7. **Performance Tests** - Load testing
8. **Deployment** - Production deployment

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain what is being tested
3. **Follow AAA pattern**: Arrange, Act, Assert
4. **Keep tests independent** - no dependencies between tests
5. **Use meaningful assertions** with clear error messages

### Test Data

1. **Use fixtures** for consistent test data
2. **Clean up after tests** to avoid side effects
3. **Use realistic data** that matches production scenarios
4. **Avoid hardcoded values** - use constants or fixtures

### Performance

1. **Run tests in parallel** when possible
2. **Use appropriate timeouts** for different test types
3. **Mock external services** to avoid network dependencies
4. **Use database transactions** for faster cleanup

### Maintenance

1. **Update tests** when requirements change
2. **Remove obsolete tests** that are no longer relevant
3. **Monitor test execution time** and optimize slow tests
4. **Keep test documentation** up to date

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Ensure MongoDB Memory Server is properly configured
   - Check test setup in `tests/setup.js`

2. **Timeout Errors**

   - Increase timeout values in test configuration
   - Check for slow operations in tests

3. **E2E Test Failures**

   - Ensure application is running before tests
   - Check Playwright browser installation
   - Verify test selectors are correct

4. **Coverage Issues**
   - Check Jest configuration for coverage paths
   - Ensure all source files are included

### Debug Mode

Run tests in debug mode:

```bash
# Jest debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Playwright debug mode
npx playwright test --debug
```

## Monitoring and Reporting

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Report**: `coverage/lcov.info`
- **JSON Report**: `coverage/coverage-final.json`

### Test Reports

Test reports are generated in the `reports/` directory:

- **Test Summary**: `reports/test-summary.md`
- **Coverage Reports**: `reports/backend-coverage/` and `reports/frontend-coverage/`

## Contributing

When adding new tests:

1. **Follow naming conventions** for test files
2. **Add appropriate test data** to fixtures
3. **Update documentation** if needed
4. **Ensure tests pass** in CI/CD pipeline
5. **Add tests for new features** before merging

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Artillery Documentation](https://artillery.io/docs/)

## Support

For testing-related questions or issues:

1. Check this documentation first
2. Review existing test examples
3. Check CI/CD pipeline logs
4. Create an issue with detailed information

