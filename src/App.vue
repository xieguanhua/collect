<script>
import {mapGetters,mapMutations} from 'vuex'
import color from '@/utils/color'
export default {
  computed: {
    ...mapGetters({
      mainColor: 'color/mainColor',
    })
},
  onLaunch:async function () {
    this.createColor()
  },
  async onShow() {
    console.log('App show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods:{
    ...mapMutations({
      setMakeColor: 'color/setMakeColor'
    }),
    createColor(){
      const {textColor,bgColor} = this.mainColor
      const black = '#000000',white='#ffffff';
      const makeColor={
        //文字
        textColorInverse:color(textColor).negate().hex(),//反色
        textColorBg:color(textColor).isDark()?white:black, //文字颜色对应的黑白背景
        textColorGrey:color(textColor).lightness(36).hex(),//文字辅助色
        textColorPlaceholder :color(textColor).lightness(60).hex(),//输入框提示色
        textColorDisable:color(textColor).lightness(75).hex(),//输入框提示色
        //背景
        bgColorInverse:color(bgColor).negate().hex(),//反色
        bgColorGrey :color(bgColor).lightness(94).hex(),//背景灰色
        bgColorHover :color(bgColor).lightness(98).hex(),//点击状态颜色
        bgColorText:color(bgColor).isDark()?white:black //文字颜色对应的文字颜色
      }
      this.setMakeColor(makeColor)
    }
  }
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "uview-ui/index.scss";
@import "@/static/iconfont/iconfont.css";
</style>
