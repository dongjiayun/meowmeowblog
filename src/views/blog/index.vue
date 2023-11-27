<template>
    <div class="blog">
        <div class="blog-body">
            <article-item
                v-for="(item,index) in list"
                :key="index"
                :data="item"
            />
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

<script setup lang="ts">
import { articleModel } from '@/api'
import { onMounted, ref } from 'vue'
import { pagination } from '@/mixins/pagination'
import { ElLoading } from 'element-plus'
import articleItem from '@/components/blog/articleItem.vue'

const {
    pageNo,
    pageSize,
    totalNum,
    initPagination
} = pagination()

const list = ref<Array<Article>>([])

onMounted(() => {
    initPagination()
    getData()
})

const getData = () => {
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
