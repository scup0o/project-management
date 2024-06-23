<template>
  <div
    class="container-fluid"
    style="background-color: var(--bg-color); height: 100vh"
  >
    <div class="row" style="height: 100vh">
      <div class="row">
        <Header style="width: 100%; position: absolute"></Header>
      </div>
      <div class="row">
        <div class="col-7 d-flex justify-content-center align-items-center" style="">
          <img
            src="../assets/img/vinyl-login.jpg"
            style="
              width: 800px;
              height: 640px;
              border-radius: 10px 10px 10px 10px;
            "
          />
        </div>
        <div class="col-5" style="background-color: white">
          <div style="padding: 4vh; padding-top: 20vh">
            <p
            class="title"
              style="
                font-size: 30px;
              "
            >
              Đăng nhập
            </p>
            <Form
              @submit="loginUser"
              :validation-schema="FormSchema"
              style="padding: 30px"
            >
              <div class="form-group">
                <label for="username" style="font-family: 'RalewayBold'; padding:1vh"
                  >Username</label
                >
                <Field
                  name="username"
                  type="text"
                  class="form-control icon-username field"
                  placeholder="Username"
                  v-model="userNew.username"
                >
                </Field>
                <ErrorMessage
                  name="email"
                  class="error-feedback"
                  as="p"
                ></ErrorMessage>
              </div>
              <div class="form-group" style="padding-top: 10px">
                <label for="matkhau" style="font-family: 'RalewayBold'; padding:1vh"
                  >Mật khẩu</label
                >
                <div
                  class="control"
                  style="display: inline; padding-left: 10px"
                >
                  <span class="" @click="toggleShow">
                    <i
                      class="fas"
                      :class="{
                        'fa-eye-slash': !showPassword,
                        'fa-eye': showPassword,
                      }"
                    ></i>
                  </span>
                </div>
                <Field
                  :type="type"
                  name="matkhau"
                  class="input form-control icon-password field"
                  placeholder="Mật khẩu"
                  v-model="userNew.matkhau"
                  style="display: inline"
                ></Field>
                <ErrorMessage
                  name="matkhau"
                  class="error-feedback"
                ></ErrorMessage>
              </div>
              <p
                class="fg"
                style="text-align: right; padding-top: 10px; font-size: 15px"
                @click="this.$router.push({ name: 'forgotpassword' })"
              >
                Quên mật khẩu?
              </p>
              <button
                class="btn btn-dark"
                style="
                  border-radius: 25px 25px 25px 25px;
                  margin-top: 20px;
                  background-color: var(--main-color);
                  width:100%;
                  padding:1vh;
                "
              >
                Đăng nhập
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
import VueJwtDecode from "vue-jwt-decode";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    Header,
  },

  data() {
    const FormSchema = yup.object({});

    return {
      type: "password",
      showPassword: false,
      userNew: FormSchema,
      FormSchema,
    };
  },

  methods: {
    async loginUser(data) {
      try {
        const user = await UserService.login(data);
        //console.log(JSON.stringify(user));
        console.log(user);
        if (user === "incorrected") alert("Username hoặc mật khẩu sai");
        //if (user === 'not verified') alert("Tài khoản chưa được xác thực email");
        else {
          if (user==='lock'){
            alert("Tài khoản đã bị khóa");
            return;
          }
          localStorage.setItem("auth", user);
          //const auth = localStorage.getItem('auth');
          //console.log(VueJwtDecode.decode(auth).role);
          //console.log(VueJwtDecode.decode(user).username);
          //console.log(this.$cookies.get("jwt"))
          location.reload();
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

.icon-username {
  padding-left: 6vh;
  background: url("../assets/img/user-solid.svg")
    no-repeat left;
  background-size: 2vh;
  background-position: 2vh;
}

.icon-password {
  padding-left: 6vh;
  background: url("../assets/img/key-solid.svg")
    no-repeat left;
  background-size: 2vh;
  background-position: 2vh;
}
</style>
