<template>
  <view class="analysis-video" :style="cssTheme">
    <view class="video" :style="videoStyle">
<!--      <video :src="playUrl"  class="video-main" v-if="playUrl" autoplay @timeupdate="timeupdate" :play-strategy="3" @ended="ended"></video>
      <web-view :src="playIframeUrl" :style="videoStyle"  v-else></web-view>-->
    </view>

 <view class="info">
   <view class="info-detail">
     <view class="cover">
       <u-image
           :src="option.cover"
           :lazy-load="true"
           border-radius="6rpx"
           mode="aspectFill"
           height="100%"
           width="100%">
       </u-image>
     </view>
     <view>
       <view>{{ option.title }}</view>
       <view class="score">{{option.score }}</view>
     </view>
   </view>
   <view class="playlist">
     <view class="playlist-title">
       <view class="anthology">
         <view>{{ playlist.length?'选集':'' }}</view>
        <view>
          <u-button @click="showSelect = true" size="mini">{{ activeSource.name }}解析</u-button>
        </view>
       </view>
       <view class="updated">{{ option.updated }}</view>
     </view>
    <view class="playlist-main">
      <scroll-view scroll-x>
        <view v-for="(item,i) in playlist" :key="i" class="collect" :class="{active:i === activeIndex}" @tap="togglePlay(item)">
          {{item.title}}
          <image :src="item.mark" class="mark"  mode="heightFix"></image>
        </view>
      </scroll-view>
    </view>
   </view>

   <view class="video-info">
     <view class="director">
       {{option.director||'' }}
     </view>
     <view class="actor">
       {{option.actor ||''}}
     </view>
     <view class="remark">
       {{option.remark ||''}}
     </view>
   </view>
 </view>
    <u-select v-model="showSelect" :list="list" label-name="name" :default-value="[selectValue]" @confirm="confirm"></u-select>
  </view>
</template>

<script>
import {
  crawl,
  agentRequests
} from "@/api/crawl";
import {mapGetters, mapMutations} from 'vuex'
import {getParams,navigateTo} from '@/utils'
const systemInfo = uni.getSystemInfoSync();
const ratio = 0.5625
export default {
  name: "index",
  data(){
    return {
      videoStyle:`width:100vw;height:calc(100vw * ${ratio})`,
      activePlayLink:'',
      playUrl:'',
      playIframeUrl:'',
      // initialTime:0,
      option: {},
      playlist:[],
      showSelect:false,
      selectValue:0,
      list:[
        {"name":"盘古","url":"https://www.pangujiexi.com/pangu/?url=","json":'https://json.pangujiexi.com:12345/json.php?url='},
        {"name":"综合纯净/B站","url":"https://z1.m1907.cn/?jx="},
        {"name":"高速接口","category":"1","url":"https://jsap.attakids.com/?url="},
        {"name":"综合/B站1","url":"https://vip.parwix.com:4433/player/?url="},
        {"name":"综合/B站2","url":"https://www.cuan.la/m3u8.php?url="},
        {"name":"BL","url":"https://vip.bljiex.com/?v="},
        {"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url="},
        {"name":"七哥","url":"https://jx.mmkv.cn/tv.php?url="},
        {"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},
        {"name":"盘古cc","url":"https://www.pangujiexi.cc/jiexi.php?url="},
        {"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url="},
        {"name":"CHok","url":"https://www.gai4.com/?url="},
        {"name":"虾米","url":"https://jx.xmflv.com/?url="},
        {"name":"618G","url":"https://jx.618g.com/?url="},
        {"name":"ckmov","url":"https://www.ckmov.vip/api.php?url="},
        {"name":"沐白","url":"https://www.miede.top/jiexi/?url="},
        {"name":"RDHK","url":"https://jx.rdhk.net/?v="},
        {"name":"爱豆","url":"https://jx.aidouer.net/?url="},
        {"name":"H8","url":"https://www.h8jx.com/jiexi.php?url="},
        {"name":"解析la","url":"https://api.jiexi.la/?url="},
        {"name":"九八","url":"https://jx.youyitv.com/?url="},
        {"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url="},
        {"name":"MUTV","url":"https://jiexi.janan.net/jiexi/?url="},
        {"name":"OK","url":"https://okjx.cc/?url="},
        {"name":"维多","url":"https://jx.ivito.cn/?url="},
        {"name":"小蒋","url":"https://www.kpezp.cn/jlexi.php?url="},
        {"name":"星驰","url":"https://vip.cjys.top/?url="},
        {"name":"星空","url":"http://60jx.com/?url="},
        {"name":"0523","url":"https://go.yh0523.cn/y.cy?url="},
        {"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url="},
        {"name":"4K","url":"https://jx.4kdv.com/?url="},
        {"name":"66","url":"https://api.3jx.top/vip/?url="},
        {"name":"116","url":"https://jx.116kan.com/?url="},
        {"name":"200","url":"https://vip.66parse.club/?url="},
        {"name":"云析","url":"https://jx.yparse.com/index.php?url="},
        {"name":"8090","url":"https://www.8090g.cn/?url="},
        {"name":"迪奥","url":"https://123.1dior.cn/?url="},
      ].map((v,i)=>({...v,value:i}))
    }
  },
  onLoad(data) {
    let option = getParams(data);
    this.option = option
    uni.setNavigationBarTitle({
      title: option.title
    })
    //读取播放记录，没有则去传递过来的
    const recordCache = this.recordCache[this.activeTab.name]||{}
    this.activePlayLink =recordCache[option.title]|| option.link
    this.getDetail()
  },
  watch:{
    activePlayLink(){
      this.getVideo()
    }
  },
  methods: {
    ...mapMutations({
      setRecordCache: 'recordCache/setRecordCache'
    }),
    confirm(e){
      const {value=0} = e[0]||{}
       this.selectValue = value
      this.getVideo()
    },
    ended(){
      const data =this.playlist[this.activeIndex+1]
      if(data){
        uni.showToast({
          title:'即将播放下一集',
          icon:'none',
          position:'bottom'
        })
        this.activePlayLink =data.link
      }
    },
    togglePlay(item){
      if(this.activePlayLink === item.link||!item.link){
        return
      }
      this.activePlayLink = item.link
    },
    async getDetail() {
      const {detailsParams, pageUrl, pageDetailsUrl} = this.activeTab
      detailsParams.url = this.option.link
      const {list, details} = await crawl(pageDetailsUrl || pageUrl, detailsParams, {
        showLoading: true,
        loadingMask: true
      })
      this.option = {...this.option,...details}
      this.playlist = list||[]
    },
   async getVideo(){
      const {json,url} = this.activeSource
      const link = this.activePlayLink
     // #ifdef MP-WEIXIN || MP-ALIPAY || APP-PLUS
     try {
        if(json){
          const {playPath} = await agentRequests({url:json + link,playPath:'url'},{loadingMask: true})
          this.playUrl = playPath
        }else{
          this.playUrl=''
        }
     }catch (e){
       this.playUrl=''
        console.error(e)
     }
     // #endif
     if(!this.playUrl){
       const iframeUrl = url + link
       //#ifdef H5 || APP-PLUS
      this.playIframeUrl =iframeUrl
         //#ifdef APP-PLUS
            const currentWebview = this.$scope.$getAppWebview();
            this.$nextTick(()=>{
              const wv = currentWebview.children()[0];
              wv.setStyle({
                height:systemInfo.windowWidth*ratio
              })
            })
         // #endif
       setTimeout(()=>{
         uni.setNavigationBarTitle({
           title: this.option.title
         })
       },300)
      // #endif
      //#ifndef H5 || APP-PLUS
       navigateTo(`/pages/details/video/webPage`,{iframeUrl})
       // #endif
     }
     this.setRecordCache({
       type:this.activeTab.name,
       name:this.option.title,
       link:this.activePlayLink
     })
     // this.initialTime = uni.getStorageSync(this.playUrl)||0
   },
    //播放时间更新
    timeupdate(e){
      this.playUrl&& uni.setStorageSync(this.playUrl,e.target.currentTime)
    }
  },
  computed: {
    ...mapGetters({
      classifyArr: 'details/classifyArr',
      recordCache:'recordCache/recordCache'
    }),
    activeSource(){
     return this.list[this.selectValue]||this.list[0]
    },
    activeTab() {
      return this.classifyArr.find(({guid}) => guid === this.option.guid) || {}
    },
    activeIndex(){
      const index = this.playlist.findIndex(v=>v.link === this.activePlayLink)
     return index<0?0:index
    }
  }
}
</script>

<style lang="scss" scoped>

.analysis-video {
    video {
      width: 100%;
      height: 100%;
    }
  .info{
    padding:0 20rpx;
  }
  .info-detail{
    display: flex;
    align-items: center;
    line-height:40rpx;
    padding:20rpx 0;
    .cover{
      width: 100rpx;
      height: 100rpx;
      margin-right:20rpx;
    }
    .score{
      color:$uni-color-primary;
      font-size:24rpx;
      margin-top: 10rpx;
    }
  }
  .video-info{
    font-size: 24rpx;
    color: $uni-text-color-grey;
    view{
      margin-top:10rpx;
    }
  }
  .playlist{
    margin-top:20rpx;
    .playlist-title{
      .anthology{
        display: flex;
        align-items:center;
        justify-content: space-between;
        padding:10rpx 0;
      }
      .updated{
        color: $uni-text-color-grey;
        font-size: 20rpx;
      }
    }
    .playlist-main{
      padding: 20rpx 0;
      white-space:nowrap;
      .collect{
        padding:0 10rpx;
        margin:20rpx 0;
        font-size:24rpx;
        border-radius: 6rpx;
        position: relative;
        display: inline-block;
        min-width:80rpx;
        height:80rpx;
        line-height:80rpx;
        margin-right:20rpx;
        background: $uni-bg-color-grey;
        text-align: center;
        &.active{
          border:1px solid $uni-color-primary;
          color: $uni-color-primary;
        }
      }
      .mark{
        height: 24rpx;
        position: absolute;
        top:0;
        right:0;
        z-index: 1;

      }
    }
  }
}
</style>