declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<object, object, any>
    export default component
}

declare module '@/components/Global' {
    const global:any
    export default global
}
