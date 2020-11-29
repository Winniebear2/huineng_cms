import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import './assets/global.css'
import aMap from 'vue-amap'
Vue.config.productionTip = false
Vue.use(ElementUI,{size:'small'})
Vue.prototype.$axios = axios;
Vue.use(aMap);

aMap.initAMapApiLoader({
  key: '',
  plugin: ['AMap.Scale', 'AMap.OverView','AMap.Geocoder','AMap.Geolocation'],
  v: '1.4.4'
});
/* eslint-disable no-new */
Vue.prototype.baseURL = ''
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
