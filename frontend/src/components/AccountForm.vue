<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px"
            >Thêm tài khoản nhân viên</label
          > <!--tiêu đề-->
          <label v-else class="" style="margin: auto; font-size: 20px"
            >Chỉnh sửa tài khoản nhân viên</label>
        </div> <!--tiêu đề-->
        <Form @submit="createAccount" :validation-schema="FormSchema">
          <div class="modal-body">
            <!--chỉnh view chính từ khúc này-->
            <div class="row">
              <div class="col-3 d-flex align-items-center">
                <label name="image">Ảnh đại diện</label>
              </div>
              <div class="col d-flex justify-content-end">
                <div>
                  <label
                    for="fileuploaded"
                    @mouseenter="
                      imgop = false;
                      console.log('in');
                    "
                    @mouseleave="imgop = true"
                  >
                    <img
                      v-if="
                        accountNew.anhdaidien &&
                        haveData === true &&
                        images.length === 0
                      "
                      class="hover-e"
                      :src="`../../src/assets/img/${account.anhdaidien}`"
                      style="
                        border-radius: 100%;
                        width: 10vw;
                        height: 10vw;
                        border: 1px solid black;
                      "
                    />
                    <img
                      v-if="!accountNew.anhdaidien && images.length === 0"
                      style="
                        border-radius: 100%;
                        width: 10vw;
                        height: 10vw;
                        border: 1px solid black;
                      "
                      src="../../src/assets/img/user-img.jpg"
                    />
                    <div v-for="(image, key) in images" class="col text-center">
                      <div :id="key">
                        <img
                          style="
                            border-radius: 100%;
                            width: 10vw;
                            height: 10vw;
                            border: 1px solid black;
                          "
                          class=""
                          v-bind:ref="'image' + parseInt(0)"
                        />
                      </div>
                    </div>
                    <div
                      v-if="imgop == false"
                      style="
                        border-radius: 100%;
                        width: 10vw;
                        height: 10vw;
                        position: absolute;
                        margin-top: -10vw;
                        border: 1px solid black;
                        background-color: black;
                        opacity: 60%;
                      "
                    >
                      <div
                        style="
                          position: absolute;
                          padding-top: 8vh;
                          padding-left: 2.5vw;
                          color: white;
                          font-family: 'RalewayBold';
                        "
                      >
                        Chọn ảnh
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
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="username">Username: </label>
                  <Field
                    name="username"
                    type="text"
                    class="form-control"
                    @click="usernameMessage = ''"
                    v-model="accountNew.username"
                  >
                  </Field>
                  <ErrorMessage
                    name="username"
                    class="error-feedback"
                  ></ErrorMessage>
                  <p v-if="usernameMessage != ''" class="error-feedback">
                    {{ usernameMessage }}
                  </p>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label v-if="edit === false" for="matkhau">Mật khẩu: </label>
                  <label v-else for="matkhau">Mật khẩu mới: </label>
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
                  <div>
                    <Field
                      @click="passMess = ''"
                      :type="type"
                      name="matkhau"
                      class="input form-control"
                      v-model="accountNew.matkhau"
                    ></Field>
                  </div>

                  <ErrorMessage
                    name="matkhau"
                    style="color: red"
                  ></ErrorMessage>
                  <p class="error-feedback">{{ passMess }}</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="hoten">Họ tên: </label>
                  <Field
                    name="hoten"
                    type="text"
                    class="form-control"
                    v-model="accountNew.hoten"
                  >
                  </Field>
                  <ErrorMessage name="hoten" style="color: red"></ErrorMessage>
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
                      v-model="accountNew.gioitinh"
                      style="margin-left: 2vw"
                    >
                    </Field>
                    Nam
                    <Field
                      name="gioitinh"
                      type="radio"
                      value="Nu"
                      v-model="accountNew.gioitinh"
                      style="margin-left: 2vw"
                    >
                    </Field>
                    Nữ
                  </div>
                  <ErrorMessage
                    name="manhanvien"
                    class="error-feedback"
                    style="padding-left: 0.5vw"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group">
                <label for="email">Email: </label>
                <Field
                  name="email"
                  type="tel"
                  class="form-control"
                  v-model="accountNew.email"
                >
                </Field>
                <ErrorMessage
                  name="email"
                  class="error-feedback"
                ></ErrorMessage>
                <p v-if="emailMessage != ''" class="error-feedback">
                  {{ emailMessage }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="form-group">
                <label for="sodienthoai">Số điện thoại: </label>
                <Field
                  name="sodienthoai"
                  type="tel"
                  class="form-control"
                  v-model="accountNew.sodienthoai"
                >
                </Field>
                <ErrorMessage
                  name="sodienthoai"
                  class="error-feedback"
                ></ErrorMessage>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <div class="form-group">
                  <label for="">Mã nhân viên: </label>
                  <Field
                    @click="idMessage = ''"
                    name="manhanvien"
                    type="text"
                    class="form-control"
                    v-model="accountNew.manhanvien"
                  >
                  </Field>
                  <ErrorMessage
                    name="manhanvien"
                    class="error-feedback"
                  ></ErrorMessage>
                  <p v-if="idMessage != ''" class="error-feedback">
                    {{ idMessage }}
                  </p>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label for="chucvu">Chức vụ: </label>
                  <div style="margin: auto">
                    <Field
                      name="chucvu"
                      as="select"
                      value="admin"
                      class=""
                      v-model="accountNew.chucvu"
                      style="
                        width: 100%;
                        border-width: 1.55px;
                        border-color: var(--secondary-color);
                        box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                        height: 5vh;
                        border-radius: 5px 5px 5px 5px;
                        text-align: center;
                      "
                    >
                      <option value="admin">Quản trị</option>
                      <option value="hc">Nhân viên hành chính</option>
                      <option value="kt">Nhân viên kỹ thuật</option>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <!--chỉnh view chính tới khúc này-->
          </div>
          <div class="text-center">
            
            <button
              v-if="edit === false"
              class="btn btn-dark"
              style="margin-right: 10px"
              type="submit"
            >
              Thêm tài khoản <!--tên nút -->
            </button>
            <button v-else class="btn btn-dark" style="margin-right: 10px">
              Lưu tài khoản <!--Tên nút -->
            </button>
            <button
              @click="$emit('close'), $emit('refresh')"
              class="btn btn-dark"
              style="width: 150px"
            >
              Hủy
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import FileService from "@/services/file.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    account: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      manhanvien: yup
        .string()
        .required("Mã không được để trống")
        .max(25, "Mã có nhiều nhất 25 ký tự."),

      username: yup.string().required("Username không được để trống"),

      email: yup
        .string()
        .required("Email không được để trống")
        .email("Vui lòng nhập email hợp lệ.")
        .max(50, "E-mail tối đa 50 ký tự."),

      hoten: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),

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
      type: "password",
      password: null,
      edit: this.e,
      accountNew: this.account,
      FormSchema,
      showPassword: false,
      img: null,
      images: [],
      idMessage: "",
      haveData: true,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      passMess: "",
      imgop: false,
      emailMessage: "",
      usernameMessage: "",
    };
  },

  mounted() {
    this.accountNew.matkhau = null;
    if (this.accountNew.gioitinh != "Nam" && this.accountNew.gioitinh != "Nu")
      this.accountNew.gioitinh = "Nam";
  },

  methods: {
    toggleShow() {
      console.log(this.accountNew.matkhau);
      this.showPassword = !this.showPassword;
      console.log(this.type);
      if (this.showPassword === true) this.type = "text";
      else this.type = "password";
    },

    onFileChange(e) {
      this.haveData = false;
      console.log(e.target.files);
      this.img = e.target.files;
      console.log(this.img);
      var selectedFiles = e.target.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        this.images[0] = selectedFiles[i];
      }
      for (let i = 0; i < this.images.length; i++) {
        let reader = new FileReader(); //instantiate a new file reader
        reader.addEventListener(
          "load",
          function () {
            this.$refs["image" + parseInt(i)][0].src = reader.result;
          }.bind(this),
          false
        ); //add event listener
        console.log(reader.result);

        reader.readAsDataURL(this.images[i]);
        console.log(this.images);
      }
    },

    async onFileSelected(event) {
      try {
        await FileService.upload(event);
      } catch (error) {
        console.log(error);
      }
    },

    async createAccount(data) {
      try {
        console.log("a");
        this.passMess = "";
        console.log(data);
        if (this.images[0] !== undefined) {
          data.img = this.images[0].name;
        } else {
          data.anhdaidien = "user-img.jpg";
        }
        if (this.edit === false) {
          if (this.accountNew.matkhau === null) {
            this.passMess = "Mật khẩu không được để trống";
          } else {
            if (this.accountNew.matkhau.length < 6) {
              this.passMess = "Mật khẩu phải >= 6 ký tự";
            } else {
              const check = await UserService.create(data);
              console.log(check);
              if (check.length === 3) {
                if (check[0] === 1) {
                  this.emailMessage =
                    "Email đã được sử dụng bởi tài khoản khác";
                }
                if (check[2] === 1) {
                  this.usernameMessage =
                    "Tên đăng nhập đã được sử dụng bởi tài khoản khác";
                }
                if (check[1] === 1) {
                  this.idMessage = "Mã nhân viên đã tồn tại";
                }
              } else {
                const headers = { "Content-Type": "multipart/form-data" };
                if (this.images[0] !== undefined)
                  await FileService.upload(check + "-pic.png", this.img, {
                    headers,
                  });
                this.$toast.open({
                  message: "Thêm tài khoản thành công",
                  type: "success",
                  duration: 3000,
                  dismissible: true,
                });
                this.$emit("close");
                this.$emit("refresh");
              }
            }
          }
        } else {
          this.passMess = "";
          if (
            this.accountNew.matkhau != null ||
            this.accountNew.matkhau != undefined
          ) {
            if (this.accountNew.matkhau.length < 6) {
              this.passMess = "Mật khẩu phải >= 6 ký tự";
              return console.log("a");
            }
          }
          data.id = this.accountNew.id;
          data.util = "admin";
          if (this.images[0] !== undefined)
            data.anhdaidien = this.accountNew.id + "-pic.png";
          else data.anhdaidien = this.accountNew.anhdaidien;
          const check = await UserService.update(data);
          console.log(check);
          if (check != true) {
            if (check[0] === 1) {
              this.emailMessage = "Email đã được sử dụng bởi tài khoản khác";
            }
            if (check[2] === 1) {
              this.usernameMessage =
                "Tên đăng nhập đã được sử dụng bởi tài khoản khác";
            }
            if (check[1] === 1) {
              this.idMessage = "Mã nhân viên đã tồn tại";
            }
          } else {
            const headers = { "Content-Type": "multipart/form-data" };
            if (this.images[0] !== undefined)
              await FileService.upload(
                this.accountNew.id + "-pic.png",
                this.img,
                { headers }
              );
            this.$toast.open({
              message: "Chỉnh sửa tài khoản thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("close");
            this.$emit("refresh");
          }
          if (
            this.accountNew.id === this.user.id &&
            (this.accountNew.chucvu != this.user.chucvu ||
              this.accountNew.id != this.user.username)
          ) {
            UserService.logout();
            localStorage.removeItem("auth");

            location.reload();
          }

          /*} else {
            const check = await UserService.update(this.accountNew.id, data);
            console.log(check);
            if (check === false) {
              this.nameMessage = "Mã nhân viên đã tồn tại";
            } else {
              const headers = { "Content-Type": "multipart/form-data" };
              if (this.images[0] !== undefined)
                await FileService.upload(this.img, { headers });
              this.$toast.open({
                message: "Chỉnh sửa tài khoản thành công",
                type: "success",
                duration: 3000,
                dismissible: true,
              });
              this.$emit("close");
              this.$emit("refresh");
            }
            if (
              this.accountNew.id === this.user.id &&
              (this.accountNew.chucvu != this.user.chucvu ||
                this.accountNew.username != this.user.username)
            ) {
              UserService.logout();
              localStorage.removeItem("auth");

              location.reload();
            }
          }*/
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
label {
  padding-top: 5px;
  padding-bottom: 5px;
  font-family: RalewayBold;
}

.form-button {
  background-color: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}
.form-control {
  border-width: 1.55px;
  border-color: var(--secondary-color);
  box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
}

.preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100px;
}
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  /*background-color: rgb(196, 219, 219);*/
}
.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 500px;
  background-color: white;
  padding: 20px;
}
</style>
