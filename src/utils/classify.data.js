import {guid} from '@/utils'
export const pageReg = `pageNumberReg`
export const offsetReg =`offsetNumberReg`
export const keyWordReg = `keyReg`
export const host = 'http://192.168.3.32:3000'
export const puppeteerApi = host +'/api/puppeteer/'
export const jsonApi = host +'/api/json/'
const routes ={
    all:'全部',
    music: '音乐',
    video:'视频',
    fiction:'小说',
    cartoon:'漫画'
}
 const fuzzySearchList =[
    {
        routeType: 'cartoon',
        requestURL:{
            requestPageUrl:jsonApi,
            url:`https://m.ac.qq.com/search/smart?word=${keyWordReg}`,
            list:{
                parentCls:'data',
                text:'title',
            }
        },
        hotSearch: {
            url:`https://m.ac.qq.com/search/index`,
            list:{
                parentCls:'.search-hot-list .item',
                text:'.link【@innerText@】'
            }

        }
    },
    {
        routeType: 'video',
        requestURL:{
            requestPageUrl:jsonApi,
            jsonpName:'QZOutputJson',
            url:`http://s.video.qq.com/smt_wap?ver=3&num=10&otype=json&query=${keyWordReg}`,
            list:{
                parentCls:'item',
                text:'word',
            }
        },
        hotSearch: {
            requestPageUrl:jsonApi,
            url:`https://node.video.qq.com/x/api/hot_mobilesearch?channdlId=0&_=1636430562511`,
            list:{
                parentCls:'data.itemList',
                text:'title'
            }

        }
    }
]
fuzzySearchList.forEach(v=>{
    v.type = routes[v.routeType]
})
export {fuzzySearchList}
const defaultList = [
    {
        routeType: 'cartoon',
        name: '快看漫画',
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
        },
        searchParams:{
            url:`https://www.kuaikanmanhua.com/sou/${keyWordReg}`,
            list:{
                parentCls:'.resultList>.fl',
                cover:'.imgBox .img【@attr@$@data-src@】',//使用jquery获取dom属性,attr,text等等
                title:'.itemTitle【@innerText@】',
                link:'.link【@href@】',
                remark:'.author【@innerText@】',
            }
        }
    },
    {
        routeType: 'cartoon',
        name: '腾讯漫画',
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
        },
        searchParams:{
            url:`https://m.ac.qq.com/search/result?word=${keyWordReg}`,
            list:{
                parentCls:'.result-list .comic-item',
                cover:'.cover-image【@src@】',
                title:'.comic-title【@innerText@】',
                link:'.comic-link【@href@】',
                remark:'.comic-desc【@innerText@】',
                updated:'.comic-update【@innerText@】',
            }
        }
    },
    {
        routeType: 'video',
        name: '爱奇艺',
        tags:[
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=-1&date=&pg_num=1",
                innerText: "总榜"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=2&date=&pg_num=1",
                innerText: "电视剧"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=1&date=&pg_num=1",
                innerText: "电影"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=6&date=&pg_num=1",
                innerText: "综艺"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=4&date=&pg_num=1",
                innerText: "动漫"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=15&date=&pg_num=1",
                innerText: "儿童"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=3&date=&pg_num=1",
                innerText: "纪录片"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=-7&date=&pg_num=1",
                innerText: "说唱"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=12&date=&pg_num=1",
                innerText: "教育"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=912&date=&pg_num=1",
                innerText: "知识"
            },
            {
                href: "https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&category_id=17&date=&pg_num=1",
                innerText: "体育"
            }
        ],
        params: {
            requestPageUrl: jsonApi,
            url:`https://pcw-api.iqiyi.com/strategy/pcw/data/topRanksData?page_st=0&tag=0&date=&pg_num=${pageReg}`,
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
                director:`script:return ($('.intro-detail-item')[0]||{}).innerText`,
                actor:`script:return ($('.intro-detail-item')[1]||{}).innerText`,
                remark:`script:return ($('.intro-detail-item')[2]||{}).innerText`,
                updated:'.update-tip【@innerText@】'
                // score:''
            },
            list:`script:return (async function aa() {if (!$('.select-item').length) {return [];};await sleep(8000);async function get() {await sleep();return $('.select-item').map((i, r) => {const v = $(r).find('.select-link');return {link: v[0].href, mark: ($(r).find('img')[0] || {}).src, title: v.text(), remark: v.attr('title')}})};let list =[];async function recursion(index =0){const dom = $('.bar-li,.popup-li');const d = dom.eq(index);if(d.length && !d.hasClass('more-li')){d.click();list =[...list,...(await get())];}dom.length>++index && await recursion(index);}await recursion();return list;})()`,
        },
        searchParams:{
            url:`https://so.iqiyi.com/so/q_${keyWordReg}_ctg__t_0_page_1_p_1_qc_0_rd__site_iqiyi_m_1_bitrate__af_0`,
            list:{
                parentCls:'.vertical-pic',
                cover:'.qy-mod-link img【@src@】',
                title:'.main-tit【@innerText@】',
                link: `script:return (data.find('.album-item a')[0] || data.find('.qy-mod-link')[0]||{}).href`,
                updated:`script:return data.find('.qy-search-result-info').eq(5).text()`,
                remark:`.multiple .info-des【@innerText@】`,
            }
        }
    },
    {
        routeType: 'video',
        name: '腾讯视频',
        tags:[
            {
                href: "https://v.qq.com/x/bu/pagesheet/list?append=1&channel=tv&offset=0",
                innerText: "电视剧"
            },
            {
                href: "https://v.qq.com/x/bu/pagesheet/list?append=1&channel=movie&offset=0",
                innerText: "电影"
            },
            {
                href:  "https://v.qq.com/x/bu/pagesheet/list?append=1&channel=variety&offset=0",
                innerText: "综艺"
            },
            {
                href: "https://v.qq.com/x/bu/pagesheet/list?append=1&channel=cartoon&offset=0",
                innerText: "动漫"
            },
            {
                href: "https://v.qq.com/x/bu/pagesheet/list?append=1&channel=child&offset=0",
                innerText: "儿童"
            },
            {
                href: "https://v.qq.com/x/bu/pagesheet/list?append=1&channel=doco&offset=0",
                innerText: "纪录片"
            },
            {
                href:"https://v.qq.com/x/bu/pagesheet/list?append=1&channel=knowledge&offset=0",
                innerText: "知识"
            },
            {
                href:"https://v.qq.com/x/bu/pagesheet/list?append=1&channel=sports_new&offset=0",
                innerText: "体育"
            }
        ],
        params: {
            setCoding:true,
            url:`https://v.qq.com/x/bu/pagesheet/list?append=1&channel=tv&offset=${offsetReg}`,
            list:{
                parentCls:'.list_item',
                cover:'.figure_pic【@src@】',
                title:'.figure_title【@innerText@】',
                link:'.figure【@href@】',
                remark:'.figure_desc【@innerText@】',
            }
        },
        detailsParams:{
            url:``,
            details:`script:return (async () => {await sleep(8000);return {title: $('.video_title ._main_title').text(), actor: $('.director').text(), remark: $('.video_summary .summary').text(), updated: $('.player_hint').text(), score: $('.video_score').text()}})()`,
            list:`script:return (async () => {await sleep(8000);if (!$('.mod_episode .item').length) {return [];};async function get() {await sleep();return $('.mod_episode .item').map((i, r) => {const v = $(r).find('a');return {link: v[0].href, mark: ($(r).find('img')[0] || {}).src, title: v.text()}}).toArray()};let list = [];async function recursion(index = 0) {const dom = $('.episode_filter_items .item');const d = dom.eq(index);if (d.length) {d.click();list = [...list, ...(await get())];} else if (index === 0) {list =await get()}dom.length > ++index && await recursion(index);}await recursion();return list;})()`
        },
        searchParams:{
            url:'https://v.qq.com/x/search/?q=keyReg',
            list:`script:return (() => {return  $('.result_item_v').map((i,v) => ({cover: $(v).find('.figure_pic')[0].src, title: $(v).find('.result_title').text(),link: $(v).find('.figure')[0].href, remark: $(v).find('.desc_text').text(),})).toArray().filter(v=>v.link.indexOf('search_redirect.html')<0)})()`
        }
    },

    {
        routeType: 'music',
        name: '网易云'
    }
]


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
