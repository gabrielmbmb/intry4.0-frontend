import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

// Vuex store
import store from '@/store/index';
import { AuthModule } from '@/store/modules/auth';

// Views
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && AuthModule.accessToken === '') {
    next('/login');
  }

  if (to.name !== 'Login' && AuthModule.accessToken !== '') {
    next('/login');
  }

  next();
});

export default router;
