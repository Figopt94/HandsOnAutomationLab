import { expect } from '@playwright/test';

export class Register {
    constructor(page) {
        this.page = page;
        this.registerButton = page.getByRole('link', { name: 'Registre-se' });
        this.nameInput = page.getByRole('textbox', { name: 'Nome:' });
        this.emailInput = page.getByRole('textbox', { name: 'Email:' });
        this.passwordInput = page.getByRole('textbox', { name: 'Senha:', exact: true });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirmar Senha:' });
        this.submitButton = page.getByRole('button', { name: 'Registrar' });
    }

    async reggister () {
    await this.registerButton.click();
    }

    async fillName(name) {
        await this.nameInput.fill(name);
    }

    async fillEmail(email) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(confirmPassword) {
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async submit() {
        await this.submitButton.click();
    }
};   
