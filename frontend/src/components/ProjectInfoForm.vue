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
                  <div class="col">
                    <label for="Ma"
                      >Mã dự án:
                      <p class="dot">(*)</p></label
                    >
                  </div>
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
                  <div class="col">
                    <label for="Ten"
                      >Tên dự án:
                      <p class="dot">(*)</p></label
                    >
                  </div>
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
                  <div class="col">
                    <label for="KhachHang">Khách hàng: </label>
                  </div>
                  <div class="col-8">
                    <Field
                      name="KhachHang"
                      type="text"
                      class="form-control"
                      v-model="project.KhachHang"
                    >
                    </Field>
                    <ErrorMessage
                      name="KhachHang"
                      class="error-feedback"
                    ></ErrorMessage>
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
                        v-model="TrangThai"
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
                        <option value="huy">Hủy</option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="id_GiaHan">Gia hạn từ dự án: </label>
                  </div>
                  <div class="col-8">
                    <div style="margin: auto">
                      <Field
                        onfocus="this.size=10;"
                        onblur="this.size=1;"
                        onchange="this.size=1; this.blur();"
                        name="id_GiaHan"
                        as="select"
                        class=""
                        :value="0"
                        v-model="project.id_GiaHan"
                        style="
                          width: 100%;
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          min-height: 5vh;
                          max-height: 8vh;
                          overflow-y: auto;
                          position: absolute;
                          width: 22vw;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                      >
                        <option :value="0">Không có</option>
                        <option :value="p.id" v-for="(p, i) in plist">
                          <p v-snip="{ lines: 1 }" style="width: 50px">
                            {{ p.Ten }}
                          </p>
                        </option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row spacing">
              <div class="form-group">
                <div class="row">
                  <div class="col"><label for="MoTa">Ghi chú: </label></div>
                  <div class="col-8">
                    <Field
                      name="GhiChu"
                      as="textarea"
                      row="3"
                      class="form-control"
                      v-model="project.GhiChu"
                    >
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column flex-md-row spacing">
              <div class="form-group">
                <div class="row">
                  <label for="ThoiGianDauThau"
                    >Thời gian đấu thầu:
                    <p class="dot">(*)</p></label
                  >
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
                            type="date"
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
                            type="date"
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
                  <label for="ThoiGianBatDauDuAn"
                    >Thời gian dự án:
                    <p class="dot">(*)</p></label
                  >
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
                            type="date"
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
                            type="date"
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
                    <label for="ThoiGianNghiemThu"
                      >Thời gian nghiệm thu:
                      <p class="dot">(*)</p></label
                    >
                  </div>
                  <div class="col-7">
                    <Field
                      type="date"
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
            <div class="row spacing" v-if="date === false">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="ThoiGianBaoHanh"
                      >Thời gian bảo hành:
                      <p class="dot">(*)</p></label
                    >
                  </div>
                  <div class="col-3">
                    <Field
                      type="number"
                      v-model="project.ThoiHan"
                      name="ThoiHan"
                      class="form-control"
                    />
                  </div>

                  <div class="col-4">
                    <Field
                      as="select"
                      v-model="project.LoaiThoiHan"
                      value="tháng"
                      name="LoaiThoiHan"
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
                      @click="baohanhMessage = ''"
                    >
                      <option value="ngày">Ngày</option>
                      <option value="tháng">Tháng</option>
                      <option value="năm">Năm</option>
                    </Field>
                  </div>
                  <div class="row" style="padding-top: 10px">
                    <div class="col-5"></div>
                    <div class="col">
                      <p class="error-feedback" v-if="baohanhMessage != ''">
                        {{ baohanhMessage }}
                      </p>
                      <p
                        class="c"
                        style="margin-left: 10px"
                        @click="date = true"
                      >
                        Chọn ngày cụ thể
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row spacing" v-if="date === true">
              <div class="form-group">
                <div class="row">
                  <div class="col">
                    <label for="ThoiGianBaoHanh">Thời gian bảo hành:</label>
                  </div>
                  <div class="col-7">
                    <Field
                      type="date"
                      v-model="project.ThoiGianBaoHanh"
                      name="ThoiGianBaoHanh"
                      class="form-control"
                      @click="baohanhMessage = ''"
                    />
                    <ErrorMessage
                      name="ThoiGianBaoHanh"
                      class="error-feedback"
                    />
                    <p class="error-feedback">{{ baohanhMessage }}</p>
                    <div class="c" style="" @click="date = false">
                      Chọn thời hạn
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!--chỉnh view chính tới khúc này-->
          </div>
          <div class="text-center">
            <button
              v-if="project.id_NguoiTao === user.id || this.edit === false"
              class="btn btn-dark"
              style="margin-right: 10px; width: 10vw"
              type="submit"
              @click="
      dauthauMessage='',
      duanMessage='',
      nghiemthuMessage='',
      baohanhMessage='',
      TenMessage='',
      MaMessage=''"
            >
              Tiếp tục
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
import moment from "moment";

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
      ThoiHan: yup.number().min(1, "Thời hạn phải > 0"),
      ThoiGianNghiemThu: yup
        .date()
        .required("Thời gian nghiệm thu không được để trống"),
    });

    return {
      date: false,
      edit: this.e,
      project: this.projectprop,
      FormSchema,
      idMessage: "",
      haveData: true,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      TrangThai: new String(this.projectprop.TrangThai),
      TenMessage: "",
      MaMessage: "",
      next: false,
      dauthauMessage: "",
      duanMessage: "",
      nghiemthuMessage: "",
      baohanhMessage: "",

      plist: "",
    };
  },

  mounted() {
    if (this.edit === false) {
      this.project.LoaiThoiHan = "tháng";
    } else {
      if (this.project.ThoiHan === 0) {
        this.date = true;
      }
    }
    console.log(this.project);
    this.getp();
    console.log(this.plist);
  },

  methods: {
    async getp() {
      this.plist = await ProjectService.getType("chia se", this.user);
    },
    async checkData(data) {
      console.log(data);
      if (data.ThoiGianNghiemThu != null) {
        if (data.LoaiThoiHan === "tháng") {
          data.ThoiGianBaoHanh = new Date(
            new Date(data.ThoiGianNghiemThu).getTime() +
              data.ThoiHan * 30 * 86400000
          ).toLocaleDateString();
        }
        if (data.LoaiThoiHan === "ngày") {
          data.ThoiGianBaoHanh = new Date(
            new Date(data.ThoiGianNghiemThu).getTime() + data.ThoiHan * 86400000
          ).toLocaleDateString();
        }
        if (data.LoaiThoiHan === "năm") {
          data.ThoiGianBaoHanh = new Date(
            new Date(data.ThoiGianNghiemThu).getTime() +
              data.ThoiHan * 365 * 86400000
          ).toLocaleDateString();
        }
        data.ThoiGianBaoHanh = moment(data.ThoiGianBaoHanh).format(
          "YYYY-MM-DD"
        );
        this.project.ThoiGianBaoHanh = data.ThoiGianBaoHanh;
      }

      if (this.date === false) {
        this.project.LoaiThoiHan = data.LoaiThoiHan;
        this.project.ThoiHan = data.ThoiHan;
      } else {
        data.LoaiThoiHan = "";
        data.ThoiHan = 0;
        this.project.LoaiThoiHan = "";
        this.project.ThoiHan = 0;
      }

      if (typeof data.MoTa === "undefined" || data.MoTa === "") {
        data.Mota = "Không có mô tả";
      }
      if (
          typeof data.GhiChu === "undefined" ||
          data.GhiChu === null ||
          data.GhiChu === "" ||
          data.GhiChu.length === 0
        ) {
          data.GhiChu = "Không có";
        }
        
      data.step = "check";
      data.TrangThai = this.TrangThai;
      let check;
      if (this.edit === false) check = await ProjectService.create(data);
      else {
        data.id = this.project.id;
        check = await ProjectService.update(data);
      }
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
          this.duanMessage = "Thời gian dự án không thể để trống";
          c = false;
        } else {
          if (data.ThoiGianBatDauDuAn >= data.ThoiGianKetThucDuAn) {
            this.duanMessage =
              "Thời gian bắt đầu dự án không thể sau thời gian kết thúc dự án";
            c = false;
          } else {
            if (data.ThoiGianBatDauDuAn > data.ThoiGianNghiemThu) {
              this.duanMessage =
                "Thời gian bắt đầu dự án không thể sau thời gian nghiệm thu";
              c = false;
            }
          }
        }
        if (
          (data.ThoiGianBatDauDauThau === null ||
            data.ThoiGianBatDauDauThau === undefined) &&
          (data.ThoiGianKetThucDauThau === null ||
            data.ThoiGianKetThucDuAn === undefined)
        ) {
          this.dauthauMessage = "Thời gian đấu thầu không thể để trống";
          c = false;
        } else {
          if (data.ThoiGianBatDauDauThau >= data.ThoiGianKetThucDauThau) {
            this.dauthauMessage =
              "Thời gian bắt đầu đấu thầu không thể sau thời gian kết thúc đấu thầu";
            c = false;
          }
          if (data.ThoiGianBatDauDauThau > data.ThoiGianNghiemThu) {
            this.dauthauMessage =
              "Thời gian bắt đầu đấu thầu không thể sau thời gian nghiệm thu";
            c = false;
          } else {
            if (
              data.ThoiGianBatDauDuAn > data.ThoiGianBatDauDauThau ||
              data.ThoiGianKetThucDuAn < data.ThoiGianKetThucDauThau
            ) {
              this.dauthauMessage =
                "Thời gian đấu thầu phải nằm trong thời gian dự án";
              c = false;
            }
          }
        }
        if (
          data.ThoiGianBaoHanh === null ||
          data.ThoiGianBaoHanh === undefined
        ) {
          this.baohanhMessage = "Thời gian bảo hành không được để trống";
          return;
        }
        if (
          (new Date(data.ThoiGianBaoHanh) - new Date(data.ThoiGianNghiemThu)) /
            (1000 * 3600 * 24) /
            30 <
          3
        ) {
          this.baohanhMessage =
            "Thời gian bảo hành phải sau thời gian nghiệm thu 3 tháng";
          c = false;
        }

        if (c === true) {
          if (this.edit === true && this.project.id_NguoiTao === this.user.id) {
            console.log("next");
          }
          if (
            this.edit === false ||
            this.project.id_NguoiTao === this.user.id
          ) {
            this.project.tempTrangThai = this.TrangThai;
            this.next = true;
          } else {
            data.step = "update";
            data.id_NguoiChinhSuaLanCuoi = this.user.id;
            check = await ProjectService.update(data);
            this.$toast.open({
              message: "Chỉnh sửa dự án thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });

            this.$emit("close");
            this.$emit("refresh");
          }
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

.c:hover {
  cursor: pointer;
  text-decoration: underline;
  font-family: RalewayItalic;
}
</style>
