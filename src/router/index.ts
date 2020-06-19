import Vue from 'vue';
import VueRouter, { RouteConfig, Route } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { AuthModule } from '@/store/modules/auth';
import { PermissionModule } from '@/store/modules/permission';
import { Message } from 'element-ui';
import Layout from '@/layout/index.vue';

Vue.use(VueRouter);

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

export const constRoutes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      hidden: true,
      title: 'Login',
    },
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: 'About',
      hidden: true,
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

export const dynamicRoutes: Array<RouteConfig> = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        meta: {
          title: 'Home',
          icon: 'home',
        },
        component: () =>
          import(/* webpackChunkName: "home" */ '../views/Home.vue'),
      },
    ],
  },
  {
    path: '/users',
    name: 'Users',
    component: Layout,
    meta: {
      title: 'Users',
      roles: ['superuser'],
      icon: 'user',
    },
    children: [
      {
        path: 'index',
        name: 'Users',
        meta: {
          title: 'Users',
        },
        component: () =>
          import(/* webpackChunkName: "users" */ '../views/Users/Users.vue'),
      },
      {
        path: 'new',
        name: 'New user',
        meta: {
          title: 'New user',
        },
        component: () =>
          import(/* webpackChunkName: "users-new" */ '../views/Users/New.vue'),
      },
    ],
  },
  {
    path: '/models',
    name: 'Models',
    component: Layout,
    meta: {
      title: 'Models',
      roles: ['staff'],
      icon: 'brain',
    },
    children: [
      {
        path: 'index',
        name: 'Models',
        meta: {
          title: 'Models',
          roles: ['staff'],
        },
        component: () =>
          import(/* webpackChunkName: "models" */ '../views/Models/Models.vue'),
      },
      {
        path: 'new',
        name: 'New model',
        meta: {
          title: 'New model',
          roles: ['staff'],
        },
        component: () =>
          import(
            /* webpackChunkName: "models-new" */ '../views/Models/New.vue'
          ),
      },
      {
        path: ':id',
        name: 'Model',
        meta: {
          title: 'Model',
          roles: ['staff'],
          hidden: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "models-model" */ '../views/Models/Model.vue'
          ),
      },
      {
        path: 'train/:id',
        name: 'Train model',
        meta: {
          title: 'Train model',
          roles: ['staff'],
          hidden: true,
        },
        component: () =>
          import(
            /* webpackChunkName: "models-model" */ '../views/Models/Train.vue'
          ),
      },
    ],
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      hidden: true,
    },
    children: [
      {
        path: 'index',
        name: 'Profile',
        meta: {
          title: 'Profile',
          hidden: true,
        },
        component: () =>
          import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
      },
    ],
  },
];

const router = new VueRouter({ routes: constRoutes });

router.beforeEach(async (to, _, next) => {
  // Progress bar
  NProgress.start();

  // Check that user is logged in
  if (AuthModule.accessToken) {
    if (to.path === '/login') {
      // User is already logged in, redirect it to home
      next({ path: '/' });
      NProgress.done();
    } else {
      // Check if user has obtained its roles
      if (AuthModule.roles.length === 0) {
        try {
          // Get user info
          await AuthModule.getUserInfo();
          const { roles } = AuthModule;
          // Get routes enabled for the user roles
          PermissionModule.generateRoutes(roles);
          router.addRoutes(PermissionModule.dynamicRoutes);
          next({ ...to, replace: true });
        } catch (err) {
          // Remove token and redirect to login page
          AuthModule.resetToken();
          Message.error(err || 'An error ocurred');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach((to: Route) => {
  NProgress.done();

  // set page title
  document.title = `${to.meta.title} - InTry 4.0`;
});

export default router;
