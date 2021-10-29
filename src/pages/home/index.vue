<template>
  <view class="page-body">
<!--    <view class="preview" @touchmove.stop.prevent="moveHandle"> //阻止底层页面滚动
      <preview-image
      >

&lt;!&ndash;      v-if="preview" //必须可以改写在组件内部使用$refs获取组件后用open方法调用
      :activity_id="activity_id"
      :img_id="img_id" //图片id必须
      :keywords="keywords"
      :type_id="activeId"
      :shooting_time="timeRange"
      :page_size="pageSize" //分页必须
      :data="plist" //json对象数组列表必须
      @click="preview = false"&ndash;&gt;
      </preview-image>
    </view>-->

<!--    <swiper class="swiper"
            v-if="tabIndex==1"
            :current="index"
            duration="500"
            :disable-touch="!swiper"
            @transition="scale = false"
            @animationfinish="scale = true"
            @touchstart="handletouchstart"
            @touchend="handletouchend">
      <swiper-item class="swiper-item" v-for="(info,pos) in plist" :key="pos">
        <movable-area class="marea" scale-area>
          <movable-view
              class="mview"
              direction="all"
              damping="100"
              friction="2"
              :scale="scale"
              scale-min="1"
              scale-max="8"
              :out-of-bounds="temporaryScaleValue!=1"
              :scale-value="scaleValue"
              :animation="animation"
              @change="changeMove"
              @click="dbclick"
              @scale="handleScale">
            <image
                @load="loadover"
                class="image"
                :src="info.logo_name"
                mode="widthFix" />
          </movable-view>
        </movable-area>
      </swiper-item>
    </swiper>-->

    <!-- 本示例未包含完整css，获取外链css请参考上文，在hello uni-app项目中查看 -->
      <view>
        <view class="uni-padding-wrap">
          <view class="page-section swiper">
            <view class="page-section-spacing">
              <swiper class="swiper"  :duration="duration">
                <swiper-item>
                  <view class="swiper-item uni-bg-red">A</view>
                </swiper-item>
                <swiper-item>
                  <view class="swiper-item uni-bg-green">B</view>
                </swiper-item>
                <swiper-item>
                  <view class="swiper-item uni-bg-blue">C</view>
                </swiper-item>
              </swiper>
            </view>
          </view>
        </view>
      </view>
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
