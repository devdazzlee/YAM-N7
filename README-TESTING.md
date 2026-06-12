# Testing Guide for YAM-N7

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests with UI (Interactive)
```bash
npm run test:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

## Test Coverage

The test suite includes:

1. **All Pages Test** - Tests all 50+ pages load successfully
2. **Navigation Tests** - Tests navigation between pages
3. **Component Tests** - Tests header, footer, newsletter, services
4. **Form Tests** - Tests contact, login, register forms
5. **Product Tests** - Tests product pages and shop
6. **Responsive Design Tests** - Tests mobile, tablet, desktop views
7. **Color Scheme Tests** - Verifies correct color usage
8. **Visual Regression Tests** - Screenshot comparisons

## Test Results

Test results and screenshots are saved in:
- `test-results/` - Test execution results
- `playwright-report/` - HTML test report
- `tests/screenshots/` - Page screenshots

## Troubleshooting

If tests fail:
1. Make sure the dev server is running: `npm run dev`
2. Check that all pages are accessible
3. Verify Tailwind CSS is working correctly
4. Check browser console for errors

