<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

import UserService from "@/services/user.service.js";
import VueJwtDecode from "vue-jwt-decode";

import ChangePasswordForm from "@/components/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/DeleteAccountForm.vue";
import Header from "@/components/header.vue";

export default {
  components: {
    ChangePasswordForm,
    DeleteAccountForm,
    Form,
    Field,
    ErrorMessage,
    Header,
  },

  data() {
    const FormSchema = yup.object({
      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
      username: yup.string().required("Tên đăng nhập không được để trống"),
      address: yup
        .string()
        .required("Địa chỉ không được để trống")
        .max(100, "Địa chỉ tối đa 100 ký tự."),
      phone: yup
        .string()
        .required("Số điện thoại không được để trống")
        .min(10, "Số điện thoại không hợp lệ.")
        .matches(
          /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
          "Số điện thoại không hợp lệ"
        ),
    });

    return {
      account: VueJwtDecode.decode(localStorage.getItem("auth")),
      activetab: "information",
      activeform: "",
      onPage: 0,
      pageNumber: 0,
      onPageTemp: 1,
      img: true,
      haveData: true,
      img: null,
      images: [],
      imagesPreview: [],
      FormSchema,
      first: true,
      usernameMessage: "",
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    async getUser() {
      this.account = await UserService.get(this.account.id);
    },

    onFileChange(e) {
      this.haveData = false;
      console.log(e.target.files);
      this.img = e.target.files;
      console.log(this.img);
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
      this.usernameMessage = "";
      if (this.images[0]) data.img = this.images[0].name;
      const check = await UserService.update(this.account._id, data);
      if (check === "username") {
        this.usernameMessage =
          "Tên đăng nhập đã được sử dụng bởi tài khoản khác";
      }
      if (check === "success") {
        this.$toast.open({
          message: "Chỉnh sửa thông tin thành công",
          type: "success",
          duration: 3000,
          dismissible: true,
        });
        this.getUser();
        this.activetab = "information";
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
      <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style="background-color: var(--main-color)">
        <div
          class="d-flex flex-column align-items-sm-start px-3 pt-2 text-white min-vh-100"
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
                font-family: Lobster;
                font-size: 20px;
              "
            >
              <div>APPNAME</div>
            </div>
          </div>

          <div
            class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"
          >
            <span
              class="fs-5 d-none d-sm-inline"
              style="margin-top: 10px; margin-bottom: 0px"
              >Menu</span
            >
          </div>

          <ul
            class="nav nav-pills flex-column "
            id="menu"
            style="margin-top: -10px"
          >
            <li id="parent-tab">
              <button
                @click="
                  show = false;
                  show1 = true;
                  activetab === 'information'
                "
                class="nav-link px-0 a"
              >
                <i class="fa-regular fa-file-lines"></i>
                <span class="ms-1 d-none d-sm-inline">Cài đặt</span>
              </button>
              <div
                class="col text-start"
                :class="{ show: show === true, child: show === false }"
              >
                <button
                  class="form-control btn"
                  :class="{ btngrad: activetab === 'information' }"
                  style="padding: 10px; color: white"
                  @click="check('information')"
                >
                  Thông tin tài khoản
                </button>
                <button
                  class="form-control btn"
                  :class="{ btngrad: activetab === 'changepass' }"
                  style="padding: 10px; color: white"
                  @click="check('changepass')"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </li>
          </ul>
          <hr />
        </div>
      </div>
      <div class="col">
        <div class="row"><Header :title="'Thông tin tài khoản'"></Header></div>
        <div>
          <img
            :src="`../../src/assets/img/${account.img}`"
            style="
              border-radius: 100%;
              width: 150px;
              height: 150px;
              position: absolute;
              margin-top: 20px;
              margin-left: 50px;
              border: 1px solid black;
            "
          />
          <div
            class="row"
            style="
              padding: 40px;
              padding-top: 105px;
            "
          >
            <div class="box">
              <div class="row">
                <div
                  class="col"
                  style="
                    font-family: 'RalewayBold';
                    font-size: 25px;
                    margin-left: 190px;
                  "
                >
                  {{ account.name }}
                </div>
                <div class="col text-end">
                  <button class="btn btn-dark" @click="activetab = 'edit'">
                    Chỉnh sửa
                    <i
                      class="fa-regular fa-pen-to-square"
                      style="margin-left: 5px"
                    ></i>
                  </button>
                </div>
              </div>
              <div
                class="row"
                style="
                  padding: 70px;
                  font-family: 'RalewayBold';
                  font-size: 20px;
                  padding-top: 60px;
                  padding-bottom: 30px;
                "
              >
                <!--Thông tin cá nhân-->
              </div>
              <div>
                <div
                  class="row"
                  style="
                    margin: 100px;
                    margin-top: 0px;
                    padding-bottom: 10px;
                    margin-bottom: 0;
                    border-bottom: 1px solid rgb(186, 186, 186);
                  "
                >
                  <div class="col-3">Tên đăng nhập:</div>
                  <div class="col">
                    {{ account.username }}
                  </div>
                </div>

                <div
                  class="row"
                  style="
                    margin: 100px;
                    margin-top: 0px;
                    padding-bottom: 10px;
                    margin-bottom: 0;
                    padding-top: 20px;
                    border-bottom: 1px solid rgb(186, 186, 186);
                  "
                >
                  <div class="col-3">Họ và tên:</div>
                  <div class="col">
                    {{ account.name }}
                  </div>
                </div>

                <div
                  class="row"
                  style="
                    margin: 100px;
                    margin-top: 0px;
                    padding-bottom: 10px;
                    margin-bottom: 0;
                    padding-top: 20px;
                    border-bottom: 1px solid rgb(186, 186, 186);
                  "
                >
                  <div class="col-3">Email:</div>
                  <div class="col">
                    {{ account.email }}
                  </div>
                </div>
                <div
                  class="row"
                  style="
                    margin: 100px;
                    margin-top: 0px;
                    padding-bottom: 10px;
                    margin-bottom: 0;
                    padding-top: 20px;
                    border-bottom: 1px solid rgb(186, 186, 186);
                  "
                >
                  <div class="col-3">Điện thoại:</div>
                  <div class="col">
                    {{ account.phone }}
                  </div>
                </div>
                <div
                  class="row"
                  style="
                    margin: 100px;
                    margin-top: 0px;
                    padding-bottom: 10px;
                    margin-bottom: 0;
                    padding-top: 20px;
                    border-bottom: 1px solid rgb(186, 186, 186);
                  "
                >
                  <div class="col-3">Địa chỉ:</div>
                  <div class="col">
                    {{ account.address }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activetab === 'edit'">
          <div class="row" style="background-color: rgb(241, 241, 241)">
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
                    :src="`../../src/assets/img/${account.img}`"
                    style="
                      border-radius: 100%;
                      width: 150px;
                      height: 150px;
                      position: absolute;
                      margin-top: 0px;
                      margin-left: 470px;
                      border: 1px solid black;
                    "
                  />
                  <img
                    v-else
                    style="
                      border-radius: 100%;
                      width: 150px;
                      height: 150px;
                      position: absolute;
                      margin-top: 0px;
                      margin-left: 470px;
                      border: 1px solid black;
                    "
                    :src="imagesPreview[0]"
                  />

                  <div
                    v-if="img == false"
                    style="
                      border-radius: 100%;
                      width: 150px;
                      height: 150px;
                      position: absolute;
                      margin-top: 0px;
                      margin-left: 470px;
                      border: 1px solid black;
                      background-color: black;
                      opacity: 50%;
                    "
                  ></div>
                  <div
                    v-if="img == false"
                    style="
                      position: absolute;
                      margin-top: 60px;
                      margin-left: 485px;
                      color: white;
                      font-family: 'RalewayBold';
                    "
                  >
                    Đổi ảnh đại diện
                  </div>
                </label>

                <input
                  type="file"
                  name="fileuploaded"
                  style="visibility: hidden"
                  @change="onFileChange"
                  encType="multipart/form-data"
                  id="fileuploaded"
                />
              </div>
              <div
                class="row"
                style="
                  padding: 40px;
                  padding-top: 80px;
                  background-color: rgb(241, 241, 241);
                "
              >
                <div class="box">
                  <div
                    class="row"
                    style="
                      padding: 70px;
                      font-family: 'RalewayBold';
                      font-size: 20px;
                      padding-top: 60px;
                      padding-bottom: 30px;
                    "
                  >
                    Thông tin cá nhân
                  </div>
                  <div class="row">
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
                  </div>
                  <div class="row">
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
                          <label for="name" style="display: inline"
                            >Họ và tên:</label
                          >
                        </div>
                        <div class="col">
                          <Field
                            style="display: inline"
                            name="name"
                            type="text"
                            class="form-control"
                            v-model="account.name"
                          >
                          </Field>
                          <ErrorMessage
                            name="name"
                            style="color: red"
                          ></ErrorMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
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
                          <label for="phone" style="display: inline"
                            >Số điện thoại:</label
                          >
                        </div>
                        <div class="col">
                          <Field
                            style="display: inline"
                            name="phone"
                            type="text"
                            class="form-control"
                            v-model="account.phone"
                          >
                          </Field>
                          <ErrorMessage
                            name="phone"
                            style="color: red"
                          ></ErrorMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
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
                          <label for="address" style="display: inline"
                            >Địa chỉ:</label
                          >
                        </div>
                        <div class="col">
                          <Field
                            style="display: inline; height: 70px"
                            as="textarea"
                            name="address"
                            type="text"
                            class="form-control"
                            v-model="account.address"
                          >
                          </Field>
                          <ErrorMessage
                            name="address"
                            style="color: red"
                          ></ErrorMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row" style="padding-top: 10px">
                    <div class="col text-center">
                      <button class="btn btn-dark" style="margin-right: 10px">
                        Lưu thông tin
                      </button>
                      <button
                        class="btn btn-dark"
                        type="button"
                        @click="getUser(), (activetab = 'information')"
                        style="width: 110px"
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
#parent-tab:hover #child-tab{
    visibility:visible;
    display: block;
}

.child{
    visibility: hidden;
    display: none;
}

.active2{
    background-color: rgb(24, 0, 76);
}

.active1{
    background-color: var(--secondary-color);
}

.show{
    visibility: visible;
    display: block;
}

.box {
  box-shadow: 0 2px 8px rgba(132, 132, 132, 0.33);
  padding: 10px;
  border-radius: 10px 10px 10px 10px;
  background-color: rgb(255, 255, 255);
}

.active {
  background-color: rgb(228, 229, 239);
  width: 400px;
  margin-left: -20px;
  border: none;
}

.btngrad {
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
  background-position: right center; /* change the direction of the change here */
  color: #fff;
  text-decoration: none;
}

.hover-e:hover {
  opacity: 70%;
}

.a:hover{
    background-color: white;
    color:black
    
}

.a{
    padding-right: 20px;
    width: 13vw;
    color:black;
    background-color: white;
}
</style>
