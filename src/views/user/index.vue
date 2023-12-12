<template>
    <div class="meow-user">
        <div class="meow-user-header">
            <el-avatar :size="60" :src="avatar" />
            <div class="meow-user-header-name">{{ userData?.username || '匿名猫猫' }}</div>
        </div>
        <div class="meow-user-body">
            <el-tabs v-model="currentTab" @tab-change="handleTabChange">
                <el-tab-pane
                    v-for="item in tabs"
                    :key="item.value"
                    :label="item.label"
                    :name="item.value"
                >
                </el-tab-pane>
            </el-tabs>
            <meow-article v-if="currentTab === 'Article'" :cid="cid" />
            <meow-like v-if="currentTab === 'Like'" />
            <meow-collect v-if="currentTab === 'Collect'" />
            <meow-follow  v-if="currentTab === 'Follow'" />
            <meow-fans  v-if="currentTab === 'Fans'" />
            <meow-comment v-if="currentTab === 'Comment'" />
            <meow-like-comment v-if="currentTab === 'LikeComment'" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, defineAsyncComponent, nextTick, onMounted, ref, watch } from 'vue'
import { checkLogin } from '@/utils/auth'
import { useUserStore } from '@/stores/user'
import { ElLoading, ElMessage } from 'element-plus'
import { userModel } from '@/api'
import { getRandomCover } from '@/utils'
import Bus from '@/utils/bus'

const MeowArticle = defineAsyncComponent(() => import('./components/article.vue'))
const MeowLike = defineAsyncComponent(() => import('./components/like.vue'))
const MeowCollect = defineAsyncComponent(() => import('./components/collect.vue'))
const MeowFollow = defineAsyncComponent(() => import('./components/follow.vue'))
const MeowFans = defineAsyncComponent(() => import('./components/fans.vue'))
const MeowComment = defineAsyncComponent(() => import('./components/comment.vue'))
const MeowLikeComment = defineAsyncComponent(() => import('./components/likeComment.vue'))

const isMine = computed(() => {
    return route.name === 'mine'
})

const userStore = useUserStore()

const cid = computed(() => {
    return isMine.value ? userStore.cid : route.params.id
})

const userData = ref<SafeUser>()

const route = useRoute()

const avatar = computed(() => {
    return userData.value?.avatar.fileUrl || getRandomCover()
})

const currentTab = ref('Article')

const tabs = computed(() => {
    return isMine.value ? [
        {
            label: '小作文',
            value: 'Article',
        },
        {
            label: '点赞',
            value: 'Like',
        },
        {
            label: '收藏',
            value: 'Collect',
        },
        {
            label: '关注',
            value: 'Follow',
        },
        {
            label: '粉丝',
            value: 'Fans',
        },
        {
            label: '评论',
            value: 'Comment',
        },
        {
            label: '点赞评论',
            value: 'LikeComment',
        }
    ] : [
        {
            label: '小作文',
            value: 'Article',
        },
        {
            label: '关注',
            value: 'Follow',
        },
        {
            label: '粉丝',
            value: 'Fans',
        },
    ]
})

watch(() => cid.value, () => {
    getUser()
})

const getUser = () => {
    if (!cid.value || !<string>cid.value?.startsWith('C')) {
        return
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~',
    })
    userModel.info(cid.value).then(res => {
        if (res.status === 0) {
            userData.value = res.data
        } else {
            ElMessage.error(res.msg)
        }
    }).finally(() => {
        loading.close()
    })
}

const handleTabChange = () => {
    nextTick(() => {
        Bus.emit('refresh')
    })
}

onMounted(async() => {
    if (isMine.value) {
        await checkLogin()
    }
    getUser()
})

watch(() => route.params, () => {
    nextTick(() => {
        Bus.emit('refresh')
    })
})

</script>

<style scoped lang="scss">
.meow-user{
    &-header{
        display: flex;
        align-items: center;
        &-name{
            margin-left: 12px;
            font-size: 20px;
        }
    }
    &-body{
        margin-top: 20px;
    }
}
</style>
