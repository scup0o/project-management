<script>
import AdminAccountRender from "@/components/AdminAccountRender.vue";

import UserService from "@/services/user.service.js";
import AccountForm from "@/components/AccountForm.vue";

export default {
  components: {
    AdminAccountRender,
    AccountForm,
  },

  watch: {
  },

  data() {
    return {
      onPage: 0,
      pageNumber: 0,
      onPageTemp: 1,
      searchText: "",
      accountlist: [],
      edit: false,
    };
  },

  mounted() {
    this.getAccount();
    console.log(this.accountlist);
  },

  methods: {
    async getAccount() {
      try {
        this.onPage = 0;
        this.pageNumber = 0;
        this.onPageTemp = 1;
        this.searchText = "";
        this.accountlist = await UserService.getAll();
        console.log(this.accountlist);
      } catch (error) {
        console.log(error);
      }
    },
  },

  computed: {
    accountStrings() {
        return this.accountlist.map((account) => {
          const { name, username, manhanvien } = account;
          return [name, username, manhanvien].join("");
        });
      
    },

    filteredAccounts() {
      if (!this.searchText) return this.accountlist;
      else {
        this.onPage = 0;
        this.onPageTemp = 1;
        return this.accountlist.filter((_account, index) =>
          this.accountStrings[index]
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        );
      }
    },

    filteredAccountsCount() {
      return this.filteredAccounts.length;
    },

    sliceAccount() {
      //let pL = this.filteredAccounts;
      let accountListNumber = Math.ceil(this.filteredAccounts.length / 7);
      this.pageNumber = accountListNumber;
      console.log(accountListNumber);
      let count = 0;
      let tempAccounts = [];
      let i;
      for (i = 0; i < accountListNumber; i++) {
        tempAccounts[i] = this.filteredAccounts.slice(count, count + 7);
        count = count + 7;
        console.log(tempAccounts);
      }
      return tempAccounts;
    },
  },
};
</script>
<template>
  <div class="container-fluid">
    <div class="row" style="background-color: var(--third-color); padding: 6px">
      <div class="col">
        <button
          class="btn btn-outline-secondary"
          @click="edit = true"
          data-aos="fade-up"
          style="margin-right: 10px"
        >
          Tạo tài khoản
          <i class="fa-solid fa-square-plus" id="util-icon"></i>
        </button>
      </div>
      <div class="col-4">
        <div class="input-group" style="">
          <input
            type="text"
            class="form-control search-form"
            placeholder="Nhập thông tin cần tìm"
            v-model="searchText"
          />
          <button class="btn btn-outline-secondary search-button" type="button">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="row tt" style="margin: auto">
        <div class="col text-end">
             MSNV
        </div>
        <div class='col d-flex justify-content-center'>
            Username
        </div>
        <div class="col-2 d-flex justify-content-center">
            Họ tên
        </div>
        <div class="col-2 d-flex justify-content-center">
            Email
        </div>
        <div class="col-3 d-flex justify-content-center">
            Chức vụ
        </div>
        <div class="col">
        </div>
    </div>

    <div class="row" style="padding-top: 20px; padding: 10px">
      <div
        v-for="(accounts, index) in sliceAccount"
        :key="index"
        v-if="filteredAccountsCount > 0"
      >
        <AdminAccountRender
          v-if="index === onPage"
          :accounts="accounts"
          :is="accounts"
          @refresh="getAccount()"
        >
        </AdminAccountRender>
      </div>
      <p v-else>Không có tài khoản nào.</p>
    </div>
    <div
      class="row text-center d-flex"
      v-if="filteredAccountsCount > 0"
      style="padding-top: 10px"
    >
      <div>
        <button
          v-if="onPage != 0"
          @click="onPage--, onPageTemp--"
          class="btn btn-info"
          style="
            margin-right: 10px;
            background-color: var(--third-color);
            background-color: black;
          "
          title="Trang trước"
        >
          <i class="fa-solid fa-caret-left"></i>
        </button>
        <div style="display: inline">
          <input
            class="form-control"
            style="width: 50px; display: inline"
            type="number"
            v-model="onPageTemp"
            @keyup.enter="(onPage = onPageTemp - 1), (onPageTemp = onPage + 1)"
          />/ {{ pageNumber }}
        </div>
        <button
          v-if="onPageTemp < pageNumber"
          @click="onPage++, (onPageTemp = onPage + 1)"
          class="btn btn-info"
          style="
            margin-left: 10px;
            background-color: var(--third-color);
            background-color: black;
          "
          title="Trang sau"
        >
          <i class="fa-solid fa-caret-right"></i>
        </button>
      </div>
    </div>
  </div>
  <AccountForm
    :account="{
      userId: null,
      password: null,
      phone: null,
      name: null,
      address: null,
      role: 'employee',
      img: null,
    }"
    :e="false"
    v-if="edit === true"
    @close="edit = false"
    @refresh="getAccount()"
  ></AccountForm>
</template>
<style scoped>
span {
  font-family: "RalewayBold";
  font-size: 25px;
}

#util-icon {
  margin-left: 10px;
}

.tt{
    font-family: RalewayBold;
    color:gray;
    padding-top:1vw;
}
</style>
