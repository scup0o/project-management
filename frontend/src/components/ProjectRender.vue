<template>
  <div class="row" style="max-height: 76vh; min-height: 76vh; overflow-y: auto">
    <div
      class="col-12"
      v-for="(project, index) in projects"
      :key="project"
      style="padding-bottom: 1vh; padding-top: 1vh"
    >
      <div class="card">
        <div class="row d-flex align-items-center">
          <div class="row">
            <label v-snip="{ lines: 1 }">{{ project.Ten }}</label>
          </div>
          <div class="row">
            <label
              v-snip="{ lines: 1 }"
              style="color: gray; font-family: Raleway"
              >{{ project.Ma }}</label
            >
          </div>
          <div class="row">
            <p
              v-snip="{ lines: 3 }"
              style="font-family: RalewayItalic; font-size: 1vw"
            >
              {{ project.MoTa }}
            </p>
          </div>
          <div class="row" id="util-button">
            <div class="col-12 d-flex justify-content-end">
              <i
                v-if="
                  project.id_NguoiTao === user.id && project.loai != 'luu tru'
                "
                class="fa-solid fa-box-archive"
                @click="archiveProject(project, 'a')"
                id="util-icon"
                title="Lưu trữ dự án"
              ></i>
              <i
                class="fa-solid fa-boxes-packing"
                v-if="project.loai==='luu tru'"
                @click="archiveProject(project, 'u')"
                id="util-icon"
                title="Hủy lưu trữ dự án"
              ></i>
              <i
                v-if="project.loai === 'luu tru'"
                class="fa-solid fa-trash-can"
                id="util-icon"
                title="Xóa dự án"
                @click="deleteProject(project)"
              ></i>
              <i
                class="fa-solid fa-calendar-days"
                id="util-icon"
                title="Sự kiện"
              ></i>
              <i
                class="fa-solid fa-ellipsis-vertical parent"
                @click="(editProject = project), (edit = true)"
                id="util-icon"
                style="display: inline"
                title="Thông tin"
                ><div class="menu" id="child">
                  <div class="row text-menu" @click="iOpenUp(project)" style="">
                    Thông tin chung
                  </div>
                  <hr style="width: 100%; padding:0">
                  <div class="row text-menu">Thông tin hệ thống</div>
                </div></i
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ProjectInformation
    v-if="i === true"
    :projectprop="editProject"

    :e="ie"
    @close="i = false"
    @refresh="this.$emit('refresh')"
    :type="projectT"
  >
  </ProjectInformation>
</template>
<script>
import ProjectInformation from "@/components/ProjectInformation.vue";
import ProjectService from "@/services/project.service";
import UserService from "@/services/user.service";
import VueJwtDecode from "vue-jwt-decode";
import moment from "moment";

export default {
  components: {
    ProjectInformation,
  },
  emits: ["refresh"],

  props: {
    projects: {
      type: Array,
      default: [],
    },
    projectType:{ type: String, required: true}
  },

  data() {
    return {
      projectT:this.projectType,
      editProject: null,
      edit: false,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      openMenu: false,
      i: false,
      ie: false,
    };
  },

  mounted() {
    console.log(this.projects);
  },

  methods: {
    format_date(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
    },
    async iOpenUp(data) {
      data.NguoiTao = await UserService.get(data.id_NguoiTao);
      data.NguoiChinhSua = await UserService.get(data.id_NguoiChinhSuaLanCuoi);
      data.ThoiGianBaoHanh = this.format_date(data.ThoiGianBaoHanh);
      data.ThoiGianBatDauDauThau = this.format_date(data.ThoiGianBatDauDauThau);
      data.ThoiGianKetThucDauThau = this.format_date(
        data.ThoiGianKetThucDauThau
      );
      data.ThoiGianNghiemThu = this.format_date(data.ThoiGianNghiemThu);
      data.ThoiGianBatDauDuAn = this.format_date(data.ThoiGianBatDauDuAn);
      data.ThoiGianKetThucDuAn = this.format_date(data.ThoiGianKetThucDuAn);
      this.i = true;
      this.ie = data.e;
      this.editProject = data;
    },

    async archiveProject(data, s) {
      try {
        let q = "lưu trữ";
        data.confirm = true;
        if (s === "u") {
          q = "hủy lưu trữ";
          data.confirm = false;
        }
        if (confirm(`Bạn có muốn ${q} dự án ${data.Ma}?`)) {
          const check = await ProjectService.archive(data.id, data);
          if (check != true) {
            this.$toast.open({
              message: `${q} dự án thất bại` ,
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: `Dự án đã được ${q}`,
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

    async deleteProject(data) {
      try {
        if (confirm(`Bạn có chắc muốn xóa dự án ${data.Ma}?`)) {
          const check = await ProjectService.delete(data.id);
          if (check != true) {
            this.$toast.open({
              message: "Xóa dự án thất bại",
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: "Dự án đã được xóa",
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
  width: 100%;
  background-color: var(--bar-color);
  padding: 15px;
  border: 1px solid rgb(192, 192, 192);
  box-shadow: 0 2px 8px rgba(176, 176, 176, 0.33);
  max-height: fit-content;
}

.card:hover {
  transform: scale(1.05);
  z-index: 999;
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
  transform: scale(1.1);
}

.menu {
  position: absolute;
  z-index: 999;
  margin-left: -10vw;
  width: 11vw;
  font-size: 1vw;
  font-family: Raleway;
  font-weight: normal;
  background-color: rgb(208, 224, 243);
  padding:10px 20px 15px 20px;
  border-radius: 5px 5px 5px 5px;
  border:0.1px solid rgb(144, 144, 144);
}

#child {
  visibility: hidden;
}

.text-menu:hover{
  text-decoration: underline;
  cursor: pointer;
  
}

.text-menu{
  padding-left:10px;
  padding-top:0;
  padding-bottom:0;
}
</style>
