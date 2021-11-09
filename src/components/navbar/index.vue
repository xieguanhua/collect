<template>
  <view>
    <view class="navbar" :class="{fixed}">
      <view class="status-bar" :style="{height: statusBarHeight + 'px' }"></view>
      <view class="navbar-inner">

        <view class="left" v-if="showLeft">
          <slot name="left">
            <u-icon :name="iconLeft" :size="iconSize" :style="{right:`${rightButtonWidth}px`}" @tap="goBack"></u-icon>
          </slot>
        </view>

        <slot><text class="title">{{ title }}</text></slot>

        <view class="right" v-if="showRight">
          <slot name="right">
            <u-icon :name="iconRight" :size="iconSize" :style="{right:`${rightButtonWidth}px`}" @tap="onClickRight"></u-icon>
          </slot>
        </view>
      </view>
    </view>
    <view class="u-navbar-placeholder" v-if="fixed && !immersive" :style="{ width: '100%', height: 44 + statusBarHeight + 'px' }"></view>
  </view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
let menuButtonInfo = {};
// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
menuButtonInfo = uni.getMenuButtonBoundingClientRect();
// #endif
export default {
  name: "index",
  emits:['clickRight'],
  props:{
    showLeft:{
      type: Boolean,
      default: true
    },
    showRight:{
      type: Boolean,
      default: true
    },
    title:{
      type: String,
      default: ""
    },
    iconRight:{
      type:String,
      default:''
    },
    iconLeft:{
      type:String,
      default:'nav-back'
    },
    iconSize:{
      type:String,
      default:'44rpx'
    },
    // 自定义返回逻辑
    customBack: {
      type: Function,
      default: null
    },
    fixed: {
      type: Boolean,
      default: true
    },
    // 是否沉浸式，允许fixed定位后导航栏塌陷，仅fixed定位下生效
    immersive: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      statusBarHeight: systemInfo.statusBarHeight,
      rightButtonWidth:0
    }
  },
  mounted() {
    // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
    this.rightButtonWidth = systemInfo.windowWidth - (menuButtonInfo.left||0)
    // #endif
  },
  methods:{
    goBack(){
      // 如果自定义了点击返回按钮的函数，则执行，否则执行返回逻辑
      if (typeof this.customBack === 'function') {
        // 在微信，支付宝等环境(H5正常)，会导致父组件定义的customBack()函数体中的this变成子组件的this
        // 通过bind()方法，绑定父组件的this，让this.customBack()的this为父组件的上下文
        this.customBack.bind(this.$u.$parent.call(this))();
      } else {
        uni.navigateBack();
      }
    },
    onClickRight(){
      this.$emit("clickRight");
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar{
  background: $uni-bg-color;
}
.fixed {
  position: fixed;
  z-index: 998;
  /* #ifdef H5 */
  left: var(--window-left);
  right: var(--window-right);
  /* #endif */
  /* #ifndef H5 */
  left:0;
  right: 0;
  /* #endif */
}
.navbar-inner {
  display: flex;
  align-items: center;
  position: relative;
  height: 44px;
  .right,
  .left {
    padding: 0 24rpx;
    height: 100%;
    position: absolute;
    display: flex;
    align-items:center;
  }
  .right{
    right: 0;
  }

  .title {
    flex: 1;
    text-align: center;
    padding:0 80rpx;
    /* #ifdef APP-PLUS */
    font-size: $uni-font-size-lg;
    /* #endif */
    /* #ifdef H5 */
    font-size: $uni-font-size-lg;
    font-weight: 700;
    /* #endif */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;

  }
}
</style>
