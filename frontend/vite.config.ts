import { defineConfig, AliasOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Obsługa require i ścieżek dla projektów ESM (Type: Module)
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser',
      },
      {
        find: /^xstate$/,
        customResolver(source, importer) {
          if (importer?.includes('@aws-amplify') || importer?.includes('aws-amplify')) {
            try {
              return require.resolve('xstate', {
                paths: [path.resolve(__dirname, 'node_modules/@aws-amplify/ui-react')]
              });
            } catch (e) {
              return require.resolve('xstate');
            }
          }
          return require.resolve('xstate');
        },
      },
      {
        find: /^@xstate\/react$/,
        customResolver(source, importer) {
          if (importer?.includes('@aws-amplify') || importer?.includes('aws-amplify')) {
            try {
              return require.resolve('@xstate/react', {
                paths: [path.resolve(__dirname, 'node_modules/@aws-amplify/ui-react')]
              });
            } catch (e) {
              return require.resolve('@xstate/react');
            }
          }
          return require.resolve('@xstate/react');
        },
      },
    ] as AliasOptions,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      injectRegister: 'auto',
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      manifest: {
        name: 'Bedrock Chat',
        short_name: 'Bedrock Chat',
        description: 'AWS-native chatbot using Bedrock',
        start_url: '/index.html',
        display: 'standalone',
        theme_color: '#232F3E',
        icons: [
          { src: '/images/bedrock_icon_72.png', sizes: '72x72', type: 'image/png' },
          { src: '/images/bedrock_icon_96.png', sizes: '96x96', type: 'image/png' },
          { src: '/images/bedrock_icon_128.png', sizes: '128x128', type: 'image/png' },
          { src: '/images/bedrock_icon_144.png', sizes: '144x144', type: 'image/png' },
          { src: '/images/bedrock_icon_152.png', sizes: '152x152', type: 'image/png' },
          { src: '/images/bedrock_icon_192.png', sizes: '192x192', type: 'image/png' },
          { src: '/images/bedrock_icon_384.png', sizes: '384x384', type: 'image/png' },
          {
            src: '/images/bedrock_icon_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/images/bedrock_icon_512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['@aws-amplify/ui', '@aws-amplify/ui-react', 'xstate', '@xstate/react'],
  },
  server: { host: true },
});