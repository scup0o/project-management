<template>
  <div class="row" style="max-height: 76vh; overflow-y: auto">
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
                @click="archiveProject(project)"
                id="util-icon"
                title="Lưu trữ dự án"
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
                class="fa-solid fa-ellipsis-vertical"
                @click="(editProject = project), (edit = true)"
                id="util-icon"
                style="display: inline"
                title="Thông tin"
              ></i>
              <div class="menu">
                <div class="row" @click="iOpenUp(project)">Thông tin chung</div>
                <div class="row" v-if="project.ttht === true">
                  Thông tin hệ thống
                </div>
                <div class="row" v-else>Thông tin hệ thống</div>
              </div>
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
  >
  </ProjectInformation>
</template>
<script>
import ProjectInformation from "@/components/ProjectInformation.vue";
import ProjectService from "@/services/project.service";
import UserService from "@/services/user.service";
import VueJwtDecode from "vue-jwt-decode";

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
  },

  data() {
    return {
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
    async iOpenUp(data) {
      
      data.NguoiTao = await UserService.get(data.id_NguoiTao);
      data.NguoiChinhSua = await UserService.get(
        data.id_NguoiChinhSuaLanCuoi
      );
      this.i = true;
      this.ie = data.e;
      this.editProject = data;
    },

    async archiveProject(data) {
      try {
        if (confirm(`Bạn có chắc muốn lưu trữ dự án ${data.Ma}?`)) {
          const check = await ProjectService.archive(data.id);
          if (check != true) {
            this.$toast.open({
              message: "Lưu trữ dự án thất bại",
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: "Dự án đã được chuyển vào hộp lưu trữ",
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

.card:hover #util-button {
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
  padding-top: 10px;
  z-index: 999;
}
</style>
