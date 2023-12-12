<template>
    <div id="layout" class="meow-layout">
        <div class="meow-layout-header">
            <div class="meow-layout-header-logo" @click="handleHome">
                <el-image class="meow-layout-header-logo-image" :src="getSrc('base/logo.jpg')" />
                <div class="meow-layout-header-logo-label">喵喵喵</div>
            </div>
            <div class="meow-layout-header-routes">
                <div
                    v-for="(item,index) in menus"
                    :key="index"
                    class="meow-layout-header-routes-item"
                    :class="{ active: currentRouteName === item.route }"
                    @click="$router.push({ name: item.route })"
                >{{ item.name }}</div>
            </div>
            <div class="meow-layout-header-notice" @click="handleNotice">
                <el-badge
                    :value="noticeNum"
                    :max="99"
                    class="item"
                >
                    <el-icon color="#FFAA2C" :size="30"><Bell /></el-icon>
                </el-badge>
            </div>
            <div class="meow-layout-header-profile">
                <div v-if="token" class="meow-layout-header-profile-inner" @click="handleLogout">
                    <el-avatar v-if="avatar" style="margin-right: 8px" :src="avatar" />{{ username }}
                </div>
                <div v-else @click="handleLogin">
                    登录
                </div>
            </div>
        </div>
        <div :class="{ 'meow-layout-main': currentRouteName !== 'home' }">
            <slot />
        </div>
        <el-backtop :bottom="60" />
        <div
            v-if="enableBack"
            class="meow-layout-back"
            @click="handleBack"
        >
            <el-icon :size="30" color="#FFAA2C"><ArrowLeft /></el-icon>
            <div>返回</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getSrc, noticeJump } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'
import { checkLogin } from '@/utils/auth'
import { noticeModel } from '@/api'
import { Local } from '@/utils/storage'
import { ElNotification } from 'element-plus'

const userStore = useUserStore()
const token = storeToRefs(userStore).token

const route = useRoute()

const router = useRouter()

const currentRouteName = computed(() => {
    return route.name
})

const enableBack = ref(false)

watch(route, () => {
    enableBack.value = history.state.position > 1 && currentRouteName.value !== 'home'
})

const menus = ref([
    { name: '博客', route: 'blog' },
    { name: '博客mobile', route: 'blog-h5' },
    { name: '我的', route: 'mine' },
    { name: '关于', route: 'about' },
    { name: '简历', route: 'resume' },
])

const handleHome = () => {
    router.push({
        name: 'home'
    })
}

const handleBack = () => {
    router.back()
}

const { username, avatar } = storeToRefs(userStore)

const handleLogin = () => {
    checkLogin()
}

const handleLogout = () => {
    ElMessageBox.confirm('是否退出登录?', '登出').then(() => {
        userStore.logout()
    })
}

const noticeNum = ref(0)

watch(() => userStore.token, () => {
    if (!userStore.token) {
        noticeNum.value = 0
    }
})

const getNoticeNum = () => {
    if (!userStore.token) {
        return
    }
    noticeModel.amount().then(res => {
        noticeNum.value = res.data
    })
    noticeModel.list().then(res => {
        const first = res.data?.list?.[0]
        const readNoticeCache = Local.get('meow-notice') || []
        if (readNoticeCache && !readNoticeCache.includes(first?.noticeId)) {
            ElNotification({
                title: first.title,
                message: first.content,
                onClick: () => {
                    noticeJump(first)
                }
            })
        }
        if (!readNoticeCache.includes(first?.noticeId)) {
            Local.set('meow-notice', [...readNoticeCache, first?.noticeId])
        }
    })
}

const noticeInterval = ref()

const initNoticeInterval = () => {
    noticeInterval.value = setInterval(() => {
        getNoticeNum()
    }, 10000)
}

const handleNotice = () => {
    router.push({
        name: 'notice'
    })
}

onMounted(() => {
    getNoticeNum()
    initNoticeInterval()
})

onBeforeUnmount(() => {
    clearInterval(noticeInterval.value)
})

</script>

<style scoped lang="scss">
.meow-layout{
    &-header{
        height: 60px;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        padding:8px;
        display: flex;
        position: sticky;
        top:0;
        z-index: 100;
        background: #FFFFFF;
        &-logo{
            display: flex;
            align-items: center;
            cursor: pointer;
            &-image{
                width: 44px;
                height: 44px;
                border-radius: 44px;
            }
            &-label{
                font-size: 28px;
                font-weight: bold;
                margin-left: 8px;
                color: #FFAA2C;
            }
        }
        &-routes{
            flex:1;
            display: flex;
            align-items: center;
            justify-content: center;
            &-item{
                font-size: 22px;
                transition: all 0.1s;
                cursor: pointer;
                margin: 0 20px;
                &.active{
                    color: #FFAA2C;
                    font-size: 26px;
                }
            }
        }
        &-profile{
            font-size: 28px;
            font-weight: bold;
            margin-left: 8px;
            color: #FFAA2C;
            cursor: pointer;
            margin-left: 20px;
            &-inner{
                display: flex;
                align-items: center;
            }
        }
        &-notice{
            color: #FFAA2C;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
    }
    &-main{
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        max-width: 1200px;
        margin: 40px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        padding: 20px;
    }
    &-back{
        position: fixed;
        left: 40px;
        top:100px;
        padding: 10px 20px;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFAA2C;
        font-size: 32px;
        cursor: pointer;
        transition: .1s;
        &:hover{
            transform: scale(1.1);
        }
    }
}
</style>
