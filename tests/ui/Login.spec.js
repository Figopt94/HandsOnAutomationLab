import { test, expect } from '@playwright/test';
import { Login } from '../POM/Login.js';

test('CT-FE-003: Successful login', async ({ page }) => {
    const login = new Login(page);
    await page.goto('http://localhost:3000/login.html');
    await login.fillEmail('figocaro@gmail.com');
    await login.fillPassword('Teste123');

    // Configure listener to capture dialog
    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Login realizado com sucesso!');
        await dialog.accept();
    });
    
    await login.submit();

    // Validate redirection to home page
    await page.waitForURL('**/dashboard.html', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard.html')

    // verify user name is displayed on header
    const userNameDisplay = await page.getByText('User')
    await expect(userNameDisplay).toContainText('User');
});

test('CT-FE-004: Invalid login', async ({ page }) => {
    const login = new Login(page);
    await page.goto('http://localhost:3000/login.html');
    await login.fillEmail('figocarao@gmail.com');
    await login.fillPassword('Teste123');

    // Configure listener to capture dialog
    page.once('dialog', async dialog => {
        expect(dialog.message()).toBe('Email ou senha incorretos');
        await dialog.accept();
    });
    
    await login.submit();

    // Wait a bit for dialog to be handled
    await page.waitForTimeout(1000);

    // Validate still on login page
    expect(page.url()).toContain('/login.html');

    // Verify that Email and Password fields are not empty on login page
    const emailLoginInput = page.getByRole('textbox', { name: 'Email:' });
    const passwordLoginInput = page.getByLabel('Senha:');

    await expect(emailLoginInput).toHaveValue('figocarao@gmail.com');
    await expect(passwordLoginInput).toHaveValue('Teste123');
});

test('CT-FE-005: Verify route protection', async ({ page }) => {
    // Step 1: Clear localStorage to simulate unauthenticated user
    await page.goto('http://localhost:3000/login.html');
    await page.evaluate(() => localStorage.clear());

    // Step 2: Try to access protected page directly
    await page.goto('http://localhost:3000/dashboard.html');

    // Validation 1: Check automatic redirection to login page
    await page.waitForURL('**/login.html', { timeout: 5000 });
    expect(page.url()).toContain('/login.html');

    // Validation 2: Verify user is on login page (check for login form elements)
    const emailInput = page.getByRole('textbox', { name: 'Email:' });
    const passwordInput = page.getByLabel('Senha:');
    const loginButton = page.getByRole('button', { name: 'Entrar' });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
});

