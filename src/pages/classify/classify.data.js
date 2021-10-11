const pageReg = `pageNumberReg`
const list = [
    {
        type: '漫画',
        name: '快看漫画',
        pageUrl: 'http://192.168.3.32:3000/',
        params: {
            url:`https://www.kuaikanmanhua.com/tag/0?page=${pageReg}`,
            list:{
                parentCls:'.ItemSpecial',
                cover:'.imgCover .img【@attr@$@data-src@】',//使用jquery获取dom属性,attr,text等等
                title:'.itemTitle【@innerText@】',
                link:'.itemLink【@href@】',
                remark:'.itemFooter .author【@innerText@】',
                data:{
                    link:'.itemLink【@href@】',
                }
                // link:'.itemLink【@javascript:return "adad"@】',//高级功能可执行js
                // reg:'【@(.*)@】'//不传则取params.reg
            },
            reg:'【@(.*)@】'
        },
        classIfy:{
            url:`https://www.kuaikanmanhua.com/tag/0`,
            tags:'.theme .selList .selListItem【@href|innerText@】',
            reg:'【@(.*)@】'
        },
    },
    {
        type: '漫画',
        name: '腾讯漫画',
        pageUrl: 'http://192.168.3.32:3000/',
        params: {
            url:`https://m.ac.qq.com/category/listAll/type/na/rank/pgv?page=${pageReg}&pageSize=15`,
            list:{
                parentCls:'.comic-item',
                cover:'.cover-image【@src@】',//使用jquery获取dom属性,attr,text等等
                title:'.comic-title【@innerText@】',
                link:'.comic-link【@href@】',
                remark:'.comic-desc【@innerText@】',
                // link:'.itemLink【@javascript:return "adad"@】',//高级功能可执行js
                // reg:'【@(.*)@】'//不传则取params.reg
            },
            reg:'【@(.*)@】'
        },
        classIfy:{
            url:`https://m.ac.qq.com/category/index`,
            tags:{
                parentCls:'.category-normal-item',
                href:'.item-link【@href@】',
                innerText:'.item-link【@innerText@】'
            },
            reg:'【@(.*)@】'
        },
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
]
export default list
