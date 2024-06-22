<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Cài đặt quyền riêng tư</label
          >
        </div>

        <Form @submit="createProject" :validation-schema="FormSchema">
          <div class="modal-body" style="margin-bottom: 3vh">
            <label style="font-size: 1.1vw">Người tham gia dự án </label>
            <div class="row">
              <div class="input-group" style="">
                <input
                  type="text"
                  class="form-control search-form icon-search"
                  style="background-color: var(--field-color)"
                  placeholder="Nhập tên nhân viên cần tìm"
                  v-model="searchP"
                />
                <button
                  class="btn btn-outline-secondary search-button"
                  type="button"
                  style="
                    width: 3vw;
                    background-color: var(--field-color);
                    border-radius: 0 25px 25px 0;
                  "
                >
                  <Field
                    name="a"
                    as="select"
                    value="tatca"
                    class="icon-filter form-control"
                    v-model="filterP"
                    style="width: 0vw; border: none; height: 3.5vh"
                  >
                    <option value="tatca">Tất cả</option>
                    <option value="hc">Nhân viên hành chính</option>
                    <option value="kt">Nhân viên kỹ thuật</option>
                  </Field>
                </button>
              </div>
            </div>
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
                v-for="(user, index) in plist"
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
                      <p style="margin-top:-20px; font-family: RalewayItalic; font-size:0.9vw">({{ user.manhanvien }})</p>
                    </div>
                  </div>
                  <div class="col-1">
                    <i
                      v-if="index != 0"
                      class="fa-solid fa-circle-xmark"
                      style="position: relative; display: block"
                      @click="removeP('plist', user, index)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row"
              style="overflow-x: auto; height: 20vh; padding: 10px"
            >
              <div v-for="(user, index) in us.userList" class="row" style="">
                <div
                  class="card"
                  style=""
                  :class="{ active: us.checkp[index] === true }"
                  v-if="
                    user.hoten
                      .toLowerCase()
                      .includes(this.searchP.toLowerCase()) &&
                    (user.chucvu === filterP || filterP === 'tatca')
                  "
                >
                  <div class="row" style="">
                    <div class="col-2">
                      <img
                        style="
                          width: 3vw;
                          height: 3vw;
                          border-radius: 100%;
                          margin: auto;
                        "
                        :src="`../../src/assets/img/${user.anhdaidien}`"
                      />
                    </div>
                    <div class="col-7">
                      <div class="row">
                        {{ user.hoten }}
                      </div>
                      <div class="row">
                        {{ user.manhanvien }}
                      </div>
                    </div>
                    <div
                      v-if="user.id === plist[0].id"
                      class="col"
                      style="
                        font-family: RalewayBlack;
                        color: gray;
                        margin: auto;
                      "
                    >
                      Chủ sở hữu
                    </div>
                    <div v-else class="col d-flex">
                      <div style="margin: auto">
                        <i
                          class="fa-solid fa-plus hover-i"
                          v-if="this.us.checkp[index] === false"
                          @click="addP(index)"
                        ></i>
                        <i
                          class="fa-solid fa-xmark hover-i"
                          style="color: #c70000"
                          @click="removeP('us', user, index)"
                          v-else
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <label style="padding-top: 2vh; font-size: 1.1vw">Quyền xem</label>
            <div class="row">
              <div class="form-group row" style="padding-left: 1vw">
                <div class="col-4">
                  <Field
                    name="QuyenXem"
                    type="radio"
                    value="tat ca"
                    v-model="project.QuyenXem"
                    style="margin-right: 0.5vw"
                  >
                  </Field>
                  Tất cả
                </div>
                <div class="col-4">
                  <Field
                    name="QuyenXem"
                    type="radio"
                    value="chi minh toi"
                    v-model="project.QuyenXem"
                    style="margin-right: 0.5vw"
                  >
                  </Field>
                  Chỉ mình tôi
                </div>
                <div class="col-4">
                  <Field
                    name="QuyenXem"
                    type="radio"
                    value="nguoi tham gia"
                    v-model="project.QuyenXem"
                    style="margin-right: 0.5vw"
                  >
                  </Field>
                  Người tham gia
                </div>
              </div>
            </div>
            <label style="padding-top: 2vh; font-size: 1.1vw"
              >Quyền chỉnh sửa</label
            >
            <div class="row">
              <div class="form-group row" style="padding-left: 1vw">
                <div class="col-4">
                  <Field
                    name="QuyenChinhSua"
                    type="radio"
                    value="nguoi co quyen xem"
                    v-model="project.QuyenChinhSua"
                    style="margin-right: 0.5vw"
                  >
                  </Field>
                  Những ai có quyền xem
                </div>
                <div class="col-4">
                  <Field
                    name="QuyenChinhSua"
                    type="radio"
                    value="chi minh toi"
                    v-model="project.QuyenChinhSua"
                    style="margin-right: 0.5vw"
                  >
                  </Field>
                  Chỉ mình tôi
                </div>
                <div class="col-4">
                  <Field
                    name="QuyenChinhSua"
                    type="radio"
                    value="tuy chinh"
                    v-model="project.QuyenChinhSua"
                    style="margin-right: 0.5vw"
                  >
                  </Field>
                  Tùy chỉnh
                </div>
              </div>
            </div>
            <div
              class=""
              v-if="project.QuyenChinhSua === 'tuy chinh'"
              style="padding-top: 2vh"
            >
              <label style="font-size: 1.1vw"
                >Những người có quyền chỉnh sửa
              </label>
              <div class="row">
                <div class="input-group" style="">
                  <input
                    type="text"
                    class="form-control search-form icon-search"
                    style="background-color: var(--field-color)"
                    placeholder="Nhập tên nhân viên cần tìm"
                    v-model="searchE"
                  />
                  <button
                    class="btn btn-outline-secondary search-button"
                    type="button"
                    style="
                      width: 3vw;
                      background-color: var(--field-color);
                      border-radius: 0 25px 25px 0;
                    "
                  >
                    <Field
                      name="a"
                      as="select"
                      value="tatca"
                      class="icon-filter form-control"
                      v-model="filterE"
                      style="width: 0vw; border: none; height: 3.5vh"
                    >
                      <option value="tatca">Tất cả</option>
                      <option value="hc">Nhân viên hành chính</option>
                      <option value="kt">Nhân viên kỹ thuật</option>
                    </Field>
                  </button>
                </div>
              </div>
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
                  v-for="(user, index) in elist"
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
                        <p style="margin-top:-20px; font-family: RalewayItalic; font-size:0.9vw">({{ user.manhanvien }})</p>
                      </div>
                    </div>
                    <div class="col-1">
                      <i
                        v-if="index != 0"
                        class="fa-solid fa-circle-xmark"
                        style="position: relative; display: block"
                        @click="removeE('elist', user, index)"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="row"
                style="overflow-x: auto; height: 20vh; padding: 10px"
              >
                <div v-for="(user, index) in us.userList" class="row" style="">
                  <div
                    class="card"
                    style=""
                    :class="{ active: us.checke[index] === true }"
                    v-if="
                      user.hoten
                        .toLowerCase()
                        .includes(this.searchE.toLowerCase()) &&
                      (user.chucvu === filterE || filterE === 'tatca')
                    "
                  >
                    <div class="row" style="">
                      <div class="col-2">
                        <img
                          style="
                            width: 3vw;
                            height: 3vw;
                            border-radius: 100%;
                            margin: auto;
                          "
                          :src="`../../src/assets/img/${user.anhdaidien}`"
                        />
                      </div>
                      <div class="col-7">
                        <div class="row">
                          {{ user.hoten }}
                        </div>
                        <div class="row">
                          {{ user.manhanvien }}
                        </div>
                      </div>
                      <div
                        v-if="user.id === elist[0].id"
                        class="col"
                        style="
                          font-family: RalewayBlack;
                          color: gray;
                          margin: auto;
                        "
                      >
                        Chủ sở hữu
                      </div>
                      <div v-else class="col d-flex">
                        <div style="margin: auto">
                          <i
                            class="fa-solid fa-plus hover-i"
                            v-if="this.us.checke[index] === false"
                            @click="addE(index)"
                          ></i>
                          <i
                            class="fa-solid fa-xmark hover-i"
                            style="color: #c70000"
                            @click="removeE('us', user, index)"
                            v-else
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center">
            <button
              v-if="edit === false"
              class="btn btn-dark"
              style="margin-right: 10px; width: 10vw"
              type="submit"
            >
              Tạo dự án
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
              Trở lại
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
import ProjectService from "@/services/project.service";
import moment from "moment";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    projectprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({});

    return {
      edit: this.e,
      project: this.projectprop,
      FormSchema,
      haveData: true,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      plist: [],
      elist: [],
      us: {
        userList: [],
        checkp: [],
        checke: [],
      },
      userList: [],
      searchP: "",
      filterP: "tatca",
      searchE: "",
      filterE: "tatca",
    };
  },

  mounted() {
    console.log(this.project);
    this.getUser();
    
    if (this.edit === false) {
      this.project.QuyenXem = "tat ca";
      this.project.QuyenChinhSua = "nguoi co quyen xem";
    }
    else{
      
      this.plist = this.projectprop.DS_TG;
      this.elist = this.projectprop.DS_CS;
    }
  },

  methods: {
    async getUser() {
      let s = "admin";
      this.us.userList = await UserService.getAll();
      let i = 0;
      if (this.edit === false) {
        while (i < this.us.userList.length) {
          if (this.us.userList[i].id === this.user.id) {
            this.us.checkp[i] = true;
            this.plist.push(this.us.userList[i]);
            this.us.checke[i] = true;
            this.elist.push(this.us.userList[i]);
          } else {
            this.us.checkp[i] = false;
            this.us.checke[i] = false;
          }
          if (this.us.userList[i].chucvu === "admin") {
            this.us.userList.splice(i, 1);
          } else {
            ++i;
          }
        }
      } else {
        i=0;
        while(i<this.us.userList.length){
          
          if (this.us.userList[i].chucvu==='admin'){
            this.us.userList.splice(i, 1);
          }
          else{
            this.us.checkp[i]=false;
          this.us.checke[i]=false;
          i++;
          }
        }
        i=0;
        while(i<this.plist.length){
          let j=0;
          while(j<this.us.userList.length){
            if(this.us.userList[j].id===this.plist[i].id){
              this.us.checkp[j]=true;
              break;
            }
            j++;
          }
          i++;
        }
        
        i=0;
        while(i<this.elist.length){
          let j=0;
          while(j<this.us.userList.length){
            if(this.us.userList[j].id===this.elist[i].id){
              this.us.checke[j]=true;
              break;
            }
            j++;
          }
          i++;
        }
      }
      console.log(this.plist);
      console.log(this.elist)
      console.log(this.us);
    },

    async addP(data) {
      this.plist.push(this.us.userList[data]);
      this.us.checkp[data] = true;
    },

    async removeP(s, data, index) {
      if (s === "us") {
        this.us.checkp[index] = false;
        let i = 0;
        let c = false;
        while (i < this.plist.length || c === false) {
          if (this.plist[i].id === data.id) {
            this.plist.splice(i, 1);
            c = true;
          } else {
            i++;
          }
        }
      } else {
        console.log("plist");
        this.plist.splice(index, 1);
        let i = 0;
        while (i < this.us.userList.length) {
          if (this.us.userList[i].id === data.id) {
            this.us.checkp[i] = false;
            break;
          } else {
            i++;
          }
        }
      }
    },

    async addE(data) {
      this.elist.push(this.us.userList[data]);
      this.us.checke[data] = true;
    },

    async removeE(s, data, index) {
      if (s === "us") {
        this.us.checke[index] = false;
        let i = 0;
        let c = false;
        while (i < this.elist.length || c === false) {
          if (this.elist[i].id === data.id) {
            this.elist.splice(i, 1);
            c = true;
          } else {
            i++;
          }
        }
      } else {
        this.elist.splice(index, 1);
        let i = 0;
        while (i < this.us.userList.length) {
          if (this.us.userList[i].id === data.id) {
            this.us.checke[i] = false;
            break;
          } else {
            i++;
          }
        }
      }
    },

    async createProject(data) {
      try {
        console.log(data);
        data.Ten = this.project.Ten;
        data.MoTa = this.project.MoTa;
        if (
          typeof data.MoTa === "undefined" ||
          data.MoTa === "" ||
          data.MoTa.length === 0
        ) {
          data.MoTa = "Không có mô tả";
        }
        console.log(data.MoTa.length);
        data.Ma = this.project.Ma;
        data.TrangThai = this.project.tempTrangThai;
        data.ThoiGianBaoHanh = this.project.ThoiGianBaoHanh;
        data.ThoiGianNghiemThu = this.project.ThoiGianNghiemThu;
        data.ThoiGianBatDauDuAn = this.project.ThoiGianBatDauDuAn;
        data.ThoiGianKetThucDuAn = this.project.ThoiGianKetThucDuAn;
        data.ThoiGianBatDauDauThau = this.project.ThoiGianBatDauDauThau;
        data.ThoiGianKetThucDauThau = this.project.ThoiGianKetThucDauThau;
        data.KhachHang=this.project.KhachHang;
        if (
          typeof data.KhachHang === "undefined" ||
          data.KhachHang === "" ||
          data.KhachHang.length === 0
        ) {
          data.KhachHang = "Không có";
        }
        data.id_GiaHan=this.project.id_GiaHan
        if (
          typeof data.id_GiaHan=== "undefined" ||
          data.id_GiaHan === "" ||
          data.id_GiaHan.length === 0
        ) {
          data.id_GiaHan = 0;
        }
        data.step = "create";
        if (data.QuyenXem === "chi minh toi") data.loai = "ca nhan";
        else data.loai = "chia se";
        if (this.edit === false) {
          data.id_NguoiTao = this.user.id;
          data.id_NguoiChinhSuaLanCuoi = this.user.id;
          data.DSNguoiThamGia = this.plist;
          data.DSNguoiChinhSua = this.elist;
          let check = await ProjectService.create(data);
          if (check === true) {
            this.$toast.open({
              message: "Thêm dự án thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("closeall");
            this.$emit("refresh");
          }
        } else {
          data.id_NguoiChinhSuaLanCuoi = this.user.id;
          data.DSNguoiThamGia = this.plist;
          data.DSNguoiChinhSua = this.elist;
          data.check='update-admin'
          data.id=this.project.id
          let check = await ProjectService.update(data);
          if (check === true) {
          this.$toast.open({
            message: "Chỉnh sửa dự án thành công",
            type: "success",
            duration: 3000,
            dismissible: true,
          });}

          this.$emit("closeall");
          this.$emit("refresh");
        }
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
  padding: 10px;
  border-bottom: 1px solid rgb(192, 192, 192);
  max-height: fit-content;
}
.active {
  background-color: var(--bar-color);
}

.hover-i:hover {
  transform: scale(1.2);
}
</style>
