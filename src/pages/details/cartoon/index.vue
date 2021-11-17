<template>
  <view class="details"  :style="cssTheme">
    <view class="info">
      <view class="info-detail">
        <view class="cover">
          <u-image
              :src="option.cover"
              :lazy-load="true"
              border-radius="6rpx"
              mode="aspectFill"
              height="260rpx"
              width="100%">
          </u-image>
        </view>
        <view class="main-info">
          <view class="title">{{ option.title }}</view>
          <view class="author">{{ option.author||'-' }}</view>
          <view class="state">状态：{{ option.state||'-' }}</view>
          <view class="updated">{{ option.updated||'-' }}</view>
          <view class="see-others">查看其他源</view>
        </view>
      </view>
      <view class="operation">
        <view></view>
       <view>
         <button class="read" type="primary" size="mini" @tap="startRead(list[0])">开始阅读</button>
       </view>
      </view>
      <view class="explain">{{ option.explain }}</view>
    </view>

    <view class="details-main">
      <view class="details-title">
        <view class="total-section">{{ activeTab.name }}，共有{{ list.length }}个资源</view>
        <view class="sort">
          <view :class="{active:!orderBy}"  @tap="setOrderBy(false)">
            正序
          </view>
          <view class="line">|</view>
          <view :class="{active:orderBy}" @tap="setOrderBy(true)">
            反序
          </view>
        </view>
      </view>
      <u-cell-group class="details-list" :border="false">
        <u-cell-item @tap="startRead(item)" icon="eye-fill" :title="item.title"  v-for="(item,i) in list" :key="i" :arrow="false" class="details-item" :border-bottom="false"></u-cell-item>
      </u-cell-group>
    </view>
  </view>
</template>

<script>
import {
  crawl
} from "@/api/crawl";
import {mapGetters,mapMutations} from 'vuex'
import {navigateTo,getParams} from '@/utils'
export default {
  name: "index",
  data() {
    return {
      option: {},
      reverseList:[]
    }
  },
  onLoad(data) {
    let option = getParams(data);
    this.option = option

    uni.setNavigationBarTitle({
      title: option.title
    })
   this.getDetail()
  },
  methods:{
    ...mapMutations({
      setOrderBy: 'details/setOrderBy'
    }),
    startRead(item){
      if(!item)return
      const {guid} = this.option
      navigateTo('/pages/details/cartoon/preview',{...item,guid})
    },
   async getDetail(){
      const {detailsParams,pageUrl,pageDetailsUrl} = this.activeTab
      detailsParams.url = this.option.link
      const {list:list,details}=await crawl(pageDetailsUrl||pageUrl,detailsParams,{showLoading:true,loadingMask:true})
      let isReverse=false
      for (let i=0;i<list.length;i++){
       const {title=''} =list[i]||{}
      const v= parseInt(title.replace(/[^0-9]/ig, ''))
      if(!isNaN(v)){
        if(!isReverse){
          isReverse =v
        }else{
          isReverse = isReverse>v
          break
        }
      }}
     this.reverseList = isReverse? list.reverse():list
     this.reverseList.forEach(v=>{
       v.title = v.title.replace(/[\r\n]/g, "");
     })
      this.option = {...this.option,...details}
      uni.setStorageSync('detail',{
          ...this.option,
          list:this.reverseList
        });
    }
  },
  computed:{
    ...mapGetters({
      orderBy: 'details/orderBy',
      classifyArr: 'details/classifyArr'
    }),
    activeTab(){
      return this.classifyArr.find(({guid})=>guid ===this.option.guid)||{}
    },
    list(){
      const {reverseList,orderBy} = this
      return orderBy?[...reverseList].reverse():reverseList
    }
  }
}
</script>
<style lang="scss" scoped>
.info{
  padding:30rpx;
  .info-detail{
    display: flex;
    .cover{
      margin-right:30rpx;
      width:180rpx;
      min-width:180rpx;
    }

    .main-info{
      line-height:42rpx;
      font-size:24rpx;
      color: $uni-text-color-grey;
      &>view{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
    .title{
      color: $uni-text-color;
      font-weight:bold;
      font-size:32rpx;
      margin-bottom:20rpx;
    }
    .see-others{
      margin-top:20rpx;
      color: $uni-color-error;
    }
  }
  .operation{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:20rpx 0;
    .read{
      border-radius: 50px;
      vertical-align: middle;
      background: $uni-color-primary;
      &:after{
        border: none;
      }
    }
  }
  .explain{
    min-height: 120rpx;
    line-height:40rpx;
    font-size:24rpx;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}

.details-main{
  .details-title{
    background: $uni-bg-color;
    padding:0 30rpx;
    display: flex;
    font-size:26rpx;
    color: $uni-text-color-grey;
    border-bottom:1px solid $uni-border-color;
    height:60rpx;
    line-height: 60rpx;
    position: sticky;
    z-index: 10;
    top: 0;
    // #ifdef H5
    top: 44px;
    // #endif
  }
  .total-section{
    flex: 1;
  }
  .sort{
    display: flex;
    .active{
      color: $uni-color-primary;
    }
    .line{
      margin:0 10rpx;
    }
  }
  .details-list{
    /deep/ .u-cell{
      padding: 12rpx 30rpx;
      border-bottom:1px solid $uni-border-color;
    }
  }
}

</style>
