import { expect } from '@playwright/test';

export class BookDetails {
    constructor(page) {
        this.page = page;
        
        // Page elements
        this.pageTitle = page.getByRole('heading', { name: '📚 Detalhes do Livro', level: 1 });
        this.bookTitle = page.getByRole('heading', { level: 2 });
        this.bookImage = page.locator('img').nth(0);
        this.bookAuthor = page.locator('strong:has-text("Autor:")').locator('..');
        this.bookPages = page.locator('strong:has-text("Páginas:")').locator('..');
        this.bookDescription = page.locator('strong:has-text("Descrição:")').locator('..');
        this.bookDate = page.locator('strong:has-text("Data de Cadastro:")').locator('..');
        
        // Buttons
        this.addToFavoritesButton = page.getByRole('button', { name: /Adicionar aos Favoritos|Remover dos Favoritos/ });
        this.deleteButton = page.getByRole('button', { name: '🗑️ Deletar Livro' });
        this.backButton = page.getByRole('button', { name: '← Voltar' });
        
        // Navigation
        this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
        this.booksLink = page.getByRole('link', { name: 'Gerenciar Livros' });
        this.favoritesLink = page.getByRole('link', { name: 'Meus Favoritos' });
        this.logoutButton = page.getByRole('button', { name: 'Sair' });
    }

    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.bookTitle).toBeVisible();
    }

    async getBookTitle() {
        return await this.bookTitle.textContent();
    }

    async getBookAuthor() {
        const authorText = await this.bookAuthor.textContent();
        return authorText.replace('Autor:', '').trim();
    }

    async getBookPages() {
        const pagesText = await this.bookPages.textContent();
        return pagesText.replace('Páginas:', '').trim();
    }

    async getBookDescription() {
        const descText = await this.bookDescription.textContent();
        return descText.replace('Descrição:', '').trim();
    }

    async getBookDate() {
        const dateText = await this.bookDate.textContent();
        return dateText.replace('Data de Cadastro:', '').trim();
    }

    async verifyBookImage() {
        await expect(this.bookImage).toBeVisible();
    }

    async verifyAllInfoDisplayed() {
        await expect(this.bookTitle).toBeVisible();
        await expect(this.bookImage).toBeVisible();
        await expect(this.bookAuthor).toBeVisible();
        await expect(this.bookPages).toBeVisible();
        await expect(this.bookDescription).toBeVisible();
        await expect(this.bookDate).toBeVisible();
    }

    async addToFavorites() {
        // Handle dialog if it appears
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.addToFavoritesButton.click();
    }

    async removeFromFavorites() {
        // Handle dialog if it appears
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.addToFavoritesButton.click();
    }

    async deleteBook() {
        // Handle confirmation dialog
        this.page.once('dialog', async dialog => {
            await dialog.accept();
        });
        await this.deleteButton.click();
    }

    async goBack() {
        await this.backButton.click();
    }

    async isFavorited() {
        const buttonText = await this.addToFavoritesButton.textContent();
        return buttonText.includes('Remover dos Favoritos');
    }

    async verifyFavoriteButtonState(shouldBeFavorited) {
        const isFav = await this.isFavorited();
        if (shouldBeFavorited) {
            expect(isFav).toBeTruthy();
        } else {
            expect(isFav).toBeFalsy();
        }
    }

    async navigateToDashboard() {
        await this.dashboardLink.click();
    }

    async navigateToBooks() {
        await this.booksLink.click();
    }

    async navigateToFavorites() {
        await this.favoritesLink.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async verifyButtonsVisible() {
        await expect(this.addToFavoritesButton).toBeVisible();
        await expect(this.deleteButton).toBeVisible();
        await expect(this.backButton).toBeVisible();
    }
}
