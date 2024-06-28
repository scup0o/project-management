<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            v-if="edit === false"
            >Thêm 
            <p v-if="cataTab === 'ngonngu'" style="display: inline">ngôn ngữ</p>
            <p style="display: inline" v-if="cataTab === 'moitruong'">
              môi trường
            </p>
            <p style="display: inline" v-if="cataTab === 'csdl'">
              cơ sở dữ liệu
            </p>
            <p style="display: inline" v-if="cataTab === 'loaitailieu'">
              loại tài liệu
            </p></label
          >
          <label
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            v-else
            >Chỉnh sửa
            <p v-if="cataTab === 'ngonngu'" style="display: inline">ngôn ngữ</p>
            <p style="display: inline" v-if="cataTab === 'moitruong'">
              môi trường
            </p>
            <p style="display: inline" v-if="cataTab === 'csdl'">
              cơ sở dữ liệu
            </p>
            <p style="display: inline" v-if="cataTab === 'loaitailieu'">
              loại tài liệu
            </p></label
          >
        </div>
        <Form @submit="createDoctype" :validation-schema="FormSchema">
          <div class="modal-body">
            <div class="row">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="ten"
                      >Tên
                      <p v-if="cataTab === 'ngonngu'" style="display: inline">
                        ngôn ngữ
                      </p>
                      <p style="display: inline" v-if="cataTab === 'moitruong'">
                        môi trường
                      </p>
                      <p style="display: inline" v-if="cataTab === 'csdl'">
                        cơ sở dữ liệu
                      </p>
                      <p
                        style="display: inline"
                        v-if="cataTab === 'loaitailieu'"
                      >
                        loại tài liệu
                      </p>
                      :
                    </label>
                    <p class="dot">(*)</p>
                  </div>
                  <div class="col-7">
                    <Field
                      name="ten"
                      type="text"
                      class="form-control"
                      v-model="doctypeNew.ten"
                    >
                    </Field>
                    <ErrorMessage
                      name="ten"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p class="error-feedback">{{ nameMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" v-if="cataTab === 'loaitailieu'">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="giaiDoan">Giai đoạn: </label>
                    <p class="dot">(*)</p>
                  </div>
                  <div class="col-7">
                    <Field
                      onfocus="this.size=10;"
                      onblur="this.size=1;"
                      onchange="this.size=1; this.blur();"
                      name="giaiDoan"
                      as="select"
                      class=""
                      v-model="giaiDoan"
                      style="
                        width: 100%;
                        border-width: 1.55px;
                        border-color: var(--secondary-color);
                        box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                        min-height: 5vh;
                        max-height: 8vh;
                        overflow-y: auto;
                        border-radius: 5px 5px 5px 5px;
                        text-align: center;
                      "
                    >
                      <option value="truocdauthau">Trước đấu thầu</option>
                      <option value="saudauthau">Sau đấu thầu</option>
                      <option value="baohanh">Bảo hành bảo trì</option>
                      <option value="khac">Loại tài liệu khác</option>
                    </Field>
                    <ErrorMessage
                      name="giaiDoan"
                      class="error-feedback"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
            <!--<div class="row" style="padding-top:3vh">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label>Loại: </label>
                    <p class="dot">(*)</p>
                  </div>
                  <div class="col-8">
                    <Field
                      onfocus="this.size=10;"
                      onblur="this.size=1;"
                      onchange="this.size=1; this.blur();"
                      name="loai"
                      as="select"
                      class=""
                      v-model="doctypeNew.loai"
                      style="
                        width: 100%;
                        border-width: 1.55px;
                        border-color: var(--secondary-color);
                        box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                        min-height: 5vh;
                        max-height: 10vh;
                        overflow-y: auto;
                        border-radius: 5px 5px 5px 5px;
                        text-align: center;
                      "
                    >
                      <option value="loaitailieu">Loại tài liệu</option>
                      <option value="moitruong">Môi trường</option>
                      <option value="ngonngu">Ngôn ngữ</option>
                      <option value="csdl">Cơ sở dữ liệu</option>
                    </Field>
                    <ErrorMessage
                      name="loai"
                      class="error-feedback"
                    ></ErrorMessage>
                  </div>
                </div>
              </div></div>-->
          </div>
          <div class="text-center">
            <button
              v-if="edit === false"
              class="btn btn-dark"
              style="margin-right: 10px"
            >
              Thêm
              <p v-if="cataTab === 'ngonngu'" style="display: inline">
                ngôn ngữ
              </p>
              <p style="display: inline" v-if="cataTab === 'moitruong'">
                môi trường
              </p>
              <p style="display: inline" v-if="cataTab === 'csdl'">
                cơ sở dữ liệu
              </p>
            </button>
            <button v-else class="btn btn-dark" style="margin-right: 10px">
              Lưu
              <p v-if="cataTab === 'ngonngu'" style="display: inline">
                ngôn ngữ
              </p>
              <p style="display: inline" v-if="cataTab === 'moitruong'">
                môi trường
              </p>
              <p style="display: inline" v-if="cataTab === 'csdl'">
                cơ sở dữ liệu
              </p>
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
import DoctypeService from "@/services/doctype.service";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    doctype: { type: Object, required: true },
    e: { type: Boolean, required: true },
    cataTab: { type: String, required: true },
  },

  data() {
    const FormSchema = yup.object({
      ten: yup
        .string()
        .required("Tên không được để trống")
        .max(45, "Tên có nhiều nhất 45 ký tự."),
    });

    return {
      edit: this.e,
      doctypeNew: this.doctype,
      FormSchema,
      img: null,
      images: [],
      nameMessage: "",
      haveData: true,
      giaiDoan: '',
    };
  },

  mounted() {
    if (this.edit === false && this.cataTab==='loaitailieu') {
      this.giaiDoan = "truocdauthau";
    }
    else{
      this.giaiDoan = new String(this.doctype.giaiDoan)
    }
    console.log(this.doctypeNew.giaiDoan);
  },

  methods: {
    async createDoctype(data) {
      try {
        let cata = "ngôn ngữ";
        if (this.cataTab === "moitruong") cata = "môi trường";
        if (this.cataTab === "csdl") cata = "cơ sở dữ liệu";
        if (this.cataTab === "loaitailieu") cata = "loại tài liệu";
        data.loai = this.cataTab;
        console.log("click");
        if (this.edit === false) {
          const check = await DoctypeService.create(data);
          if (check === false) {
            this.nameMessage = `Tên ${cata} đã tồn tại`;
          } else {
            this.$toast.open({
              message: `Thêm ${cata} thành công`,
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("close");
            this.$emit("refresh");
          }
        } else {
          data.id = this.doctypeNew.id;
          const check = await DoctypeService.update(data);
          if (check === false) {
            this.nameMessage = `Tên ${cata} đã tồn tại`;
          } else {
            this.$toast.open({
              message: `Chỉnh sửa ${cata} thành công`,
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("close");
            this.$emit("refresh");
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
  width: 550px;
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
.long {
  height: 200px;
}
.modal-body {
  margin: 20px 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: white;
  padding: 20px;
}
</style>
