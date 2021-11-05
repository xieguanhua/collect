//预览记录缓存
export default {
    // 命名空间隔离
    namespaced: true,
    state: {
        recordCache: uni.getStorageSync('recordCache') || {}
    },
    getters: {
        recordCache: state => state.recordCache
    },
    mutations: {
        setRecordCache(state, params) {
            const {type, name, link} = params;
            const data = state.recordCache[type]||{}
            data[name] = link
            state.recordCache[type] = data
            console.log(  state.recordCache)
            uni.setStorageSync('recordCache', state.recordCache)
        }
    }
}

