<template>
  <view class="zoom-scroll" :style="{height,width}">
    <view
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
        :style="{transform:`translate(${-left}px,${-top}px) scale(${scale})`}"
        :class="{animation:isAnimation}"
        class="touch-main">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "zoom-scroll",
  props: {
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
    }
  },
  data() {
    return {
      isAnimation: false,
      top: 0,
      left: 0,
      scale: 1,
      isTouch: false,
      box: null,
      lastMoveTime: 0,
      lastMoveStart: {
        y: 0,
        x: 0
      },//最后一段时间手指划动速度
      startRect: {
        top: 0,
        left: 0
      }

    }
  },
  methods: {
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
      return {
        touchMain,
        zoomScroll,
        maxScrollTop,
        maxScrollLeft,
        top: this.maxScrollPosition(top, maxScrollTop, bounceY),
        left: this.maxScrollPosition(left, maxScrollLeft, bounceX),
      }
    },
    async touchend(e) {
      this.isTouch = false
      const startTime = Date.now();
      const [p1] = this.start
      const [now] = e.changedTouches
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
      const {pageY: nowY, pageX: nowX} = now
      let {top, left} = this.startRect
      top += (p1.pageY - nowY)
      left += (p1.pageX - nowX)
      const res = await this.scrollTo(top, left)
      /*  if (this.scrollY) this.top = res.top
        if (this.scrollX) this.left = res.left*/
      const ms = 50 //回弹阻尼
      const resilience = (move, maxMove, callback) => {
        if (this.isTouch) return
        let isSetTime = false
        if (move < 0) {
          const m = Number((Math.abs(move) / ms).toFixed(1))
          move += m
          if (!m) {
            move = 0
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
          setTimeout(() => {
            resilience(move, maxMove, callback)
          }, 1)
        }
        callback(move)
      }
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
        if (this.bounceY) resilience(this.top, res.maxScrollTop, (e) => {
          this.top = e
        })
      }
      if (this.scrollX) {
        await inertiaMove(nowX - this.lastMoveStart.x, res.left, res.maxScrollLeft, this.bounceX, (e) => {
          this.left = e
        })
        if (this.bounceX) resilience(this.left, res.maxScrollLeft, (e) => {
          this.left = e
        })
      }
    },
    async touchmove(e) {
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
      e.preventDefault();
      this.isAnimation = false
      this.isTouchZoom = e.touches.length >= 2
      this.isTouch = true
      this.lastMoveTime = Date.now();
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
    }
  }
}
</script>

<style>
.zoom-scroll {
  overflow: hidden;
}

.animation {
  transition: .05s ease-in;
}

.touch-main {
  font-size: 0;
  transform-origin: left top;
}
</style>
