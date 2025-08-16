import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ViteComponents from 'vite-plugin-components'
// @ts-ignore
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3100,
        proxy: {
            '/api': {
                target: 'http://api.djydjydjy.top',
                // target: 'http://localhost:2000',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
            }
        }
    },
    plugins: [
        vue(),
        vueJsx(),
        ViteComponents({
            // 组件自动导入的目录
            dirs: ['src/components/Global'],
            // 组件的全局属性，默认为 'name'
            globalComponentsDeclaration: 'name',
        }),
        createHtmlPlugin({
            inject: {
                data: {
                    title: '喵喵喵'
                }
            }
        }),
    ],
    resolve: {
        alias: {
            // @ts-ignore
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
