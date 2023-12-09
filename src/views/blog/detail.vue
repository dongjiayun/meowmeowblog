<template>
    <div class="blog-detail">
        <div v-if="cid === data?.authorId" class="blog-detail-buttons">
            <el-button @click="handleDelete">删除</el-button>
            <el-button v-if="data?.isPrivate" @click="handleSetPrivate">解除私密</el-button>
            <el-button v-else @click="handleSetPrivate">设为私密</el-button>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
            <el-tag v-if="data?.isPrivate" style="margin-left: 10px">私密</el-tag>
        </div>
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
        <div
            class="blog-detail-body"
            :class="{ 'markdown-body': data?.isMarkdown }"
            v-html="data?.content"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArticleModel, articleModel } from '@/api'
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { getRandomCover } from '@/utils'
import moment from 'moment'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import Bus from '@/utils/bus'

const data = ref<Article>()

const router = useRouter()

const route = useRoute()

const articleId = ref()

const userStore = useUserStore()
const { cid } = storeToRefs(userStore)

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

const handleEdit = () => {
    if (!data.value?.isMarkdown) {
        return ElMessage.warning('文章为不 Markdown 格式,请去移动端编辑')
    }
    router.push({
        name: 'updateBlog',
        params: {
            id: articleId.value
        }
    })
}

const handleSetPrivate = () => {
    const params = {
        isPrivate: !data.value?.isPrivate,
        articleId: articleId.value
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    ArticleModel.setPrivate(params).then(res => {
        if (res.status === 0) {
            getData()
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

const handleDelete = () => {
    ElMessageBox.confirm('是否删除该文章?', '删除').then(() => {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~'
        })
        ArticleModel.deleteArticle(articleId.value).then(res => {
            if (res.status === 0) {
                ElMessage.success('删除成功')
                router.replace({
                    name: 'blog'
                })
                Bus.emit('refresh')
            } else {
                ElMessage({
                    type: 'error',
                    message: res.message
                })
            }
        }).finally(() => {
            loading.close()
        })
    })
}

</script>

<style scoped lang="scss">
.blog-detail{
    &-buttons{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
        align-items: center;
    }
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

