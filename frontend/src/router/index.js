import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "editor" */ '../views/dashboard/Editor.vue'),
    meta: {requiresAuth: true},
  },
  {
    path: '/settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/dashboard/Settings.vue'),
    meta: {requiresAuth: true},
    children: [
      {
        path: 'account',
        component: () => import(/* webpackChunkName: "settings_account" */ '../views/dashboard/Settings/Account.vue'),
        meta: {requiresAuth: true},
      },
      {
        path: 'billing',
        component: () => import(/* webpackChunkName: "settings_billing" */ '../views/dashboard/Settings/Billing.vue'),
        meta: {requiresAuth: true},
      },
      {
        path: 'projects',
        component: () => import(/* webpackChunkName: "settings_projects" */ '../views/dashboard/Settings/Projects.vue'),
        meta: {requiresAuth: true},
      },
      {
        path: 'environments/:project_id',
        name: 'environments',
        component: () => import(/* webpackChunkName: "settings_environments" */ '../views/dashboard/Settings/Environments.vue'),
        meta: {requiresAuth: true},
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  }
]

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !store.state.account.token) {
    next('/login')
  } else {
    next();
  }
})

export default router
