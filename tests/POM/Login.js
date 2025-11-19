import { expect } from '@playwright/test';

export class Login {
    constructor(page) {
        this.page = page;
        this.emailFielfd = page.getByRole('textbox', { name: 'Email:' });
        this.passwordField = page.getByRole('textbox', { name: 'Senha:', exact: true });
        this.loginButton = page.getByRole('button', { name: 'Entrar' });
    }

    async fillEmail(email) {
        await this.emailFielfd.fill(email);
    }

    async fillPassword(password) {
        await this.passwordField.fill(password);
    }

    async submit() {
        await this.loginButton.click();
    }
};

// locators
// test('test', async ({ page }) => {
//   await page.goto('http://localhost:3000/login.html');
//   await page.getByRole('textbox', { name: 'Email:' }).click();
//   await page.getByRole('textbox', { name: 'Email:' }).fill('figocaro@gmail.com');
//   await page.getByRole('textbox', { name: 'Senha:' }).click();
//   await page.getByRole('textbox', { name: 'Senha:' }).fill('Teste123');
//   page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('button', { name: 'Entrar' }).click();
// });