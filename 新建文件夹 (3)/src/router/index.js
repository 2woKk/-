import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'home',   
        component: () => import('../components/index.vue')
    },
    {
        path:'/login',
        name:'Login',
        component: () => import('../components/login.vue')
    },
    {
        path:'/creating',
        name:'Creating',
        component: () => import('../components/creating.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})


//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to,from,next)=>{
    if(to.path === '/login')
    return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr)
    return next('/login');
    next();
    })

export default router