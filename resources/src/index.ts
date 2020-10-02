////{{{{ どっちでもいいぽい
//import Vue from 'vue';
//import router from './router';
//import store from './store';
//Vue.config.productionTip = false;
//new Vue({
//  //  router,
//  //  store,
//  render: (h) => h(App),
//}).$mount('#app');
// }}}

////どっちでもいいぽい
import Vue, { createApp } from 'vue';
import vuex from 'vuex';
import App from '~/App.vue';

const app = createApp(App);
app.mount('#app');

//app.use();
