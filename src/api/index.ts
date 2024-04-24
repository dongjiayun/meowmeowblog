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

export const ArticleModel:ApiModel = {
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

export const commentModel:ApiModel = {
    list(data) {
        return post('/comment/get', data)
    },
    detail(commentId) {
        return get(`/comment/${commentId}`)
    },
    create(data) {
        return post('/comment', data)
    },
    edit(data) {
        return put('/comment', data)
    },
    delete(commentId) {
        return deleteHttp(`/comment/${commentId}`)
    },
    like(commentId) {
        return post(`/comment/like/${commentId}`)
    },
    unLike(commentId) {
        return deleteHttp(`/comment/like/${commentId}`)
    },
    getLikeComments(data) {
        return post('/comment/get/like', data)
    }
}

export const noticeModel:ApiModel = {
    list(data) {
        return post('/notice/get', data)
    },
    amount() {
        return get(`/notice/amount`)
    },
    read(noticeId) {
        return put(`/notice/${noticeId}`)
    },
    readAll() {
        return put(`/notice/readAll`)
    }
}

export const userModel:ApiModel = {
    info(cid) {
        return get(`/user/${cid}`)
    },
    update(data) {
        return put('/user', data)
    },
    myLikeArticles(data) {
        return post('/user/myLikeArticles', data)
    },
    myCollectArticles(data) {
        return post('/user/myCollectArticles', data)
    },
    checkFollow(data) {
        return post('/user/checkFollow', data)
    },
    follow(cid) {
        return post(`/user/follow/${cid}`)
    },
    unFollow(cid) {
        return deleteHttp(`/user/follow/${cid}`)
    },
    getFollows(data) {
        return post('/user/getFollows', data)
    },
    getFollowers(data) {
        return post('/user/getFollowers', data)
    }
}

export const messageModel:ApiModel = {
    list(data) {
        return post('/message', data)
    },
    create(data) {
        return post('/message/create', data)
    },
    delete(messageId) {
        return deleteHttp(`/message/${messageId}`)
    },
    like(messageId) {
        return post(`/message/like/${messageId}`)
    },
    unLike(messageId) {
        return deleteHttp(`/message/like/${messageId}`)
    }
}

export const tagModel:ApiModel = {
    list() {
        return post('/tag/get')
    },
    get(tagId) {
        return get(`/tag/${tagId}`)
    },
    create(data) {
        return post('/tag', data)
    },
    update(data) {
        return put('/tag', data)
    },
    delete(tagId) {
        return deleteHttp(`/tag/${tagId}`)
    }
}
