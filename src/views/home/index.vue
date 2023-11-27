<template>
    <div class="home">
        <div class="home-main">
            <div
                v-for="(item,index) in list"
                :key="index"
                class="home-main-item"
            >
                <el-image fit="cover" class="home-main-item-inner" :src="item" />
            </div>
        </div>
        <view class="home-button" @click="handleBlog">
            进入博客
        </view>
        <view class="home-bottom">
            <view class="home-bottom-item">喵喵喵</view>
            <view class="home-bottom-item">沪ICP备2023031020号</view>
            <view class="home-bottom-item">Copyright © {{ moment().format('YYYY') }}</view>
        </view>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

const list = ref([
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/0.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/1.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/2.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/3.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/4.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/0.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/1.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/2.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/3.png',
    'https://qa-res.ipetapi.com/meowmeowmeow/placeholders/4.png',
])

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
    &-main{
        display: flex;
        align-items: center;
        height:calc(100vh - 60px);
        overflow: hidden;
        &-item{
            position: relative;
            left: -500px;
            top:-300px;
            width: 300px;
            flex-shrink: 0;
            height:calc(100vh + 1000px);
            transform: rotate(15deg);
            transition: all 0.3s;
            overflow: hidden;
            filter: blur(20px);
            &-inner{
                position: relative;
                height:calc(100vh + 1000px);
                transform: rotate(-15deg) ;
                width: 1200px;
                left: -500px;
            }
            &:hover{
                width: 600px;
                filter: blur(0px);
                left: -450px;
            }
        }
    }
    &-button{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding:10px 20px;
        border-radius: 20px;
        font-size: 32px;
        background: #FFF;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        color: #FFAA2C;
        transition: all 0.1s;
        &:hover{
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            transform:  translate(-50%,-50%) scale(1.1);
        }
    }
    &-bottom{
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#FFAA2C;
        &-item{
            margin:  0 10px;
        }
    }
}
</style>
