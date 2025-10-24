import { test, expect } from '@playwright/test';

test.describe('Scénario utilisateur - connexion et accueil', () => {
  test('connexion et affichage de la page d’accueil', async ({ page }) => {
    // 🧠 Active les mocks uniquement si on est en CI
    if (process.env['CI']) {
      await page.route('**/api/auth/login', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            token: 'fake-jwt-token',
            user: { id: 1, email: 'john@doe.com', role: 'USER' },
          }),
        });
      });
    }

    // 2️⃣ Ouvre la page de connexion
    await page.goto('/login');

    // 3️⃣ Remplir le formulaire et soumettre
    await page.fill('input[name="email"]', 'jean.dupont@gmail.com');
    await page.fill('input[name="password"]', 'user123');
    await page.click('button[type="submit"]');

    // 4️⃣ Vérifie la redirection
    await expect(page).toHaveURL(/\/$/);

    // 5️⃣ Vérifie le contenu de la page d’accueil
    await expect(page.locator('h1')).toContainText('Bienvenue');
  });
});
