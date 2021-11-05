import Vue from 'vue'
import Vuex from 'vuex'
const context = require.context('./', true, /.js/)
const path = require("path");
const server={}
context.keys().forEach((key) => {
    if(key.indexOf('index')>=0)return
    server[path.basename(key, path.extname(key))] = context(key).default
})

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        ...server
    }
})
export default store

