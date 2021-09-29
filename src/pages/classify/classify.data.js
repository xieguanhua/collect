const defaultUrlKey = 'url'
const querystring = require("querystring");

const list =[
    {
        type: '漫画',
        name: '布卡漫画',
        pageUrl: 'http://m.buka.cn',
        proxyUrl:'http://localhost:3000',
        proxyUrlKey:defaultUrlKey,
        proxyParams:{

        }
    },
    {
        type: '漫画',
        name: '腾讯漫画'
    },
    {
        type: '视频',
        name: '腾讯视频'
    },
    {
        type: '视频',
        name: '爱奇艺'
    },
    {
        type: '音乐',
        name: '网易云'
    },
    {
        type: '音乐',
        name: 'qq音乐'
    },
    {
        type: '音乐',
        name: 'qq音乐'
    },
    {
        type: '音乐',
        name: 'qq音乐'
    },
    {
        type: '音乐',
        name: 'qq音乐'
    },
    {
        type: '音乐',
        name: 'qq音乐'
    },
    {
        type: '',
        name: '好看的'
    }
]

// #ifndef APP-PLUS
list.forEach(v=>{
    if(v.proxyUrl){
        if(!v.proxyParams)v.proxyParams={}
        v.proxyParams[v.proxyUrlKey||defaultUrlKey] = v.pageUrl
        const params = querystring.stringify(v.proxyParams)
        console.log(params)
        v.pageUrl = `${v.proxyUrl}?${params}`
    }
})
// #endif
export default list
