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
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/MeowMeowHome.git')">基于vue2+uniapp移动端前端源代码</div>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/meowmeowblog')">基于vue3+vite+element-ui前端桌面端源代码</div>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/pet-family-server.git')">基于golang的服务端源代码</div>
            <div>喜欢的朋友记得 ➕ ⭐️⭐️⭐️</div>
            <div>2024.1</div>
            <div>--------------------- 分割线 ---------------------</div>
            <div>时光荏苒,一晃就是2个春秋.这两年事业也遇到了十字路口.</div>
            <div>家庭也迎来了新成员,人生也有了新的身份</div>
            <div>时隔2年重新启用该博客,愿一切越来越好</div>
            <div>再贴几个最新项目,旧活新整,朝花夕拾.新瓶装旧酒,用新技术套用成熟架构,开发新项目.也有了很多新的理解</div>
            <div>ps:由于更换了oss,之前的图片都不能访问了</div>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/pet-shop-server.git')">基于golang的宠物店后台</div>
            <div class="copy" @click="handleJump('https://github.com/dongjiayun/pet-shop-app.git')">基于vue3的uniapp宠物店小程序</div>
            <div>2025.9</div>
            <div v-if="isPixel" class="meow-about-ornament">
                <pikachu />
            </div>
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
