<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

import UserService from "@/services/user.service.js";
import VueJwtDecode from "vue-jwt-decode";
import FileService from "@/services/file.service";

import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import Header from "@/components/header.vue";

export default {
  components: {
    ChangePasswordForm,
    Form,
    Field,
    ErrorMessage,
    Header,
  },

  data() {
    const FormSchema = yup.object({
      hoten: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),

      username: yup.string().required("Tên đăng nhập không được để trống"),
      /*masonhanvien:yup
        .string()
        .required("Mã số nhân viên không được để trống."),*/
      email: yup
        .string()
        .required("Email không được để trống")
        .email("Vui lòng nhập email hợp lệ.")
        .max(50, "E-mail tối đa 50 ký tự."),

      sodienthoai: yup
        .string()
        .required("Số điện thoại không được để trống")
        .min(10, "Số điện thoại không hợp lệ.")
        .matches(
          /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
          "Số điện thoại không hợp lệ"
        ),
    });

    return {
      cacheKey: 1,
      account: VueJwtDecode.decode(localStorage.getItem("auth")),
      activetab: "information",
      activeform: "",
      haveData: true,
      imgS: null,
      img: true,
      images: [],
      imagesPreview: [],
      FormSchema,
      first: true,
      usernameMessage: "",
      emailMessage: "",
      a: 0,
    };
  },

  mounted() {
    console.log(this.account);
    this.getUser();
  },

  methods: {
    async getUser() {
      const nowTime = +new Date();
      this.cacheKey = nowTime;
      this.account = await UserService.get(this.account.id);
      this.a = this.a++;
      this.$forceUpdate();
    },

    onFileChange(e) {
      //this.a=!this.a;
      this.haveData = false;
      console.log(e.target.files);
      this.imgS = e.target.files;
      console.log(this.imgS);
      let temp = this.images.length;
      var selectedFiles = e.target.files;

      for (let i = 0; i < selectedFiles.length; i++) {
        let reader = new FileReader(); //instantiate a new file reader
        reader.onload = (e) => {
          this.imagesPreview[0] = e.target.result;
        };
        this.images[0] = selectedFiles[i];
        reader.readAsDataURL(selectedFiles[i]);
        console.log(this.images);
      }
    },

    async edit(data) {
      data.util = "staff";
      data.id = this.account.id;
      console.log(data);
      if (this.images[0]) {
        data.anhdaidien = this.account.id + "-pic.png";
      } else {
        data.anhdaidien = this.account.anhdaidien;
      }
      const check = await UserService.update(data);
      /*if (check === "username") {
        this.usernameMessage =
          "Tên đăng nhập đã được sử dụng bởi tài khoản khác";
      }*/
      if (check === true) {
        const headers = { "Content-Type": "multipart/form-data" };
        if (this.images[0]) {
          console.log(this.imgS[0].name);
          console.log(this.imgS)
          await FileService.upload(this.account.id + "-pic.png", this.imgS, {
            headers,
          });
        }
        this.$toast.open({
          message: "Chỉnh sửa thông tin thành công",
          type: "success",
          duration: 3000,
          dismissible: true,
        });
        this.getUser();
        this.activetab = "information";
        this.$forceUpdate();
      } else {
        console.log(check);
        if (check[0] === 1) {
          this.emailMessage = "Email đã được sử dụng bởi tài khoản khác";
        }
        if (check[2] === 1) {
          this.usernameMessage =
            "Tên đăng nhập đã được sử dụng bởi tài khoản khác";
        }
      }
    },

    check(data) {
      if (this.activetab === "edit")
        if (confirm("Thông tin chưa được lưu, bạn có chắc muốn thoát?")) {
          this.getUser();
          this.activetab = data;
        } else {
          this.activetab = "edit";
        }
      else {
        this.activetab = data;
      }
    },
  },

  watch: {
    account() {
      this.usernameMessage = "";
    },
  },

  computed: {},
};
</script>
<template>
  <div class="container-fluid">
    <div class="row" style="">
      <div class="col-2 px-0" style="background-color: var(--third-color)">
        <div
          class="d-flex flex-column align-items-sm-start px-3 pt-2 text-white min-vh-100"
        >
          <ul class="nav nav-pills flex-column" style="padding-top: 2vh">
            <li>
              <button
                class="nav-btn"
                style="padding: 1vh"
                @click="check('information')"
              >
                <i
                  class="fa-solid fa-chevron-right"
                  style="padding-right: 0.3vw"
                  v-if="activetab != 'changepass'"
                ></i>
                Thông tin tài khoản
              </button>
            </li>
            <li>
              <button
                class="nav-btn"
                style="padding: 1vh"
                @click="
                  check('changepass'),
                    (usernameMessage = ''),
                    (emailMessage = '')
                "
              >
                <i
                  class="fa-solid fa-chevron-right"
                  style="padding-right: 0.3vw"
                  v-if="activetab === 'changepass'"
                ></i>
                Đổi mật khẩu
              </button>
            </li>
          </ul>
          <hr />
        </div>
      </div>
      <div class="col">
        <div class="row"><Header :title="'Thông tin tài khoản'"></Header></div>
        <!--trang thong tin-->
        <div v-if="activetab != 'edit'">
          <img
            :src="`../../src/assets/img/${account.anhdaidien}?cache=${cacheKey}`"
            style="
              border-radius: 100%;
              width: 10vw;
              height: 10vw;
              position: absolute;
              margin-top: 1vw;
              margin-left: 6vw;
              border: 1px solid black;
            "
          />

          <div class="row" style="padding: 5vw">
            <div class="box" style="font-family: RalewayBold">
              <div class="row">
                <div
                  class="col"
                  style="
                    font-family: 'RalewayBlack';
                    font-size: 2vw;
                    margin-left: 13vw;
                  "
                >
                  {{ account.hoten }}
                </div>
                <div class="col text-end">
                  <button
                    class="btn btn-dark"
                    @click="activetab = 'edit'"
                    style="background-color: var(--main-color)"
                  >
                    Chỉnh sửa
                    <i
                      class="fa-regular fa-pen-to-square"
                      style="margin-left: 5px"
                    ></i>
                  </button>
                </div>
              </div>
              <div class="row" style="padding: 2vw">
                <!--Thông tin cá nhân-->
              </div>
              <div>
                <div class="row" style="padding: 0vw 3vw 3vw 3vw">
                  <div class="row line" style="">
                    <div class="col">
                      <div class="row">
                        <div class="col-6 lb">Tên đăng nhập:</div>
                        <div class="col">
                          {{ account.username }}
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="row">
                        <div class="col-6 lb">Mã số nhân viên:</div>
                        <div class="col">
                          {{ account.manhanvien }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row line" style="">
                    <div class="col-3 lb">Email:</div>
                    <div class="col">
                      {{ account.email }}
                    </div>
                  </div>
                  <div class="row line" style="">
                    <div class="col-3 lb">Điện thoại:</div>
                    <div class="col">
                      {{ account.sodienthoai }}
                    </div>
                  </div>
                  <div class="row line" style="">
                    <div class="col">
                      <div class="row">
                        <div class="col-6 lb">Chức vụ:</div>
                        <div class="col" v-if="account.chucvu === 'admin'">
                          Quản trị
                        </div>
                        <div class="col" v-if="account.chucvu === 'hc'">
                          Nhân viên hành chính
                        </div>
                        <div class="col" v-if="account.chucvu === 'kt'">
                          Nhân viên kỹ thuật
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="row">
                        <div class="col-6 lb">Giới tính:</div>
                        <div class="col" v-if="account.gioitinh === 'Nu'">
                          Nữ
                        </div>
                        <div class="col" v-else>Nam</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Trang chinh sua-->
        <div v-if="activetab === 'edit'">
          <div class="row">
            <Form @submit="edit" :validation-schema="FormSchema">
              <div>
                <label
                  for="fileuploaded"
                  @mouseenter="img = false"
                  @mouseleave="img = true"
                >
                  <img
                    v-if="haveData === true"
                    class="hover-e"
                    :src="`../../src/assets/img/${account.anhdaidien}?cache=${cacheKey}`"
                    style="
                      border-radius: 100%;
                      width: 10vw;
                      height: 10vw;
                      position: absolute;
                      margin-top: 0px;
                      margin-left: 30vw;
                      border: 1px solid black;
                    "
                  />
                  <img
                    v-else
                    style="
                      border-radius: 100%;
                      width: 10vw;
                      height: 10vw;
                      position: absolute;
                      margin-top: 0px;
                      margin-left: 30vw;
                      border: 1px solid black;
                    "
                    :src="imagesPreview[0]"
                  />

                  <div
                    v-if="img == false"
                    style="
                      border-radius: 100%;
                      width: 10vw;
                      height: 10vw;
                      position: absolute;
                      margin-top: 0px;
                      margin-left: 30vw;
                      border: 1px solid black;
                      background-color: black;
                      opacity: 50%;
                    "
                  >
                    <div
                      style="
                        position: absolute;
                        padding-top: 8vh;
                        padding-left: 1vw;
                        color: white;
                        font-family: 'RalewayBold';
                      "
                    >
                      Đổi ảnh đại diện
                    </div>
                  </div>
                </label>
                <form
                  encType="multipart/form-data"
                  @submit="this.$emit('submit')"
                  action="/api/img"
                  method="post"
                >
                  <input
                    type="file"
                    name="fileuploaded"
                    style="visibility: hidden"
                    @change="onFileChange"
                    encType="multipart/form-data"
                    id="fileuploaded"
                  />
                </form>
              </div>
              <div
                class="row"
                style="
                  padding: 70px;
                  padding-top: 80px;
                  background-color: rgb(241, 241, 241);
                "
              >
                <div class="box">
                  <div
                    class="row"
                    style="font-family: 'RalewayBold'; font-size: 20px"
                  >
                    <!--Thông tin cá nhân-->
                  </div>
                  <!--<div class="row">
                    <div
                      class="form-group"
                      style="
                        padding: 70px;
                        padding-top: 0px;
                        padding-bottom: 10px;
                      "
                    >
                      <div class="row">
                        <div class="col-3">
                          <label for="username" style="display: inline"
                            >Tên đăng nhập:</label
                          >
                        </div>
                        <div class="col">
                          <Field
                            style="display: inline"
                            name="username"
                            type="text"
                            class="form-control"
                            v-model="account.username"
                          >
                          </Field>
                          <ErrorMessage
                            name="username"
                            style="color: red"
                          ></ErrorMessage>
                          <div class="error-feedback" style="color: red">
                            {{ usernameMessage }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>-->
                  <div class="row" style="padding: 5vh; padding-top: 8vh">
                    <div class="row">
                      <div class="form-group" style="">
                        <label for="hoten">Họ và tên</label>
                        <Field
                          style="width: 98%; margin: auto"
                          name="hoten"
                          type="text"
                          class="form-control field"
                          v-model="account.hoten"
                        >
                        </Field>
                        <ErrorMessage
                          name="hoten"
                          class="error-feedback"
                          style="padding-left: 0.5vw"
                        ></ErrorMessage>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col">
                        <div class="form-group" style="">
                          <label for="username">Username</label>
                          <Field
                            style="width: 98%; margin: auto"
                            name="username"
                            type="text"
                            class="form-control field"
                            v-model="account.username"
                            @click="usernameMessage = ''"
                          >
                          </Field>
                          <ErrorMessage
                            name="username"
                            class="error-feedback"
                            style="padding-left: 0.5vw"
                          ></ErrorMessage>
                          <p
                            v-if="usernameMessage != ''"
                            class="error-feedback"
                          >
                            {{ usernameMessage }}
                          </p>
                        </div>
                      </div>
                      <div class="col">
                        <div class="form-group" style="">
                          <label for="gioitinh">Giới tính</label>
                          <div style="margin: auto">
                            <Field
                              name="gioitinh"
                              type="radio"
                              value="Nam"
                              v-model="account.gioitinh"
                              style="margin-left: 2vw"
                            >
                            </Field>
                            Nam
                            <Field
                              name="gioitinh"
                              type="radio"
                              value="Nu"
                              v-model="account.gioitinh"
                              style="margin-left: 2vw"
                            >
                            </Field>
                            Nữ
                          </div>
                          <ErrorMessage
                            name="gioitinh"
                            class="error-feedback"
                            style="padding-left: 0.5vw"
                          ></ErrorMessage>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <!--<div class="col">
                        <div class="form-group" style="">
                          <label for="manhanvien">Mã số nhân viên</label>
                          <Field
                            style="width: 98%; margin: auto"
                            name="manhanvien"
                            type="text"
                            class="form-control field"
                            v-model="account.manhanvien"
                          >
                          </Field>
                          <ErrorMessage
                            name="manhanvien"
                            class="error-feedback"
                            style="padding-left: 0.5vw"
                          ></ErrorMessage>
                        </div>
                      </div>-->
                    </div>
                    <div class="row">
                      <div class="col">
                        <div class="form-group" style="">
                          <label for="sodienthoai">Số điện thoại</label>
                          <Field
                            style="width: 98%; margin: auto"
                            name="sodienthoai"
                            type="text"
                            class="form-control field"
                            v-model="account.sodienthoai"
                          >
                          </Field>
                          <ErrorMessage
                            name="sodienthoai"
                            class="error-feedback"
                            style="padding-left: 0.5vw"
                          ></ErrorMessage>
                        </div>
                      </div>
                      <div class="col">
                        <div class="form-group" style="">
                          <label for="email">Email</label>
                          <Field
                            style="width: 98%; margin: auto"
                            name="email"
                            type="text"
                            class="form-control field"
                            v-model="account.email"
                            @click="emailMessage = ''"
                          >
                          </Field>
                          <ErrorMessage
                            name="email"
                            class="error-feedback"
                            style="padding-left: 0.5vw"
                          ></ErrorMessage>
                          <p v-if="emailMessage != ''" class="error-feedback">
                            {{ emailMessage }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row" style="padding: 5vh">
                    <div class="col text-center">
                      <button
                        class="btn btn-dark"
                        style="
                          margin-right: 1vw;
                          background-color: var(--main-color);
                        "
                        @click="(usernameMessage = ''), (emailMessage = '')"
                      >
                        Lưu thông tin
                      </button>
                      <button
                        class="btn btn-dark"
                        type="button"
                        @click="
                          getUser(),
                            (activetab = 'information'),
                            (usernameMessage = ''),
                            (emailMessage = ''),
                            (imagesPreview[0] =
                              '../../src/assets/img/' + this.account.anhdaidien)
                        "
                        style="
                          width: 110px;
                          background-color: var(--main-color);
                        "
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ChangePasswordForm
    v-if="activetab === 'changepass'"
    :account="account"
    @close="activetab = 'information'"
  ></ChangePasswordForm>
</template>
<style scoped>
#parent-tab:hover #child-tab {
  visibility: visible;
  display: block;
}

.child {
  visibility: hidden;
  display: none;
}

.active2 {
  background-color: rgb(24, 0, 76);
}

.active1 {
  background-color: var(--secondary-color);
}

.show {
  visibility: visible;
  display: block;
}

.box {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  padding: 2vh;
  border-radius: 25px 25px 25px 25px;
  background-color: rgb(255, 255, 255);
}

ul,
li {
  width: 100%;
}

/*.btngrad {
  background-image: linear-gradient(
    to right,
    #ffffff 0%,
    var(--main-color) 51%,
    var(--main-color) 100%
  );
  margin: 10px;
  padding: 15px 45px;
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  border-radius: 10px;
  display: block;
}

.btngrad:hover {
  background-position: right center; /* change the direction of the change here 
  color: #fff;
  text-decoration: none;
}*/

.nav-btn {
  border-radius: 5px 5px 5px 5px;
  border: none;
  padding: 1vh;
  background-color: var(--third-color);
  padding-left: 2vh;
  width: 100%;
  text-align: left;
  color: white;
}

.active {
  background-color: var(--sub-color);
}

.nav-btn:hover {
  /*text-decoration: underline;*/
  background-color: white;
  color: black;
}

.hover-e:hover {
  opacity: 70%;
}

.a:hover {
  background-color: white;
  color: black;
}

.a {
  padding-right: 20px;
  width: 13vw;
  color: black;
  background-color: white;
}
label {
  padding-top: 2vh;
  padding-bottom: 1vh;
}

.line {
  padding-bottom: 1vw;
  padding-top: 1vw;
  border-bottom: 1px solid rgb(186, 186, 186);
}

.lb {
  color: gray;
}
</style>
