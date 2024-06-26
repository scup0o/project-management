import { createWebHistory, createRouter } from "vue-router";
import VueJwtDecode from "vue-jwt-decode";
import userService from "../services/user.service";

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
    meta: {
      loginAuth: true,
    },
  },

  {
    path: "/user/logout",
    name: "user.logout",
    meta: {
      loginAuth: false,
    },
  },

  {
    path: "/forgotpassword",
    name: "forgotpassword",
    component: () => import("@/views/ForgotPassword.vue"),
    meta: {
      loginAuth: true,
    },
  },

  {
    path: "/forgotpassword/:username/",
    name: "forgotpasswordid",
    component: () => import("@/views/ForgotPassword.vue"),
    meta: { /*userAuth: true,*/ loginAuth: true },
  },

  {
    path: "/",
    name: "administration",
    component: () => import("@/views/Administration.vue"),
    meta: {
      isAuth: true,
    },
  },

  {
    path: "/user",
    name: "account",
    component: () => import("@/views/Account.vue"),
    meta: {
      isAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.isAuth)) {
    let user = localStorage.getItem("auth");
    if (!user) {
      next("/user/login");
    }
  }

  if (to.matched.some((record) => record.meta.loginAuth)) {
    let user = localStorage.getItem("auth");
    console.log(user);
    if (user) {
      next("/");
    }
  }

  if (to.matched.some((record) => record.meta.employeeAuth)) {
    let user = localStorage.getItem("auth");
    user = VueJwtDecode.decode(user);
    if (!user.role) {
        next("/notfound")
    }
  }

  if (to.matched.some((record) => record.meta.userAuth)) {
    let id = to.params.username;
    let check = await userService.checkLink(id);
    console.log(id);
    if (check === false) {
      next("/notfound")
    }
  }

  if (to.matched.some((record) => record.meta.adminAuth)) {
    let user = localStorage.getItem("auth");
    user = VueJwtDecode.decode(user);
    if (user.role) {
      if (user.role != admin) {
        next("/notfound")
      }
    }
  }
  next();

  if (to.fullPath("/api/img")) {
    this.$router.push("/");
  }
});

export default router;
