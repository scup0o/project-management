<template>
    <div class="row" style="max-height: 76vh; overflow-y: auto;">
      <div
        class="col-12"
        v-for="(project, index) in projects"
        :key="project"
        style="padding-bottom:1vh; padding-top:1vh"
      >
          <div
            class="card"
          >
            <div class="row d-flex align-items-center">
              <div class="col">
                <div class="row">
                  <label v-snip="{ lines: 1 }">{{ project.ten }}</label>
                </div>
                <div class="row">
                  <p v-snip="{ lines: 2 }" v-if="project.giaiDoan==='truocdauthau'">{{ 'Trước đấu thầu' }}</p>
                  <p v-snip="{ lines: 2 }" v-if="project.giaiDoan==='saudauthau'">{{ 'Sau đấu thầu' }}</p>
                  <p v-snip="{ lines: 2 }" v-if="project.giaiDoan==='baohanh'">{{ 'Bảo hành, bảo trì' }}</p>
                  <p v-snip="{ lines: 2 }" v-if="project.giaiDoan==='khac'">{{ 'Loại tài liệu khác' }}</p>
                </div>
              </div>
              <div class="col-2">
                <div class="row d-flex justify-content-end" id="util-button">
                  <button
                    class="btn"
                    @click="(editProject = project), (edit = true)"
                    id="util-icon"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                </div>
                <div class="row" id="util-button">
                  <button
                    class="btn delete-icon"
                    @click="deleteProject(project)"
                    id="util-icon"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <ProjectForm
      v-if="edit === true"
      :project="editProject"
      :e="true"
      @close="edit = false"
      @refresh="this.$emit('refresh')"
    >
    </ProjectForm>
  </template>
  <script>
  import ProjectInfoForm from "@/components/ProjectInfoForm.vue";
  import ProjectService from "@/services/project.service";
  
  export default {
    components: {
      ProjectInfoForm,
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
      };
    },
  
    mounted(){
      console.log(this.projects)
    },
  
    methods: {
      async deleteProject(data) {
        try {
          if (confirm(`Bạn có chắc muốn xóa loại tài liệu ${data.ten}?`)) {
            const check = await ProjectService.delete(data.id);
            if (check === false) {
              this.$toast.open({
                message: "Xóa loại tài liệu thất bại",
                type: "error",
                duration: 3000,
                dismissible: true,
              });
            } else {
              this.$toast.open({
                message: "Xóa thành công",
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
  
  #util-button {
    visibility: hidden;
  }
  
  #util-icon:hover{
      transform: scale(1.05);
  }
  
  </style>
  