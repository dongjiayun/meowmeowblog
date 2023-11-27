import { useRoute } from 'vue-router'

export const checkCurrentRouteIsTabbar = () => {
    const route = useRoute()
    return !!route?.meta.isTabbar
}
