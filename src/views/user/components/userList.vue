<template>
    <div class="user-list">
        <div
            v-for="(item,index) in list"
            :key="index"
            class="user-list-item"
            @click="handleUser(item)"
        >
            <el-avatar :src="item.avatar.fileUrl || getRandomCover()" />
            <div class="user-list-item-username">{{ item.username }}</div>
            <div class="user-list-item-info">
                <div class="user-list-item-info-item"><span class="user-list-item-info-item-orange">{{ toThousandsNum(item?.followerIds.length || 0,0) }} </span> 关注</div>
                <div class="user-list-item-info-item"><span class="user-list-item-info-item-orange">{{ toThousandsNum(item?.followIds.length || 0,0) }} </span> 粉丝</div>
            </div>
        </div>
        <el-empty v-if="list.length === 0" />
        <div class="user-list-footer">
            <el-button v-if="!noMore" type="primary" @click="handleLoadmore">加载更多~</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { pagination } from '@/mixins/pagination'
import { userModel } from '@/api'
import { ElLoading, ElMessage } from 'element-plus'
import { getRandomCover, toThousandsNum } from '@/utils'
import { useRoute, useRouter } from 'vue-router'

const list = ref<SafeUserDetail[]>([])

const props = defineProps<{
    isFollow?: boolean,
    isFans?: boolean
}>()

const {
    pageNo,
    pageSize,
    initPagination,
    noMore
} = pagination()

const init = () => {
    initPagination()
    list.value = []
    noMore.value = false
    getData()
}

const getData = () => {
    const params = {
        pageNo: pageNo.value,
        pageSize: pageSize.value,
    }
    const route = useRoute()
    if (route?.params.id) {
        // @ts-ignore
        params.id = route.params.id
    }
    if (props.isFollow) {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        userModel.getFollows(params).then(res => {
            if (res.status === 0) {
                list.value = [...list.value, ...res.data.list]
                if (res.data.list.length === 0 || res.data.list.length < pageSize.value) {
                    noMore.value = true
                }
            } else {
                ElMessage({
                    type: 'error',
                    message: res.message
                })
            }
        }).finally(() => {
            loading.close()
        })
    } else if (props.isFans) {
        const loading = ElLoading.service({
            lock: true,
            text: '加载中~',
        })
        userModel.getFollowers(params).then(res => {
            if (res.status === 0) {
                list.value = [...list.value, ...res.data.list]
                if (res.data.list.length === 0 || res.data.list.length < pageSize.value) {
                    noMore.value = true
                }
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
}

const handleLoadmore = () => {
    if (noMore.value) {
        return
    }
    pageNo.value++
    getData()
}

const router = useRouter()
const handleUser = item => {
    router.push({
        name: 'user',
        params: {
            id: item.cid
        }
    })
}

onMounted(() => {
    init()
})
</script>

<style scoped lang="scss">
.user-list{
    &-item+&-item{
        margin-top: 20px;
    }
    &-item{
        padding: 20px;
        display: flex;
        align-items: center;
        border: 1px solid #eee;
        border-radius: 12px;
        box-shadow:  0 0 10px #eee;
        cursor: pointer;
        &-username{
            margin-left: 12px;
            flex:1;
        }
        &-info{
            display: flex;
            align-items: center;
            &-item{
                display: flex;
                align-items: center;
                margin-left: 20px;
                &-orange{
                    color: #FFAA2C;
                    margin-right: 8px;
                }
            }
        }
    }
    &-footer{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>
