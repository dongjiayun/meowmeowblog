import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/styles/index.scss'
import '@/styles/variable.scss'
import global from '@/utils/global'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Longpress from '@/directives/longpress'

import VConsole from 'vconsole'

const app = createApp(App)

// @ts-ignore
if (import.meta.env.VITE_APP_CURRENTMODE !== 'prod') {
    const vConsole = new VConsole()
    // @ts-ignore
    app.use(vConsole)
}

app.use(createPinia())
app.use(router)
app.use(global)
app.use(ElementPlus, {
    locale: zhCn,
})
app.directive('longpress', Longpress)

app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
