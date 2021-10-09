const pageReg = `$pageNumber$`
const list = [
    {
        type: '漫画',
        name: '快看漫画',
        pageUrl: 'http://192.168.3.32:3000/',
        params: {
            url:`https://www.kuaikanmanhua.com/tag/0?page=${pageReg}`,
            classIfyTags:'.theme .selList .selListItem【%href|innerText%】',
            list:{
                cls:'.ItemSpecial',
                cover:'.imgCover .img【%attr@$@data-src%】',//使用jquery获取dom属性,attr,text等等
                title:'.itemTitle【%innerText%】',
                link:'.itemLink【%href%】',
                remark:'.itemFooter .author【%innerText%】'
                // link:'.itemLink【%javascript:return "adad"%】',//高级功能可执行js
                // reg:'【%(.*)%】'//不传则取params.reg
            },
            reg:'【%(.*)%】'
        },
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
]
export default list
