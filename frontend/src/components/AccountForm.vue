<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label v-if="edit===false" class="" style="margin: auto; font-size: 20px"
            >Thêm tài khoản nhân viên</label
          >
          <label v-else class="" style="margin: auto; font-size: 20px"
            >Chỉnh sửa tài khoản nhân viên</label
          >
        </div>
        <Form @submit="createAccount" :valstaffIdation-schema="FormSchema">
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="staffId">Mã nhân viên: </label>
                  <Field
                    name="staffId"
                    type="text"
                    class="form-control"
                    v-model="accountNew.staffId"
                  >
                  </Field>
                  <ErrorMessage
                    name="staffId"
                    style="color: red"
                  ></ErrorMessage>
                  <p style="color: red">{{ staffIdMessage }}</p>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label v-if="edit === false" for="password">Mật khẩu: </label>
                  <label v-else for="password">Mật khẩu mới: </label>
                  <div>
                    <Field
                      :type="type"
                      name="password"
                      class="input form-control"
                      v-model="accountNew.password"
                      style="max-width: 210px; display: inline"
                    ></Field>
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
                  </div>

                  <ErrorMessage
                    name="password"
                    style="color: red"
                  ></ErrorMessage>
                  <p style="color: red">{{ passMess }}</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="form-group">
                <label for="name">Họ tên: </label>
                <Field
                  name="name"
                  type="text"
                  class="form-control"
                  v-model="accountNew.name"
                >
                </Field>
                <ErrorMessage name="name" style="color: red"></ErrorMessage>
              </div>
            </div>
            <div class="row">
              <div class="form-group">
                <label for="phone">Số điện thoại: </label>
                <Field
                  name="phone"
                  type="tel"
                  class="form-control"
                  v-model="accountNew.phone"
                >
                </Field>
                <ErrorMessage name="phone" style="color: red"></ErrorMessage>
              </div>
            </div>
            <div class="row">
              <div class="col-6" style="padding-top: 20px">
                <div class="form-group">
                  <label for="role">Chức vụ: </label>
                  <div style="margin: auto">
                    <Field
                      name="role"
                      type="radio"
                      value="admin"
                      v-model="accountNew.role"
                      style="margin-left: 30px"
                    >
                    </Field>
                    Quản lý
                    <Field
                      name="role"
                      type="radio"
                      value="employee"
                      v-model="accountNew.role"
                      style="margin-left: 30px"
                    >
                    </Field>
                    Nhân viên
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div style="padding-top: 20px">
                  <label name="image">Ảnh đại diện</label>
                  <label
                    for="fileuploaded"
                    class="btn"
                    title="Chọn ảnh đại diện"
                    style="
                      margin-left: 30px;
                      background-color: var(--secondary-color);
                      border-color: var(--secondary-color);
                      color: white;
                    "
                    ><i class="fa-solstaffId fa-image"></i
                  ></label>
                  <form
                    encType="multipart/form-data"
                    @submit="this.$emit('submit')"
                    action="/api/img"
                    method="post"
                  >
                    <input
                      type="file"
                      name="fileuploaded"
                      style="visibility: hstaffIdden"
                      @change="onFileChange"
                      encType="multipart/form-data"
                      staffId="fileuploaded"
                    />
                    <div class="row">
                      <div
                        v-if="accountNew.img && haveData === true"
                        class="col text-center"
                      >
                        <img
                          style="display: inline-flex; margin-top: -10px"
                          class="preview img-thumbnail"
                          :src="`../../src/assets/img/${accountNew.img}`"
                        />
                        <p style="">{{ accountNew.img }}</p>
                      </div>
                      <div
                        v-for="(image, key) in images"
                        class="col text-center"
                      >
                        <div :staffId="key">
                          <img
                            style="display: inline-flex; margin-top: -10px"
                            class="preview img-thumbnail"
                            v-bind:ref="'image' + parseInt(0)"
                          />
                          <p>{{ image.name }}</p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div class="row">
                <div class="form-group">
                  <label for="address">Địa chỉ: </label>
                  <Field
                    as="textarea"
                    name="address"
                    type="text"
                    class="form-control"
                    v-model="accountNew.address"
                    style="height: 70px"
                  >
                  </Field>
                  <ErrorMessage
                    name="address"
                    class="error-feedback"
                    as="p"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button
              v-if="edit === false"
              class="btn form-button"
              style="margin-right: 10px"
              @click=""
              type="submit"
            >
              Thêm tài khoản
            </button>
            <button v-else class="btn form-button" style="margin-right: 10px">
              Lưu tài khoản
            </button>
            <button
              @click="$emit('close'), $emit('refresh')"
              class="btn form-button"
              style="wstaffIdth: 150px"
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
import { Form, Field, ErrorMessage } from "vee-valstaffIdate";
import ImgService from "@/services/img.service";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";

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
      staffId: yup
        .string()
        .required("Tên không được để trống")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),

      name: yup
        .string()
        .required("Tên phải có giá trị.")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),

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
      type: "password",
      password: null,
      edit: this.e,
      accountNew: this.account,
      FormSchema,
      showPassword: false,
      img: null,
      images: [],
      staffIdMessage: "",
      haveData: true,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      passMess: "",
    };
  },

  mounted() {
    this.accountNew.password = null;
  },

  methods: {
    toggleShow() {
      console.log(this.accountNew.password);
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
        await ImgService.upload(event);
      } catch (error) {
        console.log(error);
      }
    },

    async createAccount(data) {
      try {
        this.passMess = "";
        console.log(data);
        if (this.images[0] !== undefined) {
          data.img = this.images[0].name;
        }
        if (this.edit === false) {
          if (this.accountNew.password === null) {
            this.passMess = "Mật khẩu không được để trống";
          } else {
            if (this.accountNew.password.length < 6) {
              this.passMess = "Mật khẩu phải >= 6 ký tự";
            } else {
              const check = await UserService.create(data);
              if (check === false) {
                this.staffIdMessage = "Mã nhân viên đã tồn tại";
              } else {
                const headers = { "Content-Type": "multipart/form-data" };
                if (this.images[0] !== undefined)
                  await ImgService.upload(this.img, { headers });
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
            this.accountNew.password != null ||
            this.accountNew.password != undefined
          ) {
            if (this.accountNew.password.length < 6){
              this.passMess = "Mật khẩu phải >= 6 ký tự";
            console.log('a')}
            else{
                const check = await UserService.update(this.accountNew.staffId, data);
            console.log(check)
            if (check === false) {
              this.nameMessage = "Mã nhân viên đã tồn tại";
            } else {
              const headers = { "Content-Type": "multipart/form-data" };
              if (this.images[0] !== undefined)
                await ImgService.upload(this.img, { headers });
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
              this.accountNew.staffId === this.user.staffId &&
              (this.accountNew.role != this.user.role ||
                this.accountNew.staffId != this.user.username)
            ) {
              UserService.logout();
              localStorage.removeItem("auth");

              location.reload();
            }
            }
          } else {
            const check = await UserService.update(this.accountNew.staffId, data);
            console.log(check)
            if (check === false) {
              this.nameMessage = "Mã nhân viên đã tồn tại";
            } else {
              const headers = { "Content-Type": "multipart/form-data" };
              if (this.images[0] !== undefined)
                await ImgService.upload(this.img, { headers });
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
              this.accountNew.staffId === this.user.staffId &&
              (this.accountNew.role != this.user.role ||
                this.accountNew.username != this.user.username)
            ) {
              UserService.logout();
              localStorage.removeItem("auth");

              location.reload();
            }
          }
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
  border-wstaffIdth: 1.55px;
  border-color: var(--secondary-color);
  box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
}
.error-feedback {
  color: red;
}
.preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  wstaffIdth: 100px;
}
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  wstaffIdth: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: mstaffIddle;
}

.modal-container {
  wstaffIdth: 600px;
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
  overflow-x: hstaffIdden;
  height: 500px;
  background-color: white;
  padding: 20px;
}
</style>
