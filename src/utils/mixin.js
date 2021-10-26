import {mapGetters, mapMutations} from 'vuex'
import color from '@/utils/color'

module.exports = {
    data() {
        return {}
    },
    onLaunch() {
        this.createColor()
    },
    computed: {
        ...mapGetters({
            themeMainColor: 'color/mainColor',
            themeMakeColor: 'color/makeColor',
        }),
        theme() {
            return {...this.themeMakeColor, ...this.themeMainColor}
        },
        cssTheme(){
            let theme = ''
            Object.keys(this.theme).forEach(v => {
                //大写转划线
                const k = `--${v.replace(/([A-Z])/g, "-$1").toLowerCase()}`
                theme += `${k}:${this.theme[v]};`
            })
            return theme
        }
    },
    methods: {
        ...mapMutations({
            setMakeColor: 'color/setMakeColor'
        }),
        createColor() {
            const {textColor, bgColor} = this.themeMainColor
            const black = '#000000', white = '#ffffff';
            const makeColor = {
                //文字
                textColorInverse: color(textColor).negate().hex(),//反色
                textColorBg: color(textColor).isDark() ? white : black, //文字颜色对应的黑白背景
                textColorGrey: color(textColor).lightness(36).hex(),//文字辅助色
                textColorPlaceholder: color(textColor).lightness(60).hex(),//输入框提示色
                textColorDisable: color(textColor).lightness(75).hex(),//输入框提示色
                //背景
                bgColorInverse: color(bgColor).negate().hex(),//反色
                bgColorGrey: color(bgColor).lightness(96).hex(),//背景灰色
                bgColorHover: color(bgColor).lightness(98).hex(),//点击状态颜色
                bgColorText: color(bgColor).isDark() ? white : black //文字颜色对应的文字颜色
            }
            this.setMakeColor(makeColor)
        },
        // 查询节点信息
        // 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
        // 解决办法为在组件根部再套一个没有任何作用的view元素
        getRect(selector, all) {
            return new Promise(resolve => {
                uni.createSelectorQuery().in(this)[all ? 'selectAll' : 'select'](selector).boundingClientRect((rect = {}) => {
                    if (all && Array.isArray(rect) && rect.length) {
                        resolve(rect)
                    } else {
                        resolve(rect)
                    }
                }).exec()
            })
        },
        //节流
        // immediate立刻执行，
        // isLastExec最后执行,
        // 注：func必须穿声明方法的变量，不能直接传方法，否则无效
        throttle(func, wait = 500, {immediate = true,isLastExec=false},...args) {
            let prev = Date.now()
            if(typeof func === 'function'){
                clearTimeout(func.finTimer)
                if(func.prev){
                    prev =func.prev
                }else{
                    func.prev = prev
                }
                const now = Date.now()
                if(immediate && !func.once){
                    func.once =true
                    func.apply(this, args)
                }else if (Math.abs(now - prev) >= wait) {
                    func.apply(this, args)
                    func.prev = Date.now()
                } else {
                    func.finTimer = setTimeout(() => {
                        func.prev = null
                        func.once =false
                        isLastExec &&func.apply(this, args)
                    }, wait)
                }
            }

        }
    }
}
