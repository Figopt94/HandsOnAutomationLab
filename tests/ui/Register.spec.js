// @ts-check
import { test, expect } from '@playwright/test';
import { Register } from '../POM/Register.js';

test('CT-FE-001: Register a user', async ({ page }) => {
  
  const register = new Register(page);
  await page.goto('http://localhost:3000/login.html');

  // Code to generate unique email and name
  const timestamp = Date.now();
  const uniqueEmail = `lacey.massey+${timestamp}@mailinator.com`;
  const uniqueName = `User${timestamp}`;

  await register.reggister();
  await register.fillName('Carlos Oliveiraa');
  await register.fillEmail(uniqueEmail);
  await register.fillPassword('senha123');
  await register.fillConfirmPassword('senha123');

  // Configure listener to capture dialog
  const dialogPromise = page.waitForEvent('dialog', { timeout: 10000 });
  await register.submit();

  // Wait for dialog to appear and validate message
  const dialog = await dialogPromise;
  expect(dialog.message()).toBe('Conta criada com sucesso!');
  await dialog.accept();

  // Wait a bit after accepting dialog
  await page.waitForTimeout(1000);
  
  // Validate the redirect to /login.html page
  await page.waitForURL('**/login.html', { timeout: 5000 });
  expect(page.url()).toContain('/login.html');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  
  // Verify that Email and Password fields are empty on login page
  const emailLoginInput = page.getByRole('textbox', { name: 'Email:' });
  const passwordLoginInput = page.getByLabel('Senha:');
  
  await expect(emailLoginInput).toHaveValue('');
  await expect(passwordLoginInput).toHaveValue('');
});

// locator Email já cadastrado
// page.once('dialog', dialog => {
  //   console.log(`Dialog message: ${dialog.message()}`);
  //   dialog.dismiss().catch(() => {});
  // });

test('CT-FE-002: Register with mismatch password', async ({ page }) => {
  const register = new Register(page);
  await page.goto('http://localhost:3000/login.html');

  await register.reggister();
  await register.fillName('Test User');
  await register.fillEmail('test@test.com');
  await register.fillPassword('pass123');
  await register.fillConfirmPassword('pass456');

  // Preparar para capturar dialog
  page.on('dialog', async dialog => {
    expect(dialog.message()).toBe('As senhas não coincidem!');
    await dialog.accept();
  });
  
  // Forçar o clique no botão (ignorando validações HTML5)
  await page.getByRole('button', { name: 'Registrar' }).click({ force: true });
  
  // Aguardar um pouco para garantir que o dialog foi processado
  await page.waitForTimeout(1000);
});
