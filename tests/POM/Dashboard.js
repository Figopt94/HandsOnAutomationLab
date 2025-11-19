import { expect } from '@playwright/test';

export class Dashboard {
    constructor(page) {
        this.page = page;
        
        // Header elements
        this.userNameDisplay = page.locator('.user-name, .username, [class*="user"]').first();
        this.logoutButton = page.getByRole('button', { name: /sair|logout/i });
        
        // Navigation buttons
        this.dashboardNavButton = page.getByRole('link', { name: /dashboard|início/i });
        this.booksNavButton = page.getByRole('link', { name: /gerenciar livros|livros/i });
        this.favoritesNavButton = page.getByRole('link', { name: /meus favoritos|favoritos/i });
        
        // Statistics cards
        this.statsCards = page.locator('.card, .stat-card, [class*="card"]');
        this.totalBooksCard = page.locator('.card:has-text("Total"), .card:has-text("Livros")').first();
        this.totalFavoritesCard = page.locator('.card:has-text("Favoritos")').first();
        
        // Recent books section
        this.recentBooksSection = page.locator('.recent-books, [class*="recent"]');
        this.recentBooksGrid = page.locator('#livros-recentes, .books-grid').first();
        this.bookCards = page.locator('#livros-recentes .book-card, .books-grid .book-card');
        
        // Book card elements (for individual books)
        this.bookImage = page.locator('#livros-recentes img, .books-grid img');
        this.bookTitle = page.locator('#livros-recentes h3, .books-grid h3');
        this.bookAuthor = page.locator('#livros-recentes p, .books-grid p');
    }

    async goto() {
        await this.page.goto('http://localhost:3000/dashboard.html');
    }

    async getUserName() {
        return await this.userNameDisplay.textContent();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async navigateToDashboard() {
        await this.dashboardNavButton.click();
    }

    async navigateToBooks() {
        await this.booksNavButton.click();
    }

    async navigateToFavorites() {
        await this.favoritesNavButton.click();
    }

    async getStatsCardsCount() {
        return await this.statsCards.count();
    }

    async getRecentBooksCount() {
        return await this.bookCards.count();
    }

    async isUserNameVisible() {
        return await this.userNameDisplay.isVisible();
    }

    async verifyStatisticsAreDisplayed() {
        await expect(this.statsCards.first()).toBeVisible();
    }

    async verifyRecentBooksGridLoaded() {
        await expect(this.recentBooksGrid).toBeVisible();
    }

    async verifyMaxRecentBooks(maxBooks = 5) {
        const count = await this.getRecentBooksCount();
        expect(count).toBeLessThanOrEqual(maxBooks);
    }
}