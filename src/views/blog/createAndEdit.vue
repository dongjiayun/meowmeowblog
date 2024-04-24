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
        <div class="editor-tags">
            <div>标签:</div>
            <el-check-tag
                v-for="(item,index) in tags"
                :key="index"
                class="editor-tags-item"
                type="primary"
                :checked="checkedTags.includes(item.tagId)"
                @change="handleTagChange(item.tagId)"
            >
                {{ item.label }}
            </el-check-tag>
        </div>
        <div class="editor-content">
            <div ref="inputRef" class="editor-input">
                <el-input
                    id="textarea"
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
// @ts-ignore
import { articleModel, ArticleModel, tagModel } from '@/api'
import { useRoute, useRouter } from 'vue-router'
import { ElLoading, ElMessage } from 'element-plus'
import markdown from '@/components/blog/markdown.vue'

const content = ref('')

const form = ref({
    title: ''
})

const tags = ref<Tag[]>([])

const checkedTags = ref<string[]>([])

const getTags = () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'loading~'
    })
    const params = {
        pageNo: 1,
        pageSize: 10000
    }
    return tagModel.list(params).then(res => {
        if (res.status === 0) {
            tags.value = res.data.list
        }
    }).finally(() => {
        loading.close()
    })
}

const handleTagChange = (tagId: string) => {
    if (checkedTags.value.includes(tagId)) {
        checkedTags.value = checkedTags.value.filter(item => item !== tagId)
    } else {
        checkedTags.value.push(tagId)
    }
}

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
            checkedTags.value = res.data.tags.map(item => item.tagId)
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
    const selectedTags = tags.value.filter(item => checkedTags.value.includes(item.tagId))
    const params = {
        title: form.value.title,
        content: content.value,
        isMarkdown: true,
        tags: selectedTags
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

const handleTabKeyDown = (event, textarea) => {
    if (event.key === 'Tab') {
        event.preventDefault() // 阻止Tab的默认行为
        const start = textarea.selectionStart // 获取光标位置
        const end = textarea.selectionEnd
        const target = event.target
        const value = target.value // 获取textarea的值

        // 在光标位置插入4个空格
        target.value = value.substring(0, start) + '    ' + value.substring(end)

        // 更新光标位置
        textarea.selectionStart = textarea.selectionEnd = start + 4
    }
}

let textarea

onMounted(async() => {
    await getTags()
    if (isEdit) {
        getData()
    }
    nextTick(() => {
        textarea = document.getElementById('textarea')
        if (textarea) {
            textarea.addEventListener('keydown', event => {
                handleTabKeyDown(event, textarea)
            })
        }
    })
})

onUnmounted(() => {
    textarea.removeEventListener('keydown', event => {
        handleTabKeyDown(event, textarea)
    })
})
</script>

<style scoped lang="scss">
.editor{
    &-tags{
        display: flex;
        margin-bottom: 20px;
        justify-content: flex-end;
        align-items: center;
        &-item{
            margin-left: 10px;
        }
    }
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
