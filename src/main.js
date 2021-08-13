//Importaciones por defecto
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@babel/polyfill'
//Importacin de Vuetify y complementos del mismo
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
//Importacion de Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
//Importacion de Alertas de Alertify
import VueAlertify from 'vue-alertify'
Vue.use(VueAlertify)
//Graficas de Google
import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
