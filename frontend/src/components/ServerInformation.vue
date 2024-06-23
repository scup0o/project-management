<template>
  <div class="modal-mask" v-if="form === false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Thông tin Server</label
          >
        </div>
        <!--tiêu đề-->
        <div class="modal-body" style="margin-bottom: 3vh">
          <!--chỉnh view chính từ khúc này-->

          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="ten">Tên Server: </label>
              </div>
              <div class="col-7">
                {{ server.ten }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="loai">Loại Server: </label>
              </div>
              <div class="col-7">
                <p v-if="server.loai === 'csdl'">Cơ sở dữ liệu</p>
                <p v-if="server.loai === 'web'">Web</p>
                <p v-if="server.loai === 'app'">App</p>
                <p v-if="server.loai === 'khac'">Khác</p>
              </div>
            </div>
          </div>
          <div class="form-group" v-if="server.loai != 'khac'">
            <div class="row spacing">
              <div class="col">
                <label for="csdl" v-if="server.loai === 'csdl'"
                  >Cơ sở dữ liệu:
                </label>
                <label v-if="server.loai != 'csdl' && server.loai != 'khac'"
                  >Ngôn ngữ sử dụng:
                </label>
              </div>
              <div class="col-7">
                <div v-if="server.loai === 'csdl'">{{ server.csdl }}</div>
                <div v-if="server.loai != 'csdl' && server.loai != 'khac'">
                  {{ server.ngonngu }}
                </div>
              </div>
            </div>
          </div>
          <div class="form-group" v-if="server.loai === 'web'">
            <div class="row spacing">
              <div class="col">
                <label>Môi trường vận hành: </label>
              </div>
              <div class="col-7">
                {{ server.moitruong }}
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label>Các framework/ phần mềm sử dụng khác: </label>
              </div>
              <div class="col-7">{{ server.pmkhac }}</div>
            </div>
          </div>

          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="IP">IP: </label>
              </div>
              <div class="col-7">{{ server.IP }}</div>
            </div>
          </div>
          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="hdh">Hệ điều hành: </label>
              </div>
              <div class="col-7">{{ server.hdh }}</div>
            </div>
          </div>
          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="ram">RAM: </label>
              </div>
              <div class="col-7">{{ server.ram }}</div>
            </div>
          </div>
          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="ocung">Ổ cứng: </label>
              </div>
              <div class="col-7">{{ server.ocung }}</div>
            </div>
          </div>
          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="cardmanhinh">Card màn hình: </label>
              </div>
              <div class="col-7">{{ server.cardmanhinh }}</div>
            </div>
          </div>

          <div class="form-group">
            <div class="row spacing">
              <div class="col">
                <label for="ghichu">Thông tin ghi chú: </label>
              </div>
              <div class="col-7">
                {{ server.ghichu }}
              </div>
            </div>
          </div>
          <!--chỉnh view chính tới khúc này-->
        </div>
        <div class="text-center">
          <button
            v-if="this.edit === true"
            class="btn btn-dark"
            style="margin-right: 10px; width: 10vw"
            type="submit"
            @click="this.form = true"
          >
            Chỉnh sửa
            <!--tên nút -->
          </button>

          <button
            @click="$emit('close')"
            class="btn btn-dark"
            style="width: 10vw; margin-right: 10px"
          >
            Đóng
          </button>
          <button
            v-if="this.edit === true && this.d === true"
            class="btn btn-danger"
            style="width: 10vw"
            type="submit"
            @click="deleteServer()"
          >
            Xóa Server
            <!--tên nút -->
          </button>
        </div>
      </div>
    </div>
  </div>
  <ServerForm
    :serverprop="{
      id: this.server.id,
      IP: new String(this.server.IP).toString(),
      loai: new String(this.server.loai).toString(),
      ten: new String(this.server.ten).toString(),
      hdh: new String(this.server.hdh).toString(),
      id_HT: this.server.id_HT,
      pmkhac: new String(this.server.pmkhac).toString(),
      moitruong: new String(this.server.moitruong).toString(),
      csdl: new String(this.server.csdl).toString(),
      ngonngu: new String(this.server.ngonngu).toString(),
      ghichu: new String(this.server.ghichu).toString(),
      ocung: new String(this.server.ocung).toString(),
      ram: new String(this.server.ram).toString(),
      cardmanhinh: new String(this.server.cardmanhinh).toString(),
      hdh: new String(this.server.hdh).toString(),
    }"
    :e="true"
    @close="form = false"
    v-if="form === true"
    @updateServer="updateServer"
  ></ServerForm>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

import ProjectShareForm from "@/components/ProjectShareForm.vue";
import ServerForm from "@/components/ServerForm.vue";
import VueJwtDecode from "vue-jwt-decode";
import SettingiService from "@/services/settingi.service.js";
import UserService from "@/services/user.service";
import ProjectService from "@/services/project.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    ServerForm,
  },

  props: {
    serverprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
    d: { type: Boolean },
  },

  data() {
    return {
      d: this.d,
      form: false,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      server: this.serverprop,
      edit: this.e,
    };
  },

  mounted() {},

  methods: {
    async deleteServer() {
      let check = await SettingiService.deleteServer(this.server.id);
        if (check === true) {
          this.$toast.open({
            message: "Xóa server thành công",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
        }
        this.$emit("refresh");
        return;
    },
    async updateServer(data) {
      if (this.d === true) {
        let check = await SettingiService.updateServer(data);
        if (check === true) {
          this.$toast.open({
            message: "Cập nhật server thành công",
            type: "success",
            duration: 3000,
            dismissible: true,
          });
        }
        this.$emit("refresh");
        return;
      }
      this.server = data;
      this.$emit("updateServer", data);
      this.$toast.open({
        message: "Cập nhật server thành công",
        type: "success",
        duration: 3000,
        dismissible: true,
      });
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
</style>
