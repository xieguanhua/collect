<template>
  <view class="page-body">

  </view>
</template>

<script>


export default {
  data() {
    return {
      background: ['color1', 'color2', 'color3'],
      indicatorDots: true,
      interval: 2000,
      duration: 500
    }
  },
  methods: {
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots
    },
    changeAutoplay(e) {
      this.autoplay = !this.autoplay
    },
    intervalChange(e) {
      this.interval = e.target.value
    },
    durationChange(e) {
      this.duration = e.target.value
    }
  }
}
</script>

<style>
.touch-main {
  font-size: 0;
  transform-origin: left top;
}
.uni-bg-red{
  background: red;
  width: 100%;

  height: 100%;
}
.uni-bg-green{
  background: green;
  width: 100%;

  height: 100%;


}
.uni-bg-blue{
  background: blue;
  width: 100%;
  height: 100%;
}
.transition {
  /*transition: .1s*/
}

page, .page-body {
  height: 100%;
  overflow: hidden;
}
.page-body{
  font-size: 0;
}

</style>
