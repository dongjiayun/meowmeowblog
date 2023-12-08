import { useUserStore } from '@/stores/user'
import Bus from '@/utils/bus'

export const checkLogin = () => {
    return new Promise(resolve => {
        const userStore = useUserStore()
        const token = userStore.token
        if (token) {
            resolve(true)
        } else {
            Bus.emit('login')
        }
    })
}
