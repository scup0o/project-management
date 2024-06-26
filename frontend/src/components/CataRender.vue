<template>
  <div
    class="row"
    style="max-height: 85vh; overflow-y: auto; overflow-x: hidden"
  >
    <div
      class="col-3"
      v-for="(cata, index) in catas"
      :key="cata"
      style="padding-bottom: 1vh; padding-top: 1vh"
    >
      <div class="card">
        <div class="row d-flex">
          <div class="row">
            <div class="col-9">
              <label v-snip="{ lines: 1 }">{{ cata.ten }}</label>
            </div>
            <div class="col-3 text-end">
                <i
                  class="fa-solid fa-pen-to-square"
                  @click="(editCata = cata), (edit = true)"
                  id="util-icon"
                  style="display: inline;padding-right:10px"
                ></i>
                <i
                  class="fa-solid fa-trash-can"
                  @click="deleteCata(cata)"
                  id="util-icon"
                  style="display: inline"
                ></i>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <DoctypeForm
    v-if="edit === true"
    :doctype="editCata"
    :e="true"
    @close="edit = false"
    @refresh="this.$emit('refresh')"
    :cataTab="this.cataTab"
  >
  </DoctypeForm>
</template>
<script>
import DoctypeForm from "@/components/DoctypeForm.vue";
import DoctypeService from "@/services/doctype.service";

export default {
  components: {
    DoctypeForm,
  },
  emits: ["refresh"],

  props: {
    cataTab: {
      type: String,
      required: true,
    },
    catas: {
      type: Array,
      default: [],
    },
  },

  data() {
    return {
      editCata: null,
      edit: false,
    };
  },

  mounted() {
    console.log(this.catas);
  },

  methods: {
    async deleteCata(data) {
      try {
        let cata = "ngôn ngữ";
        if (this.cataTab === "moitruong") cata = "môi trường";
        if (this.cataTab === "csdl") cata = "cơ sở dữ liệu";
        if (confirm(`Bạn có chắc muốn xóa ${cata} ${data.ten}?`)) {
          const check = await DoctypeService.delete(data.id);
          if (check === false) {
            this.$toast.open({
              message: `Xóa ${cata} thất bại`,
              type: "error",
              duration: 3000,
              dismissible: true,
            });
          } else {
            this.$toast.open({
              message: `Xóa ${cata} thành công`,
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


.card:hover #description-box {
  height: 90px;
}

#description-box {
  height: 50px;
}

#util-icon:hover {
  transform: scale(1.1);
  cursor: pointer;
}
</style>
