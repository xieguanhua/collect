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
        @touchmove="touchmove"
        :refresherEnabled="isPrev"
        @touchTap="functionShow=!functionShow">
        <view>
          <view class="main" :style="{height:`${totalHeight}px`}">
            <cartoon-load v-for="l in renderList" :item="l" :key="l.link"/>
          </view>
          <u-loadmore :status="bottomStatus" :load-text="loadText" class="loadmore" v-if="list.length"/>
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
            <u-cell-item  :title="item.title"  v-for="(item,i) in directoryList" :key="i" :arrow="false" class="details-item" :class="{active:activeIndex===i}" :border-bottom="false" @tap="selectedWorks(i)"></u-cell-item>
          </u-cell-group>
        </scroll-view>
      </view>
    </u-popup>
    <view class="footer" :class="{show:functionShow}">
      <view class="schedule">
        <u-icon name="skip-back-left" size="36" class="skip" :class="{disabled:!isPrev}" @click="prev"></u-icon>
        <view class="slider">
          <slider v-model="schedule" @change="slider" @changing="slider" block-size="16" :active-color="theme.primary"/>
        </view>
        <u-icon name="skip-forward-right" size="36" class="skip" :class="{disabled:!isNext}" @click="next"></u-icon>
      </view>
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
          <view>{{ porTrait?"竖屏":"横屏"}}</view>
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
      porTrait:true,//竖屏
      schedule:0,
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
    totalHeight(){
      const data =this.list[ this.list.length-1]||{}
      return data.bottom||0
    },
    activeList(){
      return this.list.filter(v=>v.parentLink === this.activeLink)
    },
    isNext(){
      return !!this.directoryList[this.activeIndex+1]
    },
    isPrev(){
      return !!this.directoryList[this.activeIndex-1]
    },
    list(){
      let bottom= 0
      const { windowWidth } = uni.getSystemInfoSync();
      return this.comicList.map(v=>{
       const data= this.calculateImage(v,windowWidth)
        const top = bottom
        bottom += data.widthFixH||0
        return {...v,top,bottom,...data}
      })
    }
  },
  watch:{
    list(){
      this.setRenderList()
    }
  },
  onUnload(){
    // #ifdef APP-PLUS
    plus.screen.lockOrientation('portrait')
    // #endif
  },
   onLoad(data) {
    const {link} = getParams(data);
    this.activeLink =link
    this.selectedWorks(this.activeIndex)
  },
  methods:{
    ...mapMutations({
      setOrderBy: 'details/setOrderBy'
    }),
    calculateImage(e,winWidth){
      console.log(11,winWidth)
      const {width,height} = e
      const ratio = winWidth/width
      const widthFixW = parseInt(String(width * ratio))
      const widthFixH = parseInt(String(height * ratio))
      return {widthFixW,widthFixH}
    },
    slider(e){
      this.onSlider =true
      this.$u.debounce(()=>{
        this.onSlider =false
      }, 800)
      const {value} = e.detail
      const index = parseInt(String(value * ((this.activeList.length-1)/100)))
      const {top,bottom} =  this.activeList[index]||{}
      if(!isNaN(top)){
        const { windowHeight } = uni.getSystemInfoSync();
        const totalScrollTop = this.totalHeight-windowHeight
        let scrollTop= bottom >totalScrollTop?totalScrollTop:top
        this.scrollTop = scrollTop*this.zoom
      }
    },
    async selectedWorks(index,closeCatalog =true){
      try {
        uni.showLoading({
          title:'加载中',
          mask:true
        })
        this.comicList= await this.getDetail(index)
        this.scrollTop =0
        this.schedule=0
        if(closeCatalog){
          this.showCatalog=false
        }
        const {link} = this.directoryList[index] ||{}
        this.activeLink =link
      }catch (e){
        console.error(e)
      }finally {
        uni.hideLoading()
      }
    },
    next(){
      if(!this.isNext){
        return
      }
      this.selectedWorks(this.activeIndex+1)
    },
    prev(){
      if(!this.isPrev){
        return
      }
      this.selectedWorks(this.activeIndex-1)
    },
    setLandscape(){
      this.statusBarHeight= systemInfo.statusBarHeight+(menuButtonInfo.height||0)
      this.porTrait = plus.navigator.getOrientation() !== 0;
      plus.screen.unlockOrientation();
      plus.screen.lockOrientation( this.porTrait?'portrait-primary':'landscape-primary');
      setTimeout(()=>{
        this.comicList= []
        this.selectedWorks(this.activeIndex,false)
      },200)
    },
    touchmove(){
      this.functionShow = false
    },
    async setInverted(){
        await this.selectedWorks(this.activeIndex,false)
        this.setOrderBy(!this.inverted)
    },
    scroll(){
      this.throttle(this.monitorScroll, 500, {immediate:true,isLastExec:true})
      this.throttle(this.setRenderList, 300, {immediate:true,isLastExec:true})
    },
    //长列表加载
    setRenderList(){
      const { windowHeight } = uni.getSystemInfoSync();
      let scrollTop = this.scrollTop<0?0:this.scrollTop/this.zoom
      if(scrollTop+windowHeight>this.totalHeight){
        scrollTop = this.totalHeight-windowHeight
      }
       const index = this.list.findIndex(v=>v.bottom>=scrollTop)
      const slice = index - 5
      this.renderList= this.list.slice(slice<0?0:slice,slice+10)
    },
    //监听滚动到那个位置
    monitorScroll(e){
      let scrollTop = this.scrollTop<0?0:this.scrollTop/this.zoom
      //漫画集滚动到那一集选中
      const {parentLink,link} =this.renderList.find(v=>v.bottom >=scrollTop)||this.renderList[0]
      this.activeLink = parentLink
      if(this.onSlider)return
      this.schedule = 100 / this.activeList.length * (this.activeList.findIndex(v=>v.link === link)+1)
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
    const { windowWidth } = uni.getSystemInfoSync();
    list.forEach(v=>{
      height += this.calculateImage(v,windowWidth).widthFixH||0
    })
    callback(height*this.zoom+this.scrollTop)

    this.$nextTick(this.setRenderList)
    this.comicList= [...list,...this.comicList]
  },
    //上拉加载
    async scrollToLower(){
      try {
        if(this.bottomStatus ==='loading' || this.bottomStatus ==='nomore')return
        this.bottomStatus ='loading'
        const index = this.activeIndex+1
        if(!this.isNext){
          this.$nextTick(()=>{
            this.bottomStatus = 'nomore'
          })
          return
        }
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
    .schedule{
      padding:30rpx 20rpx;
      display: flex;
      align-items: center;
      .slider{
        flex: 1;
      }
      .skip{
        padding:10rpx;
        color:$uni-text-color;
        &.disabled{
          color:$uni-text-color-disable;
        }
      }
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
