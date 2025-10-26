import { test, expect } from '@playwright/test';

test.describe('Scénario utilisateur - connexion et accueil', () => {
  test('connexion et affichage de la page d’accueil', async ({ page }) => {
    // 2️⃣ Ouvre la page de connexion
    await page.goto('/login');

    // 3️⃣ Remplir le formulaire et soumettre
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="password"]', 'user123');
    await page.click('button[type="submit"]');

    // 4️⃣ Vérifie la redirection
    await expect(page).toHaveURL(/\/$/);

    // 5️⃣ Vérifie le contenu de la page d’accueil
    await expect(page.locator('h1')).toContainText('Bienvenue');
  });
});
