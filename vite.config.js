import path from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin as vue2 } from 'vite-plugin-vue2';

export default defineConfig({
  plugins: [vue2()],
  server: {
    host: true,
    proxy: {
      '^/holidays_csv': {
        changeOrigin: true,
        target: 'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv',
        rewrite: (path) => path.replace(/^\/holidays_csv/, ''),
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src/') }],
  },
});
