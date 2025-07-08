import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import removeConsole from 'vite-plugin-remove-console';
import pkg from './package.json';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  server: { host: true },
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    removeConsole({
      includes: ['debug'],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
