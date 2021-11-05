//详情数据排序缓存
import classifyArr from '@/utils/classify.data'
export default  {
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

