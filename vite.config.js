import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from "vite-plugin-node-polyfills";
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// https://vite.dev/config/
export default defineConfig({
    // server: {
    //    open: 'src/nested/about.html'
    //
    // },
    css: {
        postcss: "postcss.config.js"
    },
    plugins: [
        react(),
        nodePolyfills(),
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
                about: 'src/nested/about.html'
            },
            // output: {
            //     experimentalMinChunkSize: 200,
            //     manualChunks: {
            //         antdChunks: ["antd"]
            //     }
            // }
        }
    }
})
