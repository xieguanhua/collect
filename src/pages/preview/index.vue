<template>
  <view  class="preview" :style="cssTheme">
    <navbar :title="activeDetail.title" fixed immersive :class="{show:functionShow}" class="title"></navbar>
    <zoom-scroll
        @scrolltolower="scrollToLower"
        @scrolltoupper="scrollTopPer"
        @scroll="scroll"
        :lowerThreshold="2000"
        @touchTap="functionShow=!functionShow">
        <view class="main">
          <view class="comic-list" v-for="(item,i) in comicList" :key="i">
            <u-image v-for="(l,k) in item.list"
                     :src="l.path"
                     :key="k"
                     lazy-load
                     mode="widthFix"
                     width="100%">
            </u-image>
          </view>
          <u-loadmore :status="bottomStatus" :load-text="loadText" class="loadmore" v-if="comicList.length"/>
        </view>
    </zoom-scroll>
    <u-popup v-model="showCatalog" mode="right" safe-area-inset-bottom>
      <view class="popup-content">
        <view class="status-bar" :style="{height: statusBarHeight + 'px' }"></view>
        <view class="title hidden-text">{{detail.title}}</view>
        <view class="remark">
          <view class="hidden-text">{{detail.title}}</view>
          <view class="order">倒序</view>
        </view>
        <scroll-view scroll-y scroll-with-animation class="detail-list-scroll">
          <u-cell-group class="details-list" :border="false">
            <u-cell-item  :title="item.title"  v-for="(item,i) in detail.list" :key="i" :arrow="false" class="details-item" :class="{active:activeIndex===i}" :border-bottom="false"></u-cell-item>
          </u-cell-group>
        </scroll-view>
      </view>
    </u-popup>
    <view class="footer" :class="{show:functionShow}">
      <view class="features">
        <view class="features-list" @tap="showCatalog=true">
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
    </view>
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
      statusBarHeight: systemInfo.statusBarHeight+(menuButtonInfo.height||0),
      showCatalog:false,//显示目录
      functionShow:true,//显示控制功能
      activeLink:'',//当前选中播放列表
      detail:uni.getStorageSync('detail'),//需要预览的详情
      comicList:[],
      //上拉加载
      loadText: {
        loadmore: '上拉加载更多',
        loading: '努力加载中',
        nomore: '没有更多了'
      },
      bottomStatus:'loadmore',
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
    activeIndex(){
      return this.detail.list.findIndex(v=>v.link===this.activeLink)
    },
    activeDetail(){
      return this.detail.list[this.activeIndex]||{}
    },

  },
  async onLoad(data) {
    const {link} = getParams(data);
    this.activeLink =link
    const list = await this.getDetail(this.activeIndex)
    this.comicList.push(await this.formatData(list,this.activeDetail))
  },
  methods:{
    scroll(e){
      this.functionShow=false
      this.throttle(this.monitorScroll, 300, {immediate:true,isLastExec:true})
    },
    //监听滚动到那个位置
   async monitorScroll(e){
      //漫画集滚动到那一集选中
      const comicList = await this.getRect('.comic-list',true)
      const index =  comicList.findIndex(v=>v.bottom>0)
      const {link} =this.comicList[index] || {}
      this.activeLink =link
    },
    //下拉加载
  async scrollTopPer(){
      const index = this.activeIndex-1
      const detail = this.detail.list[index]
      if(!detail){
        //没有更多数据
        return
      }
    let list  = await this.getDetail(index)
    this.comicList.unshift(await this.formatData(list,detail))
    },
    //上拉加载
    async scrollToLower(){
      try {
        if(this.bottomStatus ==='loading' || this.bottomStatus ==='nomore')return
        this.bottomStatus ='loading'
        const index = this.activeIndex+1
        const detail = this.detail.list[index]
        if(!detail){
          //没有更多数据
          this.$nextTick(()=>{
            this.bottomStatus ='nomore'
          })
          return
        }
        let list  = await this.getDetail(index)
        this.comicList.push(await this.formatData(list,detail))
      }catch (e){
        console.error(e)
      }finally {
        this.bottomStatus ='loadmore'
      }
    },
    //数据格式
   async formatData(list,detail={}){
      list = await Promise.all(list.map(v=>this.getImageInfo(v)))
      return {...detail,list}
    },
    //获取请求数据
    async getDetail(index){
      try {
        const {pageUrl,previewParams}=this.activeTab
        let {list,link} = this.detail.list[index] ||{}
        previewParams.url = link
        if(!list){
          const {links}=await crawl(pageUrl,previewParams)
          this.detail.list[index].list = list=links
        }
        return list
      }catch (e){
        console.error(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.preview{
  background: #1F2123;
  height:100vh;
  .title{
    /deep/ .navbar{
      transform: translateY(-100%);
      transition: .1s;
    }
    &.show{
      /deep/ .navbar{
        transform: translateY(0%);
      }
    }
  }

  .loadmore{
    padding:40rpx 0;
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
      .u-cell_title{
        @extend .hidden-text;
      }
    }
    .active, .active /deep/.u-cell{
      color:$uni-color-primary;
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
    transition: .1s;
    transform: translateY(100%);
    &.show{
      transform: translateY(0%);
    }
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
