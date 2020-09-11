import * as firebase from 'firebase'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyARsH55bDewv8M9_PrJvi_1RQyCJhhHB68",
  authDomain: "test-e4760.firebaseapp.com",
  databaseURL: "https://test-e4760.firebaseio.com",
  projectId: "test-e4760",
  storageBucket: "test-e4760.appspot.com",
  messagingSenderId: "831835090415",
  appId: "1:831835090415:web:34ea025dcb312165d71a1a",
  measurementId: "G-14V1ZRJT3L"
};

firebase.initializeApp(firebaseConfig)

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
