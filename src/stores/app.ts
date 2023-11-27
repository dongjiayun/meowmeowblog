import { defineStore } from 'pinia'
import { Local } from '@/utils/storage'

export const useAppStore = defineStore('app', {
    state: () => ({
        bizId: '',
        authCode: '',
        showLoading: false,
        isWx: false,
    }),
    actions: {
        setBizId(bizId: string) {
            if (bizId) {
                this.bizId = bizId
                Local.set('pa_biz_id', bizId)
            } else {
                this.getBizId()
            }
        },
        getBizId() {
            const bizId = Local.get('pa_biz_id')
            this.bizId = bizId
        },
        setAuthCode(authCode: string) {
            if (authCode) {
                this.authCode = authCode
                Local.set('pa_auth_code', authCode)
            } else {
                this.getAuthCode()
            }
        },
        getAuthCode() {
            const authCode = Local.get('pa_auth_code')
            this.authCode = authCode
        }
    }
})
