import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication API Tests', () => {

    test('CT-BE-001: Register Valid User', async ({ request }) => {
        const timestamp = Date.now();
        const newUser = {
            nome: `Test User ${timestamp}`,
            email: `testuser${timestamp}@test.com`,
            senha: 'Test@123'
        };

        const response = await request.post(`${BASE_URL}/registro`, {
            data: newUser
        });

        expect(response.status()).toBe(201);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Usuário criado com sucesso');
        expect(responseBody).toHaveProperty('usuario');
        expect(responseBody.usuario).toHaveProperty('id');
        expect(responseBody.usuario).toHaveProperty('nome', newUser.nome);
        expect(responseBody.usuario).toHaveProperty('email', newUser.email);
        expect(responseBody.usuario).not.toHaveProperty('senha'); // Should not return password
    });

    test('CT-BE-002: Register User with Existing Email', async ({ request }) => {
        // Try to register with an existing email (admin@biblioteca.com already exists)
        const duplicateUser = {
            nome: 'Duplicate User',
            email: 'admin@biblioteca.com',
            senha: 'Test@123'
        };

        const response = await request.post(`${BASE_URL}/registro`, {
            data: duplicateUser
        });

        expect(response.status()).toBe(400);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Email já cadastrado');
    });

    test('CT-BE-003: Successful Login', async ({ request }) => {
        const loginData = {
            email: 'admin@biblioteca.com',
            senha: '123456'
        };

        const response = await request.post(`${BASE_URL}/login`, {
            data: loginData
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Login realizado com sucesso');
        expect(responseBody).toHaveProperty('usuario');
        expect(responseBody.usuario).toHaveProperty('id');
        expect(responseBody.usuario).toHaveProperty('nome');
        expect(responseBody.usuario).toHaveProperty('email', loginData.email);
        expect(responseBody.usuario).not.toHaveProperty('senha'); // Should not return password
    });

    test('CT-BE-004: Login with Invalid Credentials', async ({ request }) => {
        const invalidLoginData = {
            email: 'invalid@test.com',
            senha: 'wrongpassword'
        };

        const response = await request.post(`${BASE_URL}/login`, {
            data: invalidLoginData
        });

        expect(response.status()).toBe(401);
        const responseBody = await response.json();
        
        expect(responseBody).toHaveProperty('mensagem', 'Email ou senha incorretos');
    });
});
