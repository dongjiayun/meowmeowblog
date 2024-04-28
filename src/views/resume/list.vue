<template>
    <div v-if="isAdmin" class="blog-resume-list">
        <div>
            <el-button
                type="primary"
                @click="handleCreate"
            >新增</el-button>
        </div>
        <el-container>
            <el-main>
                <el-table :data="resumes">
                    <el-table-column width="400px" label="id" prop="resumeId" />
                    <el-table-column label="版本" prop="version" />
                    <el-table-column label="语言" prop="language">
                        <template #default="{ row }">
                            {{ languageMap.find(item => row?.language === item.value).label }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-slot="{ row }"
                        label="创建时间"
                        prop="createAt"
                        width="200px"
                    >
                        {{ moment(row.createAt).format('YYYY-MM-DD HH:mm:ss') }}
                    </el-table-column>
                    <el-table-column
                        v-slot="{ row }"
                        label="更新时间"
                        prop="updateAt"
                        width="200px"
                    >
                        {{ moment(row.updateAt).format('YYYY-MM-DD HH:mm:ss') }}
                    </el-table-column>
                    <el-table-column align="right" label="操作">
                        <template #default="{ row }">
                            <el-button link type="primary" @click="handleUpdate(row)">修改</el-button>
                            <el-button link type="primary" @click="handleDelete(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="blog-resume-list-pagination">
                    <el-pagination
                        v-model:current-page="pageNo"
                        :page-size="pageSize"
                        :total="totalPage"
                        background
                    />
                </div>
            </el-main>
        </el-container>
        <el-dialog
            v-model="showCreate"
            append-to-body
            title="新增简历"
            draggable
            destroy-on-close
        >
            <el-form
                ref="createRef"
                :model="createForm"
                :rules="rules"
                label-width="80px"
                @submit.prevent
            >
                <el-form-item prop="language" label="语言">
                    <el-select v-model="createForm.language">
                        <el-option v-for="item in languageMap" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="content" label="内容">
                    <el-input
                        v-model="createForm.content"
                        type="textarea"
                        autosize
                        show-word-limit
                        maxlength="10000"
                        placeholder="请输入内容"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button
                    type="primary"
                    @click="handleCreateSubmit"
                >提交</el-button>
            </template>
        </el-dialog>
        <el-dialog
            v-model="showUpdate"
            append-to-body
            title="编辑简历"
            draggable
            destroy-on-close
        >
            <el-form
                ref="updateRef"
                :model="updateForm"
                :rules="rules"
                label-width="80px"
                @submit.prevent
            >
                <el-form-item prop="language" label="语言">
                    <el-select v-model="updateForm.language">
                        <el-option v-for="item in languageMap" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="content" label="内容">
                    <el-input
                        v-model="updateForm.content"
                        type="textarea"
                        autosize
                        show-word-limit
                        maxlength="10000"
                        placeholder="请输入内容"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button
                    type="primary"
                    @click="handleUpdateSubmit"
                >提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { onBeforeMount, ref } from 'vue'
import { pagination } from '@/mixins/pagination'
import { resumeModel } from '@/api'
import { checkLogin } from '@/utils/auth'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'

const {
    pageNo,
    pageSize,
    totalPage,
    initPagination
} = pagination()

const languageMap = [
    {
        label: '中文',
        value: 'zh'
    },
    {
        label: '英文',
        value: 'en'
    }
]

const createForm = ref({
    content: '',
    language: '',
})
const updateForm = ref({
    resumeId: '',
    content: '',
    language: '',
})

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const resumes = ref<Resumes>([])

const init = () => {
    initPagination()
    getData()
}

const rules = ref({
    content: {
        required: true,
        message: '请输入内容',
        trigger: 'blur',
    },
    language: {
        required: true,
        message: '请选择语言',
        trigger: 'blur',
    }
})

const showCreate = ref(false)

const showUpdate = ref(false)

const loading = ref(false)

const createRef = ref()

const updateRef = ref()

const getData = () => {
    const params = {
        pageSize: pageSize.value,
        pageNo: pageNo.value
    }
    loading.value = true
    resumeModel.list(params).then(res => {
        if (res.status === 0) {
            resumes.value = res.data.list
            totalPage.value = res.data.totalCount
        }
    }).finally(() => {
        loading.value = false
    })
}

const handleCreate = () => {
    createForm.value = {
        content: '',
        language: '',
    }
    showCreate.value = true
}

const handleUpdate = (resume: Resume) => {
    updateForm.value = resume
    console.log(updateForm.value)
    showUpdate.value = true
}

const handleDelete = (resume: Resume) => {
    ElMessageBox.confirm(
        '此操作将永久删除该简历, 是否继续?',
    ).then(() => {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading...',
        })
        resumeModel.delete(resume.resumeId).then(res => {
            if (res.status === 0) {
                ElMessage.success('删除成功')
                getData()
            }
        }).finally(() => {
            loading.close()
        })
    })
}

const handleCreateSubmit = async() => {
    await createRef.value.validate()
    const { content, language } = createForm.value
    const params = {
        content,
        language
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
    })
    resumeModel.create(params).then(res => {
        if (res.status === 0) {
            ElMessage.success('创建成功')
            showCreate.value = false
            getData()
        }
    }).finally(() => {
        loading.close()
    })
}

const handleUpdateSubmit = async() => {
    await updateRef.value.validate()
    const { content, language, resumeId } = updateForm.value
    const params = {
        resumeId,
        content,
        language
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
    })
    resumeModel.update(params).then(res => {
        if (res.status === 0) {
            ElMessage.success('更新成功')
            showUpdate.value = false
            getData()
        }
    }).finally(() => {
        loading.close()
    })
}

onBeforeMount(() => {
    checkLogin()
    if (!isAdmin.value) {
        ElMessage.error('您没有权限访问该页面~')
    }
    init()
})

</script>

<style scoped lang="scss">
.blog-resume-list{
    min-height: 60vh;
    &-pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>
