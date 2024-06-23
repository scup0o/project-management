<template>
  <div class="modal-mask" v-if="form === false && info === false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Thêm hệ thống</label
          >
          <!--tiêu đề-->
          <label
            v-else
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Chỉnh sửa hệ thống</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="create" :validation-schema="FormSchema">
          <div class="modal-body" style="margin-bottom: 3vh">
            <!--chỉnh view chính từ khúc này-->
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="DonViSuDung">Đơn vị sử dụng: </label>
                </div>
                <div class="col-7">
                  <Field
                    name="DonViSuDung"
                    type="text"
                    class="form-control"
                    v-model="i.DonViSuDung"
                  >
                  </Field>
                  <ErrorMessage
                    name="DonViSuDung"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="HienTrangHeThong">Hiện trạng hệ thống: </label>
                </div>
                <div class="col-7">
                  <Field
                    as="select"
                    name="HienTrangHeThong"
                    value="hoanthanh"
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
                    v-model="i.HienTrangHeThong"
                    ><option value="hoanthanh">Hoàn thành</option>
                    <option value="chuahoanthanh">Chưa hoàn thành</option>
                  </Field>

                  <ErrorMessage
                    name="HienTrangHeThong"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div
              class="form-group"
              v-if="i.HienTrangHeThong === 'chuahoanthanh'"
            >
              <div class="row spacing">
                <div class="col">
                  <label for="HienTrang"
                    >Các việc đã hoàn thành và chưa hoàn thành:
                  </label>
                </div>
                <div class="col-7">
                  <Field
                    rows="3"
                    as="textarea"
                    name="HienTrang"
                    class="form-control"
                    style=""
                    v-model="HienTrang"
                  >
                  </Field>

                  <ErrorMessage
                    name="HienTrang"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="GhiChu">Ghi chú: </label>
                </div>
                <div class="col-7">
                  <Field
                    rows="3"
                    as="textarea"
                    name="GhiChu"
                    class="form-control"
                    style=""
                    v-model="i.GhiChu"
                  >
                  </Field>

                  <ErrorMessage
                    name="GhiChu"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="PhanMemNgoai">Các phần mềm ngoài: </label>
                </div>
                <div class="col-7">
                  <Field
                    rows="3"
                    as="textarea"
                    name="PhanMemNgoai"
                    class="form-control"
                    style=""
                    v-model="i.PhanMemNgoai"
                  >
                  </Field>

                  <ErrorMessage
                    name="PhanMemNgoai"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="NoiCaiDatSourceCode"
                    >Nơi cài đặt source code:
                  </label>
                </div>
                <div class="col-7">
                  <Field
                    rows="2"
                    as="textarea"
                    name="NoiCaiDatSourceCode"
                    class="form-control"
                    style=""
                    v-model="i.NoiCaiDatSourceCode"
                  >
                  </Field>

                  <ErrorMessage
                    name="NoiCaiDatSourceCode"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <label for="NoiCaiDatSourceCode">Danh sách server: </label>
              </div>
              <div class="row">
                <div class="col">
                  <div class="row d-flex justify-content-end">
                    <div
                      class="input-group"
                      style="width: 100%; padding-left: 0px"
                    >
                      <input
                        type="text"
                        class="form-control search-form icon-search"
                        style="background-color: var(--field-color)"
                        placeholder="Nhập server cần tìm"
                        v-model="searchText"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-3 hover-i" @click="form = true">
                  <div class="row text-center">
                    <i class="fa-solid fa-square-plus"></i>
                  </div>
                  <div class="row">
                    <button
                      class="btn"
                      style="border: none; font-size: 1vw; margin-top: -8px"
                    >
                      Thêm server
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="row"
                style="height: 30vh; overflow-y: auto; padding-top: 5px"
              >
                <div v-if="i.DSServer.length > 0">
                  <div class="row">
                    <div class="row text-center">
                      <div class="col-3" style="margin: auto">
                        <label style="font-size: 1vw; color: gray"
                          >Tên Server</label
                        >
                      </div>
                      <div class="col-4" style="margin: auto">
                        <label style="font-size: 1vw; color: gray"
                          >IP Server</label
                        >
                      </div>
                      <div class="col-3" style="margin: auto">
                        <label style="font-size: 1vw; color: gray"
                          >Loại Server</label
                        >
                      </div>
                      <div class="col-1 text-end" style=""></div>
                    </div>
                  </div>
                  <div
                    v-for="(s, i) in i.DSServer"
                    :key="s"
                    style="padding-bottom: 5px"
                  >
                    <div
                      class="card row"
                      v-if="
                        s.ten
                          .toLowerCase()
                          .includes(this.searchText.toLowerCase())
                      "
                    >
                      <div class="row text-center">
                        <div class="col-3" style="margin: auto">
                          {{ s.ten }}
                        </div>
                        <div class="col-4" style="margin: auto">
                          {{ s.IP }}
                        </div>
                        <div
                          class="col-3"
                          style="margin: auto; padding-top: 15px"
                        >
                          <p v-if="s.loai === 'csdl'">Cơ sở dữ liệu</p>
                          <p v-if="s.loai === 'web'">Web</p>
                          <p v-if="s.loai === 'app'">App</p>
                          <p v-if="s.loai === 'khac'">Khác</p>
                        </div>
                        <div class="col-1 text-end" style="">
                          <div class="row">
                            <i
                              class="fa-regular fa-circle-xmark"
                              style="color: #b8b8b8; padding-top: 10px"
                              id="util-icon"
                              title="Xóa server"
                              @click="deleteServer(i)"
                            ></i>
                          </div>
                          <div class="row">
                            <i
                              class="fa-solid fa-circle-info"
                              id="util-icon"
                              @click="
                                info = true;
                                editServer = s;
                                editIndex = i;
                              "
                              title="Thông tin Server"
                              style="padding-top: 10px; padding-bottom: 10px"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p
                  v-else
                  style="
                    font-family: 'RalewayItalic';
                    font-size: 2vh;
                    padding-left: 0.6vw;
                  "
                >
                  Không có server nào.
                </p>
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
              Thêm hệ thống
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
  <ServerForm
    :serverprop="{
      id:0,
      pmkhac: '',
      moitruong: '',
      csdl: '',
      ngonngu: '',
      ghichu: '',
      ocung: '',
      ram: '',
      cardmanhinh: '',
      hdh: '',
      id_HT: 0,
    }"
    :e="false"
    @close="form = false"
    v-if="form === true"
    @createServer="addServer"
  ></ServerForm>
  <ServerInformation
    @updateServer="updateServer"
    v-if="info === true"
    :serverprop="editServer"
    :e="true"
    @close="info = false"
  >
  </ServerInformation>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

import ServerForm from "@/components/ServerForm.vue";
import ServerInformation from "@/components/ServerInformation.vue";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import SettingiService from "@/services/settingi.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    ServerForm,
    ServerInformation,
  },

  props: {
    iprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      DonViSuDung: yup.string().required("Đơn vị sử dụng không được để trống"),
    });

    return {
      editIndex: 0,
      form: false,
      editServer: null,
      info: false,
      FormSchema,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      i: this.iprop,
      HienTrang: "",
      edit: this.e,
      searchText: "",
    };
  },

  mounted() {
    console.log(this.i);
  },

  methods: {
    async create(data) {
      this.i.server = this.i.DSServer.length;
      if (data.HienTrangHeThong === "chuahoanthanh") {
        this.i.HienTrangHeThong = data.HienTrangHeThong + "()" + this.HienTrang;
      } else {
        this.i.HienTrangHeThong = data.HienTrangHeThong;
      }
      if (this.i.GhiChu === "") this.i.GhiChu = "Không có thông tin";
      if (this.i.PhanMemNgoai === "")
        this.i.PhanMemNgoai = "Không có thông tin";
      if (this.i.NoiCaiDatSourceCode === "")
        this.i.NoiCaiDatSourceCode = "Không có thông tin";
      if (this.edit === false) {
        this.i.id_NguoiTao = this.user.id;
        this.i.id_NguoiCapNhat = this.user.id;
        let check = await SettingiService.create(this.i);
        if (check === true) {
          this.$toast.open({
            message: "Thông tin hệ thống đã được cập nhật",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          this.$emit("refresh");
        }
      }
      else{
        this.i.id_NguoiCapNhat = this.user.id;
        let check = await SettingiService.update(this.i);
        if (check === true) {
          this.$toast.open({
            message: "Thông tin hệ thống đã được cập nhật",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          this.$emit("refresh");
        }
      }
    },

    updateServer(data) {
      console.log(data);
      this.i.DSServer[this.editIndex] = data;
    },
    addServer(data) {
      console.log(data);
      this.i.DSServer.push(data);
    },

    deleteServer(index) {
      if (confirm(`Xóa server ${this.i.DSServer[index].ten}?`))
        this.i.DSServer.splice(index, 1);
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
  height: 500px;
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
