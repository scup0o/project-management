<template>
  <div class="modal-mask" v-if="this.next === false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px"
            >Thêm tài liệu</label
          >
          <!--tiêu đề-->
          <label v-else class="" style="margin: auto; font-size: 20px"
            >Chỉnh sửa tài liệu</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="createFile" :validation-schema="FormSchema">
          <div
            class="modal-body"
            :class="{
              long:
                (this.user.id === this.filepj.id_NguoiTao || this.edit === false) && ionly===true,
            }"
          >
            <!--chỉnh view chính từ khúc này-->
            <div
              class="row"
              v-if="
                (this.user.id === this.filepj.id_NguoiTao || this.edit === false) && ionly===true
              "
            >
              <div class="form-group">
                <div class="row">
                  <div class="col-4">
                    <label for="LoaiTaiLieu" style="margin-left: 3vw"
                      >Loại tài liệu:
                    </label>
                  </div>
                  <div class="col-8">
                    <div style="">
                      <Field
                        name="LoaiTaiLieu"
                        as="select"
                        :value="this.LoaiTaiLieu"
                        class=""
                        v-model="this.LoaiTaiLieu"
                        style="
                          width: 80%;
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          height: 5vh;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                      >
                        <option
                          v-for="(t, i) in typelist"
                          :key="t"
                          :value="t.ten"
                        >
                          {{ t.ten }}
                        </option>
                        <option
                          value="Loại tài liệu khác"
                          v-if="this.GiaiDoan != 'khac'"
                        >
                          Loại tài liệu khác
                        </option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row"
              v-if="
                ((this.user.id === this.filepj.id_NguoiTao &&
                  (this.LoaiTaiLieu === 'Loại tài liệu khác' ||
                    this.GiaiDoan === 'khac')) ||
                (this.edit === false &&
                  (this.LoaiTaiLieu === 'Loại tài liệu khác' ||
                    this.GiaiDoan === 'khac')))&& ionly===true
              "
              style="margin-top: 2.5vh"
            >
              <div class="col-4">
                <label for="TenLoaiTaiLieu" style="margin-left: 3vw"
                  >Tên loại tài liệu:
                </label>
              </div>
              <div class="col-8">
                <Field
                  name="TenLoaiTaiLieu"
                  type="text"
                  class="form-control"
                  style="width: 80%"
                  v-model="TenLoaiTaiLieu"
                >
                </Field>
                <ErrorMessage
                  name="TenLoaiTaiLieu"
                  class="error-feedback"
                ></ErrorMessage>
              </div>
            </div>
            <div
              class="row"
              style="margin-top: 2.5vh"
              v-if="
                (this.user.id === this.filepj.id_NguoiTao || this.edit === false) && ionly===true
              "
            >
              <div class="form-group">
                <div class="row">
                  <div class="col-4">
                    <label for="GiaiDoan" style="margin-left: 3vw"
                      >Giai đoạn:
                    </label>
                  </div>
                  <div class="col-8">
                    <div style="">
                      <Field
                        name="GiaiDoan"
                        as="select"
                        :value="GiaiDoan"
                        class=""
                        v-model="this.GiaiDoan"
                        style="
                          width: 80%;
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          height: 5vh;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                      >
                        <option value="truocdauthau">Trước đấu thầu</option>
                        <option value="saudauthau">Sau đấu thầu</option>
                        <option value="baohanh">Bảo hành, bảo trì</option>
                        <option value="khac">Các tài liệu khác</option>
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row"
              v-if="
                ((filelist[0] && this.edit === false) ||
                (this.user.id === this.filepj.id_NguoiTao && this.edit === true)) && ionly===true
              "
              style="margin-top: 2.5vh"
            >
              <div class="col-4">
                <label for="TenTaiLieu" style="margin-left: 3vw"
                  >Tên tài liệu: <p class="dot" style="padding-left:0">(*)</p>
                </label>
              </div>
              <div class="col-8">
                <Field
                  name="TenTaiLieu"
                  type="text"
                  class="form-control"
                  style="width: 80%"
                  v-model="filepj.TenTaiLieu"
                  @click="this.nameMessage = ''"
                >
                </Field>
                <ErrorMessage
                  name="TenTaiLieu"
                  class="error-feedback"
                ></ErrorMessage>
                <p class="error-feedback">{{ nameMessage }}</p>
              </div>
            </div>
            <div
              class="row"
              style="margin-top: 2.5vh"
              v-if="edit === false || ionly === false"
            >
              <div class="col-4">
                <label name="TaiLieu" style="margin-left: 3vw">Tài liệu:<p class="dot">(*)</p></label>
              </div>
              <div class="col-8">
                <div class="row" v-if="!filelist[0]">
                  <label
                    @click="
                      this.fileMessage = '';
                      this.nameMessage = '';
                    "
                    for="fileuploaded"
                    class="btn btn-info"
                    style="
                      width: 80%;
                      /*margin-left: 10px;*/
                      background-color: var(--secondary-color);
                      border-color: var(--secondary-color);
                      font-family: 'Raleway';
                      color: white;
                    "
                    ><i
                      class="fa-solid fa-arrow-up-from-bracket"
                      style="margin-right: 10px"
                    ></i
                    >{{ s }}</label
                  >
                  <p class="error-feedback" v-if="fileMessage != ''">
                    {{ fileMessage }}
                  </p>
                  <form
                    encType="multipart/form-data"
                    @submit="this.$emit('submit')"
                    action="/api/file"
                    method="post"
                  >
                    <input
                      type="file"
                      name="fileuploaded"
                      style="visibility: hidden"
                      @change="onFileChange"
                      encType="multipart/form-data"
                      id="fileuploaded"
                    />
                  </form>
                </div>
                <div class="row" v-if="filelist[0]">
                  <div class="col-2">
                    <i
                      class="fa-solid fa-file-word"
                      style="color: #2e58ff; font-size: 2.5vw"
                      v-if="
                        filepj.extension === '.docx' ||
                        filepj.extension === '.doc'
                      "
                    ></i>
                    <i
                      class="fa-solid fa-file-excel"
                      style="color: #197500; font-size: 2.5vw"
                      v-if="
                        filepj.extension === '.xlsx' ||
                        filepj.extension === '.xls'
                      "
                    ></i>
                    <i
                      class="fa-solid fa-file-powerpoint"
                      style="color: #db1a1a; font-size: 2.5vw"
                      v-if="
                        filepj.extension === '.ppt' ||
                        filepj.extension === '.pptx'
                      "
                    ></i>
                    <i
                      class="fa-solid fa-file-pdf"
                      style="color: #fd1212; font-size: 2.5vw"
                      v-if="filepj.extension === '.pdf'"
                    ></i>
                    <i
                      class="fa-solid fa-file"
                      style="color: #a1a1a1; font-size: 2.5vw"
                      v-if="
                        filepj.extension != '.pdf' &&
                        filepj.extension != '.ppt' &&
                        filepj.extension != '.pptx' &&
                        filepj.extension != '.xlsx' &&
                        filepj.extension != '.xls' &&
                        filepj.extension != '.docx' &&
                        filepj.extension != '.doc'
                      "
                    ></i>
                  </div>
                  <div class="col-8">
                    <p>{{ filelist[0].name }}</p>
                  </div>

                  <div class="col-1">
                    <i
                      class="fa-regular fa-circle-xmark"
                      style="color: #a8a8a8"
                      @click="this.filelist = []"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <!--chỉnh view chính tới khúc này-->
          </div>
          <div class="text-center">
            <button
              v-if="(edit === false || this.user.id === this.filepj.id_NguoiTao)&&ionly===true"
              class="btn btn-dark"
              style="margin-right: 10px; width: 150px"
              type="submit"
            >
              Tiếp tục
            </button>
            <button v-else class="btn btn-dark" style="margin-right: 10px" type="submit" >
              Cập nhật
            </button>
            <button
              @click="$emit('close'), $emit('refresh')"
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
  <FileShareForm
    v-if="this.next === true"
    @close="this.next = false"
    @closeall="
      $emit('close');
      $emit('refresh');
      this.next = false;
    "
    :fileprop="filepj"
    :e="edit"
  >
  </FileShareForm>
</template>
<script>
import "@/assets/css/base.css";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import FileService from "@/services/file.service";
import DoctypeService from "@/services/doctype.service";
import FileShareForm from "@/components/FileShareForm.vue";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    FileShareForm,
  },

  props: {
    fileprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
    project: { type: Object, required: true },
    io: { type: Boolean, required: true },
  },

  emits: ["refresh"],

  watch: {
    GiaiDoan() {
      this.getType();
    },
    next() {
      this.checkType();
    },
  },

  data() {

    return {
      ionly: this.io,
      pj: this.project,
      s: "Thêm tệp",
      edit: this.e,
      filepj: this.fileprop,
      file: null,
      filelist: [],
      fileMessage: "",
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      typelist: [],
      GiaiDoan: new String(this.fileprop.GiaiDoan),
      TenLoaiTaiLieu: "",
      LoaiTaiLieu: new String(this.fileprop.LoaiTaiLieu),
      next: false,
      tempLoai: "",
    };
  },

  mounted() {
    this.getType();
    if (this.edit === true) {
      this.s = "Chọn tệp cập nhật";
      this.checkType();
    }
  },

  methods: {
    async checkType() {
      let index = -1;
      index = this.typelist.findIndex((x) => x.ten === this.LoaiTaiLieu);
      if (index === -1) {
        this.TenLoaiTaiLieu = new String(this.LoaiTaiLieu);
        this.LoaiTaiLieu = "Loại tài liệu khác";
      }
    },

    onFileChange(e) {
      this.haveData = false;
      this.file = e.target.files;
      console.log(e.target.files);
      var selectedFiles = e.target.files;

      for (let i = 0; i < selectedFiles.length; i++) {
        let reader = new FileReader();
        this.filelist[0] = selectedFiles[i];
        reader.readAsDataURL(selectedFiles[i]);
        console.log(this.filelist);
        if (this.edit === false)
          this.filepj.TenTaiLieu = this.filelist[0].name.split(".")[0];
        this.filepj.extension = this.filelist[0].name.substring(
          this.filelist[0].name.indexOf("."),
          this.filelist[0].name.length
        );
        console.log(this.filepj);
      }
    },

    async getType() {
      this.typelist = await DoctypeService.getType(this.GiaiDoan);
      if (this.typelist.length > 0) {
        this.LoaiTaiLieu = this.typelist[0].ten;
      } else {
        this.LoaiTaiLieu = "Loại tài liệu khác";
      }
      console.log(this.filepj);
    },

    async createFile(data) {
      try {
        //if="this.LoaiTaiLieu==='Loại tài liệu khác' || this.GiaiDoan==='khac'"
        if (this.filelist[0] !== undefined) {
          
        } else {
            this.fileMessage = "Chọn file cần tải lên";
        }
        if (
          (data.TenTaiLieu === null ||
            data.TenTaiLieu === undefined ||
            data.TenTaiLieu.length === 0) &&
          (this.ionly===true)
        ) {
          this.nameMessage = "Tên tài liệu không được để trống";
        } else {
          if (this.ionly === false) {
            if (this.filelist[0] !== undefined) {
              console.log("uploading file....");
              this.filepj.id_NguoiChinhSua = this.user.id;
              this.filepj.check = "normal-update";
              let check = await FileService.update(this.filepj);
              let s = check + this.filepj.extension;
              console.log(s);
              console.log(this.filepj);
              await FileService.upload(
                "doc" + check + this.filepj.extension,
                this.file
              );
              this.$toast.open({
                message: "Cập nhật tài liệu thành công",
                type: "success",
                duration: 3000,
                dismissible: true,
              });
              this.$emit("close");
              this.$emit("refresh");
            } else {
              if (
                this.edit === false ||
                this.user.id !== this.filepj.id_NguoiTao
              )
                this.fileMessage = "Chọn file cần tải lên";
            }
          } else {
            data.step = "check";
            let check;
            if (this.user.id === this.filepj.id_NguoiTao) {
              data.id = this.filepj.id;
              data.id_DuAn = this.filepj.id_DuAn;
              check = await FileService.update(data);
            }

            if (this.edit === false) {
              data.id_DuAn = this.pj.id;
              check = await FileService.create(data);
            }

            console.log(check);
            if (check === false) {
              this.nameMessage = "Tên tài liệu đã tồn tại trong dự án";
            } else {
              if (
                data.LoaiTaiLieu === "Loại tài liệu khác" ||
                data.GiaiDoan === "khac"
              ) {
                console.log(data.TenLoaiTaiLieu);
                if (data.TenLoaiTaiLieu.length === 0) {
                  this.LoaiTaiLieu = "Loại tài liệu khác";
                } else {
                  this.LoaiTaiLieu = new String(this.TenLoaiTaiLieu);
                }
              }
              if (this.edit===false)this.filepj.GiaiDoan = new String(this.GiaiDoan);
              this.filepj.LoaiTaiLieu = new String(this.LoaiTaiLieu);
              if (this.edit === true) {
                this.filepj.tempGiaiDoan = new String(this.GiaiDoan);
                if (this.filelist[0] != undefined) {
                  this.filepj.file = this.file;
                } else {
                  this.filepj.file = "no";
                }
                this.next = true;
              } else {
                console.log(this.file);
                //await FileService.upload('a.docx', this.file.file);
                this.filepj.id_DuAn = this.pj.id;
                this.filepj.file = this.file;
                this.next = true;
              }
            }
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

  background-color: white;
  padding: 20px;
}

.long {
  height: 30vh;
}
</style>
