// vite.config.ts
import angular from '@analogjs/vite-plugin-angular';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular()],
  test: {
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    setupFiles: ['./test-setup.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    mockReset: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/.storybook/**',
        '**/index.ts',
        '**/public-api.ts',
        "**/*.stories.ts",
        '**/*.html',
        '**/*.scss',
        '**/*.spec.ts',
      ],
    },
  },
  server: {
    fs: {
      deny: ['dist/**'],
    },
  },
  optimizeDeps: {
    exclude: ['dist/**'],
  },
  resolve: {
    alias: {
      'app': path.resolve(__dirname, 'src/app'),
    },
  },
});
