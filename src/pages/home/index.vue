<template>
  <view class="page-body">
    <!--    <web-view :webview-styles="webviewStyles" src="https://uniapp.dcloud.io/static/web-view.html"></web-view>-->
  </view>
</template>

<script>

// import Http from '@/utils/http'
//
// const service = new Http()
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: '#FF3333'
        }
      },
      background: ['color1', 'color2', 'color3'],
      indicatorDots: true,
      interval: 2000,
      duration: 500
    }
  },
  mounted() {
        // service.get(`https://music.163.com/api/v6/playlist/detail`, {
        //   id:3778678
        // })
    // service.get(`https://u.y.qq.com/cgi-bin/musicu.fcg`, {
    //   data: {
    //     detail: {
    //       module: "musicToplist.ToplistInfoServer",
    //       method: "GetDetail",
    //       param: {
    //         topId: 26,
    //         offset:0,
    //         num: 100,
    //       },
    //     }
    //   }
    // })
    // var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效，非v3编译模式使用this.$mp.page.$getAppWebview()
    // setTimeout(function() {
    //   let wv = currentWebview.children()[0];
    //   wv.evalJS("document.write('11')");
    // }, 1000);
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

.uni-bg-red {
  background: red;
  width: 100%;

  height: 100%;
}

.uni-bg-green {
  background: green;
  width: 100%;

  height: 100%;


}

.uni-bg-blue {
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

.page-body {
  font-size: 0;
}

</style>
