<template>
  <view  class="preview" :style="cssTheme">
    <navbar :title="activeDetail.title" fixed immersive :class="{show:functionShow}" class="title"></navbar>
    <zoom-scroll
        @scrolltolower="scrollToLower"
        @scrolltoupper="scrollTopPer"
        @scroll="scroll"
        :zoom.sync="zoom"
        :scroll-top.sync="scrollTop"
        :lowerThreshold="2000"
        :refresherEnabled="refresherEnabled"
        @touchTap="functionShow=!functionShow">
        <view>
          <view class="main" :style="{height:`${totalHeight}px`}">
            <cartoon-load v-for="(l,k) in renderList" :item="l" :key="k"/>
          </view>
          <u-loadmore :status="bottomStatus" :load-text="loadText" class="loadmore" v-if="comicList.length && pullEnabled"/>
        </view>

    </zoom-scroll>
    <u-popup v-model="showCatalog" mode="right" safe-area-inset-bottom>
      <view class="popup-content">
        <view class="status-bar" :style="{height: statusBarHeight + 'px' }"></view>
        <view class="title hidden-text">{{detail.title}}</view>
        <view class="remark">
          <view class="hidden-text">{{detail.title}}</view>
          <view class="order" @click="setInverted">{{invertedText}}</view>
        </view>
        <scroll-view scroll-y scroll-with-animation class="detail-list-scroll">
          <u-cell-group class="details-list" :border="false">
            <u-cell-item  :title="item.title"  v-for="(item,i) in directoryList" :key="i" :arrow="false" class="details-item" :class="{active:activeIndex===i}" :border-bottom="false"></u-cell-item>
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
        <view class="features-list"  @click="setInverted">
          <view class="iconfont icon-paixu"></view>
          <view>{{ invertedText }}</view>
        </view>
      <!-- #ifdef APP-PLUS-->
        <view class="features-list" @tap="setLandscape">
          <view class="iconfont icon-shuping"></view>
          <view>{{ landscape?"竖屏":"横屏"}}</view>
        </view>
      <!-- #endif-->

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
import {mapGetters, mapMutations} from "vuex";
const systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
import cartoonLoad from './cartoonLoad'
export default {
  name: "preview",
  data(){
    return {
      landscape:true,
      statusBarHeight: systemInfo.statusBarHeight+(menuButtonInfo.height||0),
      showCatalog:false,//显示目录
      functionShow:true,//显示控制功能
      activeLink:'',//当前选中播放列表
      detail:uni.getStorageSync('detail'),//需要预览的详情
      comicList:[],
      renderList:[],
      //上拉加载
      loadText: {
        loadmore: '上拉加载更多',
        loading: '努力加载中',
        nomore: '没有更多了'
      },
      bottomStatus:'loadmore',
      zoom:1,
      scrollTop:0,
    }
  },
  components:{
    navbar,
    zoomScroll,
    cartoonLoad
  },
  computed:{
    ...mapGetters({
      classifyArr: 'details/classifyArr',
      inverted: 'details/orderBy',
    }),
    invertedText(){
      return this.inverted?'倒叙':'正序'
    },
    directoryList(){
      const list  = [...this.detail.list]
      return this.inverted ?list.reverse():list
    },
    activeTab(){
      return this.classifyArr.find(({guid})=>guid ===this.detail.guid)||{}
    },
    activeIndex(){
      return this.directoryList.findIndex(v=>v.link===this.activeLink)
    },
    activeDetail(){
      return this.directoryList[this.activeIndex]||{}
    },
    pullEnabled(){
      return !!this.directoryList[this.activeIndex+1]
    },
    refresherEnabled(){
      return !!this.directoryList[this.activeIndex-1]
    },
    totalHeight(){
      let height = 0
      this.comicList.forEach(v=>{
        height += v.widthFixH||0
      })
      return height
    },
  },
  watch:{
    comicList(){
      this.setRenderList()
    }
  },
  onUnload(){
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait')
    // #endif
  },
  async onLoad(data) {
    const {link} = getParams(data);
    this.activeLink =link
    try {
      uni.showLoading({
        title:'加载中',
      })
      const list = await this.getDetail(this.activeIndex)
      this.comicList= [...this.comicList,...list]
    }catch (e){
        console.error(e)
    }finally {
      uni.hideLoading()
    }
  },
  methods:{
    ...mapMutations({
      setOrderBy: 'details/setOrderBy'
    }),
    setLandscape(){

      this.statusBarHeight= systemInfo.statusBarHeight+(menuButtonInfo.height||0)
      this.landscape = plus.navigator.getOrientation() !== 0;
      plus.screen.unlockOrientation();
      plus.screen.lockOrientation( this.landscape?'portrait-primary':'landscape-primary');
    },
    setInverted(){
        this.comicList.reverse()
        this.setOrderBy(!this.inverted)
    },
    scroll(){
      this.functionShow=false
      this.throttle(this.monitorScroll, 300, {immediate:true,isLastExec:true})
      this.setRenderList()
    },
    setRenderList(){
      const { windowHeight } = uni.getSystemInfoSync();
      let scrollTop = this.scrollTop<0?0:this.scrollTop/this.zoom
      if(scrollTop+windowHeight>this.totalHeight){
        scrollTop = this.totalHeight-windowHeight
      }
      let height = 0
      let dataList = []
      for (let j=0;j<this.comicList.length;j++){
        const v=this.comicList[j]
        v.top = height
        height += v.widthFixH||0
        if(v.top>=scrollTop && v.top<=scrollTop+windowHeight || height>=scrollTop && height<=scrollTop+windowHeight || v.top<=scrollTop && height>= scrollTop+windowHeight){
          dataList.push(v)
        }else if(height>=scrollTop+windowHeight){
          dataList.push(v)
          break
        }
      }
      this.renderList= dataList
    },
    //监听滚动到那个位置
   async monitorScroll(e){
      //漫画集滚动到那一集选中
     this.activeLink = this.renderList[0].parentLink
   },
    //下拉加载
  async scrollTopPer(e){
      const {callback} =e
      const index = this.activeIndex-1
      const detail = this.directoryList[index]
      if(!detail){
        //没有更多数据
        return
      }
    let list  = await this.getDetail(index)
    let height = 0
    list.forEach(v=>{
      height += v.widthFixH||0
    })
    callback(height*this.zoom+this.scrollTop)

    this.$nextTick(this.setRenderList)
    this.comicList= [...list,...this.comicList]
  },
    //上拉加载
    async scrollToLower(){
      try {
        if(this.bottomStatus ==='loading' || this.bottomStatus ==='nomore' || !this.pullEnabled)return
        this.bottomStatus ='loading'
        const index = this.activeIndex+1
        let list  = await this.getDetail(index)
        this.comicList= [...this.comicList,...list]
      }catch (e){
        console.error(e)
      }finally {
        this.bottomStatus ='loadmore'
      }
    },
    //数据格式
   async formatData(list,detail={}){
      const {link} = detail
     if(typeof list === 'string'){
       list =[list]
     }
      list = await Promise.all(list.map(v=>this.getImageInfo(v)))
      list.forEach(v=>{
      v.parentLink = link
      })
      return list
    },
    //获取请求数据
    async getDetail(index,config){
      try {
        const {pageUrl,previewParams}=this.activeTab
        const detail = this.directoryList[index] ||{}
         let {list,link} = detail
        previewParams.url = link
        if(!list){
          const {links}=await crawl(pageUrl,previewParams,config)
          list = await this.formatData(links,detail)
          this.detail.list[index].list = list
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
