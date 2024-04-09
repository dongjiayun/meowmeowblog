<template>
    <div class="meow-about">
        <div class="meow-about-header">
            <pa-navbar>关于</pa-navbar>
        </div>
        <div class="meow-about-body">
            <div>喵喵喵养宠社区</div>
            <div>
                年底比较空,花了一个月折腾了个🐱🐱社区.
            </div>
            <div>
                桌面端项目使用了Vue 3 + TypeScript + Element Plus开发，
            </div>
            <div>
                移动端项目则采用了UniApp结合打磨了将近1年的Uni-UI二开框架，前端建站只花了5个工作日。🐾🚀
            </div>
            <div>
                后端部分则采用了基于Gin的GoLang框架进行开发。
            </div>
            <h3>这个小作坊托管在我的GitHub（其实就是我自己的个人仓库），欢迎来逛逛！🛠️🌟</h3>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/MeowMeowHome.git')">移动端前端源代码</div>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/meowmeowblog')">前端桌面端源代码</div>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/pet-family-server.git')">服务端源代码</div>
            <div>喜欢的朋友记得 ➕ ⭐️⭐️⭐️</div>
        </div>
        <div v-if="isPixel" class="meow-about-ornament">
            <pikachu />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import pikachu from '@/components/trinkets/pikachu.vue'

const appStore = useAppStore()

const theme = storeToRefs(appStore).theme

const isPixel = computed(() => {
    return theme.value === 'pixel'
})
const handleJump = url => {
    window.open(url, '_blank')
}
</script>

<style scoped lang="scss">
.meow-about{
    background: #fff;
    font-size: 20px;
    &-header{
        z-index: 10;
        background: #fff;
        position: sticky;
        top: 0;
    }
    &-body{
        padding: 10px;
        .copy{
            color: #FFAA2C;
            text-decoration:  underline;
            cursor: pointer;
        }
    }
    &-ornament{
        position: relative;
    }
}
</style>
