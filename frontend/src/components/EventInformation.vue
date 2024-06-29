<template>
  <div class="modal-mask" v-if="oe===false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label class="" style="margin: auto; font-size: 20px"
            >Thông tin sự kiện</label
          >
        </div>
        <div class="modal-body" >
          <div class="row">
            <div class="form-group">
              <div class="row">
                <div class="col-5">
                  <label for="TenSuKien">Tên sự kiện: </label>
                </div>
                <div class="col-7">
                  {{ event.TenSuKien }}
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
                  {{ event.MoTaSuKien }}
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 2.5vh">
            <div class="form-group">
              <div class="row">
                <div class="col-5">
                  <label for="NgayDienRaSuKien">Ngày diễn ra sự kiện: </label>
                </div>
                <div class="col-7">{{format_date(event.NgayDienRaSuKien)}}
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="margin-top: 2.5vh">
            <div class="form-group">
              <div class="row">
                <div class="col-5">
                  <label for="NgayKetThucSuKien">Ngày kết thúc sự kiện: </label>
                </div>
                <div class="col-7">
                  {{format_date(event.NgayKetThucSuKien)}}
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
                  {{event.DiaDiemDienRaSuKien}}
                </div>
              </div>
            </div>
          </div>
          <label style="padding-top: 3vh">Danh sách người tham gia</label>
          <div v-if="event.DSNguoiThamGia.length > 0">
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
                v-for="(user, index) in event.DSNguoiThamGia"
                :key="user"
                class="col-2"
                style=""
              >
                <div class="row text-center">
                  <div class="col">
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
                        ({{ user.username }})
                      </p>
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
            Không có người tham gia
          </p>
        </div>
        <div class="text-center">
          <button
            v-if="edit === true && this.user.chucvu!='admin' && this.kt===false"
            class="btn btn-dark"
            style="margin-right: 10px; width: 150px"
            type="submit"
            @click='oe=true'
          >
            Chỉnh sửa
          </button>
          <button
            @click="$emit('close'), $emit('refresh')"
            class="btn btn-dark"
            style="width: 150px"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
  <EventForm
    v-if="oe === true"
    :eventprop="event"
    :e="true"
    @close="oe=false"
    @closeall="oe = false; $emit('close'); $emit('refresh')"
  >
  </EventForm>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import EventService from "@/services/event.service";
import EventForm from "@/components/EventForm.vue";
import moment from "moment";


export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    EventForm
  },

  props: {
    eventprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
    kt: { type: Boolean, required: true },

  },

  data() {
    return {
      plist: [],
      us: {
        userList: [],
        checkp: [],
      },
      oe:false,
      edit: this.e,
      event: this.eventprop,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
    };
  },

  mounted() {
    console.log(this.event);
  },

  methods: {
    format_date(value) {
      if (value) {
        return moment(String(value)).format("DD - MM - YYYY");
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
  height: 55vh;
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
