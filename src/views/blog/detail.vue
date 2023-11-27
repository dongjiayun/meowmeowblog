<template>
    <div class="blog-detail">
        <div v-if="covers && covers.length > 0" class="blog-detail-covers">
            <el-carousel height="600px">
                <el-carousel-item v-for="item in covers" :key="item" class="blog-detail-covers-item">
                    <el-image
                        :preview-src-list="covers.map(i => i.fileUrl)"
                        style="height: 600px"
                        fit="contain"
                        :src="item?.fileUrl"
                        preview-teleported
                    />
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="blog-detail-header">
            <el-image class="blog-detail-header-avatar" :src="avatar" />
            <div class="blog-detail-header-name">{{ authorName }}</div>
            <div class="blog-detail-header-date">发表于 {{ moment(data?.createAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
        <div class="blog-detail-body" v-html="data?.content" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { articleModel } from '@/api'
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import { getRandomCover } from '@/utils'
import moment from 'moment'

const data = ref<Article>()

const router = useRouter()

const route = useRoute()

const articleId = ref()

const covers = computed(() => {
    return data.value?.covers || []
})

const avatar = computed(() => {
    return data.value?.author?.avatar.fileUrl || getRandomCover()
})

const authorName = computed(() => {
    return data.value?.author?.username || '匿名猫猫'
})

articleId.value = route.params.id

onMounted(() => {
    getData()
})

const getData = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    articleModel.get(articleId.value).then(res => {
        if (res.status === 0) {
            data.value = res.data
        } else {
            ElMessage({
                type: 'error',
                message: res.message
            })
        }
    }).finally(() => {
        loading.close()
    })
}
</script>

<style scoped lang="scss">
.blog-detail{
    &-covers{
        background:url("@/assets/base/textLogo.png") repeat;
        margin-bottom: 20px;
        &-item{
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    &-header{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &-avatar{
            width: 60px;
            height: 60px;
            border-radius: 60px;
            margin-right: 20px;
        }
        &-name{
            font-size: 24px;
            font-weight: bold;
            flex:1;
        }
        &-date{
            font-size: 16px;
            color: #ccc;
        }
    }
     &-body{
        font-size: 24px;
        overflow: auto;
    }
}
</style>

