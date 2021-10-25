<template>
  <view  class="preview"  :style="cssTheme">
<!--    <navbar :title="selectPreview.title" fixed immersive></navbar>-->
    <zoom-scroll @scrolltolower="scrolltolower">
        <view class="main">
           <u-image v-for="(item,i) in links"
                    :src="item"
                    :key="i"
                    lazy-load
                    mode="widthFix"
                    width="100%">
           </u-image>
        </view>
    </zoom-scroll>
    <u-popup v-model="show" mode="right" safe-area-inset-bottom>
      <view class="popup-content">
        <view class="status-bar" :style="{height: statusBarHeight + 'px' }"></view>
        <view class="title hidden-text">{{detail.title}}</view>
        <view class="remark">
          <view class="hidden-text">{{detail.title}}</view>
          <view class="order">倒序</view>
        </view>
        <scroll-view scroll-y scroll-with-animation class="detail-list-scroll">
          <u-cell-group class="details-list" :border="false">
            <u-cell-item  :title="item.title"  v-for="(item,i) in detail.list" :key="i" :arrow="false" class="details-item" :border-bottom="false"></u-cell-item>
          </u-cell-group>
        </scroll-view>
      </view>
    </u-popup>
<!--    <view class="footer">
      <view class="features">
        <view class="features-list" @tap="show=true">
          <view class="iconfont icon-mulu"></view>
          <view>目录</view>
        </view>
        <view class="features-list">
          <view class="iconfont icon-paixu"></view>
          <view>排序</view>
        </view>
        <view class="features-list">
          <view class="iconfont icon-shuping"></view>
          <view>竖屏</view>
        </view>
        <view class="features-list">
          <view class="iconfont icon-shangxiahuadong"></view>
          <view>卷轴</view>
        </view>
      </view>
      <view class="safe-area"></view>
    </view>-->
  </view>
</template>

<script>
import {
  crawl
} from "@/api/crawl";
import {getParams} from '@/utils'
import navbar from '@/components/navbar'
import zoomScroll from '@/components/zoom-scroll'
import {mapGetters} from "vuex";
const systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
  name: "preview",
  data(){
    return {
      activeLink:'',
      statusBarHeight: systemInfo.statusBarHeight+(menuButtonInfo.height||0),
      show:false,
      selectPreview:{},
      detail:uni.getStorageSync('detail'),
      links:[]
    }
  },
  components:{
    navbar,
    zoomScroll
  },
  computed:{
    ...mapGetters({
      classifyArr: 'details/classifyArr'
    }),
    activeTab(){
      return this.classifyArr.find(({guid})=>guid ===this.detail.guid)||{}
    },
    activeDetails(){
      return this.detail.list.find(v=>v.link===this.activeLink)||{}
    },
  },
  onLoad(data) {
    this.selectPreview = getParams(data);
    this.activeLink = this.selectPreview.link
    this.getDetail()
  },
  methods:{
    scrolltolower(){
      console.log(11)
    },
    async getDetail(){
      const {pageUrl,previewParams}=this.activeTab
      previewParams.url = this.activeLink
      let {list} = this.activeDetails
      if(!list){
        const {links}=await crawl(pageUrl,previewParams)
        this.activeDetails.list =links
        list=links
      }
      this.links = [...this.links,...list]
    }
  }
}
</script>
<style lang="scss" scoped>
.preview{
  background: #1F2123;
  height:100vh;
  .main{
    /deep/ .u-image__image{
    }
  }
}
.popup-content{
  height: 100%;
  width: 80vw;
  display: flex;
  flex-direction: column;
  &>view{
    padding: 0 20rpx;
  }
  .hidden-text{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .title{
    height:60rpx;
    line-height: 60rpx;
    font-weight:bold;
    text-align: center;
  }
  .remark{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    background: $uni-bg-color-grey;
    font-size:24rpx;
    .order{
      min-width: 80rpx;
      margin-left:20rpx;
    }
  }
}
.detail-list-scroll{
  height: 0;
  flex: 1;
  .details-list{
    /deep/ .u-cell{
      padding: 12rpx 30rpx;
      @extend .hidden-text;
    }
  }
}
  .footer{
    position: fixed;
    bottom: 0;
    background: $uni-bg-color;
    left: 0;
    right: 0;
    z-index: 997;
    .safe-area{
      height: env(safe-area-inset-bottom);
      width: 100%;
    }
    .features{
      display: flex;
      align-items: center;
      height:100rpx;
      &>.features-list{
        .iconfont{
          line-height:40rpx;
          margin-bottom:8rpx;
          font-size:36rpx;
        }
      .icon-shangxiahuadong,.icon-paixu{
        font-size: 48rpx;
      }
        flex: 1;
        text-align: center;
      }
    }
  }

</style>
