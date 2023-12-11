<template>
    <div class="comment-card">
        <div class="comment-card-header">
            <el-avatar :src="avatar || getRandomCover()" />
            <div class="comment-card-header-name">{{ data.author.username }}</div>
            <div class="comment-card-header-date">{{ moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
        <div class="comment-card-body">
            {{ data.content }}
        </div>
        <div class="comment-card-footer">
            <div
                v-if="cid === data.authorId"
                class="comment-card-footer-item"
                @click="handleDelete"
            >
                <el-icon :size="26" color="#FFAA2C"><Delete /></el-icon>
            </div>
            <div v-if="liked" class="comment-card-footer-item" @click="handleUnLike">
                <div>{{ toThousandsNum(likeCount,0) }}</div>
                <el-icon :size="26" color="#FFAA2C"><StarFilled /></el-icon>
            </div>
            <div v-else class="comment-card-footer-item" @click="handleLike">
                <div>{{ toThousandsNum(likeCount,0) }}</div>
                <el-icon :size="26" color="#FFAA2C"><Star /></el-icon>
            </div>
            <div class="comment-card-footer-item" @click="triggleComment">
                <div>{{ toThousandsNum(commentCount || 0,0) }}</div>
                <el-icon :size="26" color="#FFAA2C"><Comment /></el-icon>
                <div style="margin-left: 8px">{{ isCommentShow ? '收起' : '展开' }}</div>
            </div>
        </div>
        <div v-if="isCommentShow" class="comment-card-comments">
            <comment
                :article-id="props.articleId"
                :target-id="data.commentId"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import moment from 'moment'
import { getRandomCover, toThousandsNum } from '@/utils'
import { useUserStore } from '@/stores/user'
import { commentModel } from '@/api'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import comment from './comment.vue'

const props = defineProps<{
    data: Comment,
    articleId: string
}>()

const liked = ref(false)

const userStore = useUserStore()

const likeCount = ref(0)

const commentCount = ref(0)

liked.value = props.data.likeIds?.includes(userStore.cid)
likeCount.value = props.data.likeIds?.length || 0
commentCount.value = props.data.childrenCommentIds?.length || 0

const avatar = computed(() => {
    return props.data.author.avatar.fileUrl
})

const cid = computed(() => {
    return userStore.cid
})

const handleLike = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '请稍后...',
    })
    commentModel.like(props.data.commentId).then(res => {
        if (res.status === 0) {
            liked.value = true
            likeCount.value += 1
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const handleUnLike = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '请稍后...',
    })
    commentModel.unLike(props.data.commentId).then(res => {
        if (res.status === 0) {
            liked.value = false
            likeCount.value -= 1
        } else {
            ElMessage.error(res.message)
        }
    }).finally(() => {
        loading.close()
    })
}

const isCommentShow = ref(false)
const triggleComment = () => {
    isCommentShow.value = !isCommentShow.value
}

const emits = defineEmits(['refresh'])

const handleDelete = () => {
    ElMessageBox.confirm('是否删除该评论?', '删除').then(() => {
        const loading = ElLoading.service({
            lock: true,
            text: '请稍后...',
        })
        commentModel.delete(props.data.commentId).then(res => {
            if (res.status === 0) {
                ElMessage.success('删除成功')
                emits('refresh')
            } else {
                ElMessage.error(res.message)
            }
        }).finally().then(() => {
            loading.close()
        })
    })
}
</script>

<style scoped lang="scss">
.comment-card{
    border: 1px solid #eee;
    padding:20px;
    border-radius: 12px;
    box-shadow:  0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    &-header{
        display: flex;
        align-items: center;
        &-name{
            margin-left: 10px;
            flex:1;
        }
        &-date{
            font-size: 12px;
            color: #999;
        }
    }
    &-body{
        margin-top: 20px;
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
        }
    }
    &-comments{
        margin-top: 20px;
    }
}
</style>
