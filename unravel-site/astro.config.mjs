// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app', '.ngrok.io', '.ngrok.app'],
    },
  },
});
