import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Statistics API Tests', () => {

    test('CT-BE-013: Get Library Statistics', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/estatisticas`);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        // Validate response structure
        expect(responseBody).toHaveProperty('totalLivros');
        expect(responseBody).toHaveProperty('totalPaginas');
        expect(responseBody).toHaveProperty('totalUsuarios');
        
        // Validate data types
        expect(typeof responseBody.totalLivros).toBe('number');
        expect(typeof responseBody.totalPaginas).toBe('number');
        expect(typeof responseBody.totalUsuarios).toBe('number');
        
        // Validate positive numbers
        expect(responseBody.totalLivros).toBeGreaterThanOrEqual(0);
        expect(responseBody.totalPaginas).toBeGreaterThanOrEqual(0);
        expect(responseBody.totalUsuarios).toBeGreaterThan(0); // At least the default users
    });
});
