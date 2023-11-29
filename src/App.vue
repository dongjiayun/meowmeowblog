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
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()

const keepAlive = ref(['Blog', 'Resume'])
const handleResize = () => {
    if (window.self !== window.top) {
        window.location.href = 'https://club.meowmeowmeow.cn'
        return
    }
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    if (width < 768) {
        window.location.href = 'https://club.meowmeowmeow.cn'
    }
}

handleResize()

window.addEventListener('resize', () => {
    handleResize()
})
</script>

<style lang="scss" scoped>
.meow{

}
</style>
