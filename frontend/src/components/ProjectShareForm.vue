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
                <!--<button
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
                </button>-->
              </div>
            </div>
            <div
              class="row text-center flex-nowrap"
              style="
                overflow-x: auto;
                padding-top: 2vh;
                height: 13vh;
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
                  <div class="col">
                    <img
                      style="
                        display: inline-block;
                        width: 2vw;
                        height: 2vw;
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
                        ({{ user.username }})
                      </p>
                    </div>
                  </div>

                  <div class="col-1">
                    <i
                      v-if="index != 0"
                      class="fa-solid fa-circle-xmark"
                      style="position: relative; display: block; margin-left:-55px"
                      @click="removeP('plist', user, index)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 30vh; overflow-y: auto; overflow-x: hidden">
              <div class="row" style="">
                <div
                  v-for="(user, index) in us.userList"
                  class="row"
                  style="padding-bottom: 2px; padding-left: 2vw"
                >
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
                    <div class="row" style="padding-right: 10px">
                      <div class="col-1">
                        <img
                          style="
                            width: 1.5vw;
                            height: 1.5vw;
                            border-radius: 100%;
                            margin: auto;
                          "
                          :src="`../../src/assets/img/${user.anhdaidien}`"
                        />
                      </div>
                      <div class="col d-flex align-items-center">
                        <div class="row" style="padding-left: 10px">
                          {{ user.hoten }} ({{ user.username }})
                        </div>
                      </div>
                      <div
                        class="col-2"
                        v-if="user.id === plist[0].id"
                        style="margin-right: 10px"
                      >
                        <select
                          v-model="user.loai"
                          style="
                            width: 180%;
                            border-width: 1.55px;
                            border-color: var(--secondary-color);
                            box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                            height: 3.5vh;
                            border-radius: 5px 5px 5px 5px;
                            text-align: center;
                            font-size: 1vw;
                          "
                        >
                          <option value="hc">Hành chính</option>
                          <option value="kt">Kỹ thuật</option>
                        </select>
                      </div>
                      <div
                        v-if="user.id === plist[0].id"
                        class="col-3 text-end"
                        style="
                          font-family: RalewayBlack;
                          color: gray;
                          margin: auto;
                          font-size: 0.9vw;
                        "
                      >
                        Chủ sở hữu
                      </div>
                      <div
                        v-else
                        class="col-4 d-flex justify-content-end text-end"
                      >
                        <select
                          v-if="this.us.checkp[index] === true"
                          v-model="user.loai"
                          style="
                            width: 80%;
                            border-width: 1.55px;
                            border-color: var(--secondary-color);
                            box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                            height: 3.5vh;
                            border-radius: 5px 5px 5px 5px;
                            text-align: center;
                            font-size: 1vw;
                          "
                        >
                          <option value="hc">Hành chính</option>
                          <option value="kt">Kỹ thuật</option>
                        </select>
                        <div style="padding-left: 20px">
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
                    @click="getCS"
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
                    @click="getCS"
                  >
                  </Field>
                  Chỉ mình tôi
                </div>
                <div class="col-4">
                  <Field
                    name="QuyenXem"
                    type="radio"
                    value="nguoi tham gia"
                    v-model="QuyenXem"
                    style="margin-right: 0.5vw"
                    @click="getCS()"
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
                  <!--<button
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
                  </button>-->
                </div>
              </div>
              <div
                class="row text-center flex-nowrap"
                style="
                  overflow-x: auto;
                  padding-top: 2vh;
                  height: 13vh;
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
                    <div class="col">
                      <img
                        style="
                          display: inline-block;
                          width: 2vw;
                          height: 2vw;
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
                          ({{ user.username }})
                        </p>
                      </div>
                    </div>
                    <div class="col-1">
                      <i
                        v-if="index != 0"
                        class="fa-solid fa-circle-xmark"
                        style="position: relative; display: block;margin-left:-55px"
                        @click="removeE('elist', user, index)"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div style="height: 30vh; overflow-y: auto; overflow-x: hidden">
                <div class="row" style="overflow-x: auto">
                  <div
                    v-for="(user, index) in cslist"
                    class="row"
                    style="padding-bottom: 0.2vh; padding-left: 2vw"
                  >
                    <div
                      class="card"
                      style=""
                      :class="{
                        active:
                          us.checke[getIndex(user)] === true ||
                          (QuyenXem === 'tat ca' && us.checke[index] === true),
                      }"
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
                              width: 1.5vw;
                              height: 1.5vw;
                              border-radius: 100%;
                              margin: auto;
                            "
                            :src="`../../src/assets/img/${user.anhdaidien}`"
                          />
                        </div>
                        <div class="col-7">
                          <div class="row">
                            {{ user.hoten }} ({{ user.username }})
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
                              v-if="
                                us.checke[getIndex(user)] === false ||
                                (QuyenXem === 'tat ca' &&
                                  us.checke[index] === false)
                              "
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

  watch: {
    QuyenXem() {
      this.getCS();
    },

    plist() {
      this.getCS();
    },
  },

  data() {
    const FormSchema = yup.object({});

    return {
      change: false,
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
      cslist: [],
      QuyenXem: "",
    };
  },

  mounted() {
    console.log(this.project);

    if (this.edit === false) {
      this.QuyenXem = "tat ca";
      this.project.QuyenChinhSua = "nguoi co quyen xem";
    } else {
      this.plist = this.project.DS_TG;
      console.log(this.project.DS_CS.length);
      if (this.project.DS_CS.length != 0) this.elist = this.projectprop.DS_CS;
      else this.elist[0] = this.plist[0];
      this.QuyenXem = this.project.qx;
      this.project.QuyenChinhSua = this.project.qcs;
    }

    this.getUser();
  },

  computed: {},

  methods: {
    getIndex(data) {
      let i = 0;
      while (i < this.us.userList.length) {
        if (this.us.userList[i].id === data.id) {
          break;
        }
        i++;
      }
      console.log(i);
      console.log(this.cslist);
      console.log(this.elist);
      console.log(this.us.checke);
      return i;
    },
    async getUser() {
      let s = "admin";
      this.us.userList = await UserService.getAll();
      let i = 0;
      if (this.edit === false) {
        while (i < this.us.userList.length) {
          if (this.us.userList[i].id === this.user.id) {
            this.us.checkp[i] = true;
            this.plist.push(this.us.userList[i]);
            this.plist[0].loai = "hc";
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
        i = 0;
        while (i < this.us.userList.length) {
          if (this.us.userList[i].chucvu === "admin") {
            this.us.userList.splice(i, 1);
          } else {
            this.us.checkp[i] = false;
            this.us.checke[i] = false;
            i++;
          }
        }
        i = 0;

        while (i < this.plist.length) {
          let j = 0;
          while (j < this.us.userList.length) {
            if (this.us.userList[j].id === this.plist[i].id) {
              this.us.checkp[j] = true;
              this.us.userList[j].loai = this.plist[i].loai;
              break;
            }
            j++;
          }
          i++;
        }

        i = 0;
        while (i < this.elist.length) {
          let j = 0;
          while (j < this.us.userList.length) {
            if (this.us.userList[j].id === this.elist[i].id) {
              this.us.checke[j] = true;
              break;
            }
            j++;
          }
          i++;
        }
      }
      console.log(this.plist[0].loai);
      console.log(this.elist);
      console.log(this.us);
      this.getCS();
    },

    getCS() {
      if (this.project.QuyenXem === "chi minh toi") {
        this.cslist = [];
        this.cslist.push(this.plist[0]);
        return;
      }
      if (this.project.QuyenXem === "tat ca") {
        this.cslist = this.us.userList;
        console.log(this.us.userList);
      } else this.cslist = this.plist;
    },

    async addP(data) {
      this.plist.push(this.us.userList[data]);
      this.us.checkp[data] = true;
      this.plist[this.plist.length - 1].loai = "hc";
    },

    async removeP(s, data, index) {
      if (s === "us") {
        this.removeE("us", data, index);
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
        this.removeE("elist", data, index);
        let n = 0;
        while (n < this.elist.length) {
          if (this.elist[n].id === this.plist[index].id) {
            let m = 0;
            this.elist.splice(n, 1);
            break;
          }
          n++;
        }
        this.plist.splice(index, 1);
        let i = 0;
        while (i < this.us.userList.length) {
          if (this.us.userList[i].id === data.id) {
            this.us.checkp[i] = false;
            console.log(this.us);

            break;
          } else {
            i++;
          }
        }
      }
      console.log(this.elist);
      console.log(this.cslist);
    },

    async addE(data) {
      this.elist.push(this.cslist[data]);
      this.us.checke[this.getIndex(this.cslist[data])] = true;
    },

    async removeE(s, data, index) {
      if (s === "us") {
        
        let i = 0;
        while (i < this.us.userList.length) {
          if (data.id ===this.us.userList[i].id) {
            this.us.checke[i]=false;
            break;
          } else {
            i++;
          }
        }
        i=0;
        while(i<this.elist.length){
          if (data.id===this.elist[i].id){
            this.elist.splice(i,1);
            break;
          }
          i++;
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
        this.project.QuyenXem = data.QuyenXem;
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
        data.LoaiThoiHan = this.project.LoaiThoiHan;
        data.ThoiHan = this.project.ThoiHan;
        data.TrangThai = this.project.tempTrangThai;
        data.ThoiGianBaoHanh = this.project.ThoiGianBaoHanh;
        data.ThoiGianNghiemThu = this.project.ThoiGianNghiemThu;
        data.ThoiGianBatDauDuAn = this.project.ThoiGianBatDauDuAn;
        data.ThoiGianKetThucDuAn = this.project.ThoiGianKetThucDuAn;
        data.ThoiGianBatDauDauThau = this.project.ThoiGianBatDauDauThau;
        data.ThoiGianKetThucDauThau = this.project.ThoiGianKetThucDauThau;
        data.KhachHang = this.project.KhachHang;
        data.GhiChu = this.project.GhiChu;
        if (
          typeof data.KhachHang === "undefined" ||
          data.KhachHang === null ||
          data.KhachHang === "" ||
          data.KhachHang.length === 0
        ) {
          data.KhachHang = "Không có";
        }
        if (
          typeof data.GhiChu === "undefined" ||
          data.GhiChu === null ||
          data.GhiChu === "" ||
          data.GhiChu.length === 0
        ) {
          data.GhiChu = "Không có";
        }
        data.id_GiaHan = this.project.id_GiaHan;
        if (
          typeof data.id_GiaHan === "undefined" ||
          data.id_GiaHan === null ||
          data.id_GiaHan === "" ||
          data.id_GiaHan.length === 0
        ) {
          data.id_GiaHan = 0;
        }
        data.step = "create";
        data.loai = "chia se";
        console.log(data);
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
          data.id_NguoiTao = this.project.id_NguoiTao;
          data.id_NguoiChinhSuaLanCuoi = this.user.id;
          data.DSNguoiThamGia = this.plist;
          data.DSNguoiChinhSua = this.elist;
          data.check = "update-admin";
          data.id = this.project.id;
          let check = await ProjectService.update(data);
          if (check === true) {
            this.$toast.open({
              message: "Chỉnh sửa dự án thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
          }

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
