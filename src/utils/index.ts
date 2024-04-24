import { round, floor, random } from 'lodash'
// @ts-ignore
import type { Param, Dicts } from '@/types/base.d.ts'
// @ts-ignore
import { useAppStore } from '@/stores/app'
// @ts-ignore
import { CommonModel } from '@/api'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import router from '@/router'

interface dictProp {
    value:string,
    label:string
}

export function getDictLabelByVal(data:Dicts, val:number|string|undefined, props:dictProp = { value: 'value', label: 'label' }) :string {
    let result = ''
    if (val || val === 0) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if ((item as any)[props.value] === val) {
                    result = (item as any)[props.label]
                }
            })
        }
    }
    return result || ''
}

export function getDictNameByVal(data:Array<object>, val:number|string, props:dictProp = { value: 'value', label: 'name' }):string {
    let result = ''
    if (val || val === 0) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if ((item as any)[props.value] === val) {
                    result = (item as any)[props.label]
                }
            })
        }
    }
    return result
}

export const isNullOrEmpty = function(val:any):boolean {
    return val === null || val === undefined || val === ''
}

export const objectTreeShake = (obj:Param = []):object => {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => !isNullOrEmpty(value)))
}

export const arrayTreeShake = (arr:Array<Param> = []):Array<object> => {
    return arr.filter((i) => !isNullOrEmpty(i))
}

export const hidePhone = (phone:string|number):string => {
    if (!phone) {
        return ''
    } else {
        const _phone = String(phone)
        const start = _phone.substring(0, 3)
        const end = _phone.substring(7, 11)
        return `${start}****${end}`
    }
}

export const uuid = ():string => {
    return `${new Date().getTime().toString(16)}-${Math.round(Math.random() * 1e12).toString(16)}-${Math.round(Math.random() * 1e12).toString(16)}-${Math.round(Math.random() * 1e12).toString(16)}`
}

export function toThousandsNum(value:number, precision = 2):number|string {
    if (isNaN(value) || value === null || value === undefined) { return '-' }
    return round(Number(value), precision).toFixed(precision).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export const toThousandsNumByPenny = (value:number, precision = 2):number|string => {
    if (isNaN(value) || value === null || value === undefined) { return '-' }
    const num = floor(Number(value) / 100, precision).toFixed(precision)
    return String(num).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

export const numberUnitFormat = (num:number, precision = 1, isInteger = true):string|number|void => {
    if (isNullOrEmpty(num)) {
        return '-'
    }
    if (num < 10000) {
        return isInteger ? toThousandsNum(round(num, 0), 0) : toThousandsNum(round(num, precision), precision)
    } else if (num >= 10000 && num < 100000000) {
        return `${toThousandsNum(round((num / 10000), precision), precision)}w`
    } else if (num >= 100000000) {
        return `${toThousandsNum(round((num / 100000000), precision), precision)}亿`
    }
}

export const getDecimals = (num:number|string):string => {
    const numstr = String(num)
    return numstr.length > 1 ? numstr.substring(numstr.length - 2, numstr.length) : numstr.length === 1 ? '0' + numstr.substring(numstr.length - 2, numstr.length) : '00'
}

export function getHMS(time:number|string):object {
    const _time = parseInt(time as string)
    const hour = _time / 3600 < 10 ? '0' + _time / 3600 : _time / 3600
    const min = _time % 3600 / 60 < 10 ? '0' + _time % 3600 / 60 : _time % 3600 / 60
    const sec = (_time % 3600 % 60) < 10 ? '0' + _time % 3600 % 60 : _time % 3600 % 60
    return { hour, min, sec }
}

export function getDHMS(time:number|string):object {
    const _time = parseInt(time as string)
    const day = _time / 3600 / 24
    const hour = _time / 3600 % 24 < 10 ? '0' + _time / 3600 % 24 : _time / 3600 % 24
    const min = _time % 3600 / 60 < 10 ? '0' + _time % 3600 / 60 : _time % 3600 / 60
    const sec = _time % 3600 % 60 < 10 ? '0' + _time % 3600 % 60 : _time % 3600 % 60
    return { day, hour, min, sec }
}

export const priceToFix = (price:number):number => {
    if (price % 100 === 0) {
        return round(price / 100)
    } else if (price % 10 === 0) {
        return round(price / 100, 1)
    } else {
        return round(price / 100, 2)
    }
}

export const query2Json = (queryStr:string):object => {
    const _queryStr = queryStr.replace('?', '')
    const query = _queryStr.split('&')
    const result: { [key: string]: string } = {}
    query.forEach(i => {
        const [key, value] = i.split('=')
        result[key] = value
    })
    return result
}

let loadingTimeout:any
export class Loading {
    static close() {
        const store = useAppStore()
        store.$patch({ showLoading: false })
        clearTimeout(loadingTimeout)
    }

    static show() {
        const store = useAppStore()
        loadingTimeout = setTimeout(() => {
            store.$patch({ showLoading: true })
        }, 200)
    }
}

export const getSrc = (src:string):string => {
    // @ts-ignore
    return new URL(`../assets/${src}`, import.meta.url).href
}

const areaList:any = {
    province_list: {},
    city_list: {},
    county_list: {}
}

export const toDurationSimple = (seconds:number) => {
    seconds = parseInt(seconds.toString())
    let ss = seconds// 秒
    let mm = 0// 分
    let hh = 0// 小时
    if (ss > 60) {
        mm = ss / 60
        ss = ss % 60
    }
    if (mm > 60) {
        hh = mm / 60
        mm = mm % 60
    }
    let result = ('00' + ss).slice(-2)
    if (mm > 0) {
        result = ('00' + mm).slice(-2) + ':' + result
    } else {
        result = '00:' + result
    }
    result = ('00' + hh).slice(-2) + ':' + result
    return result
}

export const copyText = async(val:any) => {
    if (navigator.clipboard && navigator.permissions) {
        await navigator.clipboard.writeText(val)
    } else {
        const textArea = document.createElement('textArea') as any
        textArea.value = val
        textArea.style.width = 0
        textArea.style.position = 'fixed'
        textArea.style.left = '-999px'
        textArea.style.top = '10px'
        textArea.setAttribute('readonly', 'readonly')
        document.body.appendChild(textArea)

        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
    }
}

export const useSdk = (src:string) => {
    return new Promise(resolve => {
        const setScript = document.createElement('script')
        const head = document.head || document.getElementsByTagName('head')[0]
        setScript.src = src
        setScript.type = 'text/javascript'
        head.appendChild(setScript)
        setScript.onload = () => {
            resolve(true)
        }
    })
}

export function loadImage(url:string) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.crossOrigin = 'Anonymous'

        image.onload = function() {
            resolve(image)
        }

        image.onerror = function() {
            reject(new Error('Failed to load image'))
        }

        image.src = url
    })
}

// 将图片转换为Base64
export function convertImageToBase64(image:HTMLImageElement) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    const context = canvas.getContext('2d')
    // @ts-ignore
    context.drawImage(image, 0, 0)

    const base64 = canvas.toDataURL() // 这里指定了图片的格式为JPEG，你也可以根据需要修改
    return base64
}

export function convertImageToBase64Content(image:HTMLImageElement) {
    const base64 = convertImageToBase64(image)
    const parts = base64.split(';base64,')
    return parts[1]
}

// 将Base64转换为Blob对象
export function convertBase64ToBlob(base64:string) {
    const parts = base64.split(';base64,')
    const contentType = parts[0].split(':')[1]
    const raw = window.atob(parts[1])
    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
    }

    return new Blob([uInt8Array], { type: contentType })
}

export const getRandomCover = () => {
    const index = round(random(0, 4))
    return `https://qa-res.ipetapi.com/meowmeowmeow/placeholders/${index}.png`
}

export const commonExport = ({
    fileName,
    uniqueFileName = true,
    type,
    file,
}: {
    fileName: string;
    uniqueFileName?: boolean;
    type: string;
    file: BlobPart;
}) => {
    const blob = new Blob([file])
    const _fileName = `${fileName + (uniqueFileName ? moment().format('YYYY-MM-DD HH:mm:ss') : '')}.${type}`
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = _fileName
    link.click()
    window.URL.revokeObjectURL(link.href)
}

export const copy = (content:string, message = '复制成功', alert = true) => {
    // content为要复制的内容
    // 创建元素用于复制
    const ele = document.createElement('input')
    // 设置元素内容
    ele.setAttribute('value', content)
    // 将元素插入页面进行调用
    document.body.appendChild(ele)
    // 复制内容
    ele.select()
    // 将内容复制到剪贴板
    document.execCommand('copy')
    // 删除创建元素
    document.body.removeChild(ele)
    if (alert) {
        ElMessage({
            message,
            type: 'success'
        })
    }
}

export const noticeJump = (data:Notice) => {
    switch (data.noticeType) {
        case 'collectArticle':
        case 'likeArticle':
            router.push({
                name: 'blog-detail',
                params: {
                    id: data.noticeCode
                }
            })
            break
        case 'follow':
            router.push({
                name: 'user',
                query: {
                    cid: data.noticeCode
                }
            })
            break
        case 'article':
            router.push({
                name: 'blog-detail',
                params: {
                    id: data.noticeCode
                }
            })
            break
        case 'comment':
            router.push({
                name: 'blog-detail',
                params: {
                    id: data.noticeCode.split('|')?.[1],
                }
            })
            break
        case 'likeComment':
            router.push({
                name: 'blog-detail',
                params: {
                    articleId: data.noticeCode.split('|')?.[1],
                }
            })
    }
}

function getRandomRGBColor(): string {
    const randomColor = () => Math.floor(Math.random() * 256) // 生成 0 到 255 之间的随机整数

    // 生成随机的 R、G、B 分量
    const r = randomColor()
    const g = randomColor()
    const b = randomColor()

    // 将 RGB 分量转换为 CSS 颜色表示法
    const color = `rgb(${r},${g},${b})`

    return color
}

export function getMid80PercentColor(): string {
    const color = getRandomRGBColor()

    // 获取中间 80% 的颜色
    const mid80Percent = Math.floor(255 * 0.1)
    const [r, g, b] = color.match(/\d+/g)?.map(Number) || [0, 0, 0] // 从 RGB 字符串中提取各个分量

    const midR = Math.max(Math.min(Math.round(r * 0.9 + mid80Percent), 255), 0) // 红色分量
    const midG = Math.max(Math.min(Math.round(g * 0.9 + mid80Percent), 255), 0) // 绿色分量
    const midB = Math.max(Math.min(Math.round(b * 0.9 + mid80Percent), 255), 0) // 蓝色分量

    // 将 RGB 分量转换为 CSS 颜色表示法
    const midColor = `rgb(${midR},${midG},${midB})`

    return midColor
}

export type RandomButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
export const getRandomButtonType = (): RandomButtonType => {
    const typeMap:RandomButtonType[] = ['primary', 'success', 'warning', 'danger', 'info']
    const randomIndex = Math.floor(Math.random() * typeMap.length)
    return typeMap[randomIndex]
}
