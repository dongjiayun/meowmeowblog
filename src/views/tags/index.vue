<template>
    <div v-if="isAdmin" class="blog-tags">
        <div>
            <el-button
                type="primary"
                @click="handleCreate"
            >新增</el-button>
        </div>
        <el-container>
            <el-main>
                <el-table :data="tags">
                    <el-table-column label="id" prop="tagId" />
                    <el-table-column label="标签名" prop="label" />
                    <el-table-column align="right" label="操作">
                        <template #default="{ row }">
                            <el-button link type="primary" @click="handleUpdate(row)">修改</el-button>
                            <el-button link type="primary" @click="handleDelete(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="blog-tags-pagination">
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
            v-model="showCreateTag"
            append-to-body
            title="新增标签"
            draggable
            destroy-on-close
            width="300px"
        >
            <el-form
                ref="createRef"
                :model="createForm"
                :rules="rules"
                label-width="80px"
                @submit.prevent
            >
                <el-form-item prop="label" label="标签名">
                    <el-input
                        v-model="createForm.label"
                        placeholder="请输入标签名"
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
            v-model="showUpdateTag"
            append-to-body
            title="编辑标签"
            draggable
            destroy-on-close
            width="300px"
        >
            <el-form
                ref="updateRef"
                :model="updateForm"
                :rules="rules"
                label-width="80px"
                @submit.prevent
            >
                <el-form-item prop="label" label="标签名">
                    <el-input
                        v-model="updateForm.label"
                        placeholder="请输入标签名"
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
import { onBeforeMount, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { checkLogin } from '@/utils/auth'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { tagModel } from '@/api'
import { cloneDeep } from 'lodash'
import { pagination } from '@/mixins/pagination'

const {
    pageNo,
    pageSize,
    totalPage,
    initPagination
} = pagination()

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)
const router = useRouter()

const tags = ref<Tag[]>([])

const showCreateTag = ref(false)
const createRef = ref()
const updateRef = ref()

const createForm = ref({
    label: '',
})
const updateForm = ref({
    tagId: '',
    label: '',
})
const showUpdateTag = ref(false)

const loading = ref(false)

const rules = ref({
    label: {
        required: true,
        message: '请输入标签名',
        trigger: 'blur',
    },
})

const handleCreate = () => {
    createForm.value = {
        label: '',
    }
    showCreateTag.value = true
}

const handleUpdate = (tag: Tag) => {
    updateForm.value = cloneDeep(tag)
    showUpdateTag.value = true
}

const handleCreateSubmit = async() => {
    await createRef.value.validate()
    const { label } = createForm.value
    const params = {
        label
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
    })
    tagModel.create(params).then(res => {
        if (res.status === 0) {
            ElMessage.success('创建成功')
            showCreateTag.value = false
            getData()
        }
    }).finally(() => {
        loading.close()
    })
}

const handleUpdateSubmit = async() => {
    await updateRef.value.validate()
    const { label, tagId } = updateForm.value
    const params = {
        tagId,
        label
    }
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading...',
    })
    tagModel.update(params).then(res => {
        if (res.status === 0) {
            ElMessage.success('更新成功')
            showUpdateTag.value = false
            getData()
        }
    }).finally(() => {
        loading.close()
    })
}

const init = () => {
    initPagination()
    getData()
}

const getData = () => {
    const params = {
        pageSize: pageSize.value,
        pageNo: pageNo.value
    }
    loading.value = true
    tagModel.list(params).then(res => {
        if (res.status === 0) {
            tags.value = res.data.list
            totalPage.value = res.data.totalCount
        }
    }).finally(() => {
        loading.value = false
    })
}

const handleDelete = (tag: Tag) => {
    ElMessageBox.confirm(
        '此操作将永久删除该标签, 是否继续?',
    ).then(() => {
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading...',
        })
        tagModel.delete(tag.tagId).then(res => {
            if (res.status === 0) {
                ElMessage.success('删除成功')
                getData()
            }
        }).finally(() => {
            loading.close()
        })
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
.blog-tags {
    min-height: 60vh;
    &-pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>
