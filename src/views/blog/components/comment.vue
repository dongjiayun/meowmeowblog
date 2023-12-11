<template>
    <div class="meow-comment">
        <el-form ref="formRef" :model="commentForm" :rules="commentRules">
            <el-form-item prop="content">
                <el-input
                    v-model="commentForm.content"
                    type="textarea"
                    placeholder="请输入评论"
                    :autosize="{
                        minRows: 4
                    }"
                />
            </el-form-item>
        </el-form>
        <div class="meow-comment-button">
            <el-button type="primary" @click="handleComment">提交</el-button>
        </div>
        <div v-if="commentList.length > 0" class="meow-comment-list">
            <commentCard
                v-for="(item,index) in commentList"
                :key="index"
                :data="item"
                :article-id="articleId"
                @refresh="init"
            />
            <div v-if="!noMore" class="meow-comment-list-more">
                <el-button type="primary" @click="handleLoadmore">加载更多~</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { commentModel } from '@/api'
import { ElLoading, ElMessage } from 'element-plus'
import { pagination } from '@/mixins/pagination'
import commentCard from './commentCard.vue'

const props = defineProps<{
    articleId: string
    targetId: string
}>()

const commentForm = ref<{
    content: string
}>({ content: '' })

const formRef = ref()

const commentRules = ref({
    content: {
        required: true,
        message: '请输入评论',
    }
})

const {
    pageNo,
    pageSize,
    noMore,
    initPagination
} = pagination()

const commentList = ref<Comment[]>([])

const init = () => {
    commentList.value = []
    commentForm.value.content = ''
    initPagination()
    getComments()
}

onMounted(() => {
    init()
})

const getComments = () => {
    const params = {
        targetId: props.targetId,
        pageNo: pageNo.value,
        pageSize: pageSize.value
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    commentModel.list(params).then(res => {
        if (res.status === 0) {
            commentList.value = [...commentList.value, ...res.data.list]
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

const handleComment = async() => {
    await formRef.value.validate()
    const params = {
        articleId: props.articleId,
        targetId: props.targetId,
        content: commentForm.value.content
    }
    if (props.targetId.includes('Comment')) {
        // @ts-ignore
        params.rootCommentId = props.targetId
    }
    const loading = ElLoading.service({
        lock: true,
        fullscreen: true
    })
    commentModel.create(params).then(res => {
        if (res.status === 0) {
            ElMessage.success('发表成功')
            init()
        } else {
            ElMessage.error(res.message)
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
    getComments()
}

const comment = ref('')
</script>

<style scoped lang="scss">
.meow-comment{
    &-button{
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    &-list{
        margin-top: 20px;
        &-more{
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
