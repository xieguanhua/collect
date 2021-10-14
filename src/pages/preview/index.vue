<template>
  <view  class="preview">
    dadad
  </view>
</template>

<script>
import {getParams} from '@/utils'
export default {
  name: "preview",
  onLoad(data) {
    let option = getParams(data);
    console.log(option)
    // this.option = option
    // uni.setNavigationBarTitle({
    //   title: option.title
    // })
    // this.getDetail()
  },
}
</script>
<style lang="scss" scoped>
.preview{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  //background: #000;
  z-index: 1000;
}
</style>
