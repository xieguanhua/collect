<template>
  <view class="zoom-scroll" :style="{height,width}">
    <view
        @touchstart.prevent="touchstart"
        @touchmove.prevent="touchmove"
        @touchend.prevent="touchend"
        :style="{transform:`translate3d(${-left}px,${-top}px,1px) scale(${scale})`}"
        :class="{animation:isAnimation}"
        class="touch-main">

       <slot name="pull-down" v-if="refresherEnabled">
         <view class="pull-down">
           <u-loadmore :status="downTrigger?'loading':'loadmore'" :load-text="loadText" />
         </view>
       </slot>
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "zoom-scroll",
  emits:['scrolltolower','scroll','touchTap','touchLongTap','scrolltoupper'],
  props: {
    zoom:{
      type:Number,
      default:0
    },
    scrollTop:{
      type:Number,
      default:0
    },
    isZoom: {
      type: Boolean,
      default: true
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: true
    },
    //回弹效果
    bounceY: {
      type: Boolean,
      default: true
    },
    bounceX: {
      type: Boolean,
      default: false
    },
    //到顶/底减基数
    tslow: {
      type: Number,
      default: 3
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    //距底部（单位px），触发 scrolltolower 事件
    lowerThreshold:{
      type: Number,
      default: 300
    },
    //距顶部多远时（单位px），触发 scrolltoupper 事件
    upperThreshold:{
      type: Number,
      default: 60
    },
    //开启下拉刷新
    refresherEnabled:{
      type: Boolean,
      default: false
    },
    scrollTopPer:{
      type: Function,
      default: null
    }
  },
  data() {
    return {
      loadText: {
        loadmore: '下拉加载更多',
        loading: '努力加载中',
      },
      downTrigger:false,
      currentVal:0,
      isAnimation: false,
      top: 0,
      left: 0,
      scale: 1,
      isTouch: false,
      box: null,
      lastMoveTime: 0,
      touchstartTime:0,
      lastMoveStart: {
        y: 0,
        x: 0
      },//最后一段时间手指划动速度
      startRect: {
        top: 0,
        left: 0
      },
      scrollData:{}
    }
  },
  watch:{
    scale(e){
      if(e!==this.zoom){
        this.$emit('update:zoom',e)
        this.$emit('zoom',e)
      }
    },
    scrollTop:{
      handler(e){
          if(this.top !== e){
            this.top = this.scrollTop
          }
      },
      deep:true
    },
    top(e){
      this.onScrollTop(e)
    }
  },
  methods: {
    onScrollTop(e){
      const {top,left} = this
      this.$emit('scroll', {top, left})
      this.$emit('update:scrollTop', e)
      if(this.currentVal < e){
        //上滑
        const {maxScrollTop} = this.scrollData
        if(maxScrollTop-e< this.lowerThreshold){
          this.throttle(this.scrolltolower, 2000, {immediate:true})
        }
      }
      this.currentVal = e;
    },
    scrolltolower(){
      this.$emit('scrolltolower')
    },
    //下拉刷新复位
    restore(top = 0){
      this.downTrigger = false
      if(this.isTouch)return
      if(!top){
        this.resilience(this.top, this.scrollData.touchMain.height, (e) => {
          this.top = e
        })
      }else{
        this.top = top+this.upperThreshold
      }
    },
    getDistance(p1, p2) {
      const x = p2.pageX - p1.pageX,
          y = p2.pageY - p1.pageY;
      return Math.sqrt((x * x) + (y * y));
    },
    maxScrollPosition(move, maxMove, bounce = false) {
      const top = 0 //top值
      if (move < top) {
        move = bounce ? move / this.tslow : top
      } else if (maxMove - move < top) {
        move = bounce ? maxMove + ((move - maxMove) / this.tslow) : maxMove
      }
      return move
    },
    async scrollTo(top, left, bounceY, bounceX) {
      const touchMain = await this.getRect('.touch-main')
      const zoomScroll = await this.getRect('.zoom-scroll')
      const maxScrollTop = touchMain.height - zoomScroll.height
      const maxScrollLeft = touchMain.width - zoomScroll.width
      this.scrollData = {
        touchMain,
        zoomScroll,
        maxScrollTop,
        maxScrollLeft,
        top: this.maxScrollPosition(top, maxScrollTop, bounceY),
        left: this.maxScrollPosition(left, maxScrollLeft, bounceX),
      }
      return this.scrollData
    },
    async touchend(e) {
      this.isTouch = false
      const startTime = Date.now();
      const [p1] = this.start
      const [now] = e.changedTouches
      const {pageY: nowY, pageX: nowX} = now
      //tap事件与longTap事件
      if (Math.abs(p1.pageX - nowX) < 6 && Math.abs(p1.pageY - nowY) < 6) {
          const fun = startTime - this.touchstartTime  > 300?'touchLongTap':'touchTap'
            this.$emit(fun,e)
      }

      const index = this.start.findIndex(v => {
        const num = 10
        return Math.abs(now.pageX - v.newPageX) <= num && Math.abs(now.pageY - v.newPageY) <= num
      })
      this.start.splice(index, 1)
      if (this.isTouchZoom) {
        this.isAnimation = true
        this.$nextTick(() => {
          if (this.scale <= 1) {
            this.left = 0
            const {height,ratioT,clientY} =  this.box
            const top =  height * ratioT - clientY|| 0
            this.top = top<height?top:height
            this.scale = 1
          }
          setTimeout(() => {
            this.isTouchZoom = this.start.length >= 2
            this.isAnimation = false
          }, 500)
        })
        return
      }
      if (this.start.length) return
      let {top, left} = this.startRect
      top += (p1.pageY - nowY)
      left += (p1.pageX - nowX)
      const res = await this.scrollTo(top, left)
      /*  if (this.scrollY) this.top = res.top
        if (this.scrollX) this.left = res.left*/
      //惯性移动
      const inertiaMove = async (velocity, scroll, maxScroll, bounce, callback) => {
        return new Promise(resolve => {
          //最后一段时间手指划动速度
          velocity = velocity / (startTime - this.lastMoveTime)
          if (Math.abs(velocity) > 1 && scroll > 0 && scroll < maxScroll) {
            const dir = velocity > 0 ? -1 : 1;
            const deceleration = dir * 0.005;
            let timer
            const move = () => {
              if (this.isTouch) return;
              const nowTime = Date.now();
              const t = nowTime - startTime;
              const nowV = velocity + t * deceleration;
              const skewing = (velocity + nowV) / 2 * t;
              if (dir * nowV > 0) {
                return;
              }
              let position = scroll - skewing
              const MaximumDamping = -300
              if (position < MaximumDamping) {
                return;
              } else if (maxScroll - position < MaximumDamping) {
                return;
              }
              clearTimeout(timer)
              timer = setTimeout(resolve, 10)
              position = this.maxScrollPosition(position, maxScroll, bounce)
              callback(position)
              setTimeout(move, 1);
            }
            move()
          } else {
            resolve()
          }
        })
      }
      if (this.scrollY) {
        await inertiaMove(nowY - this.lastMoveStart.y, res.top, res.maxScrollTop, this.bounceY, (e) => {
          this.top = e
        })
        if (this.bounceY) {
          const num = -this.upperThreshold
          const minMove = this.top-num<0 && this.refresherEnabled?num:0
          this.resilience(this.top, res.maxScrollTop, (e) => {
            if(minMove && e-num>=0){
              if(this.downTrigger)return
              this.downTrigger =true
            //触发下拉刷新
              if(this.scrollTopPer){
                this.scrollTopPer({top: this.top}).finally(this.restore)
              }else{
                this.$emit('scrolltoupper',{
                  callback:this.restore,
                  top: this.top
                })
              }
            }else{
              this.top = e
            }
          },minMove)
        }
      }
      if (this.scrollX) {
        await inertiaMove(nowX - this.lastMoveStart.x, res.left, res.maxScrollLeft, this.bounceX, (e) => {
          this.left = e
        })
        if (this.bounceX){
          this.resilience(this.left, res.maxScrollLeft, (e) => {
            this.left = e
          })
        }
      }
    },
    async touchmove(e) {
      clearTimeout(this.timer)
      this.isTouch = true
      const [p1, p2] = this.start
      const [now1, now2] = e.touches;  //得到第二组两个点
      const {pageY, pageX} = now1
      //多指放大
      if (this.isTouchZoom) {
        if (this.box && this.isZoom && e.touches.length >= 2 && this.start.length >= 2) {
          let scale = this.getDistance(now1, now2) / this.getDistance(p1, p2); //得到缩放比例，getDistance是勾股定理的一个方法
          const {clientY, ratioT, height, ratioL, width, clientX, scale: boxScale} = this.box
          scale = Number((boxScale * scale).toFixed(2))
          const h = height * scale, w = width * scale
          this.top = h * ratioT - clientY
          this.left = w * ratioL - clientX
          this.scale = scale
        }
        return
      }
      //单指滚动
      let {top, left} = this.startRect
      top += (p1.pageY - pageY)
      left += (p1.pageX - pageX)
      const res = await this.scrollTo(top, left, this.bounceY, this.bounceX)
      if (this.scrollY) this.top = res.top
      if (this.scrollX) this.left = res.left
      this.loadText.loadmore = this.top + this.upperThreshold<=0?'松开加载数据': '下拉加载更多'

      /**
       * 缓动代码
       */
      const nowTime = Date.now();
      if (nowTime - this.lastMoveTime > 300) {
        this.lastMoveTime = nowTime;
        this.lastMoveStart = {
          y: pageY,
          x: pageX
        };
      }
    },
    async touchstart(e) {
      clearTimeout(this.timer)
      // e.preventDefault();
      this.isAnimation = false
      this.isTouchZoom = e.touches.length >= 2
      this.isTouch = true
      this.touchstartTime= this.lastMoveTime = Date.now();
      const {top, left} = this
      this.startRect = {top, left}
      const [p1, p2] = this.start = e.touches;
      const {pageX: x, pageY: y} = p1
      this.lastMoveStart = {y, x}
      if (this.isTouchZoom && this.isZoom) {
        const {pageX, pageY} = p2 || {}
        const clientY = Math.max(pageY, y) - Math.abs(pageY - y)
        const clientX = Math.max(pageX, x) - Math.abs(pageX - x)
        const res = await this.getRect('.touch-main')
        const height = Math.ceil(res.height / this.scale)
        const width = Math.ceil(res.width / this.scale)

        const ratioT = (clientY + this.top) / res.height,
            ratioL = (clientX + this.left) / res.width
        this.box = {
          scale: this.scale,
          ratioL,
          clientY,
          clientX,
          ratioT,
          height,
          width
        }
      }
    },
     resilience(move, maxMove, callback,minMove=0)  {
      const ms = 50 //回弹阻尼
      if (this.isTouch) return
      let isSetTime = false
      if (move < minMove) {
        const m = Number((Math.abs(move-minMove) / ms).toFixed(1))
        move += m
        if (!m) {
          move = minMove
        } else {
          isSetTime = true
        }
      } else if (move > maxMove) {
        const m = Number(((move - maxMove) / ms).toFixed(1))
        move -= m
        if (!m) {
          move = maxMove
        } else {
          isSetTime = true
        }
      }
      if (isSetTime) {
        this.timer =setTimeout(() => {
          this.resilience(move, maxMove, callback,minMove)
        }, 1)
      }
      callback(move)
    }
  }
}
</script>

<style>

.zoom-scroll {
  overflow: hidden;
}

.animation {
  transition: .1s ease-in;
}

.touch-main {
  font-size: 0;
  transform-origin: left top;
}
.pull-down{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  transform: translateY(-100%);
  padding: 20px 0;
}
</style>
