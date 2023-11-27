const ls = window.localStorage
const ss = window.sessionStorage
import moment from 'moment'

export const Cookie:object = {
    cookie2Object():object {
        const cookieCache = document.cookie
        const cookiesArray = cookieCache.split(';')
        const cookie : {[key:string]:string} = {}
        cookiesArray.forEach(i => {
            if (i) {
                const [key, value] = i.split('=')
                cookie[key?.trim()] = String(value)
            }
        })
        return cookie
    },
    set(key:string, data:string, expire:any) {
        const cookie = (this as any).cookie2Object()
        cookie[key] = data
        if (expire) {
            if (typeof expire === 'string' || typeof expire === 'number') {
                cookie.expire = moment().add(+expire, 'd')
            } else if (typeof expire === 'object') {
                cookie.expire = moment().add(+expire.time, expire.unit)
            }
        }
        const cookieStr = Object.entries(cookie).map(([k, v]) => {
            return `${k}=${JSON.stringify(v)}`
        }).join(';')
        return cookieStr
    },
    get(key:string) {
        const cookie = (this as any).cookie2Object()
        return cookie[key]
    },
    remove(key:string) {
        const cookie = (this as any).cookie2Object()
        delete cookie[key]
        const cookieStr = Object.entries(cookie).map(([k, v]) => {
            return `${k}=${JSON.stringify(v)}`
        }).join(';')
        return cookieStr
    },
    clear() {
        document.cookie = ''
    }
}

function setExpire(data:any, expire:any) {
    data = { data }
    if (expire) {
        if (typeof expire === 'string' || typeof expire === 'number') {
            data._expireTime = moment().add(+expire, 'd')
        } else if (typeof expire === 'object') {
            data._expireTime = moment().add(+expire.time, expire.unit)
        }
    }
    return data
}
function getData(key:string, res:any, target:any):any {
    if (res.data) {
        const { data, _expireTime } = res
        if (_expireTime) {
            if (moment(_expireTime).isAfter()) {
                return data
            } else {
                target.remove(key)
                return undefined
            }
        } else {
            return data
        }
    } else {
        return res
    }
}

export const Local = {
    // Add type annotations for key, data and expire parameters
    set(key: string, data: any, expire?: number|object) {
        const res = setExpire(data, expire)
        ls.setItem(key, JSON.stringify(res))
    },
    // Add type annotation for key parameter and return type
    get(key: string): any {
        const data = JSON.parse(ls.getItem(key) || '{}') // Use || operator to avoid null value
        const res = getData(key, data, ls)
        if (res && typeof res === 'object' && Object.keys(res).length === 0) {
            return undefined
        }
        return res
    },
    // Add type annotation for key parameter
    remove(key: string) {
        ls.removeItem(key)
    },
    clear() {
        ls.clear()
    },
}

export const Session = {
    set(key:string, data:any, expire?:number|object) {
        const res = setExpire(data, expire)
        ss.setItem(key, JSON.stringify(res))
    },
    get(key: string): any {
        const data = JSON.parse(ss.getItem(key) || '{}')
        const res = getData(key, data, ss)
        return res
    },
    remove(key: string) {
        ss.removeItem(key)
    },
    clear() {
        ss.clear()
    }
}
