<template>
  <view class="classify" :style="cssTheme">
    <navbar icon-left="" title="分类" fixed>
      <u-search disabled :showAction="false"></u-search>
    </navbar>
  </view>
</template>

<script>
import {config} from '@/utils/classify.data'
import navbar from '@/components/navbar'

const {music: configMusic} = config
console.log(configMusic)
export default {
  name: "index",
  components: {
    navbar
  },
}
</script>
<style lang="scss" scoped>
$height: calc(100vh - var(--window-bottom));

.classify {
  height: $height;
  display: flex;
  flex-direction: column;
}
</style>