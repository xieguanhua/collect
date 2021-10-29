<template>
  <view :style="{height:`${item.widthFixH}px`,top:`${item.top}px`}" class="cartoon">
      <view class="progress" v-if="loading && !loadingErr">
        <u-circle-progress :active-color="theme.primary"
                           :percent="percent"
                           :inactive-color="theme.bgColor"
                           :border-width="8"
                           :duration="3000"
                           bg-color="transparent" :width="120">
          <text class='u-progress-info'>查找中</text>
        </u-circle-progress>
      </view>
      <view v-else-if="loadingErr" class="error">
        <image
            src="/static/image/preview/comicLoad.png"
            class="image"
            mode="widthFix"
        ></image>
        <view>图片加载失败</view>
      </view>
    <transition name="fade">
      <image
          v-show="!loading && !loadingErr"
          :src="item.link"
           mode="aspectFill"
          :draggable="false"
          @load="load"
          @error="error"
          style="width: 100%; height:100%;"
      ></image>
    </transition>
  </view>
</template>

<script>
export default {
  name: "cartoonLoading",
  props:{
    item:{
      type:Object,
      default:()=>({})
    }
  },
  data(){
    return {
      percent:98,
      loading:true,
      loadingErr:false
    }
  },
  mounted() {

  },
  methods:{
    load(){
    setTimeout(()=>{
      this.loading= false
    },300)
    },
    error(){
      this.loadingErr =true
    }
  }
}
</script>

<style lang="scss" scoped>
.cartoon{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
}
.error{
  font-size:28rpx;
text-align: center;
  color: $uni-color-primary;
  .image{
    width:400rpx;
  }

}
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>