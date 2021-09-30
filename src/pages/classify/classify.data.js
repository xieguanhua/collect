const defaultUrlKey = 'url'
const querystring = require("querystring");

const list =[
    {
        type: '漫画',
        name: '布卡漫画',
        pageUrl: 'http://localhost:3000?url=http://beta.neobai.com/',
        pageUrlNextClass:'.nextbtn',
        classifyUrl:'http://www.buka.cn/category.html',
        classIfyClassName:'.category-title',
        classIfyMoreBtn:'.more-btn',
        classIfyNextClass:'.nextbtn',
        proxyUrl:'http://localhost:3000',
        proxyUrlKey:defaultUrlKey,
        params:{

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
// #endif
export default list
