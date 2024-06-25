<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" :class="{ wide: this.ilist.length > 0 }">
        <div class="modal-header">
          <label
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Nhật ký lỗi và cập nhật hệ thống</label
          >
        </div>
        <div class="modal-body" style="margin-bottom: 3vh">
          <div class="row">
            <div class="col">
              <div class="row" style="padding-top: 5px">
                <div class="col-8" style="padding-left: 3vw">
                  <div class="row d-flex justify-content-end">
                    <div
                      class="input-group"
                      style="width: 100%; padding-left: 0px"
                    >
                      <input
                        type="text"
                        class="form-control search-form icon-search"
                        style="background-color: var(--field-color)"
                        placeholder="Tìm kiếm"
                        v-model="searchText"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-1">
                  <select
                    v-model="filter"
                    style="
                      border-width: 1.55px;
                      width: 6vw;
                      border-color: var(--secondary-color);
                      box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                      height: 5vh;
                      border-radius: 5px 5px 5px 5px;
                      text-align: center;
                    "
                  >
                    <option value="">Tất cả</option>
                    <option value="loi">Lỗi</option>
                    <option value="cap nhat">Cập nhật</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
              </div>
              <div class="row" style="padding-top: 2vh">
                <div class="col-8">
                  <label style="padding-left: 2vw"
                    >Danh sách các cập nhật và lỗi</label
                  >
                </div>
                <div
                  class="col-4 hover-i"
                  v-if="this.user.chucvu != 'admin' && this.edit === true"
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
                      Tạo nhật ký mới
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-if="ilist.length > 0"
                style="
                padding-left:30px;
                  height: 53vh;
                  overflow-y: scroll;
                  overflow-x: hidden;
                "
              >
                <div
                  class="row"
                  style="padding-bottom: 5px"
                  v-for="(i, index) in ilist"
                  :key="i"
                >
                  <div
                  v-if="
                              i.ten.toLowerCase()
                              .includes(this.searchText.toLowerCase()) && i.loai.toLowerCase()
                              .includes(this.filter)"
                    @click="editI = i"
                    class="card-render"
                    style=""
                    :class="{
                      active: this.editI.id === i.id,
                      errorsolve: i.loai === 'loi' && i.khacphuc != '',
                      error: i.loai === 'loi' && i.khacphuc === '',
                    }"
                  >
                    <div class="col">
                      <label style="color:gray; padding-top:0">{{ format_datetime(i.ngaytao) }}</label>
                      <div class="row" style="margin-top:-10px"><label>{{ i.ten }}</label></div>
                      <div class="row" style="margin-top:-5px; margin-bottom:-20px">
                        <p v-if="i.loai==='loi'" style="font-family:RalewayItalic">Lỗi (<p v-if="i.khacphuc!=''" style="display: inline;">Đã khắc phục</p><p v-else style="display: inline;">Chưa khắc phục</p>)</p>
                        <p v-if="i.loai==='cap nhat'" style="font-family:RalewayItalic">Cập nhật ({{ i.capnhat }})</p>
                        <p v-if="i.loai!='cap nhat' && i.loai!='loi' &&i.loai!='khac()'" style="font-family:RalewayItalic">{{ i.loai.split('()')[1] }}</p>
                        <p v-if="i.loai==='khac()'" style="font-family:RalewayItalic">Khác</p>
                      </div>
                    </div>
                    <div class="col text-end" style="">
                      <i
                        @click="deleteI(i)"
                        class="fa-solid fa-trash-can"
                        id="util-icon"
                        title="Xóa nhật ký"
                        style="padding-left: 20px"
                        v-if="this.user.id === i.id_nguoitao"
                      ></i>
                      <i
                      v-if="this.user.chucvu!='admin' && edit===true"
                        @click="
                          editform = true;
                          editI = i;
                        "
                        class="fa-solid fa-pen"
                        id="util-icon"
                        title="Cập nhật nhật ký"
                        style="padding-left: 20px"
                      ></i>
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
                Không có nhật ký nào.
              </p>
            </div>
            <!--thong tin-->
            <div
              class="col-6"
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
                      <label>Tên nhật ký: </label>
                    </div>
                    <div class="col-9">
                      {{ editI.ten }}
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label>Loại nhật ký: </label>
                    </div>
                    <div class="col-9">
                      <p v-if="editI.loai==='loi'">Lỗi (<p v-if="i.khacphuc!=''" style="display: inline;">Đã khắc phục</p><p v-else style="display: inline;">Chưa khắc phục</p>)</p>
                        <p v-if="editI.loai==='cap nhat'">Cập nhật</p>
                        <p v-if="editI.loai!='cap nhat' && editI.loai!='loi' &&editI.loai!='khac()'">{{ editI.loai.split('()')[1] }}</p>
                        <p v-if="editI.loai==='khac()'" >Khác</p>
                    </div>
                  </div>
                </div>
                <div class="form-group" v-if="editI.loai==='cap nhat'">
                  <div class="row spacing">
                    <div class="col">
                      <label for="GhiChu">Thông tin cập nhật: </label>
                    </div>
                    <div class="col-9">
                      {{ editI.capnhat }}
                    </div>
                  </div>
                </div>
                <div class="form-group" v-if="editI.loai==='loi' && editI.khacphuc!=''">
                  <div class="row spacing">
                    <div class="col">
                      <label for="GhiChu">Cách khắc phục: </label>
                    </div>
                    <div class="col-9">
                      {{ editI.khacphuc }}
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="GhiChu">Ghi chú: </label>
                    </div>
                    <div class="col-9">
                      {{ editI.ghichu }}
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="DonViSuDung">Thời gian tạo: </label>
                    </div>
                    <div class="col-9"> Vào lúc {{ format_datetime(editI.ngaytao) }} bởi
                      {{ editI.NguoiTao.hoten }} ({{
                        editI.NguoiTao.manhanvien
                      }})
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row spacing">
                    <div class="col">
                      <label for="DonViSuDung"
                        >Lần cập nhật cuối:
                      </label>
                    </div>
                    <div class="col-9">
                      Vào lúc {{ format_datetime(editI.ngaycapnhat) }} bởi
                      {{ editI.NguoiCapNhat.hoten }} ({{
                        editI.NguoiCapNhat.manhanvien
                      }})
                    </div>
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
  <DiaryForm
    v-if="this.form === true"
    @close="this.form = false"
    @refresh="
      this.form = false;
      this.retrieveI();
    "
    :dprop="{
      loai: 'loi',
      khacphuc: '',
      capnhat: '',
      ghichu: '',
      id_nguoitao: this.user.id,
      id_nguoicapnhat: this.user.id,
      id_HT: this.i.id,
    }"
    :e="false"
  >
  </DiaryForm>
  <DiaryForm
    v-if="this.editform === true"
    @close="this.editform = false"
    @refresh="
      this.editform = false;
      this.retrieveI();
    "
    :dprop="editI"
    :e="true"
  >
  </DiaryForm>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueJwtDecode from "vue-jwt-decode";
import SettingiService from "@/services/settingi.service";
import moment from "moment";
import DiaryForm from "@/components/DiaryForm.vue";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    DiaryForm,
  },

  props: {
    iprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    return {
      i: this.iprop,
      editform: false,
      edit: this.e,
      ilist: [],
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      searchText: "",
      project: this.projectprop,
      form: false,
      editI: null,
      info: false,
      editServer: null,
      editIndex: 0,
      filter: "",
    };
  },

  mounted() {
    this.retrieveI();
  },

  methods: {
    async deleteI(data) {
      if (confirm("Bạn có chắc muốn xóa?")) {
        let check = await SettingiService.deleteDiary(data.id);
        if (check === true) {
          this.$toast.open({
            message: "Nhật ký đã được cập nhật",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
          this.retrieveI();
        }
      }
    },

    async retrieveI() {
      this.ilist = await SettingiService.getDiary(this.i.id);
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
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 95%;
  z-index: 99;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(221, 221, 221);
  border-radius: 10px;
}

.card-render:hover {
  transform: scale(1.02);
}

.active {
  border: 3px solid rgb(136, 136, 239);
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
  transform: scale(1.02);
}

.errorsolve {
  background-color: rgb(206, 243, 206);
}

.error {
  background-color: rgb(255, 178, 178);
}
</style>
