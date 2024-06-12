<template>
  <div class="container-fluid">
    <div class="row" style="background-color: var(--bar-color); padding: 6px">
      <div class="col">
        <button
          class="btn btn-outline-secondary"
          @click="createForm = true"
          data-aos="fade-up"
          style="margin-right: 10px"
        >
          Thêm thể loại
          <i class="fa-solid fa-square-plus" id="util-icon"></i>
        </button>
        <button
          class="btn btn-outline-secondary"
          data-aos="fade-up"
          data-aos-duration="500"
          @click="deleteAll()"
        >
          Xóa tất cả
          <i class="fa-solid fa-trash" id="util-icon"></i>
        </button>
      </div>
      <div class="col-4">
        <div class="input-group" style="">
          <input
            type="text"
            class="form-control search-form"
            placeholder="Nhập thông tin cần tìm"
            v-model="searchText"
          />
          <button class="btn btn-outline-secondary search-button" type="button">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
          </button>
        </div>
      </div>
      <DoctypeForm
        v-if="createForm === true"
        @close="createForm = false"
        @refresh="retrieveDoctype()"
        :e="false"
        :doctype="{
          ten: null,
          id: null,
          giaiDoan: null,
        }"
      >
      </DoctypeForm>
    </div>
    <div class="row" style="padding-top: 20px">
      <div
        v-for="(doctype, index) in sliceDoctype"
        :key="index"
        v-if="filteredDoctypesCount > 0"
      >
        <AdminDoctypeRender
          v-if="index === onPage"
          :doctypes="doctype"
          :is="doctype"
          @refresh="retrieveDoctype()"
        >
        </AdminDoctypeRender>
      </div>
      <p v-else>Không có thể loại nào.</p>
    </div>
    <div class="row text-center d-flex" v-if="filteredDoctypesCount > 0">
      <div>
        <button
          v-if="onPage != 0"
          @click="onPage--, onPageTemp--"
          class="btn"
          style="margin-right: 10px; border-color: none"
          title="Trang trước"
        >
          <i class="fa-solid fa-caret-left"></i>
        </button>
        <div style="display: inline">
          <input
            class="form-control"
            style="width: 50px; display: inline"
            type="number"
            v-model="onPageTemp"
            @keyup.enter="(onPage = onPageTemp - 1), (onPageTemp = onPage + 1)"
          />/ {{ pageNumber }}
        </div>
        <button
          v-if="onPageTemp < pageNumber"
          @click="onPage++, (onPageTemp = onPage + 1)"
          class="btn"
          style="margin-left: 10px; border-color: none"
          title="Trang sau"
        >
          <i class="fa-solid fa-caret-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import "@/assets/css/base.css";
import DoctypeForm from "@/components/DocTypeForm.vue";
import DoctypeService from "@/services/doctype.service";
import AdminDoctypeRender from "@/components/AdminDoctypeRender.vue";

export default {
  components: {
    DoctypeForm,
    AdminDoctypeRender,
  },

  data() {
    return {
      doctypes: [],
      doctypesList: [],
      createForm: false,
      searchText: "",
      onPage: 0,
      pageNumber: 0,
      onPageTemp: 1,
    };
  },

  mounted() {
    this.retrieveDoctype();
  },

  computed: {
    doctypeStrings() {
      return this.doctypes.map((doctype) => {
        const { name } = doctype;
        return [name].join("");
      });
    },

    filteredDoctypes() {
      if (!this.searchText) return this.doctypes;
      return this.doctypes.filter((_doctype, index) =>
        this.doctypeStrings[index]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    },

    filteredDoctypesCount() {
      //console.log(this.filteredDoctypes.length);
      return this.filteredDoctypes.length;
    },

    sliceDoctype() {
      let doctypeListNumber = Math.ceil(this.filteredDoctypes.length / 8);
      this.pageNumber = doctypeListNumber;
      let count = 0;
      let tempDoctypes = [];
      let i;
      for (i = 0; i < doctypeListNumber; i++) {
        tempDoctypes[i] = this.filteredDoctypes.slice(count, count + 8);
        count = count + 8;
      }
      this.doctypesList = tempDoctypes;
      return tempDoctypes;
    },
  },

  methods: {
    async deleteAll() {
      if (confirm("Bạn muốn xóa tất cả Loại tài liệu?")) {
        try {
          const deleteCount = await DoctypeService.deleteAll();
          if (deleteCount.deletedCount != 0) {
            this.$toast.open({
              message: `Xóa ${deleteCount.deletedCount} loại tài liệu thành công`,
              type: "success",
              duration: 3000,
              dismissible: true,
            });
            this.retrieveDoctype();
          }
        } catch (error) {
          console.log(error);
        }
      }
    },

    async retrieveDoctype() {
      try {
        this.doctypes = await DoctypeService.getAll();
        console.log(this.doctypes);
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
