<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label class="" style="margin: auto; font-size: 20px"
            >Lịch sử cập nhật tài liệu</label
          >
        </div>

        <div class="modal-body" style="margin-bottom: 3vh; overflow-y: auto">
          <div class="row" v-for="(f, i) in file.LichSu" :key="f">
            <div class="col-10">
                <label>{{ format_datetime(f.ThoiGianChinhSua) }}</label>
                <p style="font-family: RalewayItalic; margin-bottom: 0px; margin-top:-5px" v-if="i===0">Phiên bản hiện tại</p>
                <p style="  ">Cập nhật bởi <b>{{ f.NguoiChinhSua.hoten }} ({{ f.NguoiChinhSua.manhanvien }})</b></p>
            </div>
            <div class="col">
                <a
                :href="`../../src/assets/file/doc${
                  f.TenFile
                }`"
                style="
                margin:auto;
                  text-decoration: none;
                  color: black;
                  margin-top: -4px;
                  padding-left: 15px;
                "
                title="Tải tài liệu"
                :download="`${file.TenTaiLieu}`"
                id="download"
                ><i class="fa-solid fa-download" style=""></i
              ></a>
            </div>
            <hr style="margin-top:-5px; margin-bottom:-5px; width:95%; margin-left:10px">
          </div>
          
        </div>
        <div class="text-center">
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
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import moment from "moment";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    fileprop: { type: Object, required: true },
  },

  data() {
    const FormSchema = yup.object({});

    return {
      file: this.fileprop,
      FormSchema,
    };
  },

  mounted() {
  },

  methods: {
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
  width: 500px;
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
</style>
