<template>
    <div
        id="layout"
        class="meow-layout"
        :class="{ isPixelTheme: theme === 'pixel' }"
        :style="isPixel ? `background: url(${bg})` : ''"
    >
        <div class="meow-layout-header">
            <div class="meow-layout-header-logo" @click="handleHome">
                <el-image class="meow-layout-header-logo-image" :src="logo" />
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
            <div class="meow-layout-header-version">
                <el-switch
                    v-model="theme"
                    inline-prompt
                    active-text="pixelart"
                    inactive-text="猫猫风格"
                    style="--el-switch-on-color: #FFAA2C; --el-switch-off-color: #FFAA2C"
                    active-value="pixel"
                    inactive-value="cat"
                    @change="handleTheme"
                />
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
            :class="{ 'pixel-button': isPixel ,'blog-button': !isPixel }"
            @click="handleBack"
        >
            <el-icon v-if="!isPixel" :size="30" color="#FFAA2C"><ArrowLeft /></el-icon>
            <div>{{ isPixel ? 'Back' : '返回' }}</div>
        </div>
        <view class="meow-layout-bottom">
            <view class="meow-layout-bottom-item">喵喵喵</view>
            <view class="meow-layout-bottom-item">沪ICP备2023031020号</view>
            <view class="meow-layout-bottom-item">Copyright © {{ moment().format('YYYY') }}</view>
        </view>
        <view
            v-if="showCursor"
            class="meow-layout-cursor"
            :style="{
                left: mouseLeft + 'px',
                top: mouseTop + 'px',
            }"
        >
            <el-image
                class="meow-layout-cursor-image"
                :class="{ cursorActived }"
                :src="getSrc('base/pixel_rocket.png')"
            />
        </view>
        <view class="meow-layout-trinket" />
        <view v-if="isPixel" class="meow-layout-tetris">
            <tetris />
        </view>
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
import { useAppStore } from '@/stores/app'
import moment from 'moment'
import tetris from '@/components/trinkets/tetris.vue'

const userStore = useUserStore()
const appStore = useAppStore()

const token = storeToRefs(userStore).token
const theme = storeToRefs(appStore).theme

const route = useRoute()

const router = useRouter()

const currentRouteName = computed(() => {
    return route.name
})

const enableBack = ref(false)

const mouseLeft = ref(0)

const mouseTop = ref(0)

const showCursor = ref(false)

const cursorActived = ref(false)

onMounted(() => {
    appStore.getTheme()
    window.addEventListener('mousemove', e => {
        mouseLeft.value = e.clientX + 4
        mouseTop.value = e.clientY + 4
    })
    document.body.addEventListener('mouseleave', () => {
        showCursor.value = false
    })
    document.body.addEventListener('mouseenter', () => {
        showCursor.value = true
    })
    window.addEventListener('mousedown', () => {
        cursorActived.value = true
    })
    window.addEventListener('mouseup', () => {
        cursorActived.value = false
    })
})

watch(route, () => {
    enableBack.value = history.state.position > 1 && currentRouteName.value !== 'home'
    getRandomBg()
})

const logo = computed(() => {
    const logoMap = {
        'cat': getSrc('base/logo.jpg'),
        'pixel': getSrc('base/pixel_logo.png')
    }
    return logoMap[theme.value]
})

const isPixel = computed(() => {
    return theme.value === 'pixel'
})

const menusCat = [
    { name: '博客', route: 'blog' },
    { name: '博客mobile', route: 'blog-h5' },
    { name: '留言板', route: 'message' },
    { name: '我的', route: 'mine' },
    { name: '关于', route: 'about' },
    { name: '简历', route: 'resume' },
]

const menusPixel = [
    { name: 'Blog', route: 'blog' },
    { name: 'H5 Blog ', route: 'blog-h5' },
    { name: 'Message', route: 'message' },
    { name: 'Mine', route: 'mine' },
    { name: 'About', route: 'about' },
    { name: 'Resumes', route: 'resume' },
]

const menus = computed(() => {
    return theme.value === 'cat' ? menusCat : menusPixel
})

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

const handleTheme = e => {
    appStore.setTheme(e)
}

const bg = ref('')

const getRandomBg = () => {
    const bgMap = [
        getSrc('home/cat.png'),
        getSrc('home/jienigui.png'),
        getSrc('home/kedaya.png'),
        getSrc('home/qiutian.png'),
        getSrc('home/orangutan.png'),
        getSrc('home/dog.png'),
        getSrc('home/pig.png'),
    ]
    bg.value = bgMap[Math.floor(Math.random() * bgMap.length)]
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
    position: relative;
    *{
        cursor:none!important;
    }
    &.isPixelTheme{
        .meow-layout-header-routes-item{
            color: #FFAA2C;
            text-shadow: 2px 2px #000, -2px -2px #000, 0 -2px #000, 0 2px #000, 2px 0 #000, -2px 0 #000;
        }
    }
    &-header{
        height: 60px;
        backdrop-filter: blur(10px);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        padding:8px;
        display: flex;
        position: sticky;
        top:0;
        z-index: 100;
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.5);
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
        &-version{
            margin-right: 20px;
            display: flex;
            align-items: center;
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
        z-index: 10;
    }
    &-back{
        position: fixed;
        left: 40px;
        top:100px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    &-bottom{
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#FFAA2C;
        background: #F5F5F5;
        &-item{
            margin:  0 10px;
        }
    }
    &-cursor{
        position: fixed;
        z-index: 10000;
        &-image{
            width: 30px;
            height: 30px;
            transform: rotate(-90deg) scale(1);
            //animation: cursor .8s infinite;
            transition:all 0.1s;
            &.cursorActived{
                transform: rotate(-90deg) scale(1.1);
            }
        }
        @keyframes cursor {
            0%{
                scale: 1;
            }
            50%{
                scale: 1.1;
            }
            100%{
                scale: 1;
            }
        }
        @keyframes light {
            0%{
                scale: 1;
            }
            50%{
                scale: 1.6;
            }
            100%{
                scale: 1;
            }
        }
        &:after{
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 10px;
            background: #FFEE99;
            right: -2px;
            bottom: 4px;
            box-shadow:0 0 10px #FFEE99;
            animation: light .4s infinite;
        }
    }
    &-trinket{
        position: absolute;
        left: 200px;
        bottom: 200px;
    }
    &-tetris{
        position: absolute;
        bottom: calc(100vh + 60px);
        left: 0px;
    }
}
</style>
