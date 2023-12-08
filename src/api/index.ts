import { post, get, put, deleteHttp } from '@/utils/http'

interface ApiModel{
   [key:string]:(params?:any) => Promise<any>
}

export const AuthModel:ApiModel = {
    login(data) {
        return post('/auth/signIn', data)
    },
    refresh() {
        return post('/auth/refreshToken')
    },
    sendEmailOtp(data) {
        return post('/auth/sendEmailOtp', data)
    },
    logout() {
        return post('/auth/signOut')
    },
    resetPassword(data) {
        return post('/auth/resetPassword', data)
    },
    findbackPassword(data) {
        return post('/auth/findbackPassword', data)
    }
}

export const CommonModel = {
    getAreaList() {
        return get('/ka/common/area/all')
    }
}

export const articleModel:ApiModel = {
    list(data) {
        return post('/article/get', data)
    },
    get(articleId) {
        return get(`/article/${articleId}`)
    },
    like(articleId) {
        return post(`/article/like/${articleId}`)
    },
    collect(articleId) {
        return post(`/article/collect/${articleId}`)
    },
    unLike(articleId) {
        return deleteHttp(`/article/like/${articleId}`)
    },
    unCollect(articleId) {
        return deleteHttp(`/article/collect/${articleId}`)
    },
    checkLikeAndCollect(articleId) {
        return get(`/article/checkLikeAndCollect/${articleId}`)
    },
    create(data) {
        return post('/article', data)
    },
    edit(data) {
        return put('/article', data)
    },
    setPrivate(data) {
        return post(`/article/private/${data.articleId}`, data)
    },
    deleteArticle(articleId) {
        return deleteHttp(`/article/${articleId}`)
    }
}
