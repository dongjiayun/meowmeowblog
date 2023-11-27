import { objectTreeShake } from '@/utils'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import type { ResponseData, ResponseType } from '@/types/base'
import {useUserStore} from '@/stores/user'

// @ts-ignore
const env = import.meta.env

export const instance = axios.create({
    baseURL: env.VITE_USER_NODE_ENV === 'development' ? '/api' : env.VITE_APP_API_ROOT,
    timeout: 120000,
    // 设置默认请求头
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
})

const errMsg = (message:string) => {
    console.log(message)
    ElMessage(message)
}

const refreshToken = () => {
    const store = useUserStore()
    store.refresh()
}

instance.interceptors.request.use(
    config => {
        const store = useUserStore()
        const query = config.method === 'GET' ? objectTreeShake(config.params) : objectTreeShake(config.data)
        if (config.method === 'GET') {
            config.params = query
        } else {
            config.data = query
        }
        config.headers['refresh-token'] = store.refreshToken
        config.headers['Authorization'] = store.jwtToken
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// http response 拦截器
const responseInterceptorsResolve = (response:any) => {
    if (response.config.customErr) {
        return response.data
    }
    if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
        const data = response.data
        if (
            response.headers['content-type'] && (
                response.headers['content-type'].indexOf('octet-stream') > -1 ||
                response.headers['content-type'].indexOf('msexcel') > -1 ||
                response.headers['content-type'].indexOf('ms-excel') > -1 ||
                response.headers['content-type'].indexOf('x-zip-compressed') > -1
            )
        ) {
            return {
                fileName: response.headers['content-disposition'].split('filename=')[1],
                content: data
            }
        } else {
            return data
        }
    } else {
        if (response && (response.status === 401 || response.status === 403)) {
            return refreshToken()
        }
        // 定义 500 报错信息显示
        if (response && response.status === 500) {
            errMsg(response.data.message)
            return
        }

        if (response && response.status === -501000) {
            return
        }

        errMsg(response.data.message)
        const error:any = new Error(response.data.message)
        error.data = response.data
        error.response = response

        return Promise.reject(response.data || 'error')
    }
}

const responseInterceptorsReject = (error:any) => {
    let errorUrl = ''
    if (error.request && error.request.responseURL) {
        const errorUrlArr = error.request.responseURL.split(location.host)
        if (errorUrlArr.length > 0) {
            errorUrl = errorUrlArr[errorUrlArr.length - 1]
        }
    }
    if (error.config?.hideNotFound && error.response.status === 404) {
        console.log('请求错误,未找到该资源')
        return Promise.resolve()
    }
    if (error && error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
            if (error.config.logoutDisabled) {
                return console.log('登陆超时,请重新登陆')
            }
            return refreshToken()
        }
        let errs = ''
        switch (error.response.status) {
            case 400:
                errs = '错误请求'
                break
            // case 401:
            //     errs = '未授权，请重新登录'
            //     break
            // case 403:
            //     errs = '您没有该功能访问权限,请联系系统管理员'
            //     break
            case 404:
                errs = '请求错误,未找到该资源'
                break
            case 405:
                errs = '请求方法未允许'
                break
            case 408:
                errs = '请求超时'
                break
            case 409:
                errs = '服务器在完成请求时发生冲突'
                break
            case 410:
                errs = '请求的资源已被永久删除'
                break
            case 411:
                errs = '需要有效长度'
                break
            case 413:
                errs = '请求实体过大'
                break
            case 414:
                errs = '请求的 URI 过长'
                break
            case 415:
                errs = '不支持的媒体类型'
                break
            case 500:
                errs = error.response.data && error.response.data.message ? error.response.data.message : '服务器端出错'
                break
            case 501:
                errs = '网络未实现'
                break
            case 502:
                errs = '网络错误'
                break
            case 503:
                errs = '服务不可用'
                break
            case 504:
                errs = '网络超时'
                break
            case 505:
                errs = 'http版本不支持该请求'
                break
            default:
                errs = `连接错误${error.response.status}`
        }
        errMsg(errorUrl + '：' + errs)
        error.message = errorUrl + '：' + errs
    }
    // else {
    //     errMsg('连接到服务器失败')
    //     error.message = '连接到服务器失败'
    // }
    return Promise.reject(error)
}
instance.interceptors.response.use(
    responseInterceptorsResolve,
    responseInterceptorsReject
)

export function get(url:string, params = {}, responseType?:ResponseType, props?:object):Promise<ResponseData> {
    return (instance as any)({
        url,
        params: {
            ...params,
            randomTime: new Date().getTime() // 防止缓存
        },
        responseType,
        ...props
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url:string, data = {}, responseType?:ResponseType, props?:object):Promise<ResponseData> {
    return (instance as any)({
        method: 'post',
        url,
        data,
        responseType,
        ...props,
    })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deleteHttp(url:string, data = {}) :Promise<ResponseData> {
    return instance({
        method: 'delete',
        url,
        data
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url:string, data = {}) :Promise<ResponseData> {
    return instance({
        method: 'patch',
        url,
        data
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url:string, data = {}) :Promise<ResponseData> {
    return instance({
        method: 'put',
        url,
        data
    })
}
