/**
 * JS生成全局唯一标识符
 */
export const guid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
/**
 * 页面跳转传参
 */
export const navigateTo = (url,params,options)=>{
    uni.navigateTo({
        ...options,
        url: `${url}?data=${encodeURIComponent(JSON.stringify(params))}`,
    });
}
/**
 * 参数解析
 */
export const getParams = ({data})=>{
    try {
        return JSON.parse(decodeURIComponent(data))
    }catch (e){
        console.error(e)
        return {}
    }
}
export function getRect(selector, all) {
    return new Promise(resolve => {
        uni.createSelectorQuery().in(this)[all ? 'selectAll' : 'select'](selector).boundingClientRect((rect={}) => {
            if (all && Array.isArray(rect) && rect.length) {
                resolve(rect)
            }else {
                resolve(rect)
            }
        }).exec()
    })
}
