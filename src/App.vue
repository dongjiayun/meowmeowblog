<template>
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, viewport-fit=cover"
    />
    <meow-layout>
        <router-view v-slot="{ Component }">
            <keep-alive :include="keepAlive">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </meow-layout>
    <Login ref="loginRef" />
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'
import Login from '@/components/blog/login.vue'
import Bus from '@/utils/bus'
import { useUserStore } from '@/stores/user'

const loginRef = ref()

const route = useRoute()

const keepAlive = ref(['Blog', 'Resume'])
const handleResize = () => {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (width < 768) {
        const url = window.location.href
        if (url.includes('resume')) {
            const urlParams = new URLSearchParams(window.location.search)
            const password = urlParams.get('password') || ''
            const lang = urlParams.get('lang') || ''
            window.location.href = `https://h5.djydjydjy.top/pages/resumes/index?password=${password}&lang=${lang}`
        } else {
            window.location.href = 'https://h5.djydjydjy.top'
        }
    }
}

handleResize()

window.addEventListener('resize', () => {
    handleResize()
})

Bus.on('login', () => {
    loginRef.value.open()
})

const userStore = useUserStore()
userStore.setUserInfo()

</script>

<style lang="scss" scoped>
.meow{

}
</style>
