<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px"
            >Tạo sự kiện</label
          >
          <!--tiêu đề-->
          <label v-else class="" style="margin: auto; font-size: 20px"
            >Chỉnh sửa thông tin sự kiện</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="createAccount" :validation-schema="FormSchema">
          <div class="modal-body">
            <!--chỉnh view chính từ khúc này-->
            <div class="row">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="TenSuKien">Tên sự kiện: </label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="TenSuKien"
                      type="text"
                      class="form-control"
                      @click="TenSuKienMessage = ''"
                      v-model="accountNew.TenSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="TenSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p v-if="TenSuKienMessage != ''" class="error-feedback">
                      {{ TenSuKienMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="MoTaSuKien">Mô tả sự kiện: </label>
                  </div>
                  <div class="col-7">
                    <Field
                      style="resize: none"
                      name="MoTaSuKien"
                      type="textarea"
                      class="form-control"
                      @click="MoTaSuKienMessage = ''"
                      v-model="accountNew.MoTaSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="MoTaSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p v-if="MoTaSuKienMessage != ''" class="error-feedback">
                      {{ MoTaSuKienMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="NgayDienRaSuKien">Ngày diễn ra sự kiện: </label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="NgayDienRaSuKien"
                      type="date"
                      class="form-control"
                      @click="NgayDienRaSuKienMessage = ''"
                      v-model="accountNew.NgayDienRaSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="NgayDienRaSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p
                      v-if="NgayDienRaSuKienMessage != ''"
                      class="error-feedback"
                    >
                      {{ NgayDienRaSuKienMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="DiaDiemDienRaSuKien"
                      >Địa điểm diễn ra sự kiện:
                    </label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="DiaDiemDienRaSuKien"
                      type="text"
                      class="form-control"
                      @click="DiaDiemDienRaSuKienMessage = ''"
                      v-model="accountNew.DiaDiemDienRaSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="DiaDiemDienRaSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p
                      v-if="DiaDiemDienRaSuKienMessage != ''"
                      class="error-feedback"
                    >
                      {{ DiaDiemDienRaSuKienMessage }}
                    </p>
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
              style="margin-right: 10px; width: 150px"
              type="submit"
            >
              Tạo sự kiện
              <!--tên nút -->
            </button>
            <button v-else class="btn btn-dark" style="margin-right: 10px">
              Lưu sự kiện
              <!--Tên nút -->
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
      TenSuKien: yup.string().required("Tên sự kiện không được để trống"),

      MoTaSuKien: yup.string().required("Mô tả sự kiện không được để trống"),

      NgayDienRaSuKien: yup
        .string()
        .required("Ngày diễn ra sự kiện không được để trống"),

      DiaDiemDienRaSuKien: yup
        .string()
        .required("Địa điểm diễn ra sự kiện không được để trống."),
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
      user: null,
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
  height: 50vh;
  background-color: white;
  padding: 20px;
}
</style>
