<template>
    <div v-if="hasPassed" class="blog-resume ">
        <div class="blog-resume-header">
            <el-switch
                v-model="lang"
                inline-prompt
                style="--el-switch-on-color: #FFAA2C; --el-switch-off-color: #FFAA2C;margin-right: 10px"
                active-text="中"
                inactive-text="EN"
                active-value="zh"
                inactive-value="en"
                @change="handleChangeLang"
            />
            <el-button size="large" style="margin-right: 10px" @click="handleShare">分享链接</el-button>
            <el-dropdown>
                <el-button size="large" type="primary">
                    下载<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleDownload('doc')">doc文件</el-dropdown-item>
                        <el-dropdown-item @click="handleDownload('jpg')">jpg文件</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div id="content" class="markdown-body">
            <div v-html="content" />
        </div>
    </div>
    <div v-else class="blog-resume">
        <div class="blog-resume-apply">
            <el-image class="blog-resume-apply-qrcode" :src="getSrc('docs/qrcode.jpg')" />
            <div
                :class="{ 'pixel-button': isPixel ,'blog-button': !isPixel }"
                @click="handleCheckPassword"
            >{{ isPixel ? 'Apply Access' : '申请访问' }}</div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Resume'
}
</script>
<script setup lang="ts">
// @ts-ignore
import { MD5 } from 'crypto-js'
import { getSrc, commonExport, copy } from '@/utils'
import { onMounted, ref, computed } from 'vue'
// @ts-ignore
import MarkdownIt from 'markdown-it'
import { ElMessageBox, ElMessage } from 'element-plus'
import moment from 'moment'
import { resumeKey } from '@/config/secret'
import html2canvas from 'html2canvas'
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import FileSaver from 'file-saver'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { resumeModel } from '@/api'

const route = useRoute()

const router = useRouter()

const routePassword = route.query?.password

const markdown = new MarkdownIt()

const content = ref('')

const hasPassed = ref(false)

const lang = ref('zh')

const appStore = useAppStore()

const theme = storeToRefs(appStore).theme

const isPixel = computed(() => {
    return theme.value === 'pixel'
})

const resumes = ref<Resumes>([])

const loading = ref(false)

const userStore = useUserStore()

const { isAdmin } = storeToRefs(userStore)

const getContent = async() => {
    hasPassed.value = true
    // const response = await fetch(getSrc(lang.value === 'zh' ? 'docs/resume.md' : 'docs/resume-en.md'))
    // if (response.ok) {
    //     const data = await response.text()
    //     content.value = markdown.render(data)
    // } else {
    //     console.error('Failed to fetch markdown file')
    // }
    await getResumes()
    content.value = markdown.render(resumes.value.find(i => lang.value === i.language).content ?? '')
}

const checkPassword = () => {
    if (isAdmin.value) {
        return getContent()
    }
    if (hasPassed.value) {
        return getContent()
    }
    const secret = resumeKey
    const password = MD5(secret).toString()
    if (routePassword && (routePassword === password || routePassword === 'SpecialPrivilege')) {
        return getContent()
    }
}

const getResumes = () => {
    const params = {
        isLatest: true,
    }
    loading.value = true
    if (resumes.value.length) {
        return Promise.resolve(resumes.value)
    } else {
        return resumeModel.list(params).then(res => {
            if (res.status === 0) {
                resumes.value = res.data.list
            }
        }).finally(() => {
            loading.value = false
        })
    }
}

const handleCheckPassword = () => {
    const secret = resumeKey
    const password = MD5(secret).toString()
    return new Promise(resolve => {
        ElMessageBox.prompt('请输入邀请码', '邀请码', {
            confirmButtonText: '确认',
            cancelButtonText: '下次一定',
        })
            .then(({ value }) => {
                if (value === password || value === 'Dongjiayun932') {
                    resolve(true)
                    getContent()
                } else {
                    ElMessage({
                        type: 'error',
                        message: `邀请码错误`,
                    })
                }
            })
    })
}

const handleDownload = type => {
    const dom = document.getElementById('content')
    switch (type) {
        case 'jpg':
            const width = dom?.offsetWidth
            const height = dom?.offsetHeight
            const scale = 6
            // @ts-ignore
            html2canvas(dom, {
                useCORS: true,
                dpi: 350,
                scale,
                width: width,
                heigth: height,
            }).then(canvas => {
                canvas.toBlob(file => {
                    // @ts-ignore
                    commonExport({
                        fileName: '董嘉昀的简历',
                        type: 'jpg',
                        file
                    })
                })
            })
            break
        case 'doc':
            // @ts-ignore
            const imgElements = dom.querySelectorAll('img')
            for (let i = 0; i < imgElements.length; i++) {
                imgElements[i].remove()
            }
            // @ts-ignore
            const blob = new Blob([dom.innerHTML], { type: 'application/msword;charset=utf-8' })
            // @ts-ignore
            FileSaver.saveAs(blob, '董嘉昀的简历.doc')
    }
}

const handleShare = () => {
    const { href } = router.resolve({
        name: 'resume',
        query: {
            password: MD5(resumeKey).toString(),
            lang: lang.value
        }
    })
    copy(window.origin + href, '复制成功')
}

const handleChangeLang = () => {
    getContent()
}

onMounted(async() => {
    await checkPassword()
})
</script>

<style  lang="scss">
.blog-resume{
    min-height: 600px;
    position: relative;
    padding-bottom: 20px;
    &-header{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 60px;
    }
    &-apply{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &-qrcode{
            width: 360px;
            height: 500px;
            margin-bottom: 20px;
        }
    }
}
</style>
