//主题色设置
export default {
    namespaced: true,
    state:{
        mainColor:uni.getStorageSync('color') || {
            /* 行为相关颜色 */
            primary:'#007aff',
            success:'#4cd964',
            warning:'#f0ad4e',
            error:'#dd524d',
            /* 文字基本颜色 */
            textColor:'#000000',//基本色
            /* 背景颜色 */
            bgColor:'#ffffff',//基本色
            /* 边框颜色 */
            borderColor:'#ebebeb'
        },
        makeColor:uni.getStorageSync('makeColor') || {
            // textColorInverse:'#ffffff',//反色
            // textColorGrey:'#5c5c5c',//灰色
            // textColorPlaceholder :'#999999',//输入框提示色
            // textColorDisable:'#c0c0c0',//禁用色
            // bgColorGrey:'#fafafa',//灰色
            // bgColorHover:'#f1f1f1',//hover色
            // textColorBg:"#ffffff", //文字颜色对应的黑白背景
            // bgColorInverse:"#000000",//反色
            // bgColorText:'#000000' //文字颜色对应的文字颜色
        }
    },
    getters: {
        mainColor:state=>state.mainColor,
        makeColor:state=>state.makeColor
    },
    mutations: {
        setMakeColor(state, color) {
            if(color){
                state.makeColor = color
            }
        },
    }
}
