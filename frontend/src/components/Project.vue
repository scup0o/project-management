<template>
  <div
    class="container-fluid"
    style="overflow-x: hidden; overflow-y: hidden; height: 92vh"
  >
    <div
      class="row"
      style="background-color: var(--bar-color); padding: 7px; height: 7vh"
    >
      <div class="col">
        <button
          class="btn btn-outline-secondary"
          @click="createForm = true"
          data-aos="fade-up"
          style="margin-right: 10px"
          v-if="this.user.chucvu === 'hc'"
        >
          Tạo dự án
          <i class="fa-solid fa-square-plus" id="util-icon"></i>
        </button>
        <!--<button
            class="btn btn-outline-secondary"
            data-aos="fade-up"
            data-aos-duration="500"
            @click="deleteAll()"
          >
            Xóa tất cả
            <i class="fa-solid fa-trash" id="util-icon"></i>
          </button>-->
      </div>
      <div class="col-4">
        <div class="input-group" style="">
          <input
            type="text"
            class="form-control search-form"
            placeholder="Nhập tên dự án, chủ sở hữu cần tìm"
            v-model="searchText"
          />
          <button class="btn btn-outline-secondary search-button" type="button">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
          </button>
        </div>
      </div>
      <ProjectInfoForm
        v-if="createForm === true"
        @close="createForm = false"
        @refresh="retrieveProject()"
        :e="false"
        :projectprop="{
          Ma: null,
          Ten: null,
          MoTa: '',
          TrangThai: 'dangthuchien',
          ThoiGianBatDau: null,
          ThoiGianKetThuc: null,
          ThoiGianBatDauDauThau: null,
          ThoiGianKetThucDauThau: null,
          ThoiGianNghiemThu: null,
          ThoiGianBaoHanh: null,
        }"
      >
      </ProjectInfoForm>
    </div>
    <div
      class="row"
      style="
        padding-top: 3vh;
        padding-bottom: 3vh;
        font-size: 2vh;
        padding-left: 1vw;
      "
    >
      <div class="col-4">
        <div class="row">
          <div class="col">Đang thực hiện</div>
          <div class="col text-end">
            {{ sliceProjectDangThucHien.length }}
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="row">
          <div class="col">Hoàn thành</div>
          <div class="col text-end">
            {{ sliceProjectHoanThanh.length }}
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="row">
          <div class="col">Tạm dừng</div>
          <div class="col text-end">
            {{ sliceProjectTamDung.length }}
          </div>
        </div>
      </div>
    </div>
    <div class="row" style="">
      <div class="col-4" style="">
        <ProjectRender
        :projectType="projectType"
          v-if="sliceProjectDangThucHien.length > 0"
          :projects="sliceProjectDangThucHien"
          :is="sliceProjectDangThucHien"
          @refresh="retrieveProject()"
        >
        </ProjectRender>
        <p
          v-else
          style="
            font-family: 'RalewayItalic';
            font-size: 2vh;
            padding-left: 0.6vw;
          "
        >
          Không có dự án nào.
        </p>
      </div>
      <div class="col-4">
        <ProjectRender
          v-if="sliceProjectHoanThanh.length > 0"
          :projects="sliceProjectHoanThanh"
          :is="sliceProjectHoanThanhu"
          @refresh="retrieveProject()"
        >
        </ProjectRender>
        <p
          v-else
          style="
            font-family: 'RalewayItalic';
            font-size: 2vh;
            padding-left: 0.6vw;
          "
        >
          Không có dự án nào.
        </p>
      </div>
      <div class="col-4">
        <ProjectRender
          :projects="sliceProjectTamDung"
          :is="sliceProjectTamDung"
          v-if="sliceProjectTamDung.length > 0"
          @refresh="retrieveProject()"
        >
        </ProjectRender>
        <p
          v-else
          style="
            font-family: 'RalewayItalic';
            font-size: 2vh;
            padding-left: 0.6vw;
          "
        >
          Không có loại tài liệu nào.
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/base.css";
import ProjectInfoForm from "@/components/ProjectInfoForm.vue";
import ProjectService from "@/services/project.service";
import ProjectRender from "@/components/ProjectRender.vue";
import VueJwtDecode from "vue-jwt-decode";

export default {
  components: {
    ProjectInfoForm,
    ProjectRender,
  },

  props: {
    projectTab: { type: String, required: true },
  },

  watch: {
    projectTab() {
      this.retrieveProject();
    },
  },

  data() {
    return {
      projects: [],
      projectsList: [],
      createForm: false,
      searchText: "",
      onPage: 0,
      pageNumber: 0,
      onPageTemp: 1,
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
      projectType: this.projectTab,
    };
  },

  mounted() {
    this.retrieveProject();
  },

  computed: {
    projectStrings() {
      return this.projects.map((project) => {
        const { Ten, NguoiTao } = project;
        return [Ten, NguoiTao].join("");
      });
    },

    filteredProjects() {
      if (!this.searchText) return this.projects;
      return this.projects.filter((_project, index) =>
        this.projectStrings[index]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
      //console.log(this.projectsList);
    },

    sliceProjectDangThucHien() {
      return this.filteredProjects.filter(
        (_project, index) => _project.TrangThai === "dangthuchien"
      );
    },

    sliceProjectHoanThanh() {
      return this.filteredProjects.filter(
        (_project, index) => _project.TrangThai === "hoanthanh"
      );
    },
    sliceProjectTamDung() {
      return this.filteredProjects.filter(
        (_project, index) => _project.TrangThai === "tamdung"
      );
    },
  },

  methods: {
    /*async deleteAll() {
        if (confirm("Bạn muốn xóa tất cả Loại tài liệu?")) {
          try {
            const deleteCount = await ProjectService.deleteAll();
            if (deleteCount.deletedCount != 0) {
              this.$toast.open({
                message: `Xóa ${deleteCount.deletedCount} loại tài liệu thành công`,
                type: "success",
                duration: 3000,
                dismissible: true,
              });
              this.retrieveProject();
            }
          } catch (error) {
            console.log(error);
          }
        }
      },*/

    async retrieveProject() {
      try {
        this.projects=[];
        this.projectType=this.projectTab;
        this.projects = await ProjectService.getType(this.projectType, this.user);
        console.log(this.projects);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style scoped>
span {
  font-family: "RalewayBold";
  font-size: 25px;
}
</style>
