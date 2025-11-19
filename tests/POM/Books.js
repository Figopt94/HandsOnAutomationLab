import { expect } from '@playwright/test';

export class Books {
    constructor(page) {
        this.page = page;
        
        // Form fields
        this.bookNameField = page.getByRole('textbox', { name: 'Nome do Livro:' });
        this.authorField = page.getByRole('textbox', { name: 'Autor:' });
        this.pagesField = page.getByRole('spinbutton', { name: 'Número de Páginas:' });
        this.descriptionField = page.getByRole('textbox', { name: 'Descrição:' });
        this.imageUrlField = page.getByRole('textbox', { name: 'URL da Imagem:' });
        this.addBookButton = page.getByRole('button', { name: 'Adicionar Livro' });
        
        // Navigation
        this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
        this.booksLink = page.getByRole('link', { name: 'Gerenciar Livros' });
        this.favoritesLink = page.getByRole('link', { name: 'Meus Favoritos' });
        this.logoutButton = page.getByRole('button', { name: 'Sair' });
        
        // Books grid
        this.booksGrid = page.locator('#lista-livros');
        this.bookCards = page.locator('.book-card');
        this.allBookCards = page.locator('.book-card');
        
        // Headers
        this.pageTitle = page.getByRole('heading', { name: '📚 Gerenciar Livros' });
        this.addBookTitle = page.getByRole('heading', { name: 'Adicionar Novo Livro' });
        this.allBooksTitle = page.getByRole('heading', { name: 'Todos os Livros' });
    }

    async fillBookName(name) {
        await this.bookNameField.fill(name);
    }

    async fillAuthor(author) {
        await this.authorField.fill(author);
    }

    async fillPages(pages) {
        await this.pagesField.fill(pages.toString());
    }

    async fillDescription(description) {
        await this.descriptionField.fill(description);
    }

    async fillImageUrl(url) {
        await this.imageUrlField.fill(url);
    }

    async addBook(bookData) {
        await this.fillBookName(bookData.name);
        await this.fillAuthor(bookData.author);
        await this.fillPages(bookData.pages);
        await this.fillDescription(bookData.description);
        await this.fillImageUrl(bookData.imageUrl);
        await this.addBookButton.click();
    }

    async clickAddBookButton() {
        await this.addBookButton.click();
    }

    async getBooksCount() {
        return await this.page.locator('.book-card').count();
    }

    async getBookByTitle(title) {
        return this.page.locator('.book-card').filter({ hasText: title });
    }

    async verifyBookExists(title) {
        const book = await this.getBookByTitle(title);
        await expect(book).toBeVisible();
    }

    async clickBook(title) {
        const bookCard = this.page.locator('.book-card').filter({ hasText: title });
        await bookCard.waitFor({ state: 'visible', timeout: 10000 });
        await bookCard.click();
    }

    async navigateToDashboard() {
        await this.dashboardLink.click();
    }

    async navigateToFavorites() {
        await this.favoritesLink.click();
    }

    async logout() {
        await this.logoutButton.click();
    }

    async verifyPageLoaded() {
        await expect(this.pageTitle).toBeVisible();
        await expect(this.addBookTitle).toBeVisible();
        await expect(this.allBooksTitle).toBeVisible();
    }

    async verifyBooksGridLoaded() {
        await expect(this.booksGrid).toBeVisible();
    }

    async clearForm() {
        await this.bookNameField.clear();
        await this.authorField.clear();
        await this.pagesField.clear();
        await this.descriptionField.clear();
        await this.imageUrlField.clear();
    }

    async getFormValidationState() {
        return {
            name: await this.bookNameField.inputValue(),
            author: await this.authorField.inputValue(),
            pages: await this.pagesField.inputValue(),
            description: await this.descriptionField.inputValue(),
            imageUrl: await this.imageUrlField.inputValue()
        };
    }
}
