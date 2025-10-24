import { test, expect } from '@playwright/test';

test.describe('Scénario utilisateur - connexion et accueil', () => {
  test('connexion et affichage de la page d’accueil', async ({ page }) => {
    // 1️⃣ Ouvrir la page de connexion
    await page.goto('/login');

    // 2️⃣ Remplir les champs email et mot de passe
    await page.fill('input[name="email"]', 'jean.dupont@example.com');
    await page.fill('input[name="password"]', 'user123');

    // 3️⃣ Cliquer sur le bouton de connexion
    await page.click('button[type="submit"]');

    // 4️⃣ Vérifier la redirection vers la page d’accueil
    await expect(page).toHaveURL(/\/$/);

    // 5️⃣ Vérifier que le contenu de la page d’accueil est bien affiché
    await expect(page.locator('h1')).toContainText('Bienvenue');
  });
});
