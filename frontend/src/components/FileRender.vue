<template>
  <div class="row" style="max-height: 76vh; overflow-y: auto">
    <div
      class="col-12"
      v-for="(file, index) in files"
      :key="file"
      style="padding-bottom: 1vh; padding-top: 1vh"
    >
      <div class="card">
        <div class="row d-flex align-items-center">
          <div class="row">
            <label v-snip="{ lines: 1 }">{{ file.TenTaiLieu }}</label>
          </div>
          <div class="row">
            <label
              v-snip="{ lines: 1 }"
              style="color: gray; font-family: Raleway"
              >{{ file.LoaiTaiLieu }}</label
            >
          </div>
          <div class="row">
            <p
              v-snip="{ lines: 3 }"
              style="font-family: RalewayItalic; font-size: 1vw"
            >
              
            {{ file.NguoiTao.hoten}} ({{ file.NguoiTao.manhanvien }})
            </p>
          </div>
          <div class="row" id="util-button">
            <div class="col">
              <i
                class="fa-solid fa-file-word"
                style="color: #2e58ff; font-size: 1.2vw"
                v-if="file.LoaiFile === '.docx' || file.LoaiFile === '.doc'"
              ></i>
              <i
                class="fa-solid fa-file-excel"
                style="color: #197500; font-size: 1.2vw"
                v-if="file.LoaiFile === '.xlsx' || file.LoaiFile === '.xls'"
              ></i>
              <i
                class="fa-solid fa-file-powerpoint"
                style="color: #db1a1a; font-size: 1.2vw"
                v-if="file.LoaiFile === '.ppt' || file.LoaiFile === '.pptx'"
              ></i>
              <i
                class="fa-solid fa-file-pdf"
                style="color: #fd1212; font-size: 1.1vw"
                v-if="file.LoaiFile === '.pdf'"
              ></i>
              <i
                class="fa-solid fa-file"
                style="color: #a1a1a1; font-size: 1.2vw"
                v-if="
                  file.LoaiFile != '.pdf' &&
                  file.LoaiFile != '.ppt' &&
                  file.LoaiFile != '.pptx' &&
                  file.LoaiFile != '.xlsx' &&
                  file.LoaiFile != '.xls' &&
                  file.LoaiFile != '.docx' &&
                  file.LoaiFile != '.doc'
                "
              ></i>
            </div>
            <div class="col-10 d-flex justify-content-end">
              <i
                v-if="file.id_NguoiTao === user.id"
                class="fa-solid fa-trash-can"
                id="util-icon"
                title="Xóa tài liệu"
                @click="deleteFile(file)"
              ></i>
              <i
                class="fa-solid fa-clock-rotate-left"
                id="util-icon"
                title="Lịch sử cập nhật"
                @click="
                  editFile = file;
                  getUser();
                "
              ></i>
              <i
                v-if="file.e === true"
                class="fa-solid fa-upload"
                @click="(editFile = file), (edit = true), ionly=false"
                id="util-icon"
                style="display: inline"
                title="Cập nhật tài liệu"
              ></i>
              <a
                :href="`../../src/assets/file/doc${
                  file.LichSu[0].TenFile
                }`"
                style="
                  text-decoration: none;
                  color: black;
                  margin-top: -4px;
                "
                title="Tải tài liệu"
                :download="`${file.TenTaiLieu}`"
                id="download"
                ><i class="fa-solid fa-download " id="util-icon" style=""></i
              ></a>
              
              <i
                v-if="file.id_NguoiTao===user.id"
                class="fa-solid fa-pen"
                @click="(editFile = file), (edit = true)"
                id="util-icon"
                style="display: inline"
                title="Cập nhật thông tin"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FileHistory
    v-if="i === true"
    :fileprop="editFile"
    @close="i = false"
    @refresh="this.$emit('refresh')"
  >
  </FileHistory>
  <FileInfoForm
    v-if="edit === true"
    :fileprop="editFile"
    :e="true"
    :io="ionly"
    @close="edit=false; ionly=true"
    @refresh="this.$emit('refresh')"
  >
  </FileInfoForm>
</template>
<script>
import FileHistory from "@/components/FileHistory.vue";
import FileService from "@/services/file.service";
import UserService from "@/services/user.service";
import VueJwtDecode from "vue-jwt-decode";
import moment from "moment";
import FileInfoForm from "@/components/FileInfoForm.vue";

export default {
  components: {
    FileHistory,
    FileInfoForm
  },
  emits: ["refresh"],

  props: {
    files: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      ionly:true,
      editFile: null,
      edit: false,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      i: false,
    };
  },

  mounted() {
  },

  methods: {
    async getUser() {
      let i = 0;
      while (i < this.editFile.LichSu.length) {
        this.editFile.LichSu[i].NguoiChinhSua = await UserService.get(
          this.editFile.LichSu[i].id_NguoiChinhSua
        );
        i++;
      }
      this.i=true;
    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
    },

    async deleteFile(data) {
      try {
        if (confirm(`Bạn có chắc muốn xóa tài liệu ${data.TenTaiLieu}?`)) {
          const check = await FileService.delete(data.id);
          if (check != true) {
            this.$toast.open({
              message: "Xóa tài liệu thất bại",
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: "Tài liệu đã được xóa",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("refresh");
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
label {
  font-family: "RalewayBold";
}
.card {
  margin: auto;
  width: 96%;
  background-color: var(--bar-color);
  padding: 15px;
  padding-right: 0px;
  border: 1px solid rgb(192, 192, 192);
  box-shadow: 0 2px 8px rgba(176, 176, 176, 0.33);
  max-height: fit-content;
}

.card:hover {
  transform: scale(1.03);
  z-index: 999;
  background-color: rgb(219, 221, 240);
}

.card:hover .file {
  visibility: visible;
}

.file {
  font-size: 1vw;
  visibility: hidden;
}

.file:hover {
  text-decoration: underline;
  cursor: pointer;
}

.parent:hover #child {
  visibility: visible;
}

.card:hover #description-box {
  height: 90px;
}

#description-box {
  height: 50px;
}

#util-icon {
  padding-left: 20px;
}

#util-icon:hover {
  cursor: pointer;
  transform: scale(1.2);
}

.menu {
  position: absolute;
  z-index: 999;
  margin-left: -10vw;
  margin-top: -6.5vw;
  width: 11vw;
  font-size: 1vw;
  font-family: Raleway;
  font-weight: normal;
  background-color: rgb(233, 241, 250);
  padding: 10px 20px 15px 20px;
  border-radius: 5px 5px 5px 5px;
  border: 0.1px solid rgb(144, 144, 144);
}

#child {
  visibility: hidden;
}

.text-menu:hover {
  text-decoration: underline;
  cursor: pointer;
}

.text-menu {
  padding-left: 10px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
