<template>
    <div class="notice">
        <div v-for="item in noticeList" :key="item.noticeId" class="notice-item" @click="handleRead(item)">
            <el-badge style="width: 100%" :value="item.isReaded ? '' : 'new'">
                <div class="notice-item-header">
                    <el-avatar :src="item.avatar?.fileUrl || getRandomCover()" />
                    <div class="notice-item-header-title" :class="{ new: !item.isReaded }">{{ item.title }}</div>
                    <div class="notice-item-header-date">{{ moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
                </div>
                <div class="notice-item-body">
                    {{ item.content }}
                </div>
            </el-badge>
        </div>
        <div v-if="!noMore" class="notice-more">
            <el-button type="primary" @click="handleGetMore">加载更多</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { pagination } from '@/mixins/pagination'
import { noticeModel } from '@/api'
import { ElLoading, ElMessage } from 'element-plus'
import { getRandomCover } from '@/utils'
import moment from 'moment'
import { useRouter } from 'vue-router'
import { Local } from '@/utils/storage'

const noticeList = ref<Notice[]>([])

const {
    pageNo,
    pageSize,
    noMore,
    initPagination
} = pagination()

const init = () => {
    initPagination()
    noticeList.value = []
    getNotice()
}

onMounted(() => {
    init()
})

const getNotice = () => {
    const params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~',
    })
    noticeModel.list(params).then(res => {
        if (res.status === 0) {
            noticeList.value = [...noticeList.value, ...res.data.list]
            if (res.data.list.length === 0 || res.data.list.length < pageSize.value) {
                noMore.value = true
            }
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const handleGetMore = () => {
    pageNo.value++
    getNotice()
}

const handleRead = notice => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~',
    })
    noticeModel.read(notice.noticeId).then(res => {
        if (res.status === 0) {
            noticeJump(notice)
            const readNoticeCache = Local.get('meow-notice') || []
            if (!readNoticeCache.includes(notice.noticeId)) {
                Local.set('meow-notice', [...readNoticeCache, notice.noticeId])
            }
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const router = useRouter()
const noticeJump = data => {
    switch (data.noticeType) {
        case 'collectArticle':
        case 'likeArticle':
            router.push({
                name: 'blog-detail',
                params: {
                    id: data.noticeCode
                }
            })
            break
        case 'follow':
            router.push({
                name: 'user',
                query: {
                    cid: data.noticeCode
                }
            })
            break
        case 'article':
            router.push({
                name: 'blog-detail',
                params: {
                    id: data.noticeCode
                }
            })
            break
        case 'comment':
            router.push({
                name: 'blog-detail',
                params: {
                    id: data.noticeCode.split('|')?.[1],
                }
            })
            break
        case 'likeComment':
            router.push({
                name: 'blog-detail',
                params: {
                    articleId: data.noticeCode.split('|')?.[1],
                }
            })
    }
}

</script>

<style scoped lang="scss">
.notice{
    &-item+&-item{
        margin-top: 20px;
    }
    &-item{
        border-radius: 12px;
        background: #fff;
        border: 1px solid #f0f0f0;
        box-shadow:  0 0 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
        &-header{
            display: flex;
            align-items: center;
            &-title{
                margin-left: 10px;
                flex:1;
                &.new{
                    color:#FFAA2C;
                }
            }
            &-date{
                font-size: 12px;
                color: #999;
            }
        }
        &-body{
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
    }
    &-more{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }
}
</style>
