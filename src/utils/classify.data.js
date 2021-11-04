import {guid} from '@/utils'
const pageReg = `pageNumberReg`
export const host = 'http://192.168.0.103:3000'
const defaultList = [
    {
        routeType: 'fiction',
        name: '快看漫画',
        pageUrl: host +'/api/puppeteer/',
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
                }*/
            }
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
        routeType: 'fiction',
        name: '腾讯漫画',
        pageUrl: host +'/api/puppeteer/',
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
                parentCls:'.chapter-wrap-list.normal .bottom-chapter-item',
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
        routeType: 'video',
        name: '爱奇艺',
        pageUrl: host +'/api/json/',
        pageDetailsUrl:host +'/api/puppeteer/',
        params: {
            url:`https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=2&date=&pg_num=${pageReg}`,
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
                director:`script:return $('.intro-detail-item')[0].innerText`,
                actor:`script:return $('.intro-detail-item')[1].innerText`,
                remark:`script:return $('.intro-detail-item')[2].innerText`,
                updated:'.update-tip【@innerText@】'
                // score:''
            },
            list:`script:return (async function aa(){ if(!$('.select-item').length){return []};function get(){return $('.select-item').map((i,r)=>{const v = $(r).find('.select-link');return {link: v[0].href,mark:($(r).find('img')[0]||{}).src, title: v.text(), remark: v.attr('title')}})};await sleep(8000);let list = get();$('.bar-li').eq(1).click();function sleep(time){return new Promise(resolve => {setTimeout(resolve,time||3000)})};await sleep();return [...list,...get()]})()`,
            // clearCache:true
        },
    },
    {
        routeType: 'music',
        name: '网易云'
    }
]

const routes ={
    music: '音乐',
    video:'视频',
    fiction:'小说',
    cartoon:'漫画'
}
//读取本地配置与默认配置合并去重，默认配置优先
const storageList =uni.getStorageSync('config')||[]
let list = [...defaultList,...storageList]
const hash = {};
const newList = list.reduce((item, next)=>{
    next.type= routes[next.routeType]
    if(!next.guid){
       const {guid:guidText} = storageList.find(({name,routeType})=>name === next.name && routeType === next.routeType)||{}
      next.guid = guidText ||guid()
   }
    hash[next.name] ? '' : hash[next.name] = true && item.push(next);
    return item;
},[])
uni.setStorageSync('config',newList)
export default newList
