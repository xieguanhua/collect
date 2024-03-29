<template>
  <view class="content">
    <navbar :show-right="false" :show-left="false">
      <view class="flex search">
        <view class="type" @tap="showPicker =true">
          <text class="type-text">{{ activeSearchType.type }}</text>
          <u-icon name="arrow-down" size="20"></u-icon>
        </view>
        <u-icon name="search" size="34" class="search-icon"></u-icon>
        <view class="input"><input confirm-type="search" type="text" focus @input="input" v-model="value" @confirm="confirm"></view>
        <view class="cancel" @click="cancel">
          <text>取消</text>
        </view>
      </view>
    </navbar>

    <!--热门推荐与历史搜索-->
    <view class="record" v-if="!showFuzzy && !showSearch">
      <view v-if="historyListRender.length" class="hot">
        <view class="title">
          <view>历史搜索</view>
          <view @tap="empty"><u-icon name="trash" size="40"></u-icon></view>
        </view>
        <view class="hot-list">
          <view v-for="(item,i) in historyListRender" :key="i" class="item"  @tap="queryList(item)">
            {{item}}
          </view>
        </view>
        <view @click="unfold=!unfold" class="unfold" :class="{active:unfold}" v-if="historyList.length>historyListRender.length || unfold">
          <u-icon name="arrow-down" size="40"></u-icon>
        </view>
      </view>
      <view v-if="hotList.length" class="hot">
        <view class="title">热门搜索</view>
        <view class="hot-list">
          <view v-for="(item,i) in hotList" :key="i" class="item" @tap="queryList(item.text)">
            {{item.text}}
          </view>
        </view>
      </view>
    </view>
    <!--关键词搜索列表-->
    <u-cell-group class="keyword-list" :border="false" v-else-if="showFuzzy && !showSearch">
      <u-cell-item :title="item.text"  v-for="(item,i) in fuzzyQueryList" :key="i" :arrow="false" class="keyword-item" :border-bottom="false"  @tap="queryList(item.text)"></u-cell-item>
    </u-cell-group>


    <view v-else>
      <view class="info-detail" v-for="(item,i) in searchList"  :key="i" @tap="toDetails(item)">
        <view class="cover">
          <u-image
              :src="item.cover"
              :lazy-load="true"
              border-radius="6rpx"
              mode="aspectFill"
              height="200rpx"
              width="100%">
          </u-image>
        </view>
        <view class="main-info">
          <view class="title">{{ item.title }}</view>
          <view class="author">来自：{{ item.name||'-' }}</view>
          <view class="updated">{{ item.updated||'-' }}</view>
          <view class="state">{{ item.remark||'-' }}</view>
        </view>
      </view>
      <no-data v-if="!searchList.length && !isQueryRequest">
        <view>没有找到 <text class="keyword">“{{value}}“</text> 相关数据</view>
      </no-data>
    </view>

    <u-select v-model="showPicker" :list="fuzzySearchList" value-name="routeType" label-name="type" @confirm="pickerConfirm" :default-value="[searchActive]"></u-select>
  </view>
</template>

<script>
import navbar from '@/components/navbar'
import {fuzzySearchList,keyWordReg} from '@/utils/classify.data'
import {getParams,navigateTo} from '@/utils'
import noData from '@/components/no-data'
import {mapGetters} from 'vuex'
import {
  crawl
} from "@/api/crawl";
export default {
  name: "index",
  data() {
    return {
      value:'',
      fuzzySearchList,
      fuzzyRequest:{},
      isQueryRequest:false,
      searchActiveType: '',//选中搜索类型
      showPicker: false,//显示搜索类型
      hotList:[],//热门推荐
      historyData:uni.getStorageSync('search')|| {},//历史列表
      unfold:false,
      fuzzyQueryList:[],
      showSearch:false,
      showFuzzy:false,
      searchList:[],
    }
  },
  onLoad(data) {
    let option = getParams(data);
    this.searchActiveType = option.routeType
  },
  components: {
    navbar,
    noData
  },
  methods: {
    toDetails(data){
      const {guid,routeType} = this.classifyArr.find(v=>v.routeType === data.routeType && data.name === v.name)||{}
      if(!routeType)return
      navigateTo(`/pages/details/${routeType}/index`,{...data,guid})
    },
    cancel() {
      uni.navigateBack();
    },
    pickerConfirm(e) {
      const {value} = e[0] || {}
      if(this.searchActiveType === value){
        return
      }
      this.searchActiveType = value
    },
    async getHostList() {
      try {
        const {hotSearch, list=[],pageUrl} = this.activeSearchType
        if (list.length) {
          this.hotList = list
        } else {
          let {list} =  await crawl(pageUrl,hotSearch)
          this.hotList = this.activeSearchType.list = list
        }
      } catch (e) {
        console.error(e)
      }
    },
    empty(){
      this.historyData[this.searchActiveType]=[]
      uni.setStorageSync('search', this.historyData)
    },
    async input(){
      try {
        this.showFuzzy =true
        if(!this.isQueryRequest){this.showSearch = false}
        this.$u.debounce(this.fuzzySearch, 300)
      }catch (e){
        console.error(e)
      }
    },
    confirm(){
      this.queryList(this.value)
    },
  async fuzzySearch(){
    try {
        const {requestURL,pageJsonUrl} = this.activeSearchType
        const params = {...requestURL}
        if(!this.value){
          this.showFuzzy =false
          this.fuzzyQueryList= []
          return
        }
        if(this.isQueryRequest)return
        this.abort(this.fuzzyRequest)
        params.url = params.url.replace(keyWordReg,this.value)
        let {list} = await crawl(pageJsonUrl,params,this.fuzzyRequest)
        if(list){
           this.fuzzyQueryList=list
         }
       this.showFuzzy =!!this.fuzzyQueryList.length
    }catch (e){
        console.error(e)
      }finally {
      this.searchList=[]
      }
    },
    abort({request}={}){
      request && request.abort()
    },
    async queryList(val=''){
      try {
        val = val.replace(/(^\s*)|(\s*$)/g, "")
        if(!val|| this.isQueryRequest){
          !val && uni.showToast({
            icon:'none',
            title: '搜索内容不能为空',
            position:'bottom'
          });
          return
        }
        this.showSearch = true
        this.isQueryRequest =true
        this.abort(this.fuzzyRequest)
        this.value = val
        const type= this.searchActiveType //当前选择的类型
        const historyData ={...this.historyData}
        const historyList = this.historyList
        //数据去重并插入
        const index = historyList.indexOf(val)
        index>=0&& historyList.splice(index,1)
        historyList.unshift(val)
        historyData[type] = historyList
        this.historyData= historyData//更新数据
        uni.setStorageSync('search',historyData)//历史列表存储
        const classList = this.classifyArr.filter(v=>v.routeType === type && v.searchParams)
        const classSearchList = (await Promise.all(classList.map(async v => {
          try {
            const params={...v.searchParams}
            params.url =params.url.replace(keyWordReg, val)
            const {list} = await crawl(v.requestPageUrl, params)
            list.forEach(r => {
              r.name = v.name
              r.routeType = v.routeType
              let num = [];
              for (let y = 0; y <= val.length; y++) {
                if (r.title.indexOf(val[y]) >= 0) {
                  ++num
                }
              }
              r.ratio = num / r.title.length
            })
            return list
          } catch (e) {
            return Promise.resolve([])
          }
        }))).flat()
        classSearchList.sort((a,b)=>{return b.ratio-a.ratio});
        this.searchList = classSearchList
      }catch (e){
        console.error(e)
      }finally {
        this.$u.debounce(()=>{
          this.isQueryRequest =false
        }, 300)
      }
    }
  },
  watch: {
    searchActive: {
      handler() {
        this.getHostList()
      },
      deep: true
    },
    isQueryRequest(v){
      if(v){
        uni.showLoading({
          title:'加载中',
          mask:true
        })
      }else{
        uni.hideLoading()
      }
    }
  },
  computed: {
    ...mapGetters({
      classifyArr: 'details/classifyArr',
    }),
    historyList(){
      return this.historyData[this.searchActiveType]||[]
    },
    historyListRender(){
      return this.historyList.slice(0,this.unfold?this.historyList.length:5)
    },
    searchActive() {
      const index = this.fuzzySearchList.findIndex(v => v.routeType === this.searchActiveType)
      return index < 0 ? 0 : index
    },
    activeSearchType() {
      return this.fuzzySearchList[this.searchActive] || this.fuzzySearchList[0]
    }
  }
}
</script>

<style scoped lang="scss">
.search{
  width:100%;
  display: flex;
  align-items: center;
  height: 100%;
  border-bottom:1px solid $uni-border-color;
  font-size: 24rpx;
  .input{
    flex: 1;
  }
  .search-icon{
    padding-right: 20rpx;
  }
  .cancel,.type{
    padding: 0 30rpx;
  }
  .type-text{
    margin-right:10rpx;
  }
  .cancel{
    height: 100%;
    display: flex;
    align-items: center;
  }
}
//推荐列表
.record{
  padding-left:20rpx;
  font-size: 24rpx;
  .unfold{
    margin-top:20rpx;
    text-align: center;
    transform: rotate(0);
    transform-origin: center center;
    transition: .3s;
    margin-left: -20rpx;
    &.active{
      transform:rotate(180deg);
    }
  }
  .title{
    color: $uni-text-color-grey;
    margin-top:40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right:20rpx;
  }
  .hot-list{
    display: flex;
    flex-wrap: wrap;
    .item{
      background: $uni-bg-color-grey;
      border-radius:6rpx;
      padding:8rpx 16rpx;
      margin-right:20rpx;
      margin-top:20rpx;
    }
  }
}
//模糊搜索列表
.keyword-list{
  /deep/ .u-cell{
    padding: 12rpx 30rpx;
    border-bottom:1px solid $uni-border-color;
  }
}

//搜索列表
.info-detail{
  display: flex;
  padding: 20rpx;
  .cover{
    margin-right:30rpx;
    width:140rpx;
    min-width:140rpx;
  }

  .main-info{
    line-height:42rpx;
    font-size:24rpx;
    color: $uni-text-color-grey;
    &>view{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
  .title{
    color: $uni-text-color;
    font-weight:bold;
    font-size:32rpx;
    margin-bottom:28rpx;
  }
  .see-others{
    margin-top:20rpx;
    color: $uni-color-error;
  }
}
.keyword{
  color: $uni-color-primary;
}

</style>