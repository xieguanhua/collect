<template>
  <view class="analysis-video" :style="cssTheme">
    <view class="video" :style="videoStyle">
      <video :src="playUrl"  class="video-main" v-if="playUrl" autoplay></video>
      <web-view :src="playIframeUrl" :style="videoStyle"  v-else></web-view>
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
   <view class="playlist" v-if="playlist.length">
     <view class="playlist-title">
       <view class="anthology">选集</view>
       <view class="updated">{{ option.updated }}</view>
     </view>
    <view class="playlist-main">
      <scroll-view scroll-x>
        <view v-for="(item,i) in playlist" :key="i" class="collect">
          {{item.title}}
        </view>
      </scroll-view>
    </view>
   </view>

   <view class="video-info">
     <view class="director">
       {{option.director }}
     </view>
     <view class="actor">
       {{option.actor }}
     </view>
     <view class="remark">
       {{option.remark }}
     </view>
   </view>
 </view>
  </view>
</template>

<script>
import {
  crawl,
  agentRequests
} from "@/api/crawl";
import {mapGetters, mapMutations} from 'vuex'
import {navigateTo, getParams} from '@/utils'
export default {
  name: "index",
  data(){
    return {
      videoStyle:{width:'100vw',height:'calc(100vw * 0.5625)'},
      playUrl:'',
      playIframeUrl:'',
      option: {},
      playlist:[]
    }
  },
  onLoad(data) {
    let option = getParams(data);
    this.option = option
    uni.setNavigationBarTitle({
      title: option.title
    })
    this.getDetail()
    this.getVideo()
  },
  components:{
  },
  methods: {
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
     // #ifdef MP-WEIXIN || MP-ALIPAY || APP-PLUS
     const url = `https://json.pangujiexi.com:12345/json.php?url=${this.option.link}`
     const {playPath} = await agentRequests({url,playPath:'url'},{
       showLoading: true,
       loadingMask: true
     })
     this.playUrl = playPath
     // #endif
     this.playIframeUrl = `https://www.pangujiexi.com/pangu/?url=${this.option.link}`
    }
  },
  computed: {
    ...mapGetters({
      orderBy: 'details/orderBy',
      classifyArr: 'details/classifyArr'
    }),
    activeTab() {
      return this.classifyArr.find(({guid}) => guid === this.option.guid) || {}
    },
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
      .updated{
        color: $uni-text-color-grey;
        font-size: 20rpx;
      }
    }
    .playlist-main{
      white-space:nowrap;
      padding:20rpx 0;
      .collect{
        font-size:24rpx;
        border-radius: 6rpx;
        display: inline-block;
        width:80rpx;
        height:80rpx;
        line-height:80rpx;
        margin-right:20rpx;
        background: $uni-bg-color-grey;
        text-align: center;
        &.active{
          color: $uni-color-primary;
        }
      }
    }
  }
}
</style>