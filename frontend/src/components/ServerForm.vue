<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Thêm Server</label
          >
          <!--tiêu đề-->
          <label
            v-else
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Chỉnh sửa Server</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="create" :validation-schema="FormSchema">
          <div class="modal-body" style="margin-bottom: 3vh">
            <!--chỉnh view chính từ khúc này-->

            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ten">Tên Server: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="ten"
                    type="text"
                    class="form-control"
                    v-model="server.ten"
                  >
                  </Field>
                  <ErrorMessage
                    name="ten"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="loai">Loại Server: </label>
                </div>
                <div class="col-7">
                  <Field
                    as="select"
                    name="loai"
                    value="app"
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
                    v-model="server.loai"
                    ><option value="app">App</option>
                    <option value="web">Web</option>
                    <option value="csdl">Cơ sở dữ liệu</option>
                    <option value="khac">Khác</option>
                  </Field>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="server.loai != 'khac'">
              <div class="row spacing">
                <div class="col">
                  <label for="csdl" v-if="server.loai === 'csdl'"
                    >Cơ sở dữ liệu:
                  </label>
                  <label v-if="server.loai != 'csdl' && server.loai != 'khac'"
                    >Ngôn ngữ sử dụng:
                  </label>
                </div>
                <div class="col-7">
                  <Field
                    v-if="server.loai === 'csdl'"
                    name="csdl"
                    type="text"
                    class="form-control"
                    v-model="server.csdl"
                    @click="csdlMes = ''"
                  >
                  </Field>
                  <p v-if="csdlMes != ''" class="error-feedback">
                    {{ csdlMes }}
                  </p>
                  <Field
                    v-if="server.loai != 'csdl' && server.loai != 'khac'"
                    name="ngonngu"
                    type="text"
                    class="form-control"
                    v-model="server.ngonngu"
                    @click="nnMes = ''"
                  >
                  </Field>
                  <p v-if="nnMes != ''" class="error-feedback">{{ nnMes }}</p>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="server.loai === 'web'">
              <div class="row spacing">
                <div class="col">
                  <label>Môi trường vận hành: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="moitruong"
                    type="text"
                    class="form-control"
                    v-model="server.moitruong"
                  >
                  </Field>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label>Các framework/ phần mềm sử dụng khác: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="pmkhac"
                    as="textarea"
                    class="form-control"
                    v-model="server.pmkhac"
                  >
                  </Field>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="IP">IP: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="IP"
                    type="text"
                    class="form-control"
                    v-model="server.IP"
                  >
                  </Field>
                  <ErrorMessage name="IP" class="error-feedback"></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="hdh">Hệ điều hành: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="hdh"
                    type="text"
                    class="form-control"
                    v-model="server.hdh"
                  >
                  </Field>
                  <ErrorMessage
                    name="hdh"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ram">RAM: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="ram"
                    type="text"
                    class="form-control"
                    v-model="server.ram"
                  >
                  </Field>
                  <ErrorMessage
                    name="ram"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ocung">Ổ cứng: </label>
                </div>
                <div class="col-7">
                  <Field
                    type="text"
                    name="ocung"
                    class="form-control"
                    style=""
                    v-model="server.ocung"
                  >
                  </Field>

                  <ErrorMessage
                    name="ocung"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="cardmanhinh">Card màn hình: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="cardmanhinh"
                    type="text"
                    class="form-control"
                    v-model="server.cardmanhinh"
                  >
                  </Field>
                  <ErrorMessage
                    name="cardmanhinh"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ghichu">Thông tin ghi chú: </label>
                </div>
                <div class="col-7">
                  <Field
                    rows="3"
                    as="textarea"
                    name="ghichu"
                    class="form-control"
                    style=""
                    v-model="server.ghichu"
                  >
                  </Field>

                  <ErrorMessage
                    name="ghichu"
                    class="error-feedback"
                  ></ErrorMessage>
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
              Thêm server
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

import ProjectShareForm from "@/components/ProjectShareForm.vue";

import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import ProjectService from "@/services/project.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    serverprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      IP: yup.string().required("IP không được để trống"),

      ten: yup.string().required("Tên không được để trống"),
    });

    return {
      form: false,
      FormSchema,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      server: this.serverprop,
      edit: this.e,
      nnMes: "",
      csdlMes: "",
    };
  },

  mounted() {
    console.log(this.server);
  },

  methods: {
    async create(data) {
      data.id=this.server.id;
      if (data.loai === "csdl") {
        data.ngonngu = "";
        data.moitruong = "";
        if (data.csdl === "") {
          this.csdlMes = "CSDL không được để trống";
          return;
        }
      }
      if (data.loai === "web" || data.loai === "app") {
        data.csdl = "";

        if (data.moitruong === "" || typeof(data.moitruong==='undefined')) {
          data.moitruong = "Không có thông tin";
        }
        console.log(data.moitruong);
        if (data.ngonngu === "") {
          this.nnMes = "Ngôn ngữ sử dụng không được để trống";
          return;
        }
      }
      if (data.pmkhac === "") {
        data.pmkhac = "Không có thông tin";
      }
      if (data.ghichu === "") {
        data.ghichu = "Không có thông tin";
      }
      if (data.ocung === "") {
        data.ocung = "Không có thông tin";
      }
      if (data.ram === "") {
        data.ram = "Không có thông tin";
      }
      if (data.cardmanhinh === "") {
        data.cardmanhinh = "Không có thông tin";
      }
      if (data.hdh === "") {
        data.hdh = "Không có thông tin";
      }
      if (this.edit === false) this.$emit("createServer", data);
      else {
        this.$emit("updateServer", data);
      }
      this.$emit("close");
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
  overflow-y: auto;
  overflow-x: hidden;
  height: 500px;
  background-color: white;
  padding: 20px;
}
</style>
