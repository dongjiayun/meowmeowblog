<template>
    <div class="comment-list">
        <commentCard
            v-for="(item,index) in list"
            :key="index"
            to-article
            :data="item"
            :article-id="item.articleId"
        />
        <el-empty v-if="list.length === 0" />
        <div class="comment-list-footer">
            <el-button v-if="!noMore" type="primary" @click="handleLoadmore">加载更多~</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { pagination } from '@/mixins/pagination'
import { commentModel } from '@/api'
import { ElLoading, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import commentCard from '@/views/blog/components/commentCard.vue'

const list = ref<Comment[]>([])

const props = defineProps<{
    isLike?: boolean,
}>()

const {
    pageNo,
    pageSize,
    initPagination,
    noMore
} = pagination()

const init = () => {
    initPagination()
    list.value = []
    noMore.value = false
    getData()
}

const getData = () => {
    const params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value,
    }
    if (props.isLike) {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        commentModel.getLikeComments(params).then(res => {
            if (res.status === 0) {
                list.value = [...list.value, ...res.data.list]
                if (res.data.list.length === 0 || res.data.list.length < pageSize.value) {
                    noMore.value = true
                }
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
        const userStore = useUserStore()
        // @ts-ignore
        params.cid = userStore.cid
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        commentModel.list(params).then(res => {
            if (res.status === 0) {
                list.value = [...list.value, ...res.data.list]
                if (res.data.list.length === 0 || res.data.list.length < pageSize.value) {
                    noMore.value = true
                }
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

const handleLoadmore = () => {
    if (noMore.value) {
        return
    }
    pageNo.value++
    getData()
}

const router = useRouter()
const handleUser = item => {
    router.push({
        name: 'user',
        params: {
            id: item.cid
        }
    })
}

onMounted(() => {
    init()
})
</script>

<style scoped lang="scss">
.comment-list{
    &-item+&-item{
        margin-top: 20px;
    }
    &-item{
        padding: 20px;
        display: flex;
        align-items: center;
        border: 1px solid #eee;
        border-radius: 12px;
        box-shadow:  0 0 10px #eee;
        cursor: pointer;
        &-username{
            margin-left: 12px;
            flex:1;
        }
        &-info{
            display: flex;
            align-items: center;
            &-item{
                display: flex;
                align-items: center;
                margin-left: 20px;
                &-orange{
                    color: #FFAA2C;
                    margin-right: 8px;
                }
            }
        }
    }
    &-footer{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>
