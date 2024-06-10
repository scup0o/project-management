<script>
import Header from "@/components/header.vue";
import BackToTop from "@/components/BackToTop.vue";
import "@/assets/css/base.css";

export default {
  components: {
    Header,
    BackToTop,
  },
};
</script>

<template>
  <div>
    <!--<Header />-->
    <div style="background-color: var(--bg-color);">
      <router-view :key="$route.fullPath" />
      <!--<BackToTop></BackToTop>-->
    </div>
  </div>
</template>

<style scoped></style>
