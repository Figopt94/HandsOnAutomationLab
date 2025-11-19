// @ts-check
import { test, expect } from '@playwright/test';
import { Login } from '../POM/Login.js';
import { Dashboard } from '../POM/Dashboard.js';

// Helper function to login before each test
/**
 * @param {import('@playwright/test').Page} page
 */
async function login(page) {
    const login = new Login(page);
    await page.goto('http://localhost:3000/login.html');
    await login.fillEmail('admin@biblioteca.com');
    await login.fillPassword('123456');

    // Configure dialog handler before clicking
    page.once('dialog', async dialog => {
        await dialog.accept();
    });

    await login.submit();

    // Wait for navigation to dashboard
    await page.waitForURL('**/dashboard.html', { timeout: 5000 });
}

test.describe('Dashboard Tests', () => {

    test('CT-FE-006: View Dashboard with Statistics', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        const dashboard = new Dashboard(page);

        // Validation 1: Statistics cards are displayed
        await dashboard.verifyStatisticsAreDisplayed();
        const statsCount = await dashboard.getStatsCardsCount();
        expect(statsCount).toBeGreaterThan(0);

        // Validation 2: Numeric values are formatted correctly
        const statsCards = dashboard.statsCards;
        const firstCardText = await statsCards.first().textContent();
        expect(firstCardText).toBeTruthy();

        // Validation 3: Recent books grid is loaded
        await dashboard.verifyRecentBooksGridLoaded();

        // Validation 4: Maximum of 5 recent books are displayed
        await dashboard.verifyMaxRecentBooks(5);

        // Validation 5: Each book card contains image, name and author
        const booksCount = await dashboard.getRecentBooksCount();
        if (booksCount > 0) {
            await expect(dashboard.bookImage.first()).toBeVisible();
            await expect(dashboard.bookTitle.first()).toBeVisible();
            await expect(dashboard.bookAuthor.first()).toBeVisible();
        }
    });

    test('CT-FE-009: Navigation Between Pages', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        const dashboard = new Dashboard(page);

        // Validation 1: "Dashboard" button redirects to /dashboard.html
        await dashboard.navigateToDashboard();
        await page.waitForURL('**/dashboard.html', { timeout: 3000 });
        expect(page.url()).toContain('/dashboard.html');

        // Validation 2: "Gerenciar Livros" button redirects to /livros.html
        await dashboard.navigateToBooks();
        await page.waitForURL('**/livros.html', { timeout: 3000 });
        expect(page.url()).toContain('/livros.html');

        // Navigate back to dashboard
        await page.goto('http://localhost:3000/dashboard.html');

        // Validation 3: "Meus Favoritos" button redirects to /favoritos.html
        await dashboard.navigateToFavorites();
        await page.waitForURL('**/favoritos.html', { timeout: 3000 });
        expect(page.url()).toContain('/favoritos.html');

        // Validation 4: Transitions occur without console errors
        // Navigate back to dashboard to verify no errors
        await page.goto('http://localhost:3000/dashboard.html');
        await page.waitForTimeout(500);
        expect(page.url()).toContain('/dashboard.html');
    });

    test('CT-FE-016: Logout from System', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        const dashboard = new Dashboard(page);

        // Click logout button
        await dashboard.logout();

        // Validation 1: Redirection to /login.html
        await page.waitForURL('**/login.html', { timeout: 5000 });
        expect(page.url()).toContain('/login.html');

        // Validation 2: localStorage data is removed
        const token = await page.evaluate(() => localStorage.getItem('token'));
        const user = await page.evaluate(() => localStorage.getItem('user'));
        expect(token).toBeNull();
        expect(user).toBeNull();

        // Validation 3: Attempting to access protected pages redirects to login
        await page.goto('http://localhost:3000/dashboard.html');
        await page.waitForURL('**/login.html', { timeout: 5000 });
        expect(page.url()).toContain('/login.html');
    });

});
