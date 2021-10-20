<template>
  <view class="page-body">
    <ZoomScroll>
      <u-image v-for="(item,i) in links"
               :src="item"
               :key="i"
               :lazy-load="true"
               mode="widthFix"
               width="100%"></u-image>
    </ZoomScroll>
  </view>
</template>

<script>
import ZoomScroll from '@/components/zoom-scroll'
let links = ["https://uc1-p1.v3mh.com/image/c191275/190817/BN80d2AOa.webp-t.w640.jpg.h?sign=023a68379cd3610dae58bde597fc15c0&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/ZeLzHjx9S.webp-t.w640.jpg.h?sign=41e938fe252e4febb5bfaf8b05181c97&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/0DHRRrGsz.webp-t.w640.jpg.h?sign=aa8e620c81d411158d739a8520620c2e&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/Gmj1Jc8Zd.webp-t.w640.jpg.h?sign=de8041fc73ad03fd7356f1dce92ca05b&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/pKRZY2k5J.webp-t.w640.jpg.h?sign=155b1a1d55c99387792579a7cbddef05&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/gRWzMVXnf.webp-t.w640.jpg.h?sign=cef5006d6948ac63364a1db889b09559&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/BYkP420qe.webp-t.w640.jpg.h?sign=59bb3b294de41b083a6c0d4770203ff6&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/d52fTdvfi.webp-t.w640.jpg.h?sign=62db6f0553f3f1c9ff62a73f3763df29&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/PkpdsdWoI.webp-t.w640.jpg.h?sign=73591fc99ae29a1242fe8a1781457ae0&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/tkjYRM3I3.webp-t.w640.jpg.h?sign=99457faa578169a63940764884f05db5&t=616ac8de", "https://uc1-p1.v3mh.com/image/c191275/190817/q9bwg0p1M.webp-t.w640.jpg.h?sign=5822925cca36bb0891f4e6cc3269e593&t=616ac8de"]
export default {
  data() {
    return {
      links,
    }
  },
  components:{
    ZoomScroll
  },
}
</script>

<style>
.touch-main {
  font-size: 0;
  transform-origin: left top;
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
