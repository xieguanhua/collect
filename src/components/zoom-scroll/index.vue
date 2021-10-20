<template>
  <view class="zoom-scroll" :style="{height,width}">
    <view
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
        :style="{transform:`translate(${-left}px,${-top}px) scale(${scale})`}"
        class="touch-main">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: "zoom-scroll",
  props: {
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
      top: 0,
      left: 0,
      scale: 1,
      isTouch: false,
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
      if (this.start.length) return
      const {pageY: nowY, pageX: nowX} = now
      let {top, left} = this.startRect
      top += (p1.pageY - nowY)
      left += (p1.pageX - nowX)
      const res = await this.scrollTo(top, left)
    /*  if (this.scrollY) this.top = res.top
      if (this.scrollX) this.left = res.left*/
      const ms = 50 //回弹阻尼
      const resilience=(move, maxMove,callback)=>{
        if(this.isTouch)return
        let isSetTime=false
        if(move<0){
          const m =Number((Math.abs(move) /ms).toFixed(1))
          move +=m
          if(!m){
            move =0
          }else{
            isSetTime =true
          }
        }else if(move>maxMove){
          const m =Number(((move-maxMove) /ms).toFixed(1))
          move-=m
          if(!m){
            move = maxMove
          }else{
            isSetTime =true
          }
        }
        if(isSetTime){
          setTimeout(()=>{
            resilience(move,maxMove,callback)
          },1)
        }
        callback(move)
      }
      //惯性移动
      const inertiaMove =async (velocity, scroll,maxScroll, bounce,callback) => {
       return new Promise(resolve => {
         //最后一段时间手指划动速度
         velocity = velocity / (startTime - this.lastMoveTime)
         if (Math.abs(velocity) > 1 && scroll>0 && scroll<maxScroll) {
           const dir = velocity > 0 ? -1 : 1;
           const deceleration = dir * 0.005;
           let timer
           const move = () => {
             if(this.isTouch)return;
             const nowTime = Date.now();
             const t = nowTime - startTime;
             const nowV = velocity + t * deceleration;
             const skewing = (velocity + nowV) / 2 * t;
             if (dir * nowV > 0) {
               return;
             }
             let position = scroll - skewing
             const MaximumDamping = -300
             if(position< MaximumDamping){
               return;
             }else if(maxScroll- position<MaximumDamping){
               return;
             }
             clearTimeout(timer)
             timer =setTimeout(resolve,10)
             position = this.maxScrollPosition(position, maxScroll, bounce)
             callback(position)
             setTimeout(move, 1);
           }
           move()
         }else{
           resolve()
         }
       })
      }
      if(this.scrollY){
        await inertiaMove(nowY - this.lastMoveStart.y, res.top, res.maxScrollTop,this.bounceY,(e) => {this.top = e})
        if(this.bounceY)resilience(this.top, res.maxScrollTop,(e) => {this.top = e})
      }
      if(this.scrollX){
        await inertiaMove(nowX - this.lastMoveStart.x, res.left,res.maxScrollLeft,this.bounceX, (e) => {this.left = e})
        if(this.bounceX)  resilience(this.left, res.maxScrollLeft,(e) => {this.left = e})
      }
    },
    async touchmove(e) {
      this.isTouch = true
      this.start.forEach((v, i) => {
        const {pageX, pageY} = e.touches[i] || {}
        v.newPageX = pageX
        v.newPageY = pageY
      })
      const [p1, p2] = this.start
      const [now1, now2] = e.touches;  //得到第二组两个点
      const {pageY, pageX} = now1
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
      this.isTouch = true
      this.lastMoveTime = Date.now();
      const {top, left} = this
      this.startRect = {top, left}
      const [p1, p2] = this.start = e.touches;
      const {pageX: x, pageY: y} = p1
      this.lastMoveStart = {y, x}
    }
  }
}
</script>

<style>
.zoom-scroll {
  overflow: hidden;
}


.touch-main {
  font-size: 0;
  transform-origin: left top;
}
</style>
