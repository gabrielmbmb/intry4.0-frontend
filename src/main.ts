import Vue from 'vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import VueParticles from 'vue-particles';

import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/element/index.css';
import '@/assets/css/base.less';

Vue.config.productionTip = false;

// Plugins
Vue.use(Element, { locale });
Vue.use(VueParticles);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
