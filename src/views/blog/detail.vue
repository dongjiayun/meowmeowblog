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
        <div class="blog-detail-title">
            {{ data?.title }}
        </div>
        <div class="blog-detail-header" @click="handleUser">
            <el-image class="blog-detail-header-avatar" :src="avatar" />
            <div class="blog-detail-header-name">{{ authorName }}</div>
            <div class="blog-detail-header-date">发表于 {{ moment(data?.createAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
        <div class="blog-detail-info">
            <div v-if="liked" class="blog-detail-info-item">
                <div>{{ toThousandsNum(likeCount,0) }}</div>
                <el-icon style="margin-left: 6px" :size="26" color="#FFAA2C"><StarFilled /></el-icon>
            </div>
            <div v-else class="blog-detail-info-item">
                <div>{{ toThousandsNum(likeCount,0) }}</div>
                <el-icon style="margin-left: 6px" :size="26" color="#FFAA2C"><Star /></el-icon>
            </div>
            <div class="blog-detail-info-item">
                <div>{{ toThousandsNum(collectCount || 0,0) }}</div>
                <el-icon style="margin-left: 6px" :size="26" color="#FFAA2C"><Share /></el-icon>
            </div>
            <div class="blog-detail-info-item">
                <div>{{ toThousandsNum(commentCount || 0,0) }}</div>
                <el-icon style="margin-left: 6px" :size="26" color="#FFAA2C"><Comment /></el-icon>
            </div>
            <div style="flex:1" />
            <div class="blog-detail-info-item">
                <div>{{ toThousandsNum(data?.readCount || 0,0) }}</div>
                <el-icon style="margin-left: 6px" :size="26" color="#FFAA2C"><View /></el-icon>
            </div>
        </div>
        <div
            class="blog-detail-body"
            :class="{ 'markdown-body': data?.isMarkdown }"
            v-html="data?.isMarkdown ? previewContent : data?.content"
        />
        <comment
            :article-id="articleId"
            :target-id="articleId"
            style="margin-top: 40px"
        />
        <Teleport to="#layout">
            <div
                class="blog-detail-fixed-button"
                :class="{ active: liked }"
                style="bottom: 180px"
                @click="handleLike"
            >
                <el-icon><Star /></el-icon>
            </div>
        </Teleport>
        <Teleport to="#layout">
            <div
                class="blog-detail-fixed-button"
                :class="{ active: collected }"
                @click="handleCollect"
            >
                <el-icon><Share /></el-icon>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ArticleModel, articleModel } from '@/api'
import { useRouter, useRoute } from 'vue-router'
import { ElLoading, ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { getRandomCover, toThousandsNum } from '@/utils'
import moment from 'moment'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import Bus from '@/utils/bus'
import comment from './components/comment.vue'

// @ts-ignore
import MarkdownIt from 'markdown-it'

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

const markdown = new MarkdownIt()

const previewContent = computed(() => {
    return markdown.render(data.value?.content)
})

articleId.value = route.params.id

const liked = ref(false)

const collected = ref(false)

const likeCount = computed(() => {
    return data.value?.likeCids?.length || 0
})

const collectCount = computed(() => {
    return data.value?.collectCids?.length || 0
})

const commentCount = computed(() => {
    return data.value?.commentIds?.length || 0
})

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
            if (!res.data) {
                ElMessage.error('文章不存在,或文章处于私密状态')
                return router.back()
            }
            data.value = res.data
            liked.value = res.data.likeCids.includes(cid.value)
            collected.value = res.data.collectCids.includes(cid.value)
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
        return ElMessage.warning('文章不为 Markdown 格式,请移步至移动端编辑')
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

const handleLike = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    if (liked.value) {
        ArticleModel.unLike(articleId.value).then(res => {
            if (res.status === 0) {
                getData()
                ElMessage.success('已取消点赞')
            } else {
                ElMessage({
                    type: 'error',
                    message: res.message
                })
            }
        }).finally(() => {
            loading.close()
        })
    } else {
        ArticleModel.like(articleId.value).then(res => {
            if (res.status === 0) {
                getData()
                ElMessage.success('点赞成功')
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
}

const handleCollect = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    if (collected.value) {
        ArticleModel.unCollect(articleId.value).then(res => {
            if (res.status === 0) {
                getData()
                ElMessage.success('已取消收藏')
            } else {
                ElMessage({
                    type: 'error',
                    message: res.message
                })
            }
        }).finally(() => {
            loading.close()
        })
    } else {
        ArticleModel.collect(articleId.value).then(res => {
            if (res.status === 0) {
                getData()
                ElMessage.success('收藏成功')
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
}

const handleUser = () => {
    router.push({
        name: 'user',
        params: {
            id: data.value?.author?.cid
        }
    })
}

</script>

<style scoped lang="scss">
.blog-detail{
    &-title{
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }
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
        cursor: pointer;
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
    &-info{
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &-item{
            display: flex;
            align-items: center;
            margin-right: 10px;
        }
    }
    &-fixed-button{
        position: fixed;
        right: 40px;
        bottom:120px;
        width: 40px;
        height: 40px;
        border-radius: 60px;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFAA2C;
        box-shadow:  var(--el-box-shadow-lighter);
        cursor: pointer;
        &.active{
            background: #FFAA2C;
            color: #fff;
        }
    }
}
</style>

