import type { ObjectDirective } from 'vue'

const LongPress: ObjectDirective = {
    // 组件mounted时执行指令
    mounted(el, binding, vNode) {
        // 确保提供的表达式是函数
        if (typeof binding.value !== 'function') {
            // // 将警告传递给控制台
            const warn = `[longpress:] provided expression '${binding.value}' is not afunction, but has to be `
            console.log(warn)
        } else {
            console.table({ el, binding, vNode })
            let timer: ReturnType<typeof setTimeout> | null = null // 定义空 定时器
            const start = (e: MouseEvent | TouchEvent) => {
                console.log(e)
                // 下列事件不执行1.不是鼠标左键2.单击事件  (3.没有传入长按时间 ?? 有默认)
                if ((<MouseEvent>e).button !== 0 && e.type === 'click') {
                    return
                }
                if (timer == null) {
                    timer = setTimeout(() => {
                        handler()
                        cancel()
                    }, 1000) // 默认长按2秒执行绑定的函数
                }
            }
            const cancel = () => {
                if (timer !== null) {
                    clearTimeout(timer)
                    console.log(timer)// 定时器默认返回一个随机的number 这个number的值是这个定时器的id
                    timer = null
                }
            }
            const handler = () => {
                binding.value()
            }
            // 添加事件监听器
            el.addEventListener('mousedown', start)
            el.addEventListener('touchstart', start)
            // 取消计时器
            el.addEventListener('click', cancel)
            el.addEventListener('mouseout', cancel)
            el.addEventListener('touchend', cancel)
            el.addEventListener('touchcancel', cancel)
        }
    },
}

export default LongPress
