<template>
    <div class="editor">
        <div class="editor-title">
            <el-form ref="formRef" :model="form" :rules="rules">
                <el-form-item label="标题" prop="title">
                    <el-input
                        v-model="form.title"
                        clearable
                    />
                </el-form-item>
            </el-form>
        </div>
        <div class="editor-content">
            <div ref="inputRef" class="editor-input">
                <el-input
                    v-model="content"
                    type="textarea"
                    placeholder="请输入内容"
                    :autosize="{
                        minRows: 40
                    }"
                />
            </div>
            <div class="editor-divider" />
            <div ref="previewRef" class="editor-preview">
                <markdown style="min-height: 70vh" :content="content" />
            </div>
        </div>
        <div class="editor-buttons">
            <div class="blog-button" @click="handleSubmit">提交</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
// @ts-ignore
import { articleModel, ArticleModel } from '@/api'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import markdown from '@/components/blog/markdown.vue'

const content = ref('')

const form = ref({
    title: ''
})

const rules = ref({
    title: {
        required: true,
        message: '请输入标题',
    }
})

const formRef = ref()

const route = useRoute()
const isEdit = route.name === 'updateBlog'

const router = useRouter()

const articleId = route.params.id

const inputRef = ref()

const previewRef = ref()

nextTick(() => {
    inputRef.value.addEventListener('scroll', e => {
        const { offsetHeight, scrollTop } = inputRef.value
        const _srcollTop = previewRef.value.offsetHeight / (offsetHeight / scrollTop)
        previewRef.value.scrollTo({ top: _srcollTop })
    })
    previewRef.value.addEventListener('scroll', e => {
        const { offsetHeight, scrollTop } = previewRef.value
        const _srcollTop = inputRef.value.offsetHeight / (offsetHeight / scrollTop)
        inputRef.value.scrollTo({ top: _srcollTop })
    })
})

const getData = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    articleModel.get(articleId).then(res => {
        if (res.status === 0) {
            content.value = res.data.content
            form.value.title = res.data.title
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

const handleSubmit = async() => {
    await formRef.value.validate()
    const params = {
        title: form.value.title,
        content: content.value,
        isMarkdown: true
    }
    if (isEdit) {
        // @ts-ignore
        params.articleId = route.params.id
    }
    const loading = ElLoading.service({
        lock: true,
        text: '请稍后...',
    })
    ArticleModel[isEdit ? 'edit' : 'create'](params).then(res => {
        if (res.status === 0) {
            ElMessage.success('发表成功')
            router.push({
                name: 'blog-detail',
                params: {
                    id: isEdit ? route.params.id : res.data
                }
            })
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

onMounted(() => {
    if (isEdit) {
        getData()
    }
})
</script>

<style scoped lang="scss">
.editor{
    &-content{
        display: flex;
    }
    &-input{
        flex:1;
        height: 70vh;
        overflow: auto;
    }
    &-divider{
        margin: 0 20px;
        border-left: 1px dashed #FFAA2C;
        height: 70vh;
    }
    &-preview{
        flex:1;
        height: 70vh;
        overflow: auto;
    }
    &-buttons{
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
