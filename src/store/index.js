import Vue from 'vue'
import Vuex from 'vuex'
import classifyArr from '@/utils/classify.data'


Vue.use(Vuex)
const details = {
    // 命名空间隔离
    namespaced: true,
    state: {
        classifyArr,
        orderBy:!!uni.getStorageSync('orderBy') //列表false正序true为反序
    },
    getters: {
        classifyArr:state=>state.classifyArr,
        orderBy:state=>state.orderBy
    },
    mutations: {
        setOrderBy(state, status=false) {
            state.orderBy = status
            uni.setStorageSync('orderBy',status);
        },
    }
}

const store = new Vuex.Store({
    modules: {
        details
    }
})
export default store

