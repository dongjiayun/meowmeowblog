<template>
    <div class="meow-message">
        <el-alert :closable="false">没有登陆也可以留言哦~</el-alert>
        <div class="meow-message-body">
            <div
                v-for="(item, index) in list"
                :key="index"
                class="meow-message-body-item"
            >
                <div class="meow-message-body-item-header">
                    <el-avatar :src="item.author.avatar.fileUrl || getRandomCover()" />
                    <div class="meow-message-body-item-header-username">{{ item.author.username || '匿名猫猫' }}</div>
                    <div class="meow-message-body-item-header-date">{{ moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
                </div>
                <div class="meow-message-body-item-body">
                    {{ item.content }}
                </div>
                <div class="meow-message-body-item-footer">
                    <div
                        v-if="cid && cid === item.authorId"
                        class="cmeow-message-body-item-footer-item"
                        @click="handleDelete(item)"
                    >
                        <el-icon class="meow-message-body-item-footer-item-icon" :size="26" color="#FFAA2C"><Delete /></el-icon>
                    </div>
                    <div v-if="item?.likeIds?.includes(cid)" class="meow-message-body-item-footer-item" @click="handleUnLike(item)">
                        <div>{{ toThousandsNum(item?.likeIds?.length || 0,0) }}</div>
                        <el-icon class="meow-message-body-item-footer-item-icon" :size="26" color="#FFAA2C"><StarFilled /></el-icon>
                    </div>
                    <div v-else class="meow-message-body-item-footer-item" @click="handleLike(item)">
                        <div>{{ toThousandsNum(item?.likeIds?.length || 0,0) }}</div>
                        <el-icon class="meow-message-body-item-footer-item-icon" :size="26" color="#FFAA2C"><Star /></el-icon>
                    </div>
                </div>
            </div>
            <div v-if="!noMore" class="meow-message-body-more">
                <el-button type="primary" @click="handleGetMore">加载更多</el-button>
            </div>
        </div>
        <div class="meow-message-input">
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
            <div class="meow-message-input-buttons">
                <el-button type="primary" @click="handleSubmit">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { messageModel, noticeModel } from '@/api'
import { pagination } from '@/mixins/pagination'
import { ElLoading, ElMessage } from 'element-plus'
import { getRandomCover, toThousandsNum } from '@/utils'
import moment from 'moment'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const list = ref<Message[]>([])

const {
    pageNo,
    pageSize,
    noMore,
    initPagination
} = pagination()

const init = () => {
    initPagination()
    list.value = []
    getData()
}

const userStore = useUserStore()

const { cid } = storeToRefs(userStore)

onMounted(() => {
    init()
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
    messageModel.list(params).then(res => {
        if (res.status === 0) {
            list.value = [...list.value, ...res.data.list]
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

const handleDelete = ({ messageId }) => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    messageModel.delete(messageId).then(res => {
        if (res.status === 0) {
            ElMessage.success('删除成功')
            init()
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const handleUnLike = ({ messageId }) => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    messageModel.unLike(messageId).then(res => {
        if (res.status === 0) {
            const index = list.value.findIndex(item => item.messageId === messageId)
            list.value[index].likeIds = list.value[index].likeIds.filter(id => id !== cid.value)
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const handleLike = ({ messageId }) => {
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    messageModel.like(messageId).then(res => {
        if (res.status === 0) {
            const index = list.value.findIndex(item => item.messageId === messageId)
            list.value[index].likeIds = [...list.value[index].likeIds, cid.value]
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const handleGetMore = () => {
    if (noMore.value) {
        return
    }
    pageNo.value++
    getData()
}

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

const handleSubmit = async() => {
    await formRef.value.validate()
    const params = {
        content: commentForm.value.content
    }
    const loading = ElLoading.service({
        lock: true,
        text: '加载中~'
    })
    messageModel.create(params).then(res => {
        if (res.status === 0) {
            ElMessage.success('评论成功')
            init()
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

</script>

<style scoped lang="scss">
.meow-message{
    &-body{
        margin-top: 20px;
        &-item+&-item{
            margin-top: 20px;
        }
        &-item{
            padding: 20px;
            border-bottom: 1px solid #eee;
            box-shadow:  0 0 10px #eee;
            border-radius: 20px;
            &-header{
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                &-username{
                    margin-left: 10px;
                    flex:1;
                }
                &-date{
                    font-size: 12px;
                    color: #999;
                }
            }
            &-body{
                margin-bottom: 20px;
            }
            &-footer{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                &-item{
                    display: flex;
                    align-items: center;
                    margin-left: 20px;
                    cursor: pointer;
                    &-icon{
                        margin-left: 4px;
                    }
                }
            }
        }
        &-more{
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }
    }
    &-input{
        margin-top: 20px;
        &-buttons{
            display: flex;
            justify-content: flex-end;
        }
    }
}
</style>
