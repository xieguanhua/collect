<template>
  <view class="details">
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
          <view class="author">作者：{{ option.author||'-' }}</view>
          <view class="state">状态：{{ option.state||'-' }}</view>
          <view class="updated">更新时间：{{ option.updated||'-' }}</view>
          <view class="see-others">查看其他源</view>
        </view>
      </view>
      <view class="operation">
        <view></view>
       <view>
         <button class="read" type="primary" size="mini">开始阅读</button>
       </view>
      </view>
      <view class="explain">{{ option.explain }}</view>
    </view>

    <view class="details-main">
      <view class="details-title">
        <view class="total-section">{{ option.typeName }}，共有{{ list.length }}个章节</view>
        <view class="sort">
          <view :class="{active:sort}"  @click="clickSort(true)">
            正序
          </view>
          <view class="line">|</view>
          <view :class="{active:!sort}" @click="clickSort(false)">
            反序
          </view>
        </view>
      </view>
      <view class="details-list">
        <view class="details-item" v-for="(item,i) in list" :key="i">
          {{ item.title }}
        </view>
      </view>

    </view>
  </view>
</template>

<script>
import {
  crawl
} from "@/api/crawl";
import classifyData from '@/common/classify.data'
export default {
  name: "index",
  data() {
    return {
      sort:true,
      activeTab:{},
      option: {},
      list:[]
    }
  },
  onLoad(option) {
    this.option = option
    uni.setNavigationBarTitle({
      title: option.title
    })

   this.activeTab= classifyData.find(({name})=>name ===option.typeName)||{}
    this.getDetail()
  },
  methods:{
    clickSort(sort){
      if(this.sort===sort)return
      this.sort = sort
      this.list.reverse()
    },
  async getDetail(){
      const {detailsParams,pageUrl} = this.activeTab
      detailsParams.url = this.option.link
      const {list=[],details}=await crawl(pageUrl,detailsParams)
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
      }
     }
      this.list = isReverse? list.reverse():list
      this.option = {...this.option,...details}
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
  .details-item{
    height:80rpx;
    line-height: 80rpx;
    padding:0 30rpx;
    color: $uni-text-color-grey;
    border-bottom:1px solid $uni-border-color;
    font-size: 24rpx;
  }
}

</style>
