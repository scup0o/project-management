<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" :class="{ wide: this.ilist.length > 0 }">
        <div class="modal-header">
          <label
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Thông tin cài đặt hệ thống</label
          >
        </div>
        <div class="modal-body" style="margin-bottom: 3vh">
          <div class="row">
            <div class="col">
              <div class="row" style="padding-top: 5px">
                <div class="col" style="padding-left: 3vw">
                  <div class="row d-flex justify-content-end">
                    <div
                      class="input-group"
                      style="width: 100%; padding-left: 0px"
                    >
                      <input
                        type="text"
                        class="form-control search-form icon-search"
                        style="background-color: var(--field-color)"
                        placeholder="Nhập đơn vị sử dụng cần tìm"
                        v-model="searchText"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="col-4 hover-i"
                  v-if="this.user.chucvu === 'kt' && this.project.e === true"
                  @click="form = true"
                >
                  <div class="row text-center">
                    <i class="fa-solid fa-square-plus"></i>
                  </div>
                  <div class="row">
                    <button
                      class="btn"
                      style="border: none; font-size: 1vw; margin-top: -8px"
                    >
                      Thêm hệ thống
                    </button>
                  </div>
                </div>
              </div>
              <label style="padding-left: 2vw">Danh sách hệ thống</label>
              <div
                v-if="ilist.length > 0"
                style="
                  height: 55vh;
                  direction: rtl;
                  text-align: left;
                  overflow-y: scroll;
                  overflow-x: hidden;
                "
              >
                <div class="row" style="padding-bottom:5px" v-for="(i, index) in ilist" :key="i">
                  <div
                    @click="editI=i"
                    class="card-render"
                    style=""
                    :class="{ active: this.editI.id === i.id }"
                  >
                    <div class="col">
                      <label>{{ i.DonViSuDung }}</label>
                      <p v-if="i.HienTrangHeThong==='hoanthanh'" style="margin-bottom:0px; font-family: RalewayItalic; color:gray">Hoàn thành</p>
                      <p v-else style="margin-bottom:0px; font-family: RalewayItalic; color:gray">Chưa hoàn thành</p>
                    </div>
                    <div class="col text-end" style="">
                      
                      <i @click="deleteI(i)" class="fa-solid fa-trash-can" id="util-icon" title="Xóa thông tin hệ thống" style="color: #e85454; padding-left:20px;" v-if="this.user.id===i.id_NguoiTao"></i>
                      <i @click="editform=true; editI=i" class="fa-solid fa-pen" id="util-icon" title="Cập nhật thông tin" style="padding-left:20px;"></i>
                      <i class="fa-solid fa-book" id="util-icon" title="Nhật ký lỗi và cập nhật"></i>
                    </div>
                  </div>
                </div>
              </div>
              <p
                v-else
                style="
                  font-family: 'RalewayItalic';
                  font-size: 2vh;
                  padding-left: 2vw;
                "
              >
                Không có hệ thống nào.
              </p>
            </div>
            <!--thong tin-->
            <div
              class="col-7"
              v-if="ilist.length > 0"
              style="background-color: rgb(233, 241, 252); border-radius: 10px"
            >
              <div class="box" style="">
                <div class="row text-center">
                  <label
                    style="
                      font-size: 1.3vw;
                      font-family: RalewayBlack;
                      padding-top: 15px;
                      padding-bottom: 15px;
                    "
                    >Thông tin</label
                  >
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="DonViSuDung">Người tạo: </label>
                    </div>
                    <div class="col-7">
                      {{ editI.NguoiTao.hoten }} ({{ editI.NguoiTao.manhanvien }})
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="DonViSuDung">Thời gian chỉnh sửa thông tin lần cuối: </label>
                    </div>
                    <div class="col-7">
                      Vào lúc {{ format_datetime(editI.ThoiGianCapNhat) }} bởi {{ editI.NguoiCapNhat.hoten }} ({{ editI.NguoiCapNhat.manhanvien }})
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="DonViSuDung">Đơn vị sử dụng: </label>
                    </div>
                    <div class="col-7">
                      {{ editI.DonViSuDung }}
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="HienTrangHeThong"
                        >Hiện trạng hệ thống:
                      </label>
                    </div>
                    <div class="col-7">
                      <p v-if="editI.HienTrangHeThong==='hoanthanh'">Hoàn thành</p>
                      <p v-else>Chưa hoàn thành <br>(<i>Thông tin ghi chú: </i>
                        <p style="display: inline;" v-if="editI.HienTrangHeThong!='chuahoanthanh()'">{{ editI.HienTrangHeThong.split('()')[1] }})</p>
                        <p style="display: inline;" v-else>Không có)</p>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="GhiChu">Ghi chú: </label>
                    </div>
                    <div class="col-7">
                      {{ editI.GhiChu }}
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="PhanMemNgoai">Các phần mềm ngoài: </label>
                    </div>
                    <div class="col-7">
                      {{ editI.PhanMemNgoai }}
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
                      {{ editI.NoiCaiDatSourceCode }}
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
                          style="width: 100%; padding-right: 40px"
                        >
                          <input
                            type="text"
                            class="form-control search-form icon-search"
                            style="background-color: var(--field-color)"
                            placeholder="Nhập server cần tìm"
                            v-model="searchS"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="row"
                    style="height: 30vh; overflow-y: auto; padding-top: 5px"
                  >
                    <div v-if="editI.DSServer.length > 0">
                      <div class="row">
                        <div class="row text-center">
                          <div class="col-3" style="margin: auto">
                            <label style="font-size: 1vw; color: gray"
                              >Tên Server</label
                            >
                          </div>
                          <div class="col-3" style="margin: auto">
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
                        v-for="(s, i) in editI.DSServer"
                        :key="s"
                        style="padding-bottom: 5px"
                      >
                        <div
                          class="card row"
                          v-if="
                            s.ten
                              .toLowerCase()
                              .includes(this.searchS.toLowerCase())
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
                            <div
                              class="col-1 text-end d-flex justify-content-center"
                              style=""
                            >
                              <i
                                class="fa-solid fa-circle-info"
                                id="util-icon"
                                @click="
                                  info = true;
                                  editServer = s;
                                  editIndex = i;
                                "
                                title="Thông tin Server"
                                style="margin: auto"
                              ></i>
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
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button
            @click="$emit('close')"
            class="btn btn-dark"
            style="width: 10vw"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <InformationForm
    v-if="editform === true"
    :iprop="editI"
    :e="true"
    @close="editform = false"
    @refresh="
      editform = false;
      this.retrieveI();
    "
  >
  </InformationForm>
  <InformationForm
    v-if="form === true"
    :iprop="{
      id_DuAn: this.project.id,
      DSServer: [],
      GhiChu: '',
      PhanMemNgoai: '',
      NoiCaiDatSourceCode: '',
    }"
    :e="false"
    @close="form = false"
    @refresh="
      form = false;
      this.retrieveI();
    "
  >
  </InformationForm>
  <ServerInformation
    v-if="info === true"
    :serverprop="editServer"
    :e="this.project.e"
    :d="true"
    @close="info = false"
    @refresh="this.retrieveI(); info = false"
  >
  </ServerInformation>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import ServerInformation from "@/components/ServerInformation.vue";
import SettingiService from "@/services/settingi.service";
import moment from "moment";
import InformationForm from "@/components/InformationForm.vue";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    InformationForm,
    ServerInformation
  },

  props: {
    projectprop: { type: Object, required: true },
  },

  data() {
    return {
      editform:false,
      ilist: [],
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      searchText: "",
      project: this.projectprop,
      form: false,
      editI: null,
      searchS: "",
      info:false,
      editServer:null,
      editIndex:0,
    };
  },

  mounted() {
    this.retrieveI();
  },

  methods: {
    async deleteI(data){
      if (confirm('Bạn có chắc muốn xóa?')){
        let check = await SettingiService.delete(data.id);
        if (check === true) {
          this.$toast.open({
            message: "Thông tin hệ thống đã được cập nhật",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
        this.retrieveI()
        }
      }
      
    },

    async retrieveI() {
      this.ilist = await SettingiService.getAll(this.project.id);
      this.editI = this.ilist[0];
      console.log(this.ilist);
    },

    format_datetime(value) {
      if (value) {
        return moment(String(value)).format("hh:mm A, DD - MM - YYYY");
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

.modal-container {
  width: 35vw;
  margin: 0px auto;
  padding: 20px 20px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;

  /*background-color: rgb(196, 219, 219);*/
}

.wide {
  width: 70vw;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
  overflow-y: hidden;
  overflow-x: hidden;
  height: 500px;
  background-color: white;
  padding-top: 0px;
}

.icon-filter {
  background: url("../assets/img/filter-solid.svg") no-repeat right;
  background-size: 2.5vh;
  background-position: 0vh;
}

.icon-search {
  padding-left: 3vw;

  background: url("../assets/img/magnifying-glass-solid.svg") no-repeat left;
  background-size: 2vh;
  background-position: 2vh;
}

.card {
  width: 100%;
  border-bottom: 1px solid rgb(192, 192, 192);
  max-height: fit-content;
}

.card-render {
  padding-left:20px;
  padding-right:20px;
  padding-top:10px;
  padding-bottom:10px;
  width: 90%;
  margin-right: 15px;
  z-index: 99;
  background-color: rgb(255, 255, 255);
  border:1px solid rgb(221, 221, 221);
  border-radius: 10px;
}

.card-render:hover{
  transform: scale(1.001);
  background-color: rgb(238, 238, 238);
}

.active {
  background-color: var(--search-color);
  border:none;
}

.hover-i:hover {
  transform: scale(1.2);
}

.box {
  padding-left: 20px;
  padding-right: 10px;
  overflow-y: scroll;
  height: 65vh;
  overflow-x: hidden;
  background-color: rgb(233, 241, 252);
  border-radius: 10px;
}

#util-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.card:hover {
  transform: scale(1.001);
  background-color: rgb(238, 238, 238);
}
</style>
