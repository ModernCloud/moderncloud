import Vue from 'vue'
import VueGapi from 'vue-gapi'
Vue.config.productionTip = false

Vue.use(VueGapi, {
    clientId: '527078498280-cb2u7idhd401g1te5kqv5cs5tdn356rm.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
})

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

axios.interceptors.request.use(
    reqConfig => {
        reqConfig.headers.Authorization = 'Bearer ' + store.state.account.token;
        return reqConfig;
    },
    err => Promise.reject(err)
);

checkToken();
function checkToken() {
    axios.get('/api/auth/my-info')
        .catch(e => {
            console.log(e);
            store.commit('clearSelectedProject');
            store.commit('logout');
        })
        .finally(run);
}

async function run() {
    document.getElementById('loading').remove();
    store.commit('changeTheme');

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

    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app')
}
