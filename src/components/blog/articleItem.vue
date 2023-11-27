<template>
    <div class="article-item">
        <el-image class="article-item-cover" :src="cover" />
        <div class="article-item-info">
            <div class="article-item-info-header">
                <el-image :src="avatar" class="article-item-info-header-avatar" />
                <div class="article-item-info-header-name">{{ authorName }}</div>
                <div class="article-item-info-header-date">{{ moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
            </div>
            <div class="article-item-info-title">{{ data.title }}</div>
            <div class="article-item-info-extendinfo">
                <div class="article-item-info-extendinfo-item">
                    <div>{{ toThousandsNum(data.likesCount || 0,0) }}</div>
                    <el-icon :size="26" color="#FFAA2C"><StarFilled /></el-icon>
                </div>
                <div class="article-item-info-extendinfo-item">
                    <div>{{ toThousandsNum(data.colllectCount || 0,0) }}</div>
                    <el-icon :size="26" color="#FFAA2C"><Share /></el-icon>
                </div>
                <div class="article-item-info-extendinfo-item">
                    <div>{{ toThousandsNum(data.commentCount || 0,0) }}</div>
                    <el-icon :size="26" color="#FFAA2C"><Comment /></el-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRandomCover, toThousandsNum } from '@/utils'
import moment from 'moment'

const props = defineProps < {
    data: Article
} >()

const cover = computed(() => {
    return props.data.covers?.[0]?.fileUrl || getRandomCover()
})

const avatar = computed(() => {
    return props.data.author?.avatar.fileUrl || getRandomCover()
})

const authorName = computed(() => {
    return props.data.author?.username || '匿名猫猫'
})
</script>

<style scoped lang="scss">
.article-item{
    display: flex;
   &-cover{
       width: 160px;
       height: 160px;
       border-radius: 12px;
       margin-right: 40px;
   }
    &-info{
        flex: 1;
        display: flex;
        flex-direction: column;
        &-header{
            display: flex;
            align-items: center;
            &-avatar{
                width: 40px;
                height: 40px;
                border-radius: 40px;
                margin-right: 12px;
            }
            &-name{
                font-size: 20px;
                font-weight: bold;
                flex:1;
            }
            &-date{
                font-size: 16px;
                color: #ccc;
            }
        }
        &-title{
            font-size: 28px;
            flex:1;
        }
        &-extendinfo{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            &-item{
                display: flex;
                align-items: center;
                font-size: 24px;
                color: #ccc;
                margin-left: 20px;
            }
        }
    }
}
.article-item+.article-item{
    margin-top: 12px;
    border-top:  1px solid #eee;
    padding-top: 12px;
}
</style>
