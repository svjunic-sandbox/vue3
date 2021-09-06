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
import { createApp } from 'vue';
import App from '~/App.vue';
import store, { key } from '~/store/index';

const app = createApp(App);
app.use(store, key);
app.mount('#app');
