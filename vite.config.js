import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from "vite-plugin-node-polyfills";


// https://vite.dev/config/
export default defineConfig({
    server: {
        open: 'index.html',
    },
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             api: 'modern-compiler', // or "modern", "legacy"
    //             importers: [],
    //         },
    //     },
    //     postcss: "postcss.config.js",
    // },

    plugins: [
        nodePolyfills(),
        react(),

    ],
    base: "./",
    build: {
        outDir: "dist-react",
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            input: {
                index: 'index.html',
                page2: 'src/nested/page2.html',
                page3: 'src/nested/page3.html',
            }
        }
    }
})
