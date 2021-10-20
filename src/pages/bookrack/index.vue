<template>
  <view class="page-body">
    <scroll-view class="scroll"
                 scroll-y
                 scroll-x
                 @scroll="scroll"
                 :scroll-left="scrollLeft"
                 :scroll-top="scrollTop">
      <view
          @touchstart="touchstart"
          @touchmove="touchmove"
          @touchend="touchend"
          :class="{transition:!isTouch}"
          :style="{transform:`translate(${left}px,${top}px) scale(${scale})`}"
          class="touch-main">
        <u-image v-for="(item,i) in links"
                 :src="item"
                 :key="i"
                 :lazy-load="true"
                 mode="widthFix"
                 width="100%">
        </u-image>
      </view>
    </scroll-view>
  </view>
</template>

<script>
let links = ["https://uc1-p1.v3mh.com/image/c191275/190817/BN80d2AOa.webp-t.w640.jpg.h?sign=023a68379cd3610dae58bde597fc15c0&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/ZeLzHjx9S.webp-t.w640.jpg.h?sign=41e938fe252e4febb5bfaf8b05181c97&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/0DHRRrGsz.webp-t.w640.jpg.h?sign=aa8e620c81d411158d739a8520620c2e&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/Gmj1Jc8Zd.webp-t.w640.jpg.h?sign=de8041fc73ad03fd7356f1dce92ca05b&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/pKRZY2k5J.webp-t.w640.jpg.h?sign=155b1a1d55c99387792579a7cbddef05&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/gRWzMVXnf.webp-t.w640.jpg.h?sign=cef5006d6948ac63364a1db889b09559&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/BYkP420qe.webp-t.w640.jpg.h?sign=59bb3b294de41b083a6c0d4770203ff6&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/d52fTdvfi.webp-t.w640.jpg.h?sign=62db6f0553f3f1c9ff62a73f3763df29&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/PkpdsdWoI.webp-t.w640.jpg.h?sign=73591fc99ae29a1242fe8a1781457ae0&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/tkjYRM3I3.webp-t.w640.jpg.h?sign=99457faa578169a63940764884f05db5&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/q9bwg0p1M.webp-t.w640.jpg.h?sign=5822925cca36bb0891f4e6cc3269e593&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/YahKtwCjF.webp-t.w640.jpg.h?sign=7c324b02d597269d3248c4e2f5cba8f6&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/ghSgn921Z.webp-t.w640.jpg.h?sign=9d2605dc24776faf2efd3a94d90eee60&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/ZmBIvzZXN.webp-t.w640.jpg.h?sign=0f2cf15b2d90564af8eb9a842b9c7289&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/jyG9LyFNN.webp-t.w640.jpg.h?sign=e233b0f772a38fc449b06e793e5909ff&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/ZFYIHhKzm.webp-t.w640.jpg.h?sign=9f29a04eb95ef79c57f03d59fe85b286&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/FqGF1Ehd2.webp-t.w640.jpg.h?sign=b46af66e8c855037ce65bff54ed2d4c9&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/SqjbQpQrU.webp-t.w640.jpg.h?sign=2724c97257c9dadde4ec1e2ecc3b23f1&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/og7CM5cmm.webp-t.w640.jpg.h?sign=ecf00d9e99ae32c9298ffc840e023cbc&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/3n3zuzq5J.webp-t.w640.jpg.h?sign=a573a865014cd97d7211753066703287&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/3cqYxwKZ2.webp-t.w640.jpg.h?sign=49adf0e042a1dc490a8f311a1496f3d9&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/itd7GQHJ6.webp-t.w640.jpg.h?sign=3ae1b8bb03fcdce00b0b7bea4d0a0308&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/jQy6SFiML.webp-t.w640.jpg.h?sign=ebafdcc51643d8481636149448dedad4&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/6Dfwv5rGE.webp-t.w640.jpg.h?sign=a26fa6114f77432eef87c44c45f91fdd&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/ZTC34iXWA.webp-t.w640.jpg.h?sign=4feb0aa1a2bde7125331a52b9398c2eb&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/4icw5A3QD.webp-t.w640.jpg.h?sign=b43624660f3b25bcd7af175e3e4f7314&t=616ac8de"]
export default {
  data() {
    return {
      links,
      scrollTop: 0,
      scrollLeft:0,
      scale: 1,
      isTouch: false,
      top:0,
      left:0,
      box: {
        ratioL: 0,
        clientY: 0,
        height: 0,
        width: 0
      },
      old: {
        scale:0,
        scrollTop: 0,
        scrollLeft:0
      }
    }
  },
  onShow() {
  },
  methods: {
    scroll: function (e) {
      const {scrollTop,scrollLeft} = e.detail
      this.old.scrollTop = scrollTop;
      this.old.scrollLeft = scrollLeft
    },
    async touchmove(e) {
      if (e.touches.length >= 2 && this.isTouch) {
        const [p1, p2] = this.start
        const [now1, now2] = e.touches;  //得到第二组两个点
        let scale = this.getDistance(now1, now2) / this.getDistance(p1, p2); //得到缩放比例，getDistance是勾股定理的一个方法
        const { clientY, ratioT, height,ratioL,width,clientX} = this.box
        scale = Number((this.old.scale * scale).toFixed(2))
        const h = height * scale,w = width * scale
        this.top = Math.round(clientY - (h * ratioT - this.old.scrollTop));
        this.left = Math.round(clientX - (w * ratioL - this.old.scrollLeft));
        this.scale =  scale
      }
    },
    touchend(e) {
      /*  const top =this.top
        this.top = 0
        this.$nextTick(()=>{
          this.scrollTop = this.old.scrollTop-top
          this.isTouch = false
        })*/
    },
    getDistance(p1, p2) {
      const x = p2.pageX - p1.pageX,
          y = p2.pageY - p1.pageY;
      return Math.sqrt((x * x) + (y * y));
    },
    async touchstart(e) {
      e.preventDefault();
      this.isTouch = e.touches.length >= 2; //判断是否有两个点在屏幕上
      this.old.scale = this.scale
      if(!this.isTouch)return
      const [p1, p2] = this.start = e.touches;  //得到第一组两个点
      const clientY = Math.max(p2.pageY, p1.pageY) - Math.abs(p2.pageY - p1.pageY)
      const clientX = Math.max(p2.pageX, p1.pageX) - Math.abs(p2.pageX - p1.pageX)
      const res = await this.$u.getRect('.touch-main')
      const height = Math.ceil(res.height / this.scale)
      const width = Math.ceil(res.width / this.scale)
      const ratioT = (clientY + (this.old.scrollTop-(this.top||0))) / res.height,
          ratioL = (clientX + (this.old.scrollLeft-(this.left||0))) / res.width
      this.box = {
        scrollTop:this.old.scrollTop,
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
</script>

<style>
.touch-main {
  transform-origin: left top;
}

.transition {
  /*transition: .1s*/
}

page, .page-body {
  height: 100%;
}

.scroll {
  height: 100%;
}

.main {
  height: 50px;
  background: red;
  transform-origin:left top;
  width: 100%;
}

</style>
