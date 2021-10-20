import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);
Vue.config.productionTip = false
import store from './store'
App.mpType = 'app'
import {getRect} from '@/utils'
Vue.prototype.getRect = getRect
const app = new Vue({
  ...App,
  store
})
app.$mount()
