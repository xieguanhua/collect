import {guid} from '@/utils'
const pageReg = `pageNumberReg`
const defaultList = [
    {
        type: '漫画',
        name: '快看漫画',
        pageUrl: 'http://192.168.3.32:3000/',
        detailsPage:'/pages/preview/comicPreview/index',
        params: {
            url:`https://www.kuaikanmanhua.com/tag/0?page=${pageReg}`,
            list:{
                parentCls:'.ItemSpecial',
                cover:'.imgCover .img【@attr@$@data-src@】',//使用jquery获取dom属性,attr,text等等
                title:'.itemTitle【@innerText@】',
                link:'.itemLink【@href@】',
                remark:'.itemFooter .author【@innerText@】',
              /*  data:{
                    link:'.itemLink【@href@】',
                }
                // link:'.itemLink【@javascript:return "adad"@】',//高级功能可执行js
                // reg:'【@(.*)@】'//不传则取params.reg*/
            },
        },
        classIfy:{
            url:`https://www.kuaikanmanhua.com/tag/0`,
            tags:'.theme .selList .selListItem【@href|innerText@】',
        },
        detailsParams:{
            url:``,
            details:{
                title:'.TopicHeader .title【@innerText@】',
                author:'.TopicHeader .nickname【@innerText@】',
                explain:'.TopicHeader .detailsBox【@innerText@】',
            },
            list:{
                parentCls:'.TopicItem',
                title:'.title【@innerText@】',
                link:'.title a【@href@】',
                filter:'attr(href)@=@javascript:void(0)'//只执行jquery
            }
        },
        previewParams:{
            url:``,
            links:'.imgList .img【@attr@$@data-src@】'
        }
    },
    {
        type: '漫画',
        name: '腾讯漫画',
        pageUrl: 'http://192.168.3.32:3000/',
        detailsPage:'/pages/preview/comicPreview/index',
        params: {
            url:`https://m.ac.qq.com/category/listAll/type/na/rank/pgv?page=${pageReg}&pageSize=15`,
            list:{
                parentCls:'.comic-item',
                cover:'.cover-image【@src@】',
                title:'.comic-title【@innerText@】',
                link:'.comic-link【@href@】',
                remark:'.comic-desc【@innerText@】',
            }
        },
        classIfy:{
            url:`https://m.ac.qq.com/category/index`,
            tags:{
                parentCls:'.category-normal-item',
                href:'.item-link【@href@】',
                innerText:'.item-link【@innerText@】'
            }
        },
        detailsParams:{
            url:``,
            details:{
                title:'.head-title-tags h1【@innerText@】',
                author:'.intro-detail-item【@innerText@】',
                explain:'.head-info-desc【@innerText@】',
            },
            list:{
                parentCls:'.body-inner .qy-play-list',
                title:'.comic-info【@innerText@】',
                link:'.chapter-link【@href@】',
                filter:'find(.comic-cover)@$@is(.lock)@=@true'
            }
        },
        previewParams:{
            url:``,
            links:'.comic-pic-item .comic-pic【@attr@$@data-src@】'
        }
    },
    {
        type: '视频',
        name: '爱奇艺',
        pageUrl: 'http://192.168.3.32:3000/',
        detailsPage:'/pages/preview/videoResolution/index',
        params: {
            url:`https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=1&date=&pg_num=${pageReg}`,
            dataType:'json',
            list:{
                parentCls:'data.formatData.data.content',
                cover:'img',
                title:'title',
                link:'pageUrl',
                remark:'desc',
            }
        },
        detailsParams:{
            url:``,
            details:{
                title:'.head-title .header-txt【@innerText@】',
                author:'.intro-detail-item【@innerText@】',
                explain:'.intro-detail .content-paragraph【@innerText@】',
                updated:'.update-tip【@innerText@】'
            },
            list:{
                parentCls:'.qy-episode-num',
                link:'.select-link【@href@】',
                title:'.select-link【@innerText@】'
            },
            movie:{
                parentCls:'.play-list-item.selected',
                title:'.des-title【@innerText@】'
            }
        },
    },
    {
        type: '音乐',
        name: '网易云'
    }
]


//读取本地配置与默认配置合并去重，默认配置优先
const storageList =uni.getStorageSync('config')||[]
let list = [...defaultList,...storageList]
const hash = {};
const newList = list.reduce((item, next)=>{
   if(!next.guid){
      const {guid:guidText} = storageList.find(({name,type})=>name === next.name && type === next.type)||{}
      next.guid = guidText ||guid()
   }
    hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    return item;
},[])
uni.setStorageSync('config',newList)
export default newList
