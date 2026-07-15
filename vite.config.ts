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
        injectRegister: 'inline',
        includeAssets: ['/icon.svg', '/icon.svg'],
        workbox: {
          maximumFileSizeToCacheInBytes: 10485760,
          importScripts: ['sw-custom.js'],
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        manifest: {
          id: '/',
          start_url: '/',
          scope: '/',
          name: 'IT Health v2.0',
          short_name: 'IT Health v2.0',
          description: 'IT Health v2.0 by WszystkokolwiekWFormie',
          theme_color: '#020617',
          background_color: '#020617',
          display: 'standalone',
          // @ts-ignore
          display_override: ['tabbed', 'window-controls-overlay', 'standalone'],
          orientation: 'portrait',
          dir: 'ltr',
          lang: 'pl',
          categories: ['health', 'fitness', 'lifestyle'],
          iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
          prefer_related_applications: false,
          related_applications: [
            {
              platform: 'windows',
              url: 'https://it-health-v20.vercel.app/manifest.webmanifest'
            }
          ],
          file_handlers: [
            {
              action: '/',
              accept: {
                'text/csv': ['.csv'],
                'application/json': ['.json']
              }
            }
          ],
          launch_handler: {
            client_mode: 'navigate-existing'
          },
          note_taking: {
            new_note_url: '/?action=new-note'
          },
          tab_strip: {
            home_tab: {
              icons: [
                {
                  src: '/icon.svg',
                  sizes: '192x192',
                  type: 'image/svg+xml'
                }
              ],
              visibility: 'auto'
            }
          },
          widgets: [
            {
              name: 'IT Health Widget',
              description: 'Widget for IT Health v2.0',
              tag: 'it-health-widget',
              template_url: '/widget.json',
              type: 'application/json',
              form_factor: 'rectangular',
              icons: [
                {
                  src: '/icon.svg',
                  sizes: '192x192',
                  type: 'image/svg+xml'
                }
              ]
            }
          ],
          scope_extensions: [
            {
              origin: '*.europe-west2.run.app',
              type: 'origin'
            },
            {
              origin: '*.vercel.app',
              type: 'origin'
            }
          ],
          protocol_handlers: [
            {
              protocol: 'web+ithealth',
              url: '/?action=%s'
            }
          ],
          share_target: {
            action: '/share',
            method: 'GET',
            enctype: 'application/x-www-form-urlencoded',
            params: {
              title: 'title',
              text: 'text',
              url: 'url'
            }
          },
          edge_side_panel: {
            preferred_width: 480
          },
          shortcuts: [
            {
              name: 'Spiżarnia Biohackera',
              short_name: 'Zakupy',
              description: 'Otwórz listę zakupów',
              url: '/',
              icons: [{ src: '/icon.svg', sizes: '192x192', type: 'image/svg+xml' }]
            }
          ],
          screenshots: [
            {
              src: '/screenshot-desktop.svg',
              sizes: '1280x720',
              type: 'image/svg+xml',
              form_factor: 'wide',
              label: 'Widok ekranu komputera'
            },
            {
              src: '/screenshot-mobile.svg',
              sizes: '720x1280',
              type: 'image/svg+xml',
              form_factor: 'narrow',
              label: 'Widok ekranu smartfona'
            }
          ],
          icons: [
            {
              src: '/icon.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
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
