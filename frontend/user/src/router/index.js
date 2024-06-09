import { createWebHistory, createRouter } from "vue-router";
import vinylShop from "@/views/vinylShop.vue";
import userRegister from "@/views/userRegister.vue";
import VueJwtDecode from 'vue-jwt-decode';


const routes = [
    {
        path: "/",
        name: "vinylShop",
        component: vinylShop,
    },

    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },

    {
        path: "/user/register",
        name: "user.register",
        component: userRegister,
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
        path: "/cart",
        name: 'userCart',
        component: () => import("@/views/Cart.vue"),
        meta:{
        }
    },

    {
        path: "/products",
        name: 'products',
        component: () => import("@/components/ProductRender.vue"),
    },

    {
        path: "/product/detail",
        name: 'productDetail',
        component: () => import("@/views/ProductCard.vue")
    },
    
    {
        path:"/user",
        name:"account",
        component:() =>import("@/views/Account.vue"),
        meta:{
            isAuth:true,
        }
    },

    {
        path:"/favorite",
        name:"favorite",
        component:() =>import("@/views/Favorite.vue"),
        meta:{
            isAuth:true,
        }
    },

    {
        path:"/forgotpassword",
        name:"forgotpassword",
        component:() =>import("@/views/ForgotPassword.vue"),
        meta:{
            loginAuth: true,
        }
    },

    {
        path:"/forgotpassword/:id",
        name:"forgotpasswordid",
        component:() =>import("@/views/ForgotPassword.vue"),
        meta:{
            loginAuth: true,
        }
    }
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
            user = VueJwtDecode.decode(user)
            if (!user.role)
                next('/')
            else next('/administration')
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