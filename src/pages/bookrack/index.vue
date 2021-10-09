<template>
  <view>
    <scroll-view style="height: 300px;" scroll-y="true" refresher-enabled="true" :refresher-triggered="triggered"
                 :refresher-threshold="100" refresher-background="lightgreen" @refresherpulling="onPulling"
                 @refresherrefresh="onRefresh" @refresherrestore="onRestore" @refresherabort="onAbort"></scroll-view>
  </view>
</template>


<script>
export default {
  data() {
    return {
      triggered: false
    }
  },
  onLoad() {
    console.log(11)
    this._freshing = false;
    setTimeout(() => {
      this.triggered = true;
    }, 1000)
  },
  methods: {
    onPulling(e) {
      console.log("onpulling", e);
    },
    onRefresh() {
      if (this._freshing) return;
      this._freshing = true;
      setTimeout(() => {
        this.triggered = false;
        this._freshing = false;
      }, 5000)
    },
    onRestore() {
      this.triggered = 'restore'; // 需要重置
      console.log("onRestore");
    },
    onAbort() {
      console.log("onAbort");
    }
  }
}
</script>
<style>
/*.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin: 200rpx auto 50rpx auto;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}*/
</style>
