<script>

export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  async onShow() {
    console.log('App show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
@import "@/static/iconfont/iconfont.css";
/*page{
  --ntp-active-background-color:#000;

}*/
uni-page-body {
  color: #000;
}
</style>
