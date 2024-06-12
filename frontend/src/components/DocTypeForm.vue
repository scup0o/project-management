<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            class=""
            style="margin: auto; font-size: 20px"
            v-if="edit === false"
            >Thêm thể loại</label
          >
          <label class="" style="margin: auto; font-size: 20px" v-else
            >Chỉnh sửa thể loại</label
          >
        </div>
        <Form @submit="createDoctype" :validation-schema="FormSchema">
          <div class="modal-body">
            <div class="row">
              <div class="form-group">
                <label for="name">Tên thể loại: </label>
                <Field
                  name="name"
                  type="text"
                  class="form-control"
                  v-model="doctypeNew.name"
                >
                </Field>
                <ErrorMessage name="name" style="color: red"></ErrorMessage>
                <p style="color: red">{{ nameMessage }}</p>
              </div>
            </div>
            <div class="row">
              <div class="form-group">
                <label for="description">Giới thiệu thể loại: </label>
                <Field
                  as="textarea"
                  name="description"
                  type="text"
                  class="form-control"
                  v-model="doctypeNew.description"
                  style="height: 150px"
                >
                </Field>
                <ErrorMessage
                  name="description"
                  class="error-feedback"
                  as="p"
                ></ErrorMessage>
              </div>
            </div>

            <div style="padding-top: 20px">
              <label name="image">Hình ảnh</label>
              <label
                for="fileuploaded"
                class="btn btn-info"
                style="
                  margin-left: 10px;
                  background-color: var(--secondary-color);
                  border-color: var(--secondary-color);
                  font-family: 'Raleway';
                  color: white;
                "
                >Chọn hình ảnh</label
              >
              <form
                encType="multipart/form-data"
                @submit="this.$emit('submit')"
                action="/api/img"
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
                <div class="row">
                  <div v-if="doctypeNew.image && haveData === true">
                    <img
                      style="display: inline-flex"
                      class="preview img-thumbnail"
                      :src="`../../src/assets/img/${doctypeNew.image}`"
                    />
                    {{ doctypeNew.image }}
                  </div>
                  <div v-for="(image, key) in images">
                    <div :id="key">
                      <img
                        style="display: inline-flex"
                        class="preview img-thumbnail"
                        v-bind:ref="'image' + parseInt(0)"
                      />
                      {{ image.name }}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="text-center">
            <button
              v-if="edit === false"
              class="btn btn-info form-button"
              style="margin-right: 10px"
            >
              Thêm thể loại
            </button>
            <button
              v-else
              class="btn btn-info form-button"
              style="margin-right: 10px"
            >
              Lưu thể loại
            </button>
            <button
              @click="$emit('close'), $emit('refresh')"
              class="btn btn-info form-button"
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
import DoctypeService from "@/services/doctype.service";
import FileService from "@/services/file.service";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    doctype: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    const FormSchema = yup.object({
      name: yup
        .string()
        .required("Tên không được để trống")
        .min(2, "Tên phải ít nhất 2 ký tự.")
        .max(50, "Tên có nhiều nhất 50 ký tự."),
    });

    return {
      edit: this.e,
      doctypeNew: this.doctype,
      FormSchema,
      img: null,
      images: [],
      nameMessage: "",
      haveData: true,
    };
  },

  mounted() {},

  methods: {
    onFileChange(e) {
      this.haveData = false;
      console.log(e.target.files);
      this.img = e.target.files;
      console.log(this.img);
      var selectedFiles = e.target.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        this.images[0] = selectedFiles[i];
      }
      for (let i = 0; i < this.images.length; i++) {
        let reader = new FileReader(); //instantiate a new file reader
        reader.addEventListener(
          "load",
          function () {
            this.$refs["image" + parseInt(i)][0].src = reader.result;
          }.bind(this),
          false
        ); //add event listener
        console.log(reader.result);

        reader.readAsDataURL(this.images[i]);
        console.log(this.images);
      }
    },

    async onFileSelected(event) {
      try {
        await ImgService.upload(event);
      } catch (error) {
        console.log(error);
      }
    },

    async createDoctype(data) {
      try {
        if (
          data.description === undefined ||
          data.description === null ||
          data.description === ""
        )
          data.description = "Không có mô tả";
        if (this.images[0] !== undefined) {
          data.image = this.images[0].name;
        }
        if (this.edit === false) {
          const check = await DoctypeService.create(data);
          if (check === false) {
            this.nameMessage = "Tên thể loại đã tồn tại";
          } else {
            const headers = { "Content-Type": "multipart/form-data" };
            if (this.images[0] !== undefined)
              await ImgService.upload(this.img, { headers });
            this.$toast.open({
              message: "Thêm thể loại thành công",
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.$emit("close");
            this.$emit("refresh");
          }
        } else {
          const check = await DoctypeService.update(this.doctypeNew._id, data);
          if (check === false) {
            this.nameMessage = "Tên thể loại đã tồn tại";
          } else {
            const headers = { "Content-Type": "multipart/form-data" };
            if (this.images[0] !== undefined)
              await ImgService.upload(this.img, { headers });
            this.$toast.open({
              message: "Chỉnh sửa thể loại thành công",
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
.error-feedback {
  color: red;
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
  height: 400px;
  background-color: white;
  padding: 20px;
}
</style>
