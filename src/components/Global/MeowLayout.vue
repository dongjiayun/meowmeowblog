<template>
    <div class="meow-layout">
        <div class="meow-layout-header">
            <div class="meow-layout-header-logo" @click="handleHome">
                <el-image class="meow-layout-header-logo-image" :src="getSrc('base/logo.jpg')" />
                <div class="meow-layout-header-logo-label">喵喵喵</div>
            </div>
            <div class="meow-layout-header-routes">
                <div
                    v-for="(item,index) in menus"
                    :key="index"
                    class="meow-layout-header-routes-item"
                    :class="{ active: currentRouteName === item.route }"
                    @click="$router.push({ name: item.route })"
                >{{ item.name }}</div>
            </div>
        </div>
        <div :class="{ 'meow-layout-main': currentRouteName !== 'home' }">
            <slot />
        </div>
        <el-backtop :bottom="60" />
        <div
            v-if="enableBack"
            class="meow-layout-back"
            @click="handleBack"
        >
            <el-icon :size="30" color="#FFAA2C"><ArrowLeft /></el-icon>
            <div>返回</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getSrc } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const router = useRouter()

const currentRouteName = computed(() => {
    return route.name
})

const enableBack = ref(false)

watch(route, () => {
    enableBack.value = history.state.position > 1 && currentRouteName.value !== 'home'
})

const menus = ref([
    { name: '博客', route: 'blog' },
    { name: '博客mobile', route: 'blog-h5' },
])

const handleHome = () => {
    router.push({
        name: 'home'
    })
}

const handleBack = () => {
    router.back()
}
</script>

<style scoped lang="scss">
.meow-layout{
    &-header{
        height: 60px;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        padding:8px;
        display: flex;
        position: sticky;
        top:0;
        z-index: 100;
        background: #FFFFFF;
        &-logo{
            display: flex;
            align-items: center;
            cursor: pointer;
            &-image{
                width: 44px;
                height: 44px;
                border-radius: 44px;
            }
            &-label{
                font-size: 28px;
                font-weight: bold;
                margin-left: 8px;
                color: #FFAA2C;
            }
        }
        &-routes{
            flex:1;
            display: flex;
            align-items: center;
            justify-content: center;
            &-item{
                font-size: 22px;
                transition: all 0.1s;
                cursor: pointer;
                margin: 0 20px;
                &.active{
                    color: #FFAA2C;
                    font-size: 26px;
                }
            }
        }
    }
    &-main{
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        max-width: 1200px;
        margin: 40px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
    }
    &-back{
        position: fixed;
        left: 40px;
        top:100px;
        padding: 10px 20px;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFAA2C;
        font-size: 32px;
        cursor: pointer;
        transition: .1s;
        &:hover{
            transform: scale(1.1);
        }
    }
}
</style>
