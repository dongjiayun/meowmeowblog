import { Loading } from '@/utils/index'

export default {
    install(app:any) {
        app.provide('Loading', Loading)
    }
}
