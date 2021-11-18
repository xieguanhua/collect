<template>
  <view class="no-data">
   <view class="image">
     <u-image
         :lazyLoad="false"
         src="/static/image/nodata.png"
         mode="widthFix">
     </u-image>
   </view>
   <view class="text"><slot>{{value}}</slot></view>
  </view>
</template>

<script>
export default {
  name: "index",
  props:{
    value:{
      type: String,
      default:'没有查找到相关数据'
    },
  },
}
</script>


<style scoped lang="scss">
.no-data{
  .image{
    width:300rpx;
    height: 400rpx;
    margin:80rpx auto 40rpx;
  }
  .text{
    text-align: center;
    color: $uni-text-color-grey;
  }
}

</style>