<template>
	<view class="classify" :style="cssTheme">
    <navbar iconLeft="plus"  iconRight="search" title="分类" fixed/>
		<view class="tabs u-border-bottom" v-show="list.length">
			<u-tabs :list="list" :current="current" @change="change"  :active-color="theme.primary"></u-tabs>
		</view>
		<view class="menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="tab-view">
				<view v-for="(item,index) in classifyList" :key="index" class="tab-item"
					:class="{'tab-item-active':tabActive === index}" @tap.stop="toggleTab(index)">
					<text class="u-line-1">{{ item.name }}</text>
				</view>
			</scroll-view>

			<view class="main">
				<scroll-view scroll-y scroll-with-animation class="tag-list-scroll" v-if="classIfyTags.length">
					<view class="tag-list">
						<view v-for="(item,i) in classIfyTags" class="tag" :class="{active:tagActive===i}" :key="i"
							@tap="toggleTag(i)">{{item.innerText}}</view>
					</view>
				</scroll-view>
				<scroll-view scroll-y
                     :scroll-top="scrollTop"
                     scroll-with-animation
                     class="work-main-scroll"
                     refresher-enabled
                     :refresher-triggered="triggered"
                     :refresher-threshold="60"
                     lower-threshold="80"
                     @refresherrefresh="onRefresh"
                     @scrolltolower="loadMore">
<!--          refresher-default-style="none"
          <view slot="refresher">内容</view>-->
          <view class="work-main">
						<view class="work-item" v-for="(item,i) in workList" :key="i" @tap="toDetails(item)">
							<view class="work-cover">
								<u-image
                    :src="item.cover"
                    :lazy-load="true"
                    border-radius="6rpx"
                    mode="aspectFill"
                    height="260rpx"
                    width="100%">
                </u-image>
							</view>
							<view class="work-title">{{item.title}}</view>
							<view class="work-remark">{{item.remark}}</view>
						</view>
					</view>
          <u-loadmore :status="bottomStatus" :load-text="loadText" class="loadmore" @loadmore="loadMore" v-if="!loading && workList.length"/>
				</scroll-view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		crawl
	} from "@/api/crawl";
  import navbar from '@/components/navbar'
  const urlFormat = require('url')
  import {mapGetters} from 'vuex'
  const Qs = require('qs');
  import {navigateTo} from '@/utils'
	let systemInfo = uni.getSystemInfoSync();
  let menuButtonInfo = {};
  // 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
  // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
  menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  // #endif
	export default {
		data() {
			return {
        rightButtonWidth: 0,
        tagRequestConfig:{},
        listRequestConfig:{},
        scrollTop:0,
        //上拉加载
        loadText: {
          loadmore: '点击或上拉加载更多',
          loading: '努力加载中',
          nomore: '没有更多了'
        },
        bottomStatus:'loadmore',
        pageNumber:1,
        //下拉刷新
        triggered:false,
        loading:false,
				statusBarHeight: systemInfo.statusBarHeight,
				tabActive: 0,
				current: 0,
        //标签列表与选中
				classIfyTags: [],
				tagActive: 0,
				workList: []
			}
		},
    components:{
      navbar
    },
    mounted() {
      // #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
      this.rightButtonWidth = systemInfo.windowWidth - (menuButtonInfo.left||0)
      // #endif
    },
    methods: {
      goTop() {
        this.scrollTop = 0
      },
      abort(){
       return new Promise(resolve => {
         const {request: tagRequest} = this.tagRequestConfig
         const {request: listRequest} = this.listRequestConfig
         tagRequest && tagRequest.abort()
         listRequest && listRequest.abort()
         setTimeout(resolve,200)
       })
      },
      async toggleTag(i){
        if(this.tagActive===i)return
        this.workList =[]
        this.tagActive =i
        await this.abort()
        this.loading= false
        this.bottomStatus='loadmore'
         this.$nextTick(()=>{
           this.triggered = !this.triggered;
         })
      },
      async onRefresh(){
        if(this.loading)return
        if(!this.triggered){
        //界面下拉触发，triggered可能不是true，要设为true
            this.triggered = true;
        }
        this.goTop()
        this.pageNumber=1
        this.loading = true
        const {pageUrl,classIfy} = this.activeTab
        try {
          const params= this.theCrawlpParams
          params.pageNumber = this.pageNumber
          const {tags} = await crawl(pageUrl, classIfy,this.tagRequestConfig)
          const {list} = await crawl(pageUrl, params,this.listRequestConfig)
          this.workList = list||[]
          this.classIfyTags = tags
        }catch (e){
          if(e.errMsg !== 'request:fail abort'){
            this.workList =[]
          }
          this.bottomStatus ='nomore'
          console.error(e)
        }finally {
          this.loading = false;
          this.triggered = false;
        }
      },
    async loadMore(){
      if(this.bottomStatus ==='loading' || this.loading ||  this.bottomStatus ==='nomore')return
      this.bottomStatus='loading'
      try {
        const {pageUrl} = this.activeTab
        const params = this.theCrawlpParams
        params.pageNumber = ++this.pageNumber
        const {list} = await crawl(pageUrl, params,this.listRequestConfig)
        this.workList = [...this.workList, ...(list || [])]
        this.bottomStatus=list&&!list.length?'nomore':'loadmore'
      } catch (e) {
        this.bottomStatus ='nomore'
        console.error(e)
      }
      },
			change(index) {
				this.current = index;
			},
     async toggleTab(index){
        if(this.tabActive===index) {
          return
        }
        this.tabActive = index
      },
      toDetails(data){
        const {guid} = this.activeTab
        navigateTo(`/pages/details/index`,{...data,guid})
      }
		},
    watch:{
      'activeTab.name':{
        async handler(){
          await this.abort()
          this.bottomStatus='loadmore'
          this.loading =false
          this.tagActive=0
          this.classIfyTags= []
          this.workList= []
         setTimeout(()=>{
           this.triggered = true;
         })
        },
        immediate:true
      }
    },
		computed: {
      ...mapGetters({
        classifyArr: 'details/classifyArr',
      }),
      classifyData(){
        return  this.classifyArr.reduce((accumulator, item) => {
          if (!item.type) {
            item.type = '未定义'
          }
          accumulator[item.type] ? accumulator[item.type].push(item) : accumulator[item.type] = [item]
          return accumulator;
        }, {});
      },
      theCrawlpParams(){
        const  {params={}} = this.activeTab||{}
        let url = params.url||""
        const {query} = urlFormat.parse(url)
        const parseQuery = Qs.parse(query)
        const {href} = this.classIfyTags[this.tagActive]||{}
        if(href){
          const parse = urlFormat.parse(href||"")
         const hrefQuery= Qs.parse(parse.query)
          parse.search= `?${Qs.stringify({...hrefQuery,...parseQuery})}`
          url= urlFormat.format(parse)
        }
        return {...params,url}
      },
      activeTab(){
        return this.classifyList[this.tabActive]||{}
      },
			classifyList() {
				return (this.list[this.current] || {}).data || this.classifyArr
			},
			list() {
				const list = Object.keys(this.classifyData).map(name => ({
					name,
					data: this.classifyData[name]
				}))
				list.length && list.unshift({
					name: '全部',
					data: this.classifyArr
				})
				return list
			}
		}
	}
</script>

<style lang="scss" scoped>
	$height:calc(100vh - var(--window-bottom));

	.classify {
		height: $height;
		display: flex;
		flex-direction: column;

		.menu-wrap {
			flex: 1;
			display: flex;
			overflow: hidden;

			.tab-view {
				height: 100%;
				width: 200rpx;
				background: $uni-bg-color-grey;
			}

			.tab-item {
				height: 110rpx;
				box-sizing: border-box;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 26rpx;
				color: $uni-text-color-placeholder;
				font-weight: 400;
				line-height: 1;
			}

			.tab-item-active {
				color: $uni-text-color;
				position: relative;
				font-size: 30rpx;
				font-weight: 600;
				background: $uni-bg-color;

				&::before {
					content: "";
					position: absolute;
					border-left: 4px solid $uni-color-primary;
					border-radius: 0 4px 4px 0;
					height: 32rpx;
					left: 0;
					top: 39rpx;
				}
			}
		}

		//右侧内容
		.main {
			flex: 1;
			display: flex;
			flex-direction: column;
    position: relative;
			.tag-list-scroll {
				max-height: 220rpx;
				border-bottom: 1rpx solid $uni-border-color;
			}

			.tag-list {
				display: flex;
				flex-wrap: wrap;
				padding: 10rpx;
				font-size: 24rpx;

				&>.tag {
					width: 21%;
					margin: 8rpx 2%;
					padding: 4rpx 6rpx;
					text-align: center;
					border-radius: 50px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					border: 1px solid transparent;

					&.active {
						border-color: $uni-color-primary;
					}
				}
			}

			.work-main-scroll {
				flex: 1;
				height: 0;

				.work-main {
					display: flex;
					padding: 2% 1%;
					flex-wrap: wrap;

					.work-item {
						position: relative;
						width: 31%;
						margin: 1%;
					}


					.work-title {
						font-size: 28rpx;
					}

					.work-remark {
						font-size: 24rpx;
						color: $uni-text-color-placeholder;
					}

					.work-title,
					.work-remark {
						margin-bottom: 8rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

				}
        .loadmore{
          padding:20rpx 0 30rpx;
        }
			}
		}
	}
</style>
