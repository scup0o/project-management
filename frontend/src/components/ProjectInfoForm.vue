<template>
  <div class="modal-mask" v-if="this.next === false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Tạo dự án</label
          >
          <!--tiêu đề-->
          <label
            v-else
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Chỉnh sửa dự án</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="checkData" :validation-schema="FormSchema">
          <div class="modal-body" style="margin-bottom: 3vh">
            <!--chỉnh view chính từ khúc này-->
            <div class="row">
              <div class="form-group">
                <div class="row spacing">
                  <div class="col"><label for="Ma">Mã dự án: </label></div>
                  <div class="col-8">
                    <Field
                      name="Ma"
                      type="text"
                      class="form-control"
                      @click="MaMessage = ''"
                      v-model="project.Ma"
                    >
                    </Field>
                    <ErrorMessage
                      name="Ma"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p v-if="MaMessage != ''" class="error-feedback">
                      {{ MaMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col"><label for="Ten">Tên dự án: </label></div>
                  <div class="col-8">
                    <Field
                      name="Ten"
                      type="text"
                      class="form-control"
                      v-model="project.Ten"
                      @click="TenMessage = ''"
                    >
                    </Field>
                    <ErrorMessage
                      name="Ten"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p v-if="TenMessage != ''" class="error-feedback">
                      {{ TenMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col"><label for="MoTa">Mô tả dự án: </label></div>
                  <div class="col-8">
                    <Field
                      name="MoTa"
                      as="textarea"
                      row="3"
                      class="form-control"
                      v-model="project.MoTa"
                    >
                    </Field>
                    <ErrorMessage name="MoTa" style="color: red"></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="TrangThai">Trạng thái: </label>
                  </div>
                  <div class="col-8">
                    <div style="margin: auto">
                      <Field
                        name="TrangThai"
                        as="select"
                        value="dangthuchien"
                        class=""
                        v-model="project.TrangThai"
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
                        <option value="dangthuchien">Đang thực hiện</option>
                        <option value="hoanthanh">Hoàn thành</option>
                        <option value="tamdung">Tạm dừng</option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column flex-md-row spacing">
              <div class="form-group">
                <div class="row">
                  <label for="ThoiGianDauThau">Thời gian đấu thầu:</label>
                  <div class="row">
                    <div class="col-6">
                      <div class="row">
                        <div class="col">
                          <label for="ThoiGianBatDauDauThau" class="form-label"
                            >BĐ:</label
                          >
                        </div>
                        <div class="col-9">
                          <Field
                            type="datetime-local"
                            v-model="project.ThoiGianBatDauDauThau"
                            name="ThoiGianBatDauDauThau"
                            class="form-control"
                            @click="dauthauMessage = ''"
                          />
                          <ErrorMessage
                            name="ThoiGianBatDauDauThau"
                            class="error-feedback"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="row">
                        <div class="col">
                          <label for="ThoiGianKetThucDauThau" class="form-label"
                            >KT:</label
                          >
                        </div>
                        <div class="col-9">
                          <Field
                            type="datetime-local"
                            v-model="project.ThoiGianKetThucDauThau"
                            name="ThoiGianKetThucDauThau"
                            class="form-control"
                            style=""
                            @click="dauthauMessage = ''"
                          />
                          <ErrorMessage
                            name="ThoiGianKetThucDauThau"
                            class="error-feedback"
                          />
                        </div>
                      </div>
                    </div>
                    <p class="error-feedback">{{ dauthauMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column flex-md-row spacing">
              <div class="form-group">
                <div class="row">
                  <label for="ThoiGianBatDauDuAn">Thời gian dự án:</label>
                  <div class="row">
                    <div class="col-6">
                      <div class="row">
                        <div class="col">
                          <label for="ThoiGianBatDauDuAn" class="form-label"
                            >BĐ:</label
                          >
                        </div>
                        <div class="col-9">
                          <Field
                            type="datetime-local"
                            v-model="project.ThoiGianBatDauDuAn"
                            name="ThoiGianBatDauDuAn"
                            class="form-control"
                            @click="duanMessage = ''"
                          />
                          <ErrorMessage
                            name="ThoiGianBatDauDuAn"
                            class="error-feedback"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="row">
                        <div class="col">
                          <label for="ThoiGianKetThucDuAn" class="form-label"
                            >KT:</label
                          >
                        </div>
                        <div class="col-9">
                          <Field
                            type="datetime-local"
                            v-model="project.ThoiGianKetThucDuAn"
                            name="ThoiGianKetThucDuAn"
                            class="form-control"
                            style=""
                            @click="duanMessage = ''"
                          />
                          <ErrorMessage
                            name="ThoiGianKetThucDuAn"
                            class="error-feedback"
                          />
                        </div>
                      </div>
                    </div>
                    <p class="error-feedback">{{ duanMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="ThoiGianNghiemThu">Thời gian nghiệm thu:</label>
                  </div>
                  <div class="col-7">
                    <Field
                      type="datetime-local"
                      v-model="project.ThoiGianNghiemThu"
                      name="ThoiGianNghiemThu"
                      class="form-control"
                      @click="nghiemthuMessage = ''"
                    />
                    <ErrorMessage
                      name="ThoiGianNghiemThu"
                      class="error-feedback"
                    />
                  </div>
                  <p class="error-feedback">{{ nghiemthuMessage }}</p>
                </div>
              </div>
            </div>
            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="ThoiGianBaoHanh">Thời gian bảo hành:</label>
                  </div>
                  <div class="col-7">
                    <Field
                      type="datetime-local"
                      v-model="project.ThoiGianBaoHanh"
                      name="ThoiGianBaoHanh"
                      class="form-control"
                      @click="baohanhMessage = ''"
                    />
                    <ErrorMessage
                      name="ThoiGianBaoHanh"
                      class="error-feedback"
                    />
                  </div>
                  <p class="error-feedback">{{ baohanhMessage }}</p>
                </div>
              </div>
            </div>
            <!--chỉnh view chính tới khúc này-->
          </div>
          <div class="text-center">
            <button
              class="btn btn-dark"
              style="margin-right: 10px; width: 10vw"
              type="submit"
            >
              Tiếp tục
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
  <ProjectShareForm
    v-if="this.next === true"
    @close="this.next = false"
    @closeall="
      $emit('close');
      $emit('refresh');
      this.next = false;
    "
    :projectprop="project"
    :e="edit"
  ></ProjectShareForm>
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
    ProjectShareForm,
  },

  props: {
    projectprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      Ma: yup
        .string()
        .required("Mã không được để trống")
        .max(25, "Mã có nhiều nhất 25 ký tự."),

      Ten: yup.string().required("Tên dự án không được để trống"),

      MoTa: yup.string().max(500, "Mô tả tối đa 500 ký tự."),
      ThoiGianBaoHanh: yup
        .date()
        .required("Thời gian bảo hành không được để trống"),
      ThoiGianNghiemThu: yup
        .date()
        .required("Thời gian nghiệm thu không được để trống"),
    });

    return {
      type: "password",
      password: null,
      edit: this.e,
      project: this.projectprop,
      FormSchema,
      img: null,
      images: [],
      idMessage: "",
      haveData: true,
      user: null,
      passMess: "",
      imgop: false,
      TenMessage: "",
      MaMessage: "",
      next: false,
      dauthauMessage: "",
      duanMessage: "",
      nghiemthuMessage: "",
      baohanhMessage: "",
    };
  },

  mounted() {
    console.log(this.project);
  },

  methods: {
    async checkData(data) {
      if (typeof data.MoTa === "undefined" || data.MoTa === '') {
        data.Mota = "Không có mô tả";
      }
      console.log(data.MoTa);
      data.step = "check";
      let check = await ProjectService.create(data);
      if (check[0] === 1) this.MaMessage = "Mã dự án đã tồn tại";
      if (check[1] === 1) this.TenMessage = "Tên dự án đã tồn tại";
      if (check[0] === 0 && check[1] === 0) {
        let c = true;
        if (
          (data.ThoiGianBatDauDuAn === null ||
            data.ThoiGianBatDauDuAn === undefined) &&
          (data.ThoiGianKetThucDuAn === null ||
            data.ThoiGianKetThucDuAn === undefined)
        ) {
          this.duanMessage = "Thời gian dự án không được để trống";
          c = false;
        } else {
          if (data.ThoiGianBatDauDuAn >= data.ThoiGianKetThucDuAn) {
            this.duanMessage =
              "Thời gian bắt đầu dự án không thể sau thời gian kết thúc dự án";
            c = false;
          }
        }
        if (
          (data.ThoiGianBatDauDauThau === null ||
            data.ThoiGianBatDauDauThau === undefined) &&
          (data.ThoiGianKetThucDauThau === null ||
            data.ThoiGianKetThucDuAn === undefined)
        ) {
          this.dauthauMessage = "Thời gian đấu thầu không được để trống";
          c = false;
        } else {
          if (data.ThoiGianBatDauDauThau >= data.ThoiGianKetThucDauThau) {
            this.dauthauMessage =
              "Thời gian bắt đầu đấu thầu không thể sau thời gian kết thúc đấu thầu";
            c = false;
          }
        }
        if (data.ThoiGianNghiemThu >= data.ThoiGianBaoHanh) {
          this.baohanhMessage =
            "Thời gian bảo hành không thể trước thời gian nghiệm thu";
          c = false;
        }
        if (c === true) {
          this.next = true;
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
