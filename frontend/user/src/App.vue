<script>
import Header from "@/components/header.vue";
import Footer from "@/components/Footer.vue";
import BackToTop from "@/components/BackToTop.vue";
import "@/assets/css/base.css";

export default {
  components: {
    Header,
    Footer,
    BackToTop,
  },
};
</script>

<template>
  <div>
    <Header />
    <div>
      <router-view :key="$route.fullPath" />
      <BackToTop></BackToTop>
    </div>
    <Footer />
  </div>
</template>

<style scoped></style>
