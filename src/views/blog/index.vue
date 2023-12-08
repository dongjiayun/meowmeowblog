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
        <div class="blog-footer">
            <el-button v-if="!noMore" type="primary" @click="handleLoadmore">加载更多~</el-button>
        </div>
    </div>
    <Teleport to="#layout">
        <el-backtop
            :visibility-height="0"
            :bottom="120"
            @click="handleAdd"
        >
            <el-icon><Plus /></el-icon>
        </el-backtop>
    </Teleport>
</template>
<script lang="ts">
export default {
    name: 'Blog'
}
</script>
<script setup lang="ts">
import { articleModel } from '@/api'
import { onMounted, ref } from 'vue'
import { pagination } from '@/mixins/pagination'
import { ElLoading, ElMessage } from 'element-plus'
import articleItem from '@/components/blog/articleItem.vue'
import { checkLogin } from '@/utils/auth'

const {
    pageNo,
    pageSize,
} = pagination()

const noMore = ref(false)

const list = ref<Array<Article>>([])

onMounted(() => {
    console.log('onMounted')
    getData()
})

const getData = () => {
    window.scroll({
        top: 0
    })
    const params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~',
    })
    articleModel.list(params).then(res => {
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

const handleLoadmore = () => {
    if (noMore.value) {
        return
    }
    pageNo.value++
    getData()
}

const handleAdd = async() => {
    console.log('handleAdd')
    await checkLogin()
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
}
</style>
