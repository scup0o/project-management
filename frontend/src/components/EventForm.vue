<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px"
            >Tạo sự kiện</label
          >
          <!--tiêu đề-->
          <label v-else class="" style="margin: auto; font-size: 20px"
            >Chỉnh sửa thông tin sự kiện</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="createEvent" :validation-schema="FormSchema">
          <div class="modal-body">
            <!--chỉnh view chính từ khúc này-->
            <div class="row">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="TenSuKien">Tên sự kiện: <p class="dot">(*)</p></label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="TenSuKien"
                      type="text"
                      class="form-control"
                      v-model="event.TenSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="TenSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="MoTaSuKien">Mô tả sự kiện: </label>
                  </div>
                  <div class="col-7">
                    <Field
                      row="10"
                      name="MoTaSuKien"
                      as="textarea"
                      class="form-control"
                      v-model="event.MoTaSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="MoTaSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="NgayDienRaSuKien">Ngày diễn ra sự kiện: <p class="dot">(*)</p></label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="NgayDienRaSuKien"
                      type="date"
                      class="form-control"
                      v-model="event.NgayDienRaSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="NgayDienRaSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="NgayKetThucSuKien"
                      >Ngày kết thúc sự kiện:
                    </label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="NgayKetThucSuKien"
                      type="date"
                      class="form-control"
                      @click="NgayKetThucSuKienMessage = ''"
                      v-model="event.NgayKetThucSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="NgayKetThucSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p
                      v-if="NgayKetThucSuKienMessage != ''"
                      class="error-feedback"
                    >
                      {{ NgayKetThucSuKienMessage }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="margin-top: 2.5vh">
              <div class="form-group">
                <div class="row">
                  <div class="col-5">
                    <label for="DiaDiemDienRaSuKien"
                      >Địa điểm diễn ra sự kiện:
                    </label>
                  </div>
                  <div class="col-7">
                    <Field
                      name="DiaDiemDienRaSuKien"
                      type="text"
                      class="form-control"
                      v-model="event.DiaDiemDienRaSuKien"
                    >
                    </Field>
                    <ErrorMessage
                      name="DiaDiemDienRaSuKien"
                      class="error-feedback"
                    ></ErrorMessage>
                  </div>
                </div>
              </div>
            </div>
            <label style="padding-top: 5vh"> Người tham gia sự kiện </label>
            <div class="row" style="padding-bottom: 2vh">
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
              v-if="plist.length != 0"
              class="row text-center flex-nowrap"
              style="overflow-x: auto; height: 11vh; overflow-y: hidden"
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
                      class="fa-solid fa-circle-xmark"
                      style="position: relative; display: block;margin-left:-55px"
                      @click="removeP('plist', user, index)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div style="height: 30vh; overflow-y: auto; overflow-x: hidden"><div
              class="row"
              
            >
              <div v-for="(user, index) in us.userList" class="row" style="padding-bottom: 2px; padding-left: 2vw">
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

                    <div class="col d-flex">
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
            </div></div>
            
          </div>
          <div class="text-center">
            <button
              v-if="edit === false"
              class="btn btn-dark"
              style="margin-right: 10px; width: 150px"
              type="submit"
            >
              Tạo sự kiện
            </button>
            <button v-else class="btn btn-dark" style="margin-right: 10px" type="submit">
              Lưu sự kiện
            </button>
            <button
              @click="this.$emit('closeall'); this.$emit('close')"
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
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import EventService from "@/services/event.service";
import moment from "moment";


export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    eventprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      TenSuKien: yup
        .string()
        .required("Tên sự kiện không được để trống")
        .max(100, "Tên sự kiện dưới 100 ký tự"),
      NgayDienRaSuKien: yup
        .date()
        .required("Ngày diễn ra sự kiện không được để trống"),
      DiaDiemDienRaSuKien: yup
        .string()
        .max(250, "Địa điểm diễn ra sự kiện dưới 250 ký tự"),
      MoTaSuKien: yup.string().max(500, "Mô tả sự kiện dưới 500 ký tự"),
    });

    return {
      plist: [],
      us: {
        userList: [],
        checkp: [],
      },
      searchP: "",
      filterP: "tatca",
      edit: this.e,
      event: this.eventprop,
      FormSchema,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      NgayKetThucSuKienMessage: "",
    };
  },

  mounted() {
    if (this.edit === true) {
      this.plist = this.eventprop.DSNguoiThamGia;
      this.event.NgayDienRaSuKien=this.format_date(this.event.NgayDienRaSuKien)
      this.event.NgayKetThucSuKien=this.format_date(this.event.NgayKetThucSuKien)
    }
    this.getUser();
  },

  methods: {
    async createEvent(data) {
      try {
        console.log(this.event);
        if (
          this.event.NgayKetThucSuKien === null ||
          this.event.NgayKetThucSuKien === undefined
        ) {
          this.event.NgayKetThucSuKien = this.event.NgayDienRaSuKien;
        } else {
          if (this.event.NgayKetThucSuKien < this.event.NgayDienRaSuKien) {
            this.NgayKetThucSuKienMessage =
              "Ngày kết thúc sự kiện không thể trước ngày diễn ra sự kiện";
            return;
          }
        }
        if (this.event.MoTaSuKien === "" || this.event.MoTaSuKien === null) {
          this.event.MoTaSuKien = "Không có mô tả";
        }
        if (this.event.DiaDiemDienRaSuKien === "" || this.event.DiaDiemDienRaSuKien === null) {
          this.event.DiaDiemDienRaSuKien = "Không có thông tin địa điểm";
        }
        this.event.DSNguoiThamGia = this.plist;
        if (this.edit === false) {
          this.event.id_NguoiTao = this.user.id;
          let check = await EventService.create(this.event);
          if (check === true) {
            this.$toast.open({
              message: "Tạo sự kiện thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("close");
            this.$emit("refresh");
          }
        } else {
          let check = await EventService.update(this.event);
          if (check === true) {
            this.$toast.open({
              message: "Cập nhật sự kiện thành công",
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

    async getUser() {
      this.us.userList = await UserService.getAll();
      let i = 0;
        while (i < this.us.userList.length) {
          if (this.us.userList[i].chucvu === "admin") {
            this.us.userList.splice(i, 1);
          } else {
            this.us.checkp[i] = false;
            ++i;
          }
        }
      if (this.edit===true) {
        i = 0;
        while (i < this.plist.length) {
          let j = 0;
          while (j < this.us.userList.length) {
            if (this.us.userList[j].id === this.plist[i].id) {
              this.us.checkp[j] = true;
              break;
            }
            j++;
          }
          i++;
        }
      }
    },

    format_date(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
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
  z-index: 998;
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
  height: 75vh;
  background-color: white;
  padding: 20px;
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
