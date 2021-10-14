<template>
  <view  class="preview">
    <navbar :title="selectPreview.title" fixed immersive></navbar>
    <view class="footer">
      <view>
        <view class="">
          <view>
            
          </view>
          <view></view>
          <view></view>
          <view></view>
        </view>
      </view>
      <view class="safe-area"></view>
    </view>
  </view>
</template>

<script>
import {getParams} from '@/utils'
import navbar from '@/components/navbar'

export default {
  name: "preview",
  data(){
    return {
      selectPreview:{},
      detail:uni.getStorageSync('detail')
    }
  },
  components:{
    navbar
  },
  onLoad(data) {
    this.selectPreview = getParams(data);
    console.log(this.detail)
    // this.option = option
    // uni.setNavigationBarTitle({
    //   title: option.title
    // })
    // this.getDetail()
  },
}
</script>
<style lang="scss" scoped>
.preview{
  .footer{
    position: fixed;
    bottom: 0;
    background: $uni-bg-color;
    left: 0;
    right: 0;
    z-index: 1000;
    .safe-area{
      height: env(safe-area-inset-bottom);
      width: 100%;
    }
  }
}
</style>
