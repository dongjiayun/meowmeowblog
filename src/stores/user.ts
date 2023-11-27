import { defineStore, storeToRefs } from 'pinia'
import { Loading } from '@/utils'
import { AuthModel } from '@/api'
import { ElMessage } from 'element-plus'
import { Local } from '@/utils/storage'
import { useAppStore } from '@/stores/app'

export const useUserStore = defineStore('user', {
    state: () => ({
        jwtToken: '',
        refreshToken: '',
        userId: '',
        openId: '',
        phoneNum: '',
        cid: '',
        platNo: '',
        hasShowHomepageAlert: false
    }),
    actions: {
        setUserInfo(data?: HFLUser) {
            if (data) {
                this.jwtToken = data.jwtToken
                this.refreshToken = data.refreshToken
                this.userId = data.haofuliUserId
                this.openId = data.haofuliOpenId
                this.phoneNum = data.phoneNum
                this.cid = data.cid
                this.platNo = data.platNo
            } else {
                const userInfoCache = Local.get('pa_userinfo')
                if (userInfoCache) {
                    this.jwtToken = userInfoCache.jwtToken
                    this.refreshToken = userInfoCache.refreshToken
                    this.userId = userInfoCache.haofuliUserId
                    this.openId = userInfoCache.haofuliOpenId
                    this.phoneNum = userInfoCache.phoneNum
                    this.cid = userInfoCache.cid
                    this.platNo = userInfoCache.platNo
                }
            }
        },
        logout() {
            this.jwtToken = ''
            this.refreshToken = ''
            this.userId = ''
            this.openId = ''
            this.phoneNum = ''
            this.cid = ''
            this.platNo = ''
        },
        login() {
            const appStore = useAppStore()
            const userInfo = Local.get('pa_userinfo')
            if (userInfo) {
                this.setUserInfo(userInfo)
                return Promise.resolve()
            }
            const authCode = appStore.authCode
            const hasAuthCode = authCode && Object.keys(authCode).length > 0
            Loading.show()
            const params = {
                authToken: hasAuthCode ? authCode : '123'
            }
            return AuthModel.haofuli_login(params).then(res => {
                if (res.status === 0) {
                    this.setUserInfo(res.data)
                    Local.set('pa_userinfo', res.data)
                    window.location.reload()
                } else {
                    ElMessage(res.message)
                }
            }).finally(() => {
                Loading.close()
            })
        },
        refresh() {
            if (this.refreshToken) {
                Loading.show()
                return AuthModel.haofuli_refresh().then(res => {
                    if (res.status === 0) {
                        this.jwtToken = res.data
                        let userInfoCache = Local.get('pa_userinfo')
                        if (!userInfoCache) {
                            userInfoCache = {}
                        }
                        userInfoCache.jwtToken = res.data
                        Local.set('pa_userinfo', userInfoCache)
                        window.location.reload()
                    } else {
                        this.logout()
                        ElMessage({ message: '登陆超时,请从好福利app内重新打开页面' })
                        // this.login()
                    }
                }).finally(() => {
                    Loading.close()
                })
            }
        }
    }
})
