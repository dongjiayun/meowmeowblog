import { defineStore } from 'pinia'
import { Loading } from '@/utils'
import { AuthModel } from '@/api'
import { ElMessage } from 'element-plus'
import { Local } from '@/utils/storage'
import router from '@/router'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        refreshToken: '',
        phone: '',
        cid: '',
        username: '',
        avatar: '',
        email: ''
    }),
    actions: {
        setUserInfo(data?: User) {
            if (data) {
                this.token = data.token
                this.refreshToken = data.refreshToken
                this.phone = data.phone
                this.cid = data.cid
                this.username = data.username
                this.avatar = data.avatar?.fileUrl
                this.email = data.email
                Local.set('pa_userinfo', data)
            } else {
                const userInfoCache = Local.get('pa_userinfo')
                if (userInfoCache) {
                    this.token = userInfoCache.token
                    this.refreshToken = userInfoCache.refreshToken
                    this.phone = userInfoCache.phone
                    this.cid = userInfoCache.cid
                    this.username = userInfoCache.username
                    this.avatar = userInfoCache.avatar?.fileUrl
                    this.email = userInfoCache.email
                }
            }
        },
        logout() {
            AuthModel.logout().finally(() => {
                this.token = ''
                this.refreshToken = ''
                this.phone = ''
                this.cid = ''
                this.username = ''
                this.avatar = ''
                this.email = ''
                Local.remove('pa_userinfo')
                router.replace({ name: 'home' })
            })
        },
        refresh() {
            if (this.refreshToken) {
                Loading.show()
                return AuthModel.haofuli_refresh().then(res => {
                    if (res.status === 0) {
                        this.token = res.data
                        let userInfoCache = Local.get('pa_userinfo')
                        if (!userInfoCache) {
                            userInfoCache = {}
                        }
                        userInfoCache.token = res.data
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
