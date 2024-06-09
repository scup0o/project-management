import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'vue-toast-notification/dist/theme-sugar.css';
import 'aos/dist/aos.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import ToastPlugin from 'vue-toast-notification';
import VueSnip from 'vue-snip'
import AOS from 'aos'

AOS.init();

createApp(App).use(router).use(ToastPlugin).use(VueSnip).mount('#app');

