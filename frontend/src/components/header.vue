<script>
import "@/assets/css/base.css";
import "@/assets/css/header.css";
import userService from "@/services/user.service.js";
import VueJwtDecode from "vue-jwt-decode";

export default {
  props: {
    title: { type: String, required: true },
  },

  components: {},

  data() {
    return {
      genres: [],
      artists: [],
      searchText: "",
      numEs: [1, 2, 3, 4, 5, 6],
      mem: 0,
      checkUser: localStorage.getItem("auth"),
      data: null,
    };
  },

  watch: {},

  computed: {},

  mounted() {
    /*if (localStorage.tempcart){
            this.cartNumber = JSON.parse((localStorage.tempcart)).totalQuantity;
        }*/

    try {
      if (this.checkUser)
        this.checkUser = VueJwtDecode.decode(localStorage.getItem("auth"));
      console.log(this.title);
      //console.log(checkUser);
    } catch (error) {
      console.log(error);
    }
  },

  methods: {
    logout() {
      userService.logout();
      localStorage.removeItem("auth");

      location.reload();
    },
  },
};
</script>

<template>
  <nav
    class="navbar navbar-expand bg-light"
    :class="{ notlogin: !checkUser }"
    style=""
  >
    <div class="container-fluid" style="height:5vh">
      <div class="container">
        <div class="row" style="padding: 5px">
          <div class="col-5 d-flex justify-content-start" style="margin: auto">
            <div style="color: black; font-family: Lobster; font-size: 25px">
              <div>{{ title }}</div>
            </div>
          </div>

          <div
            class="col-3 d-flex justify-content-center bg-light"
            style="margin: auto; color: white"
          ></div>

          <!--icon-->
          <div
            class="col-4 text-end d-flex justify-content-end"
            style="margin: auto"
          >
            <!--chua dang nhap-->
            <div
              v-if="!checkUser"
              class="center-1"
              id="header-button header-icon"
            >
              <button v-if="this.$router.currentRoute._rawValue.fullPath!='/user/login'"
                type="button"
                class="btn btn-outline-light login-button"
                @click="this.$router.push({ name: 'user.login' })"
                style="margin-left: 10px"
              >
                Đăng nhập
              </button>
            </div>

            <!--da dang nhap-->
            <div v-else>
              <div id="header-icon" style="display: inline">
                <!--<i
                  class="fa-solid fa-gears"
                  title="Quản lý"
                  @click="this.$router.push({ name: 'administration' })"
                ></i>
                <i class="fa-solid fa-bell" title="Thông báo" click=""></i>-->
                <!--<i
                  class="fa-solid fa-user"
                  title="Tài khoản"
                  @click="
                    
                  "
                ></i>-->
              </div>
              <button type="button" class="btn signout-button" @click="logout">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
