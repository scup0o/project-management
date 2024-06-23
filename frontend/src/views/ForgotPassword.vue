<template>
  <div
    class="container-fluid"
    style="background-color: var(--bg-color); height: 100vh"
  >
    <!--<img src="../assets/img/VinylMePlease_Paul-Miller.jpg" style="position: absolute; z-index:-1; margin:auto; width:100%; margin-top:-30px; margin-left:-30px; height:800px">-->
    <div class="row" style="position: absolute; width: 100%">
      <Header></Header>
    </div>
    <div
      class="row d-flex justify-content-center align-items-center"
      style="height: 100vh"
    >
      <div style="max-width: 650px" v-if="!id">
        <div
          class="col"
          style="background-color: white; border-radius: 10px 10px 10px 10px"
        >
          <div style="padding: 40px; padding-top: 60px; padding-bottom: 60px">
            <p
              style="
                margin: auto;
                text-align: center;
                font-family: 'RalewayBlack';
                font-size: 27px;
              "
            >
              Quên mật khẩu
            </p>
            <Form
              @submit="getPassword"
              :valusernameation-schema="FormSchema"
              style="padding: 30px"
            >
              <div class="form-group">
                <label
                  for="email"
                  style="font-family: 'RalewayBold'; padding: 1vh"
                  >E-mail hoặc Username
                </label>
                <Field
                  name="email"
                  type="text"
                  class="form-control field icon-email"
                  style=""
                  placeholder="Nhập Email hoặc Username"
                  @click="this.emailMes = ''"
                >
                </Field>
                <p class="error-feedback">{{ emailMes }}</p>
              </div>
              <button
                class="btn btn-dark"
                style="
                  border-radius: 25px 25px 25px 25px;
                  padding: 10px;
                  background-color: var(--main-color);
                  width: 100%;
                "
              >
                Gửi Email
              </button>
            </Form>
          </div>
        </div>
      </div>
      <div v-else class="row mx-auto" style="max-width: 650px">
        <div
          class="col"
          style="background-color: white; border-radius: 10px 10px 10px 10px"
        >
          <div style="padding: 50px">
            <p
              style="
                margin: auto;
                text-align: center;
                font-family: 'RalewayBlack';
                font-size: 27px;
              "
            >
              Đổi mật khẩu
            </p>
            <Form
              @submit="changePassword"
              :validation-schema="FormSchema2"
              style="padding: 30px"
            >
              <div class="row">
                <div class="form-group">
                  <label
                    for="newpassword"
                    style="font-family: 'RalewayBold'; padding: 1vh"
                    >Mật khẩu mới:
                  </label>
                  <div
                    class="control"
                    style="display: inline; padding-left: 10px"
                  >
                    <span class="" @click="toggleShownew">
                      <i
                        class="fas"
                        :class="{
                          'fa-eye-slash': !shownewPassword,
                          'fa-eye': shownewPassword,
                        }"
                      ></i>
                    </span>
                  </div>
                  <div>
                    <Field
                      :type="typenew"
                      name="newpassword"
                      class="input form-control field"
                      v-model="newpassword"
                      style=""
                      placeholder="Nhập mật khẩu mới"
                    ></Field>
                  </div>

                  <ErrorMessage
                    name="newpassword"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
              <div class="row" style="padding-top: 10px">
                <div class="form-group">
                  <label
                    for="newpassword"
                    style="font-family: 'RalewayBold'; padding: 1vh"
                    >Xác nhận mật khẩu mới:
                  </label>
                  <div
                    class="control"
                    style="display: inline; padding-left: 10px"
                  >
                    <span class="" @click="toggleShowconfirm">
                      <i
                        class="fas"
                        :class="{
                          'fa-eye-slash': !showconfirmPassword,
                          'fa-eye': showconfirmPassword,
                        }"
                      ></i>
                    </span>
                  </div>
                  <div>
                    <Field
                      :type="typeconfirm"
                      name="confirmpassword"
                      class="input form-control field"
                      v-model="confirmpassword"
                      style=""
                      placeholder="Xác nhận mật khẩu"
                    ></Field>
                  </div>

                  <ErrorMessage
                    name="confirmpassword"
                    style="color: red"
                  ></ErrorMessage>
                  <p style="color: red">{{ confirmMessage }}</p>
                </div>
              </div>
              <button
                class="btn btn-dark"
                style="
                  border-radius: 25px 25px 25px 25px;
                  margin-top: 20px;
                  width: 100%;
                  padding: 1vh;
                  background-color: var(--main-color);
                "
              >
                Đổi mật khẩu
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Header from "@/components/header.vue";

import UserService from "@/services/user.service.js";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    Header,
  },
  watch: {
    email() {
      this.emailMes = "";
    },
  },

  data() {
    const FormSchema = yup.object({});

    const FormSchema2 = yup.object({
      newpassword: yup
        .string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
      confirmpassword: yup
        .string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
    });
    return {
      newpassword: "",
      confirmpassword: "",
      id: this.$route.params.username,
      email: "",
      type: "password",
      showPassword: false,
      userNew: FormSchema,
      FormSchema,
      FormSchema2,
      showPassword: false,
      emailMes: "",
      typenew: "password",
      shownewPassword: false,
      typeconfirm: "password",
      showconfirmPassword: false,
      confirmMessage: "",
      passwordMessage: "",
    };
  },

  mounted() {
    console.log(this.id);
  },

  methods: {
    async getPassword(data) {
      try {
        const check = await UserService.forgotPassword(data);
        console.log(check);
        if (check === false) this.emailMes = "Không tìm thấy tài khoản";
        else {
          if (check === "lock") {
            return alert("Tài khoản đã bị khóa");
          }
          alert("Link đổi mật khẩu đã được gửi vào email");
        }
      } catch (error) {
        console.log(error);
      }
    },

    toggleShow() {
      this.showPassword = !this.showPassword;
      console.log(this.type);
      if (this.showPassword === true) this.type = "text";
      else this.type = "password";
    },

    toggleShownew() {
      this.shownewPassword = !this.shownewPassword;
      console.log(this.type);
      if (this.shownewPassword === true) this.typenew = "text";
      else this.typenew = "password";
    },

    toggleShowconfirm() {
      this.showconfirmPassword = !this.showconfirmPassword;
      console.log(this.type);
      if (this.showconfirmPassword === true) this.typeconfirm = "text";
      else this.typeconfirm = "password";
    },

    async changePassword(data) {
      console.log(data);
      this.confirmMessage = "";
      this.passwordMessage = "";
      data.util = "forgot";
      data.id = this.id;
      let check = await UserService.changePassword(data);
      if (check === "wrong")
        this.confirmMessage =
          "Mật khẩu xác nhận không trùng khớp mật khẩu hiện tại";
      else {
        this.$toast.open({
          message: "Đổi mật khẩu thành công",
          type: "success",
          duration: 3000,
          dismissible: true,
        });
        localStorage.setItem("auth", check);

        location.reload();
      }
    },
  },
};
</script>

<style scoped>
.fg:hover {
  text-decoration: underline;
  cursor: pointer;
}
.box {
  background-color: white;
  padding: 70px;
}

.icon-email {
  padding-left: 6vh;
  background: url("../assets/img/envelope-solid.svg") no-repeat left;
  background-size: 2vh;
  background-position: 2vh;
}
</style>
