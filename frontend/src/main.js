import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import SuiVue from 'semantic-ui-vue';
Vue.use(SuiVue);
import 'semantic-ui-css/semantic.min.css';

axios.interceptors.request.use(
    reqConfig => {
        reqConfig.headers.Authorization = 'Bearer ' + store.state.account.token;
        return reqConfig;
    },
    err => Promise.reject(err)
);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
