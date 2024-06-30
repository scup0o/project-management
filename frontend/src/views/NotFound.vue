<template>
  <div class="container-fluid" style="height: 100vh">
    <div class="row">
      <div style="width: 100%; height: 8vh; background-color: var(--main-color); position: absolute"></div>
    </div>
    <div class="row" style="padding-top:13vh">
      <div class="col text-center">
        <h1 style="font-family: 'RalewayBlack'; font-size: 100px">404</h1>
        <img
          src="../assets/img/page-not-found.png"
          style="padding: 20px; z-index: 9999"
        />
        <h2>Trang không tồn tại</h2>

        <button
          style="margin-top: 20px"
          class="btn btn-dark"
          @click="this.$router.push({ name: 'administration' })"
        >
          Trở về trang chủ
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header.vue"
export default{
  components:{
    Header
  }
}
</script>
