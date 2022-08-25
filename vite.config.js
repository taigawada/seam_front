import path from 'path';
import { defineConfig } from 'vite';
import { createVuePlugin as vue2 } from 'vite-plugin-vue2'

export default defineConfig({
    plugins: [vue2()],
    resolve: {
        alias: [
            { find: '@', replacement: path.resolve(__dirname, 'src/') },
        ],
    },
    server: {
        host: true,
    },
});
