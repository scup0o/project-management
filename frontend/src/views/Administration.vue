<template>
  <div class="container-fluid" style="background-color: var(--bg-color)">
    <div class="row flex-nowrap" id="sidebar">
      <div class="col-2 px-0" style="background-color: var(--main-color)">
        <div
          class="d-flex flex-column align-items-sm-start px-3 pt-2 text-white min-vh-100"
          style=""
        >
          <div
            class="row"
            style="margin-top: 10px; margin-bottom: 10px; width: 250px"
          >
            <!--<div class="row">
                    <div class="col-3">
                        <img :src="`../../src/assets/img/${user.img}`" alt="hugenerd" width="30" height="30" class="rounded-circle"></div>
                       <div class="col-9 text-start"    > 
                        <div class="row"><div class="col-12" style=" margin-top:-5px; font-size:17px">{{ user.name }}</div></div>
                        <div class="row"><div class="col" style=" margin-top:0px; font-size: 14px; font-family: 'RalewayItalic';">{{ user.userId }}</div></div></div></div>
                -->
            <div
              style="
                width: 10px;
                color: white;
                font-family: RalewayBlack, Lobster;
                font-size: 20px;
              "
            >
              <div><!--PROJECT MANAGEMENT--></div>
            </div>
          </div>
          <div
            class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span
              class="fs-5 d-none d-sm-inline"
              style="margin-bottom: 0px; padding-top: 5vh"
              >Menu</span
            >
          </div>
          <ul
            class="nav nav-pills flex-column mb-0 align-items-start align-items-sm-start"
            id="menu"
            style="margin-top: -10px; width: 100%"
          >
            <li id="parent-tab" v-if="user.chucvu != 'admin'">
              <button
                @click="
                  show = true;
                  projectTab = 'all';
                  this.activeTab = 'project';
                  show1 = false;
                  filterTittle='Danh sách dự án'
                "
                :class="{ active1: activeTab === 'project' }"
                class="nav-link px-0"
              >
                <div class="button-des">
                  <i class="fa-regular fa-file-lines"></i>
                  <span class="ms-1 d-none d-sm-inline">Dự án</span>
                </div>
              </button>
              <div
                class="col-auto text-start"
                :class="{ show: show === true, child: show === false }"
                style="padding-left: 2.5vw; padding-top: 1vh"
              >
                <div class="row">
                  <button class="a active2" @click="projectTab = 'all'">
                    <i
                      class="fa-solid fa-chevron-right"
                      style="padding-right: 1vw"
                      v-if="projectTab === 'all'"
                    ></i>
                    <span class="ms-1 d-none d-sm-inline">Chia sẻ</span>
                  </button>
                </div>
                <div class="row">
                  <button class="a active2" @click="projectTab = 'personal'">
                    <i
                      class="fa-solid fa-chevron-right"
                      style="padding-right: 1vw"
                      v-if="projectTab === 'personal'"
                    ></i>

                    <span class="ms-1 d-none d-sm-inline">Cá nhân</span>
                  </button>
                </div>
                <div class="row">
                  <button class="a active2" @click="projectTab = 'archive'">
                    <i
                      class="fa-solid fa-chevron-right"
                      style="padding-right: 1vw"
                      v-if="projectTab === 'archive'"
                    ></i>

                    <span class="ms-1 d-none d-sm-inline">Lưu trữ</span>
                  </button>
                </div>
                <div class="row">
                  <button class="a active2" @click="projectTab = 'discard'">
                    <i
                      class="fa-solid fa-chevron-right"
                      style="padding-right: 1vw"
                      v-if="projectTab === 'discard'"
                    ></i>

                    <span class="ms-1 d-none d-sm-inline">Thùng rác</span>
                  </button>
                </div>
              </div>
            </li>
            <li v-if="user.chucvu === 'admin'">
              <button
                class="nav-link px-0 align-middle"
                @click="
                  this.activeTab = 'docType';
                  show = false;
                  show1 = false;
                  filterTittle='Danh sách loại tài liệu'
                "
                :class="{ active1: activeTab === 'docType' }"
              >
                <div class="button-des">
                  <i class="fa-solid fa-icons"></i>
                  <span class="ms-1 d-none d-sm-inline">Quản lý danh mục</span>
                </div>
              </button>
            </li>

            <li v-if="user.chucvu === 'admin'">
              <button
                :class="{ active1: activeTab === 'user' }"
                class="nav-link px-0 align-middle"
                @click="
                  this.activeTab = 'user';
                  show1 = true;
                  show = false;
                  filterTittle = 'Danh sách tài khoản';
                "
              >
                <div class="button-des">
                  <i class="fa-solid fa-users"></i>
                  <span class="ms-1 d-none d-sm-inline"
                    >Quản lý người dùng</span
                  >
                </div>
              </button>
            </li>
            <hr style="color: white; width: 100%" />
            <li>
              <button
                :class="{ active1: activeTab === 'account' }"
                class="nav-link px-0 align-middle"
                @click="
                  (this.activeTab = 'account'), (show1 = true);
                  show = false;
                  filterTittle = 'Thông tin tài khoản';
                "
              >
                <div class="button-des">
                  <i class="fa-solid fa-gear" style="padding-right: 0.5vw"></i>
                  <span class="ms-1 d-none d-sm-inline">Tài khoản</span>
                </div>
              </button>
            </li>
          </ul>
          <hr />
        </div>
      </div>
      <div class="col">
        <div v-if="activeTab === 'account'">
          <div class="row" style="top: 0px">
            <Account></Account>
          </div>
        </div>
        <div v-else>
          <div class="row" style="">
            <Header :title="filterTittle"></Header>
          </div>
          <div class="row">
            <AdministrationDocType
              v-if="activeTab === 'docType'"
            ></AdministrationDocType>

            <AdministrationAccount
              v-if="activeTab === 'user'"
            ></AdministrationAccount>
          </div>
        </div>
      </div>
    </div>
    <!--<BackToTop></BackToTop>-->
  </div>
</template>
<script>
import AdministrationDocType from "@/components/AdministrationDocType.vue";
import AdministrationAccount from "@/components/AdministrationAccount.vue";
import Header from "@/components/header.vue";
import Account from "@/views/Account.vue";
import BackToTop from "@/components/BackToTop.vue";

import VueJwtDecode from "vue-jwt-decode";

export default {
  components: {
    AdministrationDocType,
    AdministrationAccount,
    Header,
    Account,
    BackToTop,
  },

  data() {
    return {
      show1: false,
      activeTab: "",
      projectTab: "",
      accountTab: "",
      activeChild: "all",
      show: false,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      filterTittle: "",
    };
  },

  mounted() {
    console.log(this.user);
    if (this.user.chucvu!=='admin') {this.activeTab='project'; this.projectTab='all'; this.show=true; this.filterTittle="Danh sách dự án"}
    else {this.activeTab='docType'; this.filterTittle="Danh sách loại tài liệu"}
    //this.getUser();
  },

  methods: {
    /* async getUser(){
                this.user = await UserService.get(this.user.id);
                console.log(this.user)
            }*/
  },

  computed: {
    filterTab() {
      console.log(this.projectTab);
      return this.projectTab;
    },

    filterAccount() {
      return this.accountTab;
    },
  },
};
</script>
<style scoped>
ul#menu li {
  padding-top: 10px;
  width: 100%;
}

button {
  padding: 1.5vh;
  text-align: left;
}

.button-des {
  padding-left: 1vw;
}

div#sidebar button:hover {
  background-color: white;
  color: black;
}

div#sidebar button {
  padding-right: 20px;
  width: 100%;
  color: white;
}

#parent-tab:hover #child-tab {
  visibility: visible;
  display: block;
}

.child {
  visibility: hidden;
  display: none;
}

.active2 {
  background-color: var(--main-color);
  padding-left: 2vh;
}

.active1 {
  background-color: var(--third-color);
}

.show {
  visibility: visible;
  display: block;
}

.a {
  border-radius: 5px 5px 5px 5px;
  border: none;
  padding: 1vh;
}
.b {
  background-color: var(--main-color);
}
</style>
