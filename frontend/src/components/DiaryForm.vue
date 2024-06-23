<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Tạo nhật ký mới</label
          >
          <label
            v-else
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Cập nhập nhật ký</label
          >
        </div>
        <Form @submit="create" :validation-schema="FormSchema">
          <div class="modal-body" style="margin-bottom: 3vh">
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label>Tên nhật ký:</label>
                </div>
                <div class="col-8">
                  <Field
                    type="text"
                    name="ten"
                    class="form-control"
                    style=""
                    v-model="d.ten"
                  >
                  </Field>
                  <ErrorMessage
                    for="ten"
                    name="ten"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label>Loại nhật ký: </label>
                </div>
                <div class="col-8">
                  <Field
                    as="select"
                    name="loai"
                    value="loi"
                    class=""
                    style="
                      width: 100%;
                      border-width: 1.55px;
                      border-color: var(--secondary-color);
                      box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                      height: 5vh;
                      border-radius: 5px 5px 5px 5px;
                      text-align: center;
                    "
                    v-model="d.loai"
                    ><option value="loi">Lỗi</option>
                    <option value="cap nhat">Cập nhật</option>
                    <option value="khac">Khác</option>
                  </Field>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="d.loai === 'cap nhat'">
              <div class="row spacing">
                <div class="col"></div>
                <div class="col-8">
                  <Field
                    as="textarea"
                    rows="3"
                    name="khacphuc"
                    class="form-control"
                    placeholder="Nhập thông tin cập nhật"
                    style=""
                    v-model="d.capnhat"
                  >
                  </Field>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="d.loai === 'khac'">
              <div class="row spacing">
                <div class="col"></div>
                <div class="col-8">
                  <Field
                    type="text"
                    name="Loai"
                    class="form-control"
                    style=""
                    placeholder="Nhập tên loại"
                    v-model="Loai"
                  >
                  </Field>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="d.loai === 'loi'">
              <div class="row spacing">
                <div class="col">
                  <label>Khắc phục: </label>
                </div>
                <div class="col-8">
                  <Field
                    type="radio"
                    :value="false"
                    name="KhacPhuc"
                    v-model="KhacPhuc"
                    style=""
                  >
                  </Field>
                  <p style="display: inline; padding-left: 10px">
                    Chưa khắc phục
                  </p>
                  <Field
                    type="radio"
                    :value="true"
                    name="KhacPhuc"
                    v-model="KhacPhuc"
                    style="margin-left: 2vw"
                  >
                  </Field>
                  <p style="display: inline; padding-left: 10px">
                    Đã khắc phục
                  </p>
                </div>
              </div>
            </div>
            <div
              class="form-group"
              v-if="d.loai === 'loi' && this.KhacPhuc === true"
            >
              <div class="row spacing">
                <div class="col"></div>
                <div class="col-8">
                  <Field
                    as="textarea"
                    rows="3"
                    name="khacphuc"
                    class="form-control"
                    placeholder="Nhập cách khắc phục"
                    style=""
                    v-model="d.khacphuc"
                  >
                  </Field>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label>Ghi chú: </label>
                </div>
                <div class="col-8">
                  <Field
                    rows="3"
                    as="textarea"
                    name="ghichu"
                    class="form-control"
                    style=""
                    v-model="d.ghichu"
                  >
                  </Field>
                </div>
              </div>
            </div>
            <!--chỉnh view chính tới khúc này-->
          </div>
          <div class="text-center">
            <button
              v-if="this.edit === false"
              class="btn btn-dark"
              style="margin-right: 10px; width: 10vw"
              type="submit"
            >
              Tạo nhật ký
              <!--tên nút -->
            </button>
            <button
              v-else
              class="btn btn-dark"
              style="margin-right: 10px; width: 10vw"
              type="submit"
            >
              Cập nhật
              <!--tên nút -->
            </button>
            <button
              @click="$emit('close'), $emit('refresh')"
              class="btn btn-dark"
              style="width: 10vw"
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
import SettingiService from "@/services/settingi.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    dprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      ten: yup.string().required("Tên không được để trống"),
    });

    return {
      FormSchema,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      d: this.dprop,
      edit: this.e,
      Loai: "",
      KhacPhuc: false,
    };
  },

  mounted() {
    if (this.edit === true) {
      if (this.d.loai != "cap nhat" && this.d.loai != "loi") {
        this.Loai = this.d.loai.split("()")[1];
        this.d.loai = "khac";
      }
      if (this.d.loai === "loi" && this.d.khacphuc === "") {
        this.KhacPhuc = false;
      } else {
        this.KhacPhuc = true;
      }
    }
  },

  methods: {
    async create(data) {
      if (data.loai === "khac") {
        this.d.loai = data.loai + "()" + data.Loai;
        this.d.capnhat = "";
        this.d.khacphuc = "";
      } else {
        if (data.loai === "loi") {
          if (this.KhacPhuc === false) this.d.khacphuc = "";
          else {
            if (this.d.khacphuc === "") this.d.khacphuc = "Không có thông tin";
            this.d.capnhat = "";
          }
        } else {
          if (data.loai === "cap nhat") {
            if (this.d.capnhat === "") this.d.capnhat = "Không có thông tin";
            this.d.khacphuc = "";
          }
        }
      }
      if (this.d.ghichu === "") this.d.ghichu = "Không có thông tin";
      if (this.edit===false){
        let check=await SettingiService.addDiary(this.d);
        if (check===true){
            this.$toast.open({
            message: "Nhật ký đã được cập nhật",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          this.$emit("refresh");
        }
      }
      else{
        let check=await SettingiService.updateDiary(this.d);
        if (check===true){
            this.$toast.open({
            message: "Nhật ký đã được cập nhật",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          this.$emit("refresh");
        }
      }
    },
  },
};
</script>
<style scoped>
.spacing {
  margin-bottom: 3vh;
}

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
  z-index: 990;
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
.hover-i:hover {
  transform: scale(1.2);
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
  overflow-y: auto;
  overflow-x: hidden;
  height: 350px;
  background-color: white;
  padding: 20px;
}

.icon-search {
  padding-left: 3vw;

  background: url("../assets/img/magnifying-glass-solid.svg") no-repeat left;
  background-size: 2vh;
  background-position: 2vh;
}

#util-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.card:hover {
  transform: scale(1.001);
  background-color: rgb(228, 228, 228);
}
</style>
