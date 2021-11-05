<template>
  <web-view :src="iframeUrl"></web-view>
</template>

<script>
import {getParams} from '@/utils'

export default {
  name: "webPage",
  data() {
    return {
      iframeUrl: ''
    }
  },
  onLoad(data) {
    const option = getParams(data);
    this.iframeUrl = option.iframeUrl
  },
}
</script>

<style scoped>

</style>