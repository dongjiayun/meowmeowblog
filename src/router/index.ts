import { createRouter, createWebHistory } from 'vue-router'

const base = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index.vue')
    }
]

const blog = [
    {
        path: '/blog',
        name: 'blog',
        component: () => import('@/views/blog/index.vue'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/blog-h5',
        name: 'blog-h5',
        component: () => import('@/views/blog/blogH5.vue')
    },
    {
        path: '/blog/detail/:id',
        name: 'blog-detail',
        component: () => import('@/views/blog/detail.vue')
    },
    {
        path: '/blog/create',
        name: 'createBlog',
        component: () => import('@/views/blog/createAndEdit.vue')
    },
    {
        path: '/blog/update/:id',
        name: 'updateBlog',
        component: () => import('@/views/blog/createAndEdit.vue')
    }
]

const resume = [
    {
        path: '/resume',
        name: 'resume',
        component: () => import('@/views/resume/index.vue')
    }
]

const routes: Array<any> = [
    ...base,
    ...blog,
    ...resume,
]

const router = createRouter({
    // @ts-ignore
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(savedPosition)
                }, 500)
            })
        } else {
            return { left: 0, top: 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
        next({ name: '404' })
    } else {
        next()
    }
})

router.beforeResolve(to => {
    if (to.meta.title) {
        // @ts-ignore
        document.title = to.meta.title
    }
})

export default router
