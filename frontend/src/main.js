import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications);

import PerfectScrollbar from 'vue2-perfect-scrollbar';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
Vue.use(PerfectScrollbar);

import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import './assets/app.scss';

import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
firebase.initializeApp({
    apiKey: "AIzaSyAV5XeHaikSuThrfDnOjBeUXarz5lNzJbI",
    authDomain: "moderncloud---test.firebaseapp.com",
    projectId: "moderncloud---test",
    storageBucket: "moderncloud---test.appspot.com",
    messagingSenderId: "247003552904",
    appId: "1:247003552904:web:94ed3b9afed3cff9b8133d"
});


document.getElementById('loading').remove();

axios.interceptors.request.use(
    reqConfig => {
        reqConfig.headers.Authorization = 'Bearer ' + store.state.account.token;
        return reqConfig;
    },
    err => Promise.reject(err)
);

axios.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response.status === 401) {
            store.commit('clearSelectedProject');
            store.commit('logout');
            router.push({path: '/login'});
        }
        return Promise.reject(error);
    }
);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
