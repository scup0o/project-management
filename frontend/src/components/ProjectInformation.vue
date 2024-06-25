<template>
  <div class="modal-mask" v-if="this.editForm === false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label class="" style="margin: auto; font-size: 20px"
            >Thông tin dự án</label
          >
        </div>

        <div class="modal-body" style="margin-bottom: 3vh">
          <!--chỉnh view chính từ khúc này-->
          <div class="row spacing">
            <div class="col"><label for="Ma">Mã dự án: </label></div>
            <div class="col-8">
              <div>{{ project.Ma }}</div>
            </div>
          </div>

          <div class="row spacing">
            <div class="col"><label for="Ten">Tên dự án: </label></div>
            <div class="col-8">
              {{ project.Ten }}
            </div>
          </div>
          <div class="row spacing">
            <div class="col"><label for="Ten">Khách hàng: </label></div>
            <div class="col-8">
              {{ project.KhachHang }}
            </div>
          </div>
          <div class="row spacing">
            <div class="col"><label for="MoTa">Mô tả dự án: </label></div>
            <div class="col-8">
              {{ project.MoTa }}
            </div>
          </div>
          <div class="row spacing">
            <div class="col">
              <label for="TrangThai">Trạng thái: </label>
            </div>
            <div class="col-8">
              <p v-if="project.TrangThai === 'dangthuchien'">Đang thực hiện</p>
              <p v-if="project.TrangThai === 'hoanthanh'">Hoàn thành</p>
              <p v-if="project.TrangThai === 'tamdung'">Tạm dừng</p>
            </div>
          </div>
          <div class="row spacing">
            <div class="col">
              <label for="TrangThai">Gia hạn từ dự án: </label>
            </div>
            <div class="col-8">
              <p v-if="project.id_GiaHan === 0 || project.id_GiaHan === null">
                Không có
              </p>
              <p v-else>{{ project.DuAnGiaHan.Ten }}</p>
            </div>
          </div>
          <div class="row spacing">
            <div class="col"><label for="Nguoitao">Người tạo: </label></div>
            <div class="col-8">
              {{ project.NguoiTao.hoten }} ({{ project.NguoiTao.manhanvien }})
            </div>
          </div>
          <div class="row spacing">
            <div class="col">
              <label for="chucvu">Lần chỉnh sửa cuối:</label>
            </div>
            <div class="col-8">
              Vào lúc {{ format_datetime(project.ThoiGianChinhSuaLanCuoi) }} bởi
              {{ project.NguoiChinhSua.hoten }} ({{
                project.NguoiChinhSua.manhanvien
              }})
            </div>
          </div>
          <label for="chucvu">Thời gian đấu thầu:</label>
          <div class="row spacing">
            <div class="col">
              <div class="row">
                <div class="col-3">
                  <label for="ThoiGianBatDauDauThau">BĐ:</label>
                </div>
                <div class="col">
                  {{ format_date(project.ThoiGianBatDauDauThau) }}
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col-3">
                  <label for="ThoiGianKetThucDauThau" class="form-label"
                    >KT:</label
                  >
                </div>
                <div class="col">
                  {{ format_date(project.ThoiGianKetThucDauThau) }}
                </div>
              </div>
            </div>
          </div>
          <label for="chucvu">Thời gian dự án:</label>
          <div class="row spacing">
            <div class="col">
              <div class="row">
                <div class="col-3">
                  <label for="ThoiGIanBatDauDuAn" class="form-label">BĐ:</label>
                </div>
                <div class="col">
                  {{ format_date(project.ThoiGianBatDauDuAn) }}
                </div>
              </div>
            </div>
            <div class="col">
              <div class="row">
                <div class="col-3">
                  <label for="ThoiGianKetThucDuAn" class="form-label"
                    >KT:</label
                  >
                </div>
                <div class="col">
                  {{ format_date(project.ThoiGianKetThucDuAn) }}
                </div>
              </div>
            </div>
          </div>
          <div class="row spacing">
            <div class="col">
              <label for="ThoiGianNghiemThu">Thời gian nghiệm thu:</label>
            </div>
            <div class="col-7">
              {{ format_date(project.ThoiGianNghiemThu) }}
            </div>
          </div>
          <div class="row spacing">
            <div class="col">
              <label for="ThoiGianBaoHanh">Thời gian bảo hành:</label>
            </div>
            <div class="col-7">
              {{ format_date(project.ThoiGianBaoHanh) }}
              <p style="display: inline" v-if="project.ThoiHan!=0">
                ({{ project.ThoiHan }} {{ project.LoaiThoiHan }})
              </p>
            </div>
          </div>
          <label>Danh sách người tham gia</label>
          <div
            class="row text-center flex-nowrap"
            style="
              overflow-x: auto;
              padding-top: 2vh;
              height: 15vh;
              overflow-y: hidden;
            "
          >
            <div
              v-for="(user, index) in tglist"
              :key="user"
              class="col-2"
              style=""
            >
              <div class="row text-center">
                <div class="col-5">
                  <img
                    style="
                      display: inline-block;
                      width: 3vw;
                      height: 3vw;
                      border-radius: 100%;
                      margin: auto;
                    "
                    :src="`../../src/assets/img/${user.anhdaidien}`"
                  />

                  <div
                    style="
                      font-size: 14px;
                      padding-top: 0.5vh;
                      margin: auto;
                      text-align: center;
                    "
                  >
                    <p>{{ user.hoten.split(" ").pop() }}</p>
                    <p
                      style="
                        margin-top: -20px;
                        font-family: RalewayItalic;
                        font-size: 0.9vw;
                      "
                    >
                      ({{ user.manhanvien }})
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--chỉnh view chính tới khúc này-->
        </div>
        <div class="text-center">
          <button
            v-if="
              (project.e === true || type != 'chia se') &&
              this.user.chucvu != 'admin'
            "
            class="btn btn-dark"
            style="margin-right: 10px"
            type="submit"
            @click="checkData()"
          >
            Chỉnh sửa
          </button>
          <button
            @click="$emit('close')"
            class="btn btn-dark"
            style="margin-right: 10px"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <ProjectInfoForm
    v-if="editForm === true"
    @close="editForm = false"
    @refresh="
      $emit('close');
      $emit('refresh');
    "
    :e="true"
    :projectprop="project"
  ></ProjectInfoForm>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import moment from "moment";

import ProjectInfoForm from "@/components/ProjectInfoForm.vue";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import ProjectService from "@/services/project.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    ProjectInfoForm,
  },

  props: {
    projectprop: { type: Object, required: true },
    e: { type: Boolean, required: true },

    type: { type: String, required: true },
  },

  data() {
    const FormSchema = yup.object({});

    return {
      edit: this.e,
      project: this.projectprop,
      FormSchema,
      editForm: false,
      tglist: [],
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
    };
  },

  mounted() {
    this.getTG();
  },

  methods: {
    async getTG() {
      let temp = await ProjectService.getQuyen(this.project.id);

      let i = 0;
      while (i < temp.DS_TG.length) {
        temp.DS_TG[i] = await UserService.get(temp.DS_TG[i]);
        i++;
      }
      console.log(temp);
      this.tglist = temp.DS_TG;
    },

    async checkData() {
      this.editForm = true;
    },
    format_datetime(value) {
      if (value) {
        return moment(String(value)).format("hh:mm A, DD - MM - YYYY");
      }
    },

    format_date(value) {
      if (value) {
        return moment(String(value)).format("DD - MM - YYYY");
      }
    },

    async createAccount(data) {
      try {
      } catch (error) {
        console.log(error);
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
