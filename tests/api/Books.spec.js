import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Books API Tests', () => {
    let createdBookId;

    test('CT-BE-005: Create New Book', async ({ request }) => {
        const timestamp = Date.now();
        const newBook = {
            nome: `API Test Book ${timestamp}`,
            autor: 'API Test Author',
            paginas: 250,
            descricao: 'This is a test book created via API',
            imagemUrl: 'https://via.placeholder.com/200x300'
        };

        const response = await request.post(`${BASE_URL}/livros`, {
            data: newBook
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('id');
        expect(responseBody).toHaveProperty('nome', newBook.nome);
        expect(responseBody).toHaveProperty('autor', newBook.autor);
        expect(responseBody).toHaveProperty('paginas', newBook.paginas);
        expect(responseBody).toHaveProperty('descricao', newBook.descricao);
        expect(responseBody).toHaveProperty('imagemUrl', newBook.imagemUrl);
        expect(responseBody).toHaveProperty('dataCadastro');

        // Store the created book ID for subsequent tests
        createdBookId = responseBody.id;
    });

    test('CT-BE-006: Get All Books', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/livros`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
        
        // Validate structure of first book
        const firstBook = responseBody[0];
        expect(firstBook).toHaveProperty('id');
        expect(firstBook).toHaveProperty('nome');
        expect(firstBook).toHaveProperty('autor');
        expect(firstBook).toHaveProperty('paginas');
    });

    test('CT-BE-007: Get Book by ID', async ({ request }) => {
        // Using a known book ID (ID 1 - Clean Code exists by default)
        const bookId = 1;
        const response = await request.get(`${BASE_URL}/livros/${bookId}`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('id', bookId);
        expect(responseBody).toHaveProperty('nome');
        expect(responseBody).toHaveProperty('autor');
        expect(responseBody).toHaveProperty('paginas');
        expect(responseBody).toHaveProperty('descricao');
        expect(responseBody).toHaveProperty('imagemUrl');
    });

    test('CT-BE-008: Update Book', async ({ request }) => {
        // First create a book to update
        const timestamp = Date.now();
        const newBook = {
            nome: `Book to Update ${timestamp}`,
            autor: 'Original Author',
            paginas: 100,
            descricao: 'Original description',
            imagemUrl: 'https://via.placeholder.com/100'
        };

        const createResponse = await request.post(`${BASE_URL}/livros`, {
            data: newBook
        });
        const createdBook = await createResponse.json();
        const bookId = createdBook.id;

        // Now update the book
        const updatedBook = {
            nome: `Updated Book ${timestamp}`,
            autor: 'Updated Author',
            paginas: 200,
            descricao: 'Updated description',
            imagemUrl: 'https://via.placeholder.com/200'
        };

        const updateResponse = await request.put(`${BASE_URL}/livros/${bookId}`, {
            data: updatedBook
        });

        expect(updateResponse.status()).toBe(200);
        const responseBody = await updateResponse.json();
        
        expect(responseBody).toHaveProperty('id', bookId);
        expect(responseBody).toHaveProperty('nome', updatedBook.nome);
        expect(responseBody).toHaveProperty('autor', updatedBook.autor);
        expect(responseBody).toHaveProperty('paginas', updatedBook.paginas);
        expect(responseBody).toHaveProperty('descricao', updatedBook.descricao);
        expect(responseBody).toHaveProperty('imagemUrl', updatedBook.imagemUrl);
    });

    test('CT-BE-009: Delete Book', async ({ request }) => {
        // First create a book to delete
        const timestamp = Date.now();
        const newBook = {
            nome: `Book to Delete ${timestamp}`,
            autor: 'Delete Author',
            paginas: 50,
            descricao: 'This book will be deleted',
            imagemUrl: 'https://via.placeholder.com/50'
        };

        const createResponse = await request.post(`${BASE_URL}/livros`, {
            data: newBook
        });
        const createdBook = await createResponse.json();
        const bookId = createdBook.id;

        // Now delete the book
        const deleteResponse = await request.delete(`${BASE_URL}/livros/${bookId}`);

        expect(deleteResponse.status()).toBe(200);
        const responseBody = await deleteResponse.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Livro removido com sucesso');

        // Verify the book is deleted
        const getResponse = await request.get(`${BASE_URL}/livros/${bookId}`);
        expect(getResponse.status()).toBe(404);
    });
});
