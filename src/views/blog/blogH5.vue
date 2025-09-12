<template>
    <div class="blog-h5">
        <div class="blog-h5-phone">
            <div class="blog-h5-phone-main">
                <div class="blog-h5-phone-main-bangs" />
                <div
                    class="blog-h5-phone-main-screen"
                >
                    <iframe class="blog-h5-phone-main-screen-inner" src="https://h5.djydjydjy.top" />
                </div>
            </div>
        </div>
        <div class="blog-h5-info">
            <div class="blog-h5-info-title">
                推荐使用手机访问~
            </div>
            <el-image class="blog-h5-info-qrcode" :src="getSrc('base/qrcode.png')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getSrc } from '@/utils'
</script>

<style scoped lang="scss">
.blog-h5{
    display: flex;
    &-phone{
        flex-shrink: 0;
        padding:20px;
        &-main{
            width: 391px;
            height: 860px;
            border-radius: 26px;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            &-bangs{
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 200px;
                height: 44px;
                background: #000;
                border-radius: 0 0 20px 20px;
                z-index: 10;
            }
            &-screen {
                box-sizing: border-box;
                padding: 38px 0 0;
                width: 375px;
                height: 844px;
                border-radius: 20px;
                background: #f5f5f5;
                overflow-y: auto;
                position: relative;
                scrollbar-width: none; /* firefox */
                -ms-overflow-style: none; /* IE 10+ */
                &::-webkit-scrollbar {
                    display: none;
                }
                &-inner{
                    width: 375px;
                    height: 808px;
                    border: none;
                }
            }
        }
    }
    &-info{
        padding:20px;
        &-title{
            font-size: 28px;
            margin-bottom: 40px;
        }
        &-qrcode{
            width: 400px;
            height: 400px;
            border-radius: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
    }
}
</style>
