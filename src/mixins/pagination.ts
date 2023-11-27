import { ref } from 'vue'
export const pagination = () => {
    const pageNo = ref(1)
    const pageSize = ref(10)
    const totalNum = ref(0)
    const totalPage = ref(0)
    const pageLoading = ref(false)
    const noMore = ref(false)
    const pageLoadError = ref(false)
    const refreshing = ref(false)
    const initPagination = () => {
        pageNo.value = 1
        totalNum.value = 0
        noMore.value = false
        pageLoading.value = false
        pageLoadError.value = false
        totalPage.value = 0
    }
    return {
        pageNo,
        pageSize,
        totalNum,
        pageLoading,
        noMore,
        pageLoadError,
        totalPage,
        refreshing,
        initPagination
    }
}
