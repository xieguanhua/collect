<template>
  <view class="page-body" :style="theme">

  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  components:{

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
