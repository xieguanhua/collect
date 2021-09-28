<template>
  <view class="classify">
    <view class="navbar">
      <view class="status-bar" :style="{height: statusBarHeight + 'px' }"></view>
      <view class="navbar-inner" :style="{height: navbarHeight + 'px'}">
        <u-icon name="plus" class="plus" size="44rpx"></u-icon>
        <text class="title">分类</text>
        <u-icon name="search" class="search" size="44rpx"></u-icon>
      </view>
    </view>
    <view class="tabs u-border-bottom" v-show="list.length">
      <u-tabs :list="list" :current="current" @change="change"></u-tabs>
    </view>
    <view class="menu-wrap">
      <scroll-view scroll-y scroll-with-animation class="tab-view">
        <view v-for="(item,index) in classifyList"
              :key="index"
              class="tab-item"
              :class="{'tab-item-active':tabActive === index}"
              @tap.stop="tabActive =index">
          <text class="u-line-1">{{ item.name }}</text>
        </view>
      </scroll-view>


    </view>

  </view>
</template>

<script>
import classifyData from './classify.data'



const classifyArr = classifyData.reduce((accumulator, item) => {
  if(!item.type){
    item.type = '未定义'
  }
  accumulator[item.type] ? accumulator[item.type].push(item):accumulator[item.type] = [item]
  return accumulator;
}, {});
let systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      statusBarHeight: systemInfo.statusBarHeight,
      classifyArr,
      tabActive:0,
      current: 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    change(index){
      this.current = index;
    },
    getData(){
    const page = this.classifyList[this.tabActive]
      console.log(page)
    }
  },
  computed: {
    classifyList(){
      return (this.list[this.current]||{}).data || classifyData
    },
    list(){
      const list =Object.keys(this.classifyArr).map(name=> ({name,data:this.classifyArr[name]}))
      list.length && list.unshift({name:'全部',data:classifyData})
      return list
    },
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44;
      // #endif
      // #ifdef MP
      // 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
      // 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
      // return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
      return systemInfo.platform === 'ios' ? 44 : 48;
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
$height:calc(100vh - var(--window-bottom));
.classify{
  height:$height;
  display: flex;
  flex-direction: column;
  .navbar-inner{
    display: flex;
    align-items: center;
    .search,.plus{
        padding:0 12px;
        height: 100%;
    }
    .title{
      flex: 1;
      font-size: 32rpx;
      text-align: center;
      font-weight:bold;

    }
  }
  .menu-wrap{
    flex: 1;
    display: flex;
    overflow: hidden;

    .tab-view{
      height: 100%;
      width: 200rpx;
      background: $uni-bg-color-grey;
    }
    .tab-item {
      height: 110rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
      color: $uni-text-color-grey;
      font-weight: 400;
      line-height: 1;
    }

    .tab-item-active {
      color: $uni-text-color;
      position: relative;
      font-size: 30rpx;
      font-weight: 600;
      background: #fff;
      &::before {
        content: "";
        position: absolute;
        border-left: 4px solid $u-type-primary;
        border-radius:0 4px 4px 0;
        height: 32rpx;
        left: 0;
        top: 39rpx;
      }
    }

  }

}

</style>
