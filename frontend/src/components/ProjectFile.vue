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
          v-if="(this.user.chucvu !='admin' && pj.e === true) || pj.loai!='chia se'"
        >
          Thêm tài liệu
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
            placeholder="Nhập tên tài liệu cần tìm"
            v-model="searchText"
          />
          <button class="btn btn-outline-secondary search-button" type="button">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
          </button>
        </div>
      </div>
      <FileInfoForm
        v-if="createForm === true"
        @close="createForm = false"
        @refresh="retrieveFile()"
        :project="this.pj"
        :e="false"
        :io="true"
        :fileprop="{
          LoaiTaiLieu: 'Biên bản yêu cầu',
          GiaiDoan: 'truocdauthau',
        }"
      >
      </FileInfoForm>
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
        <div class="col-3">
          <div class="row">
            <div class="col">Trước đấu thầu</div>
            <div class="col text-end">
              {{ sliceFileTruocDauThau.length }}
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <div class="col">Sau đấu thầu</div>
            <div class="col text-end">
              {{ sliceFileSauDauThau.length }}
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <div class="col">Bảo hành, bảo trì</div>
            <div class="col text-end">
              {{ sliceFileBaoHanh.length }}
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="row">
            <div class="col">Các tài liệu khác</div>
            <div class="col text-end">
              {{ sliceFileKhac.length }}
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="">
        <div class="col-3" style="">
          <FileRender
            v-if="sliceFileTruocDauThau.length > 0"
            :files="sliceFileTruocDauThau"
            @refresh="retrieveFile()"
          >
          </FileRender>
          <p
            v-else
            style="
              font-family: 'RalewayItalic';
              font-size: 2vh;
              padding-left: 0.6vw;
            "
          >
            Không có tài liệu nào.
          </p>
        </div>
        <div class="col-3">
          <FileRender
            v-if="sliceFileSauDauThau.length > 0"
            :files="sliceFileSauDauThau"
            @refresh="retrieveFile()"
          >
          </FileRender>
          <p
            v-else
            style="
              font-family: 'RalewayItalic';
              font-size: 2vh;
              padding-left: 0.6vw;
            "
          >
            Không có tài liệu nào.
          </p>
        </div>
        <div class="col-3">
          <FileRender
            :files="sliceFileBaoHanh"
            v-if="sliceFileBaoHanh.length > 0"
            @refresh="retrieveFile()"
          >
          </FileRender>
          <p
            v-else
            style="
              font-family: 'RalewayItalic';
              font-size: 2vh;
              padding-left: 0.6vw;
            "
          >
            Không có tài liệu nào.
          </p>
        </div>
        <div class="col-3">
          <FileRender
            :files="sliceFileKhac"
            v-if="sliceFileKhac.length > 0"
            @refresh="retrieveFile()"
          >
          </FileRender>
          <p
            v-else
            style="
              font-family: 'RalewayItalic';
              font-size: 2vh;
              padding-left: 0.6vw;
            "
          >
            Không có tài liệu nào.
          </p>
        </div>
      </div>
  </div>
</template>
<script>
import "@/assets/css/base.css";
import FileInfoForm from "@/components/FileInfoForm.vue";
import FileService from "@/services/file.service";
import FileRender from "@/components/FileRender.vue";
import VueJwtDecode from "vue-jwt-decode";

export default {
  components: {
    FileInfoForm,
    FileRender,
  },

  props: {
    project: { type: Object, required: true },
  },

  emits: ["refresh"],

  watch: {
  },

  data() {
    return {
      pj: this.project,
      files: [],
      filesList: [],
      createForm: false,
      searchText: "",
      user: VueJwtDecode.decode(localStorage.getItem("auth")),
    };
  },

  mounted() {
    console.log(this.pj)
    this.retrieveFile();
  },

  computed: {
      fileStrings() {
        return this.files.map((file) => {
          const { TenTaiLieu} = file;
          return [TenTaiLieu].join("");
        });
      },
  
      filteredFiles() {
        if (!this.searchText) return this.files;
        return this.files.filter((_file, index) =>
          this.fileStrings[index]
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        );
        //console.log(this.filesList);
      },
  
      sliceFileTruocDauThau() {
        return this.filteredFiles.filter(
          (_file, index) => _file.GiaiDoan === "truocdauthau"
        );
      },
  
      sliceFileSauDauThau() {
        return this.filteredFiles.filter(
          (_file, index) => _file.GiaiDoan === "saudauthau"
        );
      },
      sliceFileBaoHanh() {
        return this.filteredFiles.filter(
          (_file, index) => _file.GiaiDoan === "baohanh"
        );
      },
      sliceFileKhac() {
        return this.filteredFiles.filter(
          (_file, index) => _file.GiaiDoan === "khac"
        );
      },
  },

  methods: {
    /*async deleteAll() {
          if (confirm("Bạn muốn xóa tất cả Loại tài liệu?")) {
            try {
              const deleteCount = await FileService.deleteAll();
              if (deleteCount.deletedCount != 0) {
                this.$toast.open({
                  message: `Xóa ${deleteCount.deletedCount} loại tài liệu thành công`,
                  type: "success",
                  duration: 3000,
                  dismissible: true,
                });
                this.retrieveFile();
              }
            } catch (error) {
              console.log(error);
            }
          }
        },*/

    async retrieveFile() {
      try {
        let data = { id_da: this.project.id, id_user: this.user.id };
        console.log(data);
        this.files = await FileService.get(data);
        console.log(this.files);
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
