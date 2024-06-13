<template>
    <div class="container-fluid" style="overflow-x: hidden; overflow-y: hidden; height: 92vh;">
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
      <div class="row">
        <div class="col-3">
          
        </div>
      </div>
      <div class="row" style="padding-top: 20px;" >
        <div class="col-3" >
            <AdminDoctypeRender
            v-if="sliceDoctype('truocdauthau').length > 0"
              :doctypes="sliceDoctype('truocdauthau')"
              :is="sliceDoctype('truocdauthau')"
              @refresh="retrieveDoctype()"
            >
            </AdminDoctypeRender>
          <p v-else>Không có loại tài liệu nào.</p>
        </div>
        <div class="col-3">
            <AdminDoctypeRender
            v-if="sliceDoctype('saudauthau').length > 0"
              :doctypes="sliceDoctypeSauDauThau"
              :is="sliceDoctypeSauDauThau"
              @refresh="retrieveDoctype()"
            >
            </AdminDoctypeRender>
          <p v-else>Không có loại tài liệu nào.</p>
        </div>
        <div class="col-3">
            <AdminDoctypeRender
              :doctypes="sliceDoctypeBaoHanh"
              :is="sliceDoctypeBaoHanh"
              v-if="sliceDoctypeBaoHanh.length > 0"
              @refresh="retrieveDoctype()"
            >
            </AdminDoctypeRender>
          <p v-else>Không có loại tài liệu nào.</p>
        </div>
        <div class="col-3">
            <AdminDoctypeRender
              :doctypes="sliceDoctypeKhac"
              :is="sliceDoctypeKhac"
              @refresh="retrieveDoctype()"
              v-if="sliceDoctypeKhac.length > 0"
            >
            </AdminDoctypeRender>
          <p v-else>Không có loại tài liệu nào.</p>
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

      
      doctypeStrings() {
        return this.doctypes.map((doctype) => {
          const { name, giaiDoan } = doctype;
          return [name, giaiDoan].join("");
        });
      },

      filteredDoctypes() {
        if (!this.searchText) return this.doctypes;
        return this.doctypes.filter((_doctype, index) =>
          this.doctypeStrings[index]
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
        );
        console.log(this.doctypesList);
      },
  
      filteredDoctypesCount() {
        //console.log(this.filteredDoctypes.length);
        return this.filteredDoctypes.length;
      },

      sliceDoctype(data) {
        let p = this.filteredDoctypes.filter((_doctype, index) =>
          this.doctypeStrings[index]
            .toLowerCase()
            .includes(data)
        );
        console.log(p);
        return p;
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
  