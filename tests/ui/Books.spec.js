// @ts-check
import { test, expect } from '@playwright/test';
import { Login } from '../POM/Login.js';
import { Books } from '../POM/Books.js';
import { BookDetails } from '../POM/BookDetails.js';

// Configure this file to run serially to avoid favorites race conditions
test.describe.configure({ mode: 'serial' });

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

test.describe('Books Management Tests', () => {

    test('CT-FE-007: Add New Book Successfully', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        // Navigate to books page
        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        // Verify page loaded
        await booksPage.verifyPageLoaded();

        // Get initial count of books
        const initialCount = await booksPage.getBooksCount();

        // Prepare book data with unique name to avoid duplicates
        const timestamp = Date.now();
        const newBook = {
            name: `Test Automation Book ${timestamp}`,
            author: 'John Doe',
            pages: 350,
            description: 'A comprehensive guide to test automation',
            imageUrl: 'https://via.placeholder.com/200x300'
        };

        // Configure dialog handler for success message
        page.once('dialog', async dialog => {
            expect(dialog.message()).toContain('sucesso');
            await dialog.accept();
        });

        // Fill and submit the form
        await booksPage.addBook(newBook);

        // Wait for the book to be added and page to reload
        await page.waitForTimeout(2000);

        // Validation 1: Book count increased
        const newCount = await booksPage.getBooksCount();
        expect(newCount).toBeGreaterThan(initialCount);

        // Validation 2: New book appears in the list
        await booksPage.verifyBookExists(newBook.name);

        // Validation 3: Book card contains correct information
        const bookCard = await booksPage.getBookByTitle(newBook.name);
        await expect(bookCard).toContainText(newBook.name);
        await expect(bookCard).toContainText(newBook.author);
        await expect(bookCard).toContainText(newBook.pages.toString());
    });

    test('CT-FE-010: View Book Details', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        // Navigate to books page
        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        // Click on first book
        await booksPage.clickBook('Clean Code');

        // Wait for details page
        await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

        const detailsPage = new BookDetails(page);

        // Validation 1: Page loaded correctly
        await detailsPage.verifyPageLoaded();

        // Validation 2: All information is displayed
        await detailsPage.verifyAllInfoDisplayed();

        // Validation 3: Title is correct
        const title = await detailsPage.getBookTitle();
        expect(title).toBe('Clean Code');

        // Validation 4: Author is displayed
        const author = await detailsPage.getBookAuthor();
        expect(author).toBeTruthy();
        expect(author.length).toBeGreaterThan(0);

        // Validation 5: Pages are displayed
        const pages = await detailsPage.getBookPages();
        expect(pages).toBeTruthy();

        // Validation 6: Description is displayed
        const description = await detailsPage.getBookDescription();
        expect(description).toBeTruthy();

        // Validation 7: Date is displayed
        const date = await detailsPage.getBookDate();
        expect(date).toBeTruthy();

        // Validation 8: Buttons are visible
        await detailsPage.verifyButtonsVisible();
    });

    test('CT-FE-008: Add Book to Favorites', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        // Navigate to books page
        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);
        await page.waitForTimeout(2000);

        // Click on Harry Potter to view details
        await booksPage.clickBook('Harry Potter');
        await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

        const detailsPage = new BookDetails(page);
        await detailsPage.verifyPageLoaded();
        await page.waitForTimeout(1000);

        // Check current favorite state
        const initiallyFavorited = await detailsPage.isFavorited();

        if (!initiallyFavorited) {
            // If not favorited, add to favorites
            await detailsPage.addToFavorites();
            // Wait for the page to process the favorite addition
            await page.waitForTimeout(8000);
        }

        // Navigate to favorites page
        await detailsPage.navigateToFavorites();
        await page.waitForURL('**/favoritos.html', { timeout: 5000 });

        // Validation 1: Favorites page loaded
        await expect(page.getByRole('heading', { name: '❤️ Meus Favoritos' })).toBeVisible();

        // Wait for the favorites list to load
        await page.waitForTimeout(4000);

        // Validation 2: At least one book appears in favorites
        const count = await page.locator('.book-card').count();
        expect(count).toBeGreaterThan(0);

        // Validation 3: Verify Harry Potter is present in favorites
        const bookCard = page.locator('.book-card').filter({ hasText: 'Harry Potter' });
        await expect(bookCard).toBeVisible({ timeout: 10000 });
    });

    test('CT-FE-011: Delete Book', async ({ page }) => {
        // Pre-condition: User authenticated and a test book exists
        await login(page);

        // First add a book to delete
        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        const timestamp = Date.now();
        const testBook = {
            name: `Book To Delete ${timestamp}`,
            author: 'Delete Author',
            pages: 100,
            description: 'This book will be deleted',
            imageUrl: 'https://via.placeholder.com/200x300'
        };

        page.once('dialog', async dialog => {
            await dialog.accept();
        });

        await booksPage.addBook(testBook);
        await page.waitForTimeout(2000);

        // Verify book was added
        await booksPage.verifyBookExists(testBook.name);

        // Get count before deletion
        const countBefore = await booksPage.getBooksCount();

        // Click on the book to view details
        await booksPage.clickBook(testBook.name);
        await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

        const detailsPage = new BookDetails(page);

        // Delete the book
        await detailsPage.deleteBook();

        // Should redirect to books page
        await page.waitForURL('**/livros.html', { timeout: 5000 });

        // Wait for deletion to complete
        await page.waitForTimeout(3000);

        // Validation: Book no longer appears in list
        const bookCard = await booksPage.getBookByTitle(testBook.name);
        await expect(bookCard).not.toBeVisible();
    });

    test('CT-FE-012: Remove Book from Favorites', async ({ page }) => {
        // Pre-condition: User authenticated and a book is favorited
        await login(page);

        // Navigate to books page
        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        // Click on Clean Code
        await booksPage.clickBook('Clean Code');
        await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

        const detailsPage = new BookDetails(page);
        await detailsPage.verifyPageLoaded();

        // Ensure Clean Code is in favorites first
        const isFav = await detailsPage.isFavorited();
        if (!isFav) {
            await detailsPage.addToFavorites();
            // Wait for favorite to be added
            await page.waitForTimeout(8000);
        }

        // Now go to favorites page
        await detailsPage.navigateToFavorites();
        await page.waitForURL('**/favoritos.html', { timeout: 5000 });

        // Verify favorites page loaded
        await expect(page.getByRole('heading', { name: '❤️ Meus Favoritos' })).toBeVisible();

        // Wait for favorites list to load completely
        await page.waitForTimeout(6000);

        // Verify Clean Code is in favorites
        const cleanCodeCard = page.locator('.book-card').filter({ hasText: 'Clean Code' });
        await expect(cleanCodeCard).toBeVisible({ timeout: 15000 });

        // Click on Clean Code to go to details page
        await cleanCodeCard.click();
        await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

        // Step 1: Remove from favorites
        await detailsPage.removeFromFavorites();

        // Wait for the removal to be processed
        await page.waitForTimeout(3000);

        // Step 2: Go back to favorites page (retroceder using browser back)
        await page.goBack();
        await page.waitForURL('**/favoritos.html', { timeout: 5000 });

        // Step 3: Refresh page (double refresh for Firefox compatibility)
        await page.reload();
        await page.waitForTimeout(3000);
        await page.reload();

        // Wait for page to fully reload (app needs time to process removal)
        await page.waitForTimeout(8000);

        // Validation: Clean Code should not be in favorites anymore
        const cleanCodeAfter = page.locator('.book-card').filter({ hasText: 'Clean Code' });
        await expect(cleanCodeAfter).not.toBeVisible({ timeout: 25000 });
    });

    test('CT-FE-013: Form Validation - Empty Fields', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        await booksPage.verifyPageLoaded();

        // Get initial count
        const initialCount = await booksPage.getBooksCount();

        // Try to submit with empty fields - check if HTML5 validation prevents submission
        await booksPage.clickAddBookButton();

        // Wait a bit
        await page.waitForTimeout(1000);

        // Validation 1: No book should be added (count remains the same)
        const countAfterEmpty = await booksPage.getBooksCount();
        expect(countAfterEmpty).toBe(initialCount);

        // Try again with all fields
        const timestamp = Date.now();
        const validBookName = `Valid Book ${timestamp}`;
        await booksPage.fillBookName(validBookName);
        await booksPage.fillAuthor('Valid Author');
        await booksPage.fillPages(100);
        await booksPage.fillDescription('Valid Description');
        await booksPage.fillImageUrl('https://via.placeholder.com/200');

        page.once('dialog', async dialog => {
            await dialog.accept();
        });

        await booksPage.clickAddBookButton();

        // Wait for the page to reload and the specific book to appear
        await page.waitForTimeout(5000);

        // Validation 2: Verify the specific book was added (this will wait for it to be visible)
        await booksPage.verifyBookExists(validBookName);

        // Wait for the count to update (app limitation)
        await page.waitForTimeout(5000);

        // Also verify count increased
        const finalCount = await booksPage.getBooksCount();
        expect(finalCount).toBeGreaterThan(initialCount);
    });

    test('CT-FE-014: Back Button Navigation', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        // Click on a book
        await booksPage.clickBook('Clean Code');
        await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

        const detailsPage = new BookDetails(page);
        await detailsPage.verifyPageLoaded();

        // Validation 1: Back button is visible
        await expect(detailsPage.backButton).toBeVisible();

        // Click back button
        await detailsPage.goBack();

        // Validation 2: Should return to books page
        await page.waitForURL('**/livros.html', { timeout: 5000 });
        expect(page.url()).toContain('/livros.html');

        // Validation 3: Books page loads correctly
        await booksPage.verifyPageLoaded();
    });

    test('CT-FE-015: View Multiple Books Details', async ({ page }) => {
        // Pre-condition: User authenticated
        await login(page);

        await page.goto('http://localhost:3000/livros.html');
        const booksPage = new Books(page);

        // Wait for books to load
        await page.waitForTimeout(2000);

        // Get all books
        const booksCount = await booksPage.getBooksCount();
        expect(booksCount).toBeGreaterThan(0);

        // Test viewing details for first two books
        const booksToTest = Math.min(booksCount, 2);
        
        for (let i = 0; i < booksToTest; i++) {
            // Go to books page
            await page.goto('http://localhost:3000/livros.html');
            
            // Get book title
            const bookTitle = await booksPage.bookCards.nth(i).locator('h3').textContent();
            
            // Click on book
            await booksPage.bookCards.nth(i).click();
            await page.waitForURL('**/detalhes.html?id=*', { timeout: 5000 });

            const detailsPage = new BookDetails(page);

            // Validation: All information is displayed
            await detailsPage.verifyAllInfoDisplayed();
            
            const detailTitle = await detailsPage.getBookTitle();
            expect(detailTitle).toBe(bookTitle);
        }
    });
});
