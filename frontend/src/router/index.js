import { createWebHistory, createRouter } from "vue-router";
import VueJwtDecode from 'vue-jwt-decode';


const routes = [
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },

    {
        path: "/user/login",
        name: "user.login",
        component: () => import("@/views/userLogin.vue"),
        meta:{
            loginAuth: true,
        }
    },

    {
      path: "/user/logout",
      name: "user.logout",
      meta:{
        loginAuth: false,
      } 
    },

    {
        path:"/",
        name: 'administration',
        component: () => import("@/views/Administration.vue"),
        meta:{
            isAuth:true,
        }
    },
    
    {
        path:"/user",
        name:"account",
        component:() =>import("@/views/Account.vue"),
        meta:{
            isAuth:true,
        }
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to,from,next)=>{
    

    if(to.matched.some(record => record.meta.isAuth)){
        let user = localStorage.getItem('auth')
        if(!user){
            next('/user/login')
        }
    }

    if(to.matched.some(record => record.meta.loginAuth)){
        let user = localStorage.getItem('auth')
        console.log(user);
        if(user){
                next('/')
        }
    }

    if(to.matched.some(record => record.meta.employeeAuth)){
        let user = localStorage.getItem('auth')
        user = VueJwtDecode.decode(user)
        if(!user.role){
            this.$router.push({ name: "notfound"})
        }
    }

    if(to.matched.some(record => record.meta.adminAuth)){
        let user = localStorage.getItem('auth')
        user = VueJwtDecode.decode(user)
        if(user.role){
            if(user.role !=admin ){
                this.$router.push({ name: "notfound"})
            }}
    }
    next()

    if(to.fullPath('/api/img')){
        this.$router.push("/")
    }
})

export default router;