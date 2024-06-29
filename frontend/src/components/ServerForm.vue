<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-header">
          <label
            v-if="edit === false"
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Thêm Server</label
          >
          <!--tiêu đề-->
          <label
            v-else
            class=""
            style="margin: auto; font-size: 20px; font-family: RalewayBlack"
            >Chỉnh sửa Server</label
          >
        </div>
        <!--tiêu đề-->
        <Form @submit="create" :validation-schema="FormSchema">
          <div class="modal-body" style="margin-bottom: 3vh">
            <!--chỉnh view chính từ khúc này-->

            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ten"
                    >Tên Server:
                    <p class="dot">(*)</p></label
                  >
                </div>
                <div class="col-8">
                  <Field
                    name="ten"
                    type="text"
                    class="form-control"
                    v-model="server.ten"
                  >
                  </Field>
                  <ErrorMessage
                    name="ten"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="loai">Loại Server: </label>
                </div>
                <div class="col-8">
                  <Field
                    as="select"
                    name="loai"
                    value="app"
                    class=""
                    style="
                      width: 100%;
                      border-width: 1.55px;
                      border-color: var(--secondary-color);
                      box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                      height: 5vh;
                      border-radius: 5px 5px 5px 5px;
                      text-align: center;
                    "
                    @click="
                      (this.nnMes = ''), (csdlMes = ''), check(server.loai)
                    "
                    v-model="server.loai"
                    ><option value="app" @click="(loaikhac = ''), (pb = '')">
                      App
                    </option>
                    <option value="web" @click="(loaikhac = ''), (pb = '')">
                      Web
                    </option>
                    <option value="csdl" @click="(loaikhac = ''), (pb = '')">
                      Cơ sở dữ liệu
                    </option>
                    <option
                      value="khac"
                      @click="(o = true), (loaikhac = ''), (pb = '')"
                    >
                      Khác
                    </option>
                  </Field>
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
                <div class="col-8">
                  <div class="row" v-if="server.loai === 'csdl'">
                    <div class="col">
                      <Field
                        name="csdl"
                        onfocus="this.size=10;"
                        onblur="this.size=1;"
                        onchange="this.size=1; this.blur();"
                        as="select"
                        :class="{ long: server.csdl === 'khac' }"
                        v-model="server.csdl"
                        style="
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          min-height: 5vh;
                          max-height: 10vh;
                          overflow-y: auto;
                          position: absolute;
                          width: 10vw;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                      >
                        <option
                          :value="p.ten"
                          v-for="(p, i) in csdl"
                          @click="(o = true), (loaikhac = ''), (pb = '')"
                        >
                          <p v-snip="{ lines: 1 }" style="width: 50px">
                            {{ p.ten }}
                          </p>
                        </option>
                        <option value="khac" @click="o = false">Khác</option>
                      </Field>
                    </div>
                    <div class="col" v-if="server.csdl != 'khac'">
                      <Field
                        placeholder="Version"
                        name="pbcsdl"
                        type="text"
                        class="form-control"
                        v-model="pbcsdl"
                      >
                      </Field>
                    </div>
                  </div>
                  <div
                    class="row"
                    v-if="server.loai != 'csdl' && server.loai != 'khac'"
                  >
                    <div class="col">
                      <Field
                        name="ngonngu"
                        onfocus="this.size=10;"
                        onblur="this.size=1;"
                        onchange="this.size=1; this.blur();"
                        as="select"
                        v-model="server.ngonngu"
                        :class="{ long: server.ngonngu === 'khac' }"
                        style="
                          z-index: 10;
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          min-height: 5vh;
                          max-height: 10vh;
                          overflow-y: auto;
                          position: absolute;
                          width: 10vw;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                        ><option
                          :value="p.ten"
                          v-for="(p, i) in nn"
                          @click="(o = true), (loaikhac = ''), (pb = '')"
                        >
                          <p v-snip="{ lines: 1 }" style="width: 50px">
                            {{ p.ten }}
                          </p>
                        </option>
                        <option value="khac" @click="o = false">Khác</option>
                      </Field>
                    </div>
                    <div class="col" v-if="server.ngonngu != 'khac'">
                      <Field
                        placeholder="Version"
                        name="pbnn"
                        type="text"
                        class="form-control"
                        v-model="pbnn"
                      >
                      </Field>
                    </div>
                  </div>

                  <p v-if="csdlMes != ''" class="error-feedback">
                    {{ csdlMes }}
                  </p>

                  <p v-if="nnMes != ''" class="error-feedback">{{ nnMes }}</p>
                </div>
              </div>
            </div>
            <div class="row spacing" v-if="o === false" :key="o">
              <div class="col"></div>
              <div class="col-8">
                <div class="row">
                  <div class="col">
                    <Field
                      placeholder="Tên"
                      name="loaikhac"
                      type="text"
                      class="form-control"
                      v-model="loaikhac"
                    >
                    </Field>
                  </div>
                  <div class="col">
                    <Field
                      placeholder="Version"
                      name="pb"
                      type="text"
                      class="form-control"
                      v-model="pb"
                    >
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group" v-if="server.loai === 'web'">
              <div class="row spacing">
                <div class="col">
                  <label>Môi trường vận hành: </label>
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="col">
                      <Field
                        name="moitruong"
                        onfocus="this.size=10;"
                        onblur="this.size=1;"
                        onchange="this.size=1; this.blur();"
                        as="select"
                        v-model="server.moitruong"
                        :class="{ long: server.moitruong === 'khac' }"
                        style="
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          min-height: 5vh;
                          max-height: 10vh;
                          overflow-y: auto;
                          position: absolute;
                          width: 10vw;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                      >
                        <option
                          :value="p.ten"
                          v-for="(p, i) in mt"
                          @click="(loaimtkhac = ''), (pbmt = '')"
                        >
                          <p v-snip="{ lines: 1 }" style="width: 50px">
                            {{ p.ten }}
                          </p>
                        </option>
                        <option value="khac" @click="pbmt = ''">Khác</option>
                      </Field>
                    </div>
                    <div class="col" v-if="server.moitruong != 'khac'">
                      <Field
                        placeholder="Version"
                        name="pbmt"
                        type="text"
                        class="form-control"
                        v-model="pbmt"
                      >
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row spacing"
              v-if="server.moitruong === 'khac' && server.loai === 'web'"
            >
              <div class="col"></div>
              <div class="col-8">
                <div class="row">
                  <div class="col">
                    <Field
                      placeholder="Tên"
                      name="loaimtkhac"
                      type="text"
                      class="form-control"
                      v-model="loaimtkhac"
                    >
                    </Field>
                  </div>
                  <div class="col">
                    <Field
                      placeholder="Version"
                      name="pbmt2"
                      type="text"
                      class="form-control"
                      v-model="pbmt2"
                    >
                    </Field>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label>Các framework/ phần mềm sử dụng khác: </label>
                </div>
                <div class="col-8">
                  <Field
                    name="pmkhac"
                    as="textarea"
                    class="form-control"
                    v-model="server.pmkhac"
                  >
                  </Field>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="IP"
                    >IP:
                    <p class="dot">(*)</p></label
                  >
                </div>
                <div class="col-8">
                  <div class="row">
                    <div class="col">
                      <Field
                        name="IP"
                        type="text"
                        class="form-control"
                        v-model="server.IP"
                        @click="IPMes = ''"
                      >
                      </Field>
                    </div>
                    <div class="col-4">
                      <Field
                        name="loaiIP"
                        as="select"
                        class=""
                        style="
                          width: 100%;
                          border-width: 1.55px;
                          border-color: var(--secondary-color);
                          box-shadow: 0.5px 0.5px 7px 0.5px rgb(226, 227, 232);
                          height: 5vh;
                          border-radius: 5px 5px 5px 5px;
                          text-align: center;
                        "
                        v-model="loaiIP"
                        @click="IPMes = ''"
                      ><option value="ipv4">Ipv4</option>
                      <option value="ipv6">Ipv6</option>
                      </Field>
                    </div>
                    <ErrorMessage
                      name="IP"
                      class="error-feedback"
                    ></ErrorMessage>
                    <p class="error-feedback" v-if="IPMes != ''">{{ IPMes }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="hdh">Hệ điều hành: </label>
                </div>
                <div class="col-8">
                  <Field
                    name="hdh"
                    type="text"
                    class="form-control"
                    v-model="server.hdh"
                  >
                  </Field>
                  <ErrorMessage
                    name="hdh"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ram">RAM: </label>
                </div>
                <div class="col-8">
                  <Field
                    name="ram"
                    type="text"
                    class="form-control"
                    v-model="server.ram"
                  >
                  </Field>
                  <ErrorMessage
                    name="ram"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ocung">Ổ cứng: </label>
                </div>
                <div class="col-8">
                  <Field
                    type="text"
                    name="ocung"
                    class="form-control"
                    style=""
                    v-model="server.ocung"
                  >
                  </Field>

                  <ErrorMessage
                    name="ocung"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="cardmanhinh">Card màn hình: </label>
                </div>
                <div class="col-8">
                  <Field
                    name="cardmanhinh"
                    type="text"
                    class="form-control"
                    v-model="server.cardmanhinh"
                  >
                  </Field>
                  <ErrorMessage
                    name="cardmanhinh"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row spacing">
                <div class="col">
                  <label for="ghichu">Thông tin ghi chú: </label>
                </div>
                <div class="col-8">
                  <Field
                    rows="3"
                    as="textarea"
                    name="ghichu"
                    class="form-control"
                    style=""
                    v-model="server.ghichu"
                  >
                  </Field>

                  <ErrorMessage
                    name="ghichu"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
              </div>
            </div>
            <!--chỉnh view chính tới khúc này-->
          </div>
          <div class="text-center">
            <button
              v-if="this.edit === false"
              class="btn btn-dark"
              style="margin-right: 10px; width: 10vw"
              type="submit"
            >
              Thêm server
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
import ipRegex from "ip-regex";

import ProjectShareForm from "@/components/ProjectShareForm.vue";

import VueJwtDecode from "vue-jwt-decode";
import UserService from "@/services/user.service";
import DoctypeService from "@/services/doctype.service";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },

  props: {
    serverprop: { type: Object, required: true },
    e: { type: Boolean, required: true },
  },

  data() {
    /*function ipv4(message = "IP không hợp lệ") {
      return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
        message,
        excludeEmptyString: true,
      }).test("ip", message, (value) => {
        return value === undefined || value.trim() === ""
          ? true
          : value.split(".").find((i) => parseInt(i, 10) > 255) === undefined;
      });
    }

    yup.addMethod(yup.string, "ipv4", ipv4);*/
    const FormSchema = yup.object({
      IP: yup.string().required("IP không được để trống") /*.ipv4()*/,

      ten: yup.string().required("Tên không được để trống"),
    });
    return {
      IPMes: "",
      form: false,
      FormSchema,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      server: this.serverprop,
      edit: this.e,
      nnMes: "",
      csdlMes: "",
      nn: [],
      mt: [],
      csdl: [],
      o: true,
      pbcsdl: "",
      pbnn: "",
      pbmt: "",
      pb: "",
      loaimtkhac: "",
      loaikhac: "",
      pbmt2: "",
      loaiIP: "ipv4",
    };
  },

  mounted() {
    console.log(this.server);
    this.getDM();

    if (this.edit === true) {
      if (this.server.IP.length>32) this.loaiIP = 'ipv6';
      if (this.server.loai === "app") {
        this.pbnn = this.server.ngonngu.split("version")[1];
        if (this.server.ngonngu.split("()")[0] === "khac") {
          this.o = false;
          console.log(this.server.ngongu);
          let temp = this.server.ngonngu.split("()")[1];
          this.server.ngonngu = "khac";
          if (temp != "version") this.loaikhac = temp.split("version")[0];
          else this.loaikhac = "";
          this.pb = temp.split("version")[1];
        }
        this.server.ngonngu = this.server.ngonngu.split("()")[0];
      }
      if (this.server.loai === "web") {
        this.pbmt = this.server.moitruong.split("version")[1];
        this.pbnn = this.server.ngonngu.split("version")[1];

        if (this.server.ngonngu.split("()")[0] === "khac") {
          this.o = false;
          let temp = this.server.ngonngu.split("()")[1];
          this.server.ngonngu = "khac";
          if (temp != "version") this.loaikhac = temp.split("version")[0];
          else this.loaikhac = "";
          this.pb = temp.split("version")[1];
        }

        if (this.server.moitruong.split("()")[0] === "khac") {
          this.loaimtkhac = this.server.moitruong
            .split("()")[1]
            .split("version")[0];
          this.pbmt2 = this.server.moitruong.split("version")[1];
        }
        this.server.moitruong = this.server.moitruong.split("()")[0];
        this.server.ngonngu = this.server.ngonngu.split("()")[0];
      }

      if (this.server.loai === "csdl") {
        this.pbcsdl = this.server.csdl.split("version")[1];
        if (this.server.csdl.split("()")[0] === "khac") {
          this.o = false;
          let temp = this.server.csdl.split("()")[1];
          this.server.csdl = "khac";
          if (temp != "version") this.loaikhac = temp.split("version")[0];
          else this.loaikhac = "";
          this.pb = temp.split("version")[1];
        }
        this.server.csdl = this.server.csdl.split("()")[0];
      }
    }
  },

  methods: {
    async check(s) {
      this.o = true;
      if (s === "khac") {
        this.o = true;
        return;
      }
      if (s === "csdl") {
        if (this.server.csdl === "khac") this.o = false;
      } else if (this.server.ngonngu === "khac") this.o = false;
      console.log(this.o);
    },
    async getDM() {
      this.nn = await DoctypeService.getAll("ngonngu");
      this.mt = await DoctypeService.getAll("moitruong");
      this.csdl = await DoctypeService.getAll("csdl");
      if (this.edit === false) {
        this.server.ngonngu = this.nn[0].ten;
        this.server.csdl = this.csdl[0].ten;
        this.server.moitruong = this.mt[0].ten;
      } else {
        if (this.server.loai === "csdl") {
          this.server.moitruong = this.mt[0].ten;
          this.server.ngonngu = this.nn[0].ten;
        } else {
          this.server.csdl = this.csdl[0].ten;
          if (this.server.loai === "app")
            this.server.moitruong = this.mt[0].ten;
        }
      }
    },

    async create(data) {
      if (this.loaiIP === "ipv4") {
        if (!ipRegex.v4({ exact: true }).test(data.IP)) {
          this.IPMes = "IP không hợp lệ";
          return;
        }
      } else {
        if (!ipRegex.v6({ exact: true }).test(data.IP)) {
          this.IPMes = "IP không hợp lệ";
          return;
        }
      }

      data.id = this.server.id;
      if (
        typeof data.loaikhac === "undefined" ||
        data.loaikhac === null ||
        data.loaikhac.length === 0
      )
        data.loaikhac = "";

      if (
        typeof data.pb === "undefined" ||
        data.pb === null ||
        data.pb.length === 0
      )
        data.pb = "";
      if (
        typeof data.loaimtkhac === "undefined" ||
        data.loaimtkhac === null ||
        data.loaimtkhac.length === 0
      )
        data.loaimtkhac = "";

      if (
        typeof data.pbmt === "undefined" ||
        data.pbmt === null ||
        data.pbmt.length === 0
      )
        data.pbmt = "";
      if (data.loai === "khac") {
        data.csdl = "";
        data.ngonngu = "";
        data.moitruong = "";
      }
      if (data.loai === "csdl") {
        data.ngonngu = "";
        data.moitruong = "";
        if (data.csdl === "") {
          this.csdlMes = "CSDL không được để trống";
          return;
        }
        if (data.csdl != "khac") data.pb = data.pbcsdl;
        data.csdl = data.csdl + "()" + data.loaikhac + "version" + data.pb;
      }
      if (data.loai === "web" || data.loai === "app") {
        data.csdl = "";
        if (data.moitruong === "khac") data.pbmt = data.pbmt2;
        data.moitruong =
          data.moitruong + "()" + data.loaimtkhac + "version" + data.pbmt;
        if (data.ngonngu === "") {
          this.nnMes = "Ngôn ngữ sử dụng không được để trống";
          return;
        }
        if (data.ngonngu != "khac") data.pb = data.pbnn;
        data.ngonngu =
          data.ngonngu + "()" + data.loaikhac + "version" + data.pb;
      }
      if (data.pmkhac === "") {
        data.pmkhac = "Không có thông tin";
      }
      if (data.ghichu === "") {
        data.ghichu = "Không có thông tin";
      }
      if (data.ocung === "") {
        data.ocung = "Không có thông tin";
      }
      if (data.ram === "") {
        data.ram = "Không có thông tin";
      }
      if (data.cardmanhinh === "") {
        data.cardmanhinh = "Không có thông tin";
      }
      if (data.hdh === "") {
        data.hdh = "Không có thông tin";
      }
      console.log(data);
      if (this.edit === false) this.$emit("createServer", data);
      else {
        this.$emit("updateServer", data);
      }
      this.$emit("close");
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

.long {
  width: 22vw !important;
}
</style>
