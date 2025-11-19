# Automacao HandsOnAutomationLab - Project Structure

Complete test automation project with frontend, backend, and automated tests.

## 📁 Project Structure

```
Automacao-HandsOnAutomationLab/
├── Backend/                    # API server (Node.js/Express)
│   └── server.js              # Main server file
├── public/                     # Frontend application (HTML/CSS/JS)
│   ├── css/                   # Stylesheets
│   ├── js/                    # JavaScript files
│   ├── login.html
│   ├── registro.html
│   ├── dashboard.html
│   ├── livros.html
│   ├── favoritos.html
│   └── detalhes.html
├── tests/                      # All automated tests
│   ├── ui/                    # UI/Frontend tests (Playwright)
│   │   ├── Register.spec.js   # CT-FE-001, CT-FE-002
│   │   ├── Login.spec.js      # CT-FE-003, CT-FE-004, CT-FE-005
│   │   ├── Dashboard.spec.js  # CT-FE-006, CT-FE-009, CT-FE-016
│   │   └── Books.spec.js      # CT-FE-007, 008, 010-015
│   ├── api/                   # API tests (coming soon)
│   └── POM/                   # Page Object Models
│       ├── Login.js
│       ├── Register.js
│       ├── Dashboard.js
│       ├── Books.js
│       └── BookDetails.js
├── node_modules/
├── .github/                    # GitHub Actions (coming soon)
│   └── workflows/
├── package.json
├── playwright.config.js
└── README.md
```

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Start the Backend Server
```bash
node Backend/server.js
```
Server runs on: http://localhost:3000

### Run Tests

```bash
# Run all tests
npx playwright test

# Run only UI tests
npx playwright test tests/ui

# Run only API tests (when available)
npx playwright test tests/api

# Run specific test file
npx playwright test tests/ui/Login.spec.js

# Run with UI mode
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

## 📋 Test Coverage

### Frontend Tests (16 tests)
- **CT-FE-001**: Register a user
- **CT-FE-002**: Register with mismatch password
- **CT-FE-003**: Successful login
- **CT-FE-004**: Invalid login
- **CT-FE-005**: Verify route protection
- **CT-FE-006**: View Dashboard with Statistics
- **CT-FE-007**: Add New Book Successfully
- **CT-FE-008**: Add Book to Favorites
- **CT-FE-009**: Navigation Between Pages
- **CT-FE-010**: View Book Details
- **CT-FE-011**: Delete Book
- **CT-FE-012**: Remove Book from Favorites
- **CT-FE-013**: Form Validation - Empty Fields
- **CT-FE-014**: Back Button Navigation
- **CT-FE-015**: View Multiple Books Details
- **CT-FE-016**: Logout from System

### API Tests
Coming soon...

## 🔧 Configuration

Tests are configured to run against `http://localhost:3000`

Update `playwright.config.js` to change:
- Base URL
- Browser settings
- Timeout values
- Reporter configuration

## 📦 CI/CD

GitHub Actions configuration will be added to automate:
1. Starting the backend server
2. Running all tests
3. Generating test reports
4. Publishing results

## 🤝 Contributing

1. Ensure the backend server is running
2. Create/update tests in the appropriate folder
3. Run tests locally before committing
4. Follow the existing naming conventions (CT-FE-XXX for frontend tests)
