import { defineStore } from 'pinia'
import type { ConfirmSkus } from '@/types/store'
import { Local } from '@/utils/storage'

export const useMallStore = defineStore('mall', {
    state: () => {
        return {
            confirmSkus: [],
            confirmAddress: {}
        }
    },
    actions: {
        setConfirmSkus(skus: ConfirmSkus) {
            // @ts-ignore
            this.confirmSkus = skus
            Local.set('pa_confirm_skus', skus)
        },
        getConfirmSkus() {
            this.confirmSkus = Local.get('pa_confirm_skus')
        },
        clearConfirmSkus() {
            this.confirmSkus = []
            Local.remove('pa_confirm_skus')
        },
        setConfirmAddress(address: Address) {
            this.confirmAddress = address
            Local.set('pa_confirm_address', address)
        },
        getConfirmAddress() {
            this.confirmAddress = Local.get('pa_confirm_address')
        },
        clearConfirmAddress() {
            this.confirmAddress = {}
            Local.remove('pa_confirm_address')
        },
    }
})
