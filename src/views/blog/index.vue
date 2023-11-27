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
            <el-pagination
                v-model:current-page="pageNo"
                v-model:page-size="pageSize"
                background
                layout="prev, pager, next, sizes, jumper"
                :total="totalNum"
                @current-change="handlePageNo"
                @size-change="handlePageSize"
            />
        </div>
    </div>
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

const {
    pageNo,
    pageSize,
    totalNum,
} = pagination()

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
            list.value = res.data.list
            totalNum.value = res.data.totalCount || 0
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

const handlePageNo = no => {
    pageNo.value = no
    list.value = []
    getData()
}

const handlePageSize = size => {
    pageSize.value = size
    list.value = []
    getData()
}

</script>

<style scoped lang="scss">
.blog{
    &-footer{
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
