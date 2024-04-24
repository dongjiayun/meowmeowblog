<template>
    <div class="blog">
        <div class="blog-body">
            <div class="blog-body-search">
                <el-form inline>
                    <el-form-item prop="keyword" label="搜索">
                        <el-input
                            v-model="searchForm.keyword"
                            clearable
                            placeholder="文章标题或标签"
                            @clear="handleSearch"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="tags && tags.length > 0" class="blog-body-tags">
                <el-check-tag
                    v-for="(item,index) in tags"
                    :key="index"
                    class="blog-body-tags-item"
                    type="primary"
                    :checked="checkedTags.includes(item.tagId)"
                    @change="handleTagChange(item.tagId)"
                >{{ item.label }}</el-check-tag>
            </div>
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
    <Teleport to="#layout">
        <div
            v-if="route.name === 'blog'"
            class="blog-refresh"
            :class="{ 'pixel-button': isPixel ,'blog-button': !isPixel }"
            @click="init"
        >
            <div>{{ isPixel ? 'refresh' : '刷新' }}</div>
        </div>
    </Teleport>
</template>
<script lang="ts">
export default {
    name: 'Blog'
}
</script>
<script setup lang="ts">
import { articleModel, userModel, tagModel } from '@/api'
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { pagination } from '@/mixins/pagination'
import { ElLoading, ElMessage } from 'element-plus'
import articleItem from '@/components/blog/articleItem.vue'
import { checkLogin } from '@/utils/auth'
import { useRoute, useRouter } from 'vue-router'
import Bus from '@/utils/bus'
import { uniqBy } from 'lodash'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

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

const tags = ref<Tag[]>([])

const getTags = () => {
    tagModel.list().then(res => {
        if (res.status === 0) {
            tags.value = res.data.list
        }
    })
}

const checkedTags = ref<string[]>([])

const searchForm = ref({
    keyword: '',
    tagIds: []
})

const noMore = ref(false)

const route = useRoute()

const list = ref<Article[]>([])

const appStore = useAppStore()
const { theme } = storeToRefs(appStore)

const isPixel = computed(() => theme.value === 'pixel')

onMounted(() => {
    init()
    Bus.on('refresh', init)
})

onBeforeUnmount(() => {
    Bus.off('refresh', init)
})

const init = () => {
    getTags()
    initPagination()
    list.value = []
    noMore.value = false
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
    getData()
}

const handleTagChange = (tagId: string) => {
    checkedTags.value = []
    checkedTags.value.push(tagId)
    searchForm.value.tagIds = checkedTags.value
    handleSearch()
}

const handleSearch = () => {
    initPagination()
    list.value = []
    noMore.value = false
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
    getData()
}

const getData = () => {
    const params = {
        keyword: searchForm.value.keyword.trim(),
        tagId: searchForm.value.tagIds[0],
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
    &-body{
        &-search{
            display: flex;
            padding: 20px 0;
            align-items: center;
        }
        &-tags{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 20px;
            &-item{
                margin-left: 10px;
            }
        }
    }
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
        z-index: 10;
    }
    &-refresh{
        position: fixed;
        top:220px;
        left: 40px;
        z-index: 10;
    }
}
</style>
