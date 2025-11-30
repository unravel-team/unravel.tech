// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import icon from 'astro-icon';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), icon()],
  output: 'server',
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
    },
  },

  adapter: cloudflare({platformProxy: {enabled: true}}),
});
