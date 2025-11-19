import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe.serial('Favorites API Tests', () => {
    const usuarioId = 1; // Admin user ID
    const livroId = 2; // Harry Potter book ID

    test.beforeEach(async ({ request }) => {
        // Clean up: Remove the book from favorites if it exists (ignore errors)
        try {
            await request.delete(`${BASE_URL}/favoritos`, {
                data: {
                    usuarioId: usuarioId,
                    livroId: livroId
                }
            });
        } catch (error) {
            // Ignore if favorite doesn't exist
        }
    });

    test('CT-BE-010: Add Book to Favorites', async ({ request }) => {
        const favoritoData = {
            usuarioId: usuarioId,
            livroId: livroId
        };

        const response = await request.post(`${BASE_URL}/favoritos`, {
            data: favoritoData
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Livro adicionado aos favoritos');
    });

    test('CT-BE-011: Remove Book from Favorites', async ({ request }) => {
        const favoritoData = {
            usuarioId: usuarioId,
            livroId: livroId
        };

        // First add the book to favorites
        await request.post(`${BASE_URL}/favoritos`, {
            data: favoritoData
        });

        // Now remove it
        const response = await request.delete(`${BASE_URL}/favoritos`, {
            data: favoritoData
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Livro removido dos favoritos');
    });

    test('CT-BE-012: Get User Favorites', async ({ request }) => {
        const favoritoData = {
            usuarioId: usuarioId,
            livroId: livroId
        };

        // Add a book to favorites
        await request.post(`${BASE_URL}/favoritos`, {
            data: favoritoData
        });

        // Get user favorites
        const response = await request.get(`${BASE_URL}/favoritos/${usuarioId}`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
        
        // Verify the added book is in favorites
        const favoritoBook = responseBody.find(book => book.id === livroId);
        expect(favoritoBook).toBeDefined();
        expect(favoritoBook).toHaveProperty('id', livroId);
        expect(favoritoBook).toHaveProperty('nome');
        expect(favoritoBook).toHaveProperty('autor');
    });
});
