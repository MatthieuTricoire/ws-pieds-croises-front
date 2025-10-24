import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: ['**/*.spec.ts'],
  use: {
    baseURL: 'http://localhost:4200',
    headless: !!process.env['CI'],
  },
});
