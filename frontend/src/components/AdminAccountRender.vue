<script>
import AccountForm from "./AccountForm.vue";
import UserService from "../services/user.service";
import VueJwtDecode from "vue-jwt-decode";

export default {
  components: {
    AccountForm,
  },

  props: {
    accounts: { type: Array, required: true },
  },

  data() {
    return {
      editAccount: null,
      edit: false,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
    };
  },

  mounted() {},

  methods: {
    async deleteAccount(data) {
      if (confirm("Bạn có chắc muốn xóa tài khoản?")) {
        let check;
        console.log(data);
        check = await UserService.delete(data.id);
        if (check === true) {
          this.$toast.open({
            message: "Xóa tài khoản thành công",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          if (this.user.id === data.id) {
            UserService.logout();
            localStorage.removeItem("auth");

            location.reload();
          } else this.$emit("refresh");
        }
      }
    },
    async lock(data) {
      let temp = {};
      let s = "mở khóa";
      if (data.khoa != 1) {
        temp.w = "lock";
        s = "khóa";
      } else temp.w = "unlock";
      if (confirm(`Bạn có chắc muốn ${s} tài khoản ${data.username}?`)) {
        let check;

        temp.id = data.id;
        check = await UserService.lock(temp);
        if (check === true) {
          this.$toast.open({
            message: `${s} tài khoản thành công`,
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          if (this.user.id === data.id) {
            UserService.logout();
            localStorage.removeItem("auth");

            location.reload();
          } else this.$emit("refresh");
        }
      }
    },
  },
};
</script>
<template>
  <div v-for="account in accounts" :key="account" style="padding-bottom: 10px">
    <div class="box row">
      <div class="col-2 d-flex" style="margin: auto">
        <img
          :src="`../../src/assets/img/${account.anhdaidien}`"
          style="
            width: 50px;
            height: 50px;
            border-radius: 100%;
            display: inline;
          "
        />
        <p style="display: inline; margin-left: -15px; margin: auto">
          {{ account.username }}
        </p>
      </div>
      <div class="col-4 d-flex justify-content-center" style="margin: auto">
        {{ account.hoten }}
      </div>
      <div class="col-3 d-flex justify-content-center" style="margin: auto">
        <div>{{ account.email }}</div>
      </div>
      <div class="col-1 text-center d-flex justify-content-center" style="margin: auto; text-align: center">
        <p style="margin: auto" v-if="account.chucvu === 'admin'">Quản trị</p>
        <p style="margin: auto" v-else>
          Nhân viên 
        </p>
      </div>
      <div class="col-2 text-end" style="margin: auto">
        <button
          class="btn btn-outline-secondary"
          @click="lock(account)"
          style="border: none"
        >
          <i class="fa-solid fa-lock-open" v-if="account.khoa === 1"></i>
          <i class="fa-solid fa-lock" v-else></i>
        </button>

        <button
          class="btn btn-outline-secondary"
          @click="
            editAccount = account;
            edit = true;
          "
          style="border: none"
        >
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button
          class="btn btn-outline-secondary delete-icon"
          style="border: none"
          @click="deleteAccount(account)"
        >
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  </div>
  <AccountForm
    :account="editAccount"
    :e="true"
    v-if="edit === true"
    @close="edit = false"
    @refresh="this.$emit('refresh')"
  ></AccountForm>
</template>
<style scoped>
.box {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  background-color: white;
  border-radius: 10px 10px 10px 10px;
  padding: 10px;
}

.box:hover {
  transform: scale(1.01);
  transition: transform 100ms ease-in-out;
}
</style>
