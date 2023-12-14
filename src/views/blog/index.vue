<template>
    <div class="blog">
        <div class="blog-body">
            <transition-group name="el-fade-in-linear" tag="article-item">
                <article-item
                    v-for="(item,index) in list"
                    :key="index"
                    :data="item"
                />
            </transition-group>
        </div>
        <el-empty v-if="list.length === 0" />
        <div class="blog-footer">
            <el-button v-if="!noMore" type="primary" @click="handleLoadmore">加载更多~</el-button>
        </div>
    </div>
    <Teleport to="#layout">
        <div
            v-if="route.name === 'blog'"
            class="blog-fixed-button"
            @click="handleAdd"
        >
            <el-icon><Plus /></el-icon>
        </div>
    </Teleport>
</template>
<script lang="ts">
export default {
    name: 'Blog'
}
</script>
<script setup lang="ts">
import { articleModel, userModel } from '@/api'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { pagination } from '@/mixins/pagination'
import { ElLoading, ElMessage } from 'element-plus'
import articleItem from '@/components/blog/articleItem.vue'
import { checkLogin } from '@/utils/auth'
import { useRoute, useRouter } from 'vue-router'
import Bus from '@/utils/bus'
import { uniqBy } from 'lodash'

const props = defineProps<{
    cid?: string,
    isLike?: boolean,
    isCollect?: boolean
}>()

const {
    pageNo,
    pageSize,
    initPagination
} = pagination()

const noMore = ref(false)

const route = useRoute()

const list = ref<Article[]>([])

onMounted(() => {
    init()
    Bus.on('refresh', init)
})

onBeforeUnmount(() => {
    Bus.off('refresh', init)
})

const init = () => {
    initPagination()
    list.value = []
    noMore.value = false
    getData()
}

const getData = () => {
    const params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value
    }
    if (props.isLike) {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        userModel.myLikeArticles(params).then(res => {
            if (res.status === 0) {
                list.value = uniqBy([...list.value, ...res.data.list], 'articleId')
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
    } else if (props.isCollect) {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        userModel.myCollectArticles(params).then(res => {
            if (res.status === 0) {
                list.value = uniqBy([...list.value, ...res.data.list], 'articleId')
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
        if (props.cid) {
            // @ts-ignore
            params.cid = props.cid
        }
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        articleModel.list(params).then(res => {
            if (res.status === 0) {
                list.value = uniqBy([...list.value, ...res.data.list], 'articleId')
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

const handleAdd = async() => {
    await checkLogin()
    router.push({
        name: 'createBlog'
    })
}

</script>

<style scoped lang="scss">
.blog{
    &-footer{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
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
    }
}
</style>
