<template>
  <view class="content">
    <navbar :show-right="false" :show-left="false">
      <view class="flex search">
        <view class="type" @tap="showPicker =true">
          <text class="type-text">{{ activeSearchType.type }}</text>
          <u-icon name="arrow-down" size="20"></u-icon>
        </view>
        <u-icon name="search" size="34" class="search-icon"></u-icon>
        <view class="input"><input confirm-type="search" type="text" focus @input="input" v-model="value"></view>
        <view class="cancel" @click="cancel">
          <text>取消</text>
        </view>
      </view>
    </navbar>

    <!--热门推荐与历史搜索-->
    <view class="record">
      <view v-if="historyListRender.length" class="hot">
        <view class="title">
          <view>历史搜索</view>
          <view @tap="empty"><u-icon name="trash" size="40"></u-icon></view>
        </view>
        <view class="hot-list">
          <view v-for="(item,i) in historyListRender" :key="i" class="item">
            {{item.text}}
          </view>
        </view>
        <view @click="unfold=!unfold" class="unfold" :class="{active:unfold}" v-if="historyList.length>historyListRender.length || unfold">
          <u-icon name="arrow-down" size="40"></u-icon>
        </view>
      </view>
      <view v-if="hotList.length" class="hot">
        <view class="title">热门搜索</view>
        <view class="hot-list">
          <view v-for="(item,i) in hotList" :key="i" class="item">
            {{item.text}}
          </view>
        </view>
      </view>
    </view>
    <!--关键词搜索列表-->
    <view class="keyword-list">

    </view>

    <u-select v-model="showPicker" :list="fuzzySearchList" value-name="routeType" label-name="type" @confirm="pickerConfirm" :default-value="[searchActive]"></u-select>
  </view>
</template>

<script>
import navbar from '@/components/navbar'
import {fuzzySearchList} from '@/utils/classify.data'
import {getParams} from '@/utils'
import {mapGetters} from 'vuex'
import {
  crawl,
  agentRequests
} from "@/api/crawl";
export default {
  name: "index",
  data() {
    return {
      value:'',
      fuzzySearchList,
      searchActiveType: '',//选中搜索类型
      showPicker: false,//显示搜索类型
      hotList:[],//热门推荐
      historyList:uni.getStorageSync('search')||[],//历史列表
      unfold:false,
    }
  },
  onLoad(data) {
    let option = getParams(data);
    this.searchActiveType = option.routeType
  },
  components: {
    navbar
  },
  methods: {
    cancel() {
      uni.navigateBack();
    },
    pickerConfirm(e) {
      const {value} = e[0] || {}
      this.searchActiveType = value
    },
    async getHostList() {
      try {
        const {hotSearch, list=[],pageUrl,hotJsonSearch,pageJsonUrl} = this.activeSearchType
        const url = hotJsonSearch?pageJsonUrl:pageUrl
        if (list.length) {
          this.hotList = list
        } else {
          let {list} =  await crawl(url,hotSearch||hotJsonSearch)
          this.hotList = this.activeSearchType.list = list
        }
      } catch (e) {
        console.error(e)
      }
    },
    empty(){
      this.historyList = []
      uni.removeStorageSync('search')
    },
    async input(){
      try {
        const {requestURL,pageJsonUrl} = this.activeSearchType
        const params = {...requestURL}
        params.url = params.url.replace('keyReg',this.value)
        let {list} =  await crawl(pageJsonUrl,params)
        console.log(this.value)

      }catch (e){
        console.error(e)
      }
    }
  },
  watch: {
    searchActive: {
      handler() {
        this.getHostList()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      classifyArr: 'details/classifyArr',
    }),
    historyListRender(){
      return this.historyList.slice(0,this.unfold?this.historyList.length:5)
    },
    searchActive() {
      const index = this.fuzzySearchList.findIndex(v => v.routeType === this.searchActiveType)
      return index < 0 ? 0 : index
    },
    activeSearchType() {
      return this.fuzzySearchList[this.searchActive] || this.fuzzySearchList[0]
    }
  }
}
</script>

<style scoped lang="scss">
.search{
  width:100%;
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom:1px solid $uni-border-color;
  font-size: 24rpx;
  .input{
    flex: 1;
  }
  .search-icon{
    padding-right: 20rpx;
  }
  .cancel,.type{
    padding: 0 30rpx;
  }
  .type-text{
    margin-right:10rpx;
  }
  .cancel{
    height: 100%;
    display: flex;
    align-items: center;
  }
}
.record{
  padding-left:20rpx;
  font-size: 24rpx;
  .unfold{
    margin-top:20rpx;
    text-align: center;
    transform: rotate(0);
    transform-origin: center center;
    transition: .3s;
    margin-left: -20rpx;
    &.active{
      transform:rotate(180deg);
    }
  }
  .title{
    color: $uni-text-color-grey;
    margin-top:40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right:20rpx;
  }
  .hot-list{
    display: flex;
    flex-wrap: wrap;
    .item{
      background: $uni-bg-color-grey;
      border-radius:6rpx;
      padding:8rpx 16rpx;
      margin-right:20rpx;
      margin-top:20rpx;
    }
  }
}
</style>