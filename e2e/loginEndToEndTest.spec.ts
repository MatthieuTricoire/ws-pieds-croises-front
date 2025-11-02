import { test, expect } from '@playwright/test';

test.describe('Scénario utilisateur - connexion et accueil', () => {
  test('connexion et affichage de la page d’accueil', async ({ page }) => {
    if (process.env['CI']) {
      // MOCK BACKEND AUTH FLOW IN CI
      await page.route('**://localhost:8080/auth/login', async (route) => {
        console.log('🧩 MOCK /auth/login');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'fake-jwt-token',
          }),
          headers: {
            'Set-Cookie': 'token=fake-jwt-token; HttpOnly; Path=/; Max-Age=604800',
          },
        });
      });

      await page.route('**://localhost:8080/auth/check', async (route) => {
        console.log('🧩 MOCK /auth/check');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(true),
        });
      });

      await page.route('**://localhost:8080/auth/me', async (route) => {
        console.log('🧩 MOCK /auth/me');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            roles: ['ROLE_USER'],
          }),
        });
      });
    }

    // connexion
    await page.goto('/login');

    // soumettre
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="password"]', 'user123');
    await page.click('button[type="submit"]');

    // redirection
    await expect(page).toHaveURL(/\/$/);

    // page d’accueil
    await expect(page.locator('h1')).toContainText('Bienvenue');
  });
});
