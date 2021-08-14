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
/*Importacion de Axio
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)*/
//Importacion de Alertas de Alertify
import VueAlertify from 'vue-alertify'
Vue.use(VueAlertify)
//Graficas de Google
import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts)
//Importacion de vuefire
import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDANs-QHYOKwf0jojQgrgqB7xFbCymTa8c",
  authDomain: "tortillasdeharinaheidy.firebaseapp.com",
  projectId: "tortillasdeharinaheidy",
  storageBucket: "tortillasdeharinaheidy.appspot.com",
  messagingSenderId: "655989018721",
  appId: "1:655989018721:web:17d262951ddd01c07a5a20",
  measurementId: "G-E7W2YFL4S5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const db = firebase.firestore();

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
