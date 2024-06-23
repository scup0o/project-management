<template>
  <div class="container-fluid" style="padding: 70px">
    <div class="row">
      <div class="col text-center">
        <h1 style="font-family: 'RalewayBlack'; font-size: 100px">404</h1>
        <img
          src="../../src/assets/img/page-not-found.png"
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
