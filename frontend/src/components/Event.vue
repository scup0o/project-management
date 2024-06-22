<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label class="" style="margin: auto; font-size: 20px"
            >Sự kiện dự án</label
          >
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-7">
              <div class="row">
                <Calendar
                  :initial-page="{
                    month: parseInt(getM(date)),
                    year: parseInt(getY(date)),
                  }"
                  locale="vi"
                  v-model="date"
                  mode="date"
                  expanded
                  :attributes="eventlist"
                  :key="eventlist"
                  @dayfocusin="changeDate"
                />
              </div>
              <div class="row" style="padding-top: 10px">
                <div style="overflow-y: auto; height: 30vh">
                  <div class="row">
                    <label>Sự kiện ngày {{ format_date(date) }}:</label>
                  </div>
                  <div v-if="sEvent.length > 0">
                    <div v-for="(e, i) in sEvent" :key="e">
                      <div style="padding-bottom: 1px; padding-top: 1px">
                        <div class="row card-in" style="width: 98%; margin: 0">
                          <div class="col">
                            <label style="font-family: Raleway"
                              ><p style="margin-bottom: 0">
                                <b>{{ e.TenSuKien }}</b>
                              </p>
                              <p style="margin-bottom: 0" v-snip="{ lines: 4 }">
                                {{ e.MoTaSuKien }}
                              </p></label
                            >
                          </div>
                          <div class="col-1">
                            <div
                              class="row"
                              style="padding-bottom: 2vh; padding-top: 1vh"
                            >
                              <i
                                v-if="this.user.id === e.id_NguoiTao"
                                class="fa-regular fa-circle-xmark"
                                style="color: #a8a8a8"
                                id="util-icon"
                                title="Xóa sự kiện"
                                @click="deleteEvent(e)"
                              ></i>
                            </div>
                            <div class="row">
                              <i
                                class="fa-solid fa-circle-info"
                                id="util-icon"
                                title="Thông tin sự kiện"
                                style=""
                                @click="
                                  ifo = true;
                                  editevent = e;
                                "
                              ></i>
                            </div>
                          </div>
                          <div class="row" style="width: 100%">
                            <div
                              class="row text-center flex-nowrap"
                              style="
                                overflow-x: hidden;
                                overflow-y: hidden;
                                width: 200px;
                              "
                            >
                              <div
                                class="col-2"
                                v-if="e.DSNguoiThamGia.length > 5"
                              >
                                <div
                                  style="
                                    border: 1px solid gray;
                                    margin: auto;
                                    border-radius: 100%;
                                    width: 2vw;
                                    height: 2vw;
                                    background-color: white;
                                  "
                                >
                                  <p style="margin-bottom: 0">
                                    +{{ e.DSNguoiThamGia.length - 5 }}
                                  </p>
                                </div>
                              </div>
                              <div
                                v-for="(user, index) in e.DSNguoiThamGia"
                                :key="user"
                                class="col-2"
                                style=""
                              >
                                <div class="row" v-if="index < 5">
                                  <div class="col-5">
                                    <img
                                      style="
                                        display: inline-block;
                                        width: 2vw;
                                        height: 2vw;
                                        border-radius: 100%;
                                      "
                                      :src="`../../src/assets/img/${user.anhdaidien}`"
                                    />
                                  </div>
                                </div>
                              </div>
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
                    Không có sự kiện nào.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="row">
                <div class="col">
                  <div class="row d-flex justify-content-end">
                    <div
                      class="input-group"
                      style="width: 90%; padding-left: 0px; margin-right: 5px"
                    >
                      <input
                        type="text"
                        class="form-control search-form icon-search"
                        style="background-color: var(--field-color)"
                        placeholder="Nhập sự kiện cần tìm"
                        v-model="searchText"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="col-3 hover-i"
                  v-if="this.pj.e === true"
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
                      Tạo sự kiện
                    </button>
                  </div>
                </div>
              </div>
              <div class="row" style="padding-left: 15px">
                <label>Danh sách tất cả sự kiện của dự án:</label>
                <div style="overflow-y: auto; height: 57vh">
                  <div v-if="this.event.length > 0">
                    <div v-for="(e, i) in event" :key="e">
                      <div
                        v-if="
                          e.TenSuKien.toLowerCase().includes(
                            this.searchText.toLowerCase()
                          )
                        "
                        style="padding-bottom: 1px; padding-top: 1px"
                      >
                        <div class="row card-in" style="width: 98%; margin: 0">
                          <div class="col">
                            <label
                              v-if="e.NgayDienRaSuKien != e.NgayKetThucSuKien"
                              style="
                                color: gray;
                                font-family: Raleway;
                                padding-bottom: 0; width: 100%;
                              "
                              ><b
                                >Từ {{ format_date(e.NgayDienRaSuKien) }} đến
                                {{ format_date(e.NgayKetThucSuKien) }}</b
                              ></label
                            >
                            <label
                              v-else
                              style="
                                color: gray;
                                font-family: Raleway;
                                padding-bottom: 0; width: 100%;
                              "
                              ><b
                                >Ngày {{ format_date(e.NgayDienRaSuKien) }}</b
                              ></label
                            >
                            <label style="font-family: Raleway"
                              ><p style="margin-bottom: 0">
                                <b>{{ e.TenSuKien }}</b>
                              </p>
                              <p style="margin-bottom: 0" v-snip="{ lines: 4 }">
                                {{ e.MoTaSuKien }}
                              </p></label
                            >
                          </div>
                          <div class="col-1" style="margin-right: 10px">
                            <div
                              class="row"
                              style="padding-bottom: 2vh; padding-top: 1vh"
                            >
                              <i
                                v-if="this.user.id === e.id_NguoiTao"
                                class="fa-regular fa-circle-xmark"
                                style="color: #a8a8a8"
                                id="util-icon"
                                title="Xóa sự kiện"
                                @click="deleteEvent(e)"
                              ></i>
                            </div>
                            <div class="row">
                              <i
                                class="fa-solid fa-circle-info"
                                id="util-icon"
                                title="Thông tin sự kiện"
                                @click="
                                  ifo = true;
                                  editevent = e;
                                "
                              ></i>
                            </div>
                          </div>
                          <div class="row" style="width: 80%; padding-bottom: 10px;">
                            <div
                              class="row text-center flex-nowrap"
                              style="
                                overflow-x: hidden;
                                overflow-y: hidden;
                                width: 200px;
                              "
                            >
                              <div
                                class="col-2"
                                v-if="e.DSNguoiThamGia.length > 5"
                              >
                                <div
                                  style="
                                    border: 1px solid gray;
                                    margin: auto;
                                    border-radius: 100%;
                                    width: 2vw;
                                    height: 2vw;
                                    background-color: white;
                                  "
                                >
                                  <p style="margin-bottom: 0">
                                    +{{ e.DSNguoiThamGia.length - 5 }}
                                  </p>
                                </div>
                              </div>
                              <div
                                v-for="(user, index) in e.DSNguoiThamGia"
                                :key="user"
                                class="col-2"
                                style=""
                              >
                                <div class="row" v-if="index < 5">
                                  <div class="col-5">
                                    <img
                                      style="
                                        display: inline-block;
                                        width: 2vw;
                                        height: 2vw;
                                        border-radius: 100%;
                                      "
                                      :src="`../../src/assets/img/${user.anhdaidien}`"
                                    />
                                  </div>
                                </div>
                              </div>
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
                    Không có sự kiện nào.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <button
            @click="$emit('close')"
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
    v-if="form === true"
    :eventprop="{
      TenSuKien: '',
      MoTaSuKien: '',
      DiaDiemDienRaSuKien: '',
      NgayKetThucSuKien: null,
      id_DuAn: this.pj.id,
    }"
    :e="false"
    @close="form = false"
    @refresh="this.getEvent()"
  >
  </EventForm>
  <EventInformation
    v-if="ifo === true"
    :eventprop="editevent"
    @close="ifo = false"
    :e="this.pj.e"
  >
  </EventInformation>
</template>
<script>
import "@/assets/css/base.css";
import VueJwtDecode from "vue-jwt-decode";
import moment from "moment";
import UserService from "@/services/user.service";
import EventService from "@/services/event.service";
import EventForm from "@/components/EventForm.vue";
import EventInformation from "@/components/EventInformation.vue";
import { Calendar, DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { ref, computed } from "vue";

export default {
  components: {
    Calendar,
    DatePicker,
    EventForm,
    EventInformation,
  },

  props: {
    project: { type: Object, required: true },
  },

  watch: {
    date() {
      this.getsEvent();
    },
  },

  data() {
    return {
      edit: false,
      editevent: null,
      ifo: false,
      form: false,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      date: new Date(0, 0, 0),
      event: [],
      pj: this.project,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      searchText: "",
      eventlist: ref([]),
      sEvent: [],
    };
  },

  mounted() {
    this.getEvent();
  },

  computed: {},

  methods: {
    async getsEvent() {
      let i = 0;
      while (i < this.event.length) {
        if (
          this.date >= this.format_datecp(this.event[i].NgayDienRaSuKien) &&
          this.date <= this.format_datecp(this.event[i].NgayKetThucSuKien)
        ) {
          this.sEvent.push(this.event[i]);
        }
        i++;
      }
      console.log(this.sEvent);
    },

    async getEvent() {
      this.event = await EventService.getAll(this.pj.id);

      let i = 0;
      let colora = [
        "blue",
        "red",
        "purple",
        "green",
        "pink",
        "orange",
        "aliceblue",
        "DarkCyan",
        "DarkGreen",
        "yellow",
        "teal",
        "gray",
        "indigo",
      ];
      let color = [
        "blue",
        "red",
        "purple",
        "green",
        "pink",
        "orange",
        "aliceblue",
        "DarkCyan",
        "DarkGreen",
        "yellow",
        "teal",
        "gray",
        "indigo",
      ];
      while (i < this.event.length) {
        if (
          this.event[i].NgayDienRaSuKien === this.event[i].NgayKetThucSuKien
        ) {
          this.event[i].dot = colora[Math.floor(Math.random() * color.length)];
          this.event[i].dates = new Date(
            parseInt(this.getY(this.event[i].NgayDienRaSuKien)),
            parseInt(this.getM(this.event[i].NgayDienRaSuKien)) - 1,
            parseInt(this.getD(this.event[i].NgayDienRaSuKien))
          );
        } else {
          let c = color[Math.floor(Math.random() * color.length)];
          color.splice(c, 1);
          console.log(color.length);
          this.event[i].highlight = {
            start: { fillMode: "outline", color: c },
            base: { fillMode: "light", color: c },
            end: { fillMode: "outline", color: c },
          };
          this.event[i].dates = {
            start: new Date(
              parseInt(this.getY(this.event[i].NgayDienRaSuKien)),
              parseInt(this.getM(this.event[i].NgayDienRaSuKien)) - 1,
              parseInt(this.getD(this.event[i].NgayDienRaSuKien))
            ),
            end: new Date(
              parseInt(this.getY(this.event[i].NgayKetThucSuKien)),
              parseInt(this.getM(this.event[i].NgayKetThucSuKien)) - 1,
              parseInt(this.getD(this.event[i].NgayKetThucSuKien))
            ),
          };
        }

        i++;
      }
      this.eventlist = ref(this.event);
      console.log(this.event);
      this.date = this.format_datecp(new Date());
    },

    async deleteEvent(data) {
      try {
        if (confirm(`Bạn có chắc muốn xóa sự kiện ${data.TenSuKien}?`)) {
          const check = await EventService.delete(data.id);
          if (check != true) {
            this.$toast.open({
              message: "Xóa sự kiện thất bại",
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: "Sự kiện đã được xóa",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.getEvent();
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    changeDate(date) {
      this.date = date.id;
    },

    format_datetime(value) {
      if (value) {
        return moment(String(value)).format("hh:mm A, DD - MM - YYYY");
      }
    },

    format_date(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
      }
    },

    format_datecp(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
    },
    getY(value) {
      if (value) {
        return moment(String(value)).format("YYYY");
      }
    },
    getM(value) {
      if (value) {
        return moment(String(value)).format("MM");
      }
    },
    getD(value) {
      if (value) {
        return moment(String(value)).format("DD");
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
  z-index: 90;
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
  width: 70vw;
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
  overflow-x: hidden;
  height: 70vh;
  background-color: white;
  padding: 20px;
  overflow-y: hidden;
}
.icon-search {
  padding-left: 3vw;

  background: url("../assets/img/magnifying-glass-solid.svg") no-repeat left;
  background-size: 2vh;
  background-position: 2vh;
}

.hover-i:hover {
  transform: scale(1.1);
}

.card {
  height: 30vh;
}

.card-in {
  border: 1px solid gray;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
}

.card-in:hover {
  transform: scale(1.01);
  background-color: var(--field-color);
}

#util-icon:hover {
  cursor: pointer;
  transform: scale(1.2);
}

#util-icon {
  padding-left: 20px;
}
</style>
