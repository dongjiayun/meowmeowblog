<template>
    <div v-if="hasPassed" class="blog-resume ">
        <div class="blog-resume-header">
            <el-button size="large" type="primary" @click="handleDownload">下载</el-button>
        </div>
        <div id="content" class="markdown-body">
            <div v-html="content" />
        </div>
    </div>
    <div v-else class="blog-resume">
        <div class="blog-resume-button" @click="checkPassword">申请访问</div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Resume'
}
</script>
<script setup lang="ts">
import { MD5 } from 'crypto-js'
import { getSrc, commonExport } from '@/utils'
import { onMounted, ref } from 'vue'
// @ts-ignore
import MarkdownIt from 'markdown-it'
import { ElMessageBox, ElMessage } from 'element-plus'
import moment from 'moment'
import { resumeKey } from '@/config/secret'
import html2canvas from 'html2canvas'

const markdown = new MarkdownIt()

const content = ref('')

const hasPassed = ref(false)

const getContent = async() => {
    const response = await fetch(getSrc('docs/resume.md'))
    if (response.ok) {
        const data = await response.text()
        content.value = markdown.render(data)
    } else {
        console.error('Failed to fetch markdown file')
    }
}

const checkPassword = () => {
    const secret = resumeKey
    const password = MD5(secret + moment().format('MMDD')).toString()
    return new Promise(resolve => {
        ElMessageBox.prompt('请输入邀请码', '邀请码', {
            confirmButtonText: '确认',
            cancelButtonText: '下次一定',
        })
            .then(({ value }) => {
                if (value === password) {
                    resolve(true)
                    hasPassed.value = true
                    getContent()
                } else {
                    ElMessage({
                        type: 'error',
                        message: `邀请码错误`,
                    })
                    checkPassword()
                }
            })
    })
}

const handleDownload = () => {
    const dom = document.getElementById('content')
    const width = dom.offsetWidth
    const height = dom.offsetHeight
    const scale = 6
    html2canvas(dom, {
        useCORS: true,
        dpi: 350,
        scale,
        width: width,
        heigth: height,
    }).then(canvas => {
        canvas.toBlob(file => {
            commonExport({
                fileName: '董嘉昀的简历',
                type: 'jpg',
                file
            })
        })
    })
}

onMounted(async() => {
    await checkPassword()
})
</script>

<style  lang="scss">
.blog-resume{
    min-height: 600px;
    position: relative;
    &-header{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 60px;
    }
    &-button{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding:10px 20px;
        border-radius: 20px;
        font-size: 32px;
        background: #FFF;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        color: #FFAA2C;
        transition: all 0.1s;
        &:hover{
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            transform: translate(-50%,-50%)  scale(1.1);
        }
    }
}
</style>
