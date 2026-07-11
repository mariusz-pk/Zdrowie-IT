import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['app-icon.png'],
        manifest: {
          id: '/',
          name: 'IT Health v2.0',
          short_name: 'IT Health v2.0',
          description: 'IT Health v2.0 by WszystkokolwiekWFormie',
          theme_color: '#020617',
          background_color: '#020617',
          display: 'standalone',
          orientation: 'portrait',
          dir: 'ltr',
          lang: 'pl',
          categories: ['health', 'fitness', 'lifestyle'],
          shortcuts: [
            {
              name: 'Spiżarnia Biohackera',
              short_name: 'Zakupy',
              description: 'Otwórz listę zakupów',
              url: '/',
              icons: [{ src: '/app-icon.png', sizes: '192x192' }]
            }
          ],
          screenshots: [
            {
              src: '/app-icon.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Widok ekranu komputera'
            },
            {
              src: '/app-icon.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Widok ekranu smartfona'
            }
          ],
          icons: [
            {
              src: '/app-icon.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/app-icon.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/app-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/app-icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        },
        devOptions: {
          enabled: true,
          type: 'module',
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
