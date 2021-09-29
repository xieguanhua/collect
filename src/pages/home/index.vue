<template>
  <view>
<!--        <web-view ref="webview" class="webview" @onPostMessage="handlePostMessage"  src="http://m.buka.cn"></web-view>-->
<!--    <button class="button" @click="evalJs">evalJs(改变webview背景颜色)</button>-->
  </view>
</template>

<script>
module.exports = {
  methods: {
    // // webview向外部发送消息
    // handlePostMessage: function (data) {
    //   console.log("接收到消息：" + JSON.stringify(data));
    // },
    // // 调用 webview 内部逻辑
    // evalJs () {
    //   const {contentWindow, contentDocument} = this.$refs.webview
    //   const win = contentWindow || contentDocument
    //   console.log(win.document)
    //   // this.$refs.webview.evalJs("document.body.style.background ='#00FF00'");
    // }
  },
  mounted() {
  }
}
</script>
