<template>
    <div class="home">
        <div v-if="theme === 'cat'" class="home-main">
            <div
                v-for="(item,index) in list"
                :key="index"
                class="home-main-item"
            >
                <el-image fit="cover" class="home-main-item-inner" :src="item" />
            </div>
        </div>
        <div v-else-if="theme === 'pixel'" class="home-main home-main-pixel" />
        <div
            class="home-button"
            :class="{ 'pixel-button': isPixel ,'blog-button': !isPixel }"
            @click="handleBlog"
        >
            {{ isPixel ? 'Enter Blog' : '进入博客' }}
        </div>
        <div v-if="isPixel" class="home-trinket">
            <capsule />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import capsule from '@/components/trinkets/capsule.vue'
import {getSrc} from "@/utils";

const list = ref([
    getSrc('home/cats/1.jpeg'),
    getSrc('home/cats/2.jpeg'),
    getSrc('home/cats/3.jpeg'),
    getSrc('home/cats/5.jpeg'),
    getSrc('home/cats/6.jpeg'),
    getSrc('home/cats/7.jpeg'),
    getSrc('home/cats/8.jpeg'),
    getSrc('home/cats/9.jpeg'),
    getSrc('home/cats/10.jpeg')
])

const appStore = useAppStore()
const theme = storeToRefs(appStore).theme

const isPixel = computed(() => {
    return theme.value === 'pixel'
})

const router = useRouter()

const handleBlog = () => {
    router.push({
        name: 'blog'
    })
}

</script>

<style lang="scss" scoped>
.home{
    min-height: calc(100vh - 60px);
    position: relative;
    &-main{
        display: flex;
        align-items: center;
        height:calc(100vh - 60px);
        overflow: hidden;
        &-pixel{
            animation: pixel_bg 1s infinite;
            @keyframes pixel_bg {
                0%{
                    background: url("@/assets/home/home_1.png");
                }
                25%{
                    background: url("@/assets/home/home_2.png");
                }
                50%{
                    background: url("@/assets/home/home_3.png");
                }
                75%{
                    background: url("@/assets/home/home_2.png");
                }
                100%{
                    background: url("@/assets/home/home_1.png");
                }
            }
        }
        &-item{
            position: relative;
            left: -200px;
            top:200px;
            width: 15%;
            flex-shrink: 0;
            height:calc(100vh + 1000px);
            transform: rotate(15deg);
            transition: all 0.3s;
            overflow: hidden;
            filter: blur(20px);
            &-inner{
                position: relative;
                height:calc(100vh + 800px);
                transform: rotate(-15deg) ;
                width: 1600px;
                left: -300px;
            }
            &:hover{
                width: 1000px;
                filter: blur(0px);
                left: -250px;
            }
        }
    }
    &-button{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    &-trinket{
        position: absolute;
        left: 40px;
        bottom: 40px;
        width: 360px;
        height: 600px;
        z-index: 10;
    }
}
</style>
