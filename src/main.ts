// This Vue app was inspired in the design of this really great example: https://github.com/Armour/vue-typescript-admin-template
// and developed by Gabriel Martín Blázquez <gmartin_b@usal.es>

import Vue from 'vue';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import VueParticles from 'vue-particles';
import SvgIcon from 'vue-svgicon';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';

import App from './App.vue';
import router from './router';
import store from './store';
import '@/icons/components';

import '@/styles/element/index.css';
import '@/styles/base.scss';

Vue.config.productionTip = false;

// Plugins
Vue.use(Element, { locale });
Vue.use(VueParticles);
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em',
});
Vue.use(
  new VueSocketIO({
    debug: process.env.NODE_ENV !== 'production',
    connection: SocketIO(
      process.env.VUE_APP_NOTIFICATION_BACKEND_HOST || 'http://localhost:8678'
    ),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_',
    },
  })
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
