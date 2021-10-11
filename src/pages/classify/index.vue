<template>
	<view class="classify">
		<view class="navbar">
			<view class="status-bar" :style="{height: statusBarHeight + 'px' }"></view>
			<view class="navbar-inner" :style="{height: navbarHeight + 'px'}">
				<u-icon name="plus" class="plus" size="44rpx"></u-icon>
				<text class="title">分类</text>
				<u-icon name="search" class="search" size="44rpx"></u-icon>
			</view>
		</view>
		<view class="tabs u-border-bottom" v-show="list.length">
			<u-tabs :list="list" :current="current" @change="change"></u-tabs>
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
							@click="toggleTag(i)">{{item.innerText}}</view>
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
                     @scroll="onscroll"
                     @refresherrefresh="onRefresh"
                     @refresherrestore="onRestore"
                     @scrolltolower="loadMore">
<!--          refresher-default-style="none"
          <view slot="refresher">内容</view>-->
          <view class="work-main">
						<view class="work-item" v-for="(item,i) in workList" :key="i">
							<view class="work-cover">
								<image :src="item.cover" :lazy-load="true" mode="aspectFill"></image>
							</view>
							<view class="work-title">{{item.title}}</view>
							<view class="work-remark">{{item.remark}}</view>
						</view>
					</view>
          <u-loadmore :status="bottomStatus" :load-text="loadText" class="loadmore" @loadmore="loadMore" v-if="!loading"/>
				</scroll-view>
			</view>

		</view>

	</view>
</template>

<script>
	import classifyData from './classify.data'
	import {
		crawl
	} from "@/api/crawl";
  const urlFormat = require('url')

  const Qs = require('qs');


	const classifyArr = classifyData.reduce((accumulator, item) => {
		if (!item.type) {
			item.type = '未定义'
		}
		accumulator[item.type] ? accumulator[item.type].push(item) : accumulator[item.type] = [item]
		return accumulator;
	}, {});
	let systemInfo = uni.getSystemInfoSync();
	export default {
		data() {
			return {
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
				classifyArr,
				tabActive: 0,
				current: 0,
        //标签列表与选中
				classIfyTags: [],
				tagActive: 0,
				workList: []
			}
		},
		methods: {
      onscroll({target:{scrollTop}}){
        this.scrollTop = scrollTop;
      },
      goTop() {
        this.scrollTop = 0
      },
      toggleTag(i){
        if(this.loading)return
        this.tagActive =i
        this.triggered = true;
      },
      onRestore(){
        this.triggered = 'restore'; // 需要重置
      },
      async onRefresh(){
        if(this.loading)return
        this.goTop()
        this.pageNumber=1
        this.loading = true
        const {pageUrl,classIfy} = this.activeTab
        let classIfyTags=  this.classIfyTags
       if(!classIfyTags.length){
         try {
           const {tags} = await crawl(pageUrl, classIfy)
           classIfyTags =tags||[]
         }catch (e){
           console.error(e)
         }
       }
        try {
          const params= this.theCrawlpParams
          params.pageNumber = this.pageNumber
          const {list} = await crawl(pageUrl, params)
          this.workList = list||[]
        }catch (e){
          this.workList =[]
          this.bottomStatus ='nomore'
          console.error(e)
        }finally {
          this.classIfyTags = classIfyTags
          this.loading = false;
          this.triggered = false;
        }
      },
    async loadMore(){
      if(this.bottomStatus ==='loading' || this.loading)return
      this.bottomStatus='loading'
      try {
        const {pageUrl} = this.activeTab
        const params = this.theCrawlpParams
        params.pageNumber = ++this.pageNumber
        const {list} = await crawl(pageUrl, params)
        if(this.loading)return
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
      toggleTab(index){
        if(this.loading || this.bottomStatus ==='loading') return
        this.tabActive =index
      }
		},
    watch:{
      'activeTab.name':{
        handler(){
          this.tagActive=0
          this.classIfyTags= []
          this.workList= []
          this.$nextTick(()=>{
            this.triggered = true;
          })
        },
        immediate:true
      }
    },
		computed: {
      theCrawlpParams(){
        const  {params={}} = this.activeTab||{}
        let url = params.url||""
        const {query} = urlFormat.parse(url)
        const parseQuery = Qs.parse(query)
        const {href} = this.classIfyTags[this.tagActive]||{}
        if(href){
          const parse = urlFormat.parse(href||"")
         const hrefQuery= Qs.parse(parse.query)
          console.log({...hrefQuery,...parseQuery})
          parse.search= `?${Qs.stringify({...hrefQuery,...parseQuery})}`
          url= urlFormat.format(parse)
        }
        console.log(url)
        return {...params,url}
      },
      activeTab(){
        return this.classifyList[this.tabActive]||{}
      },
			classifyList() {
				return (this.list[this.current] || {}).data || classifyData
			},
			list() {
				const list = Object.keys(this.classifyArr).map(name => ({
					name,
					data: this.classifyArr[name]
				}))
				list.length && list.unshift({
					name: '全部',
					data: classifyData
				})
				return list
			},
			navbarHeight() {
				// #ifdef APP-PLUS || H5
				return 44;
				// #endif
				// #ifdef MP
				// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
				// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
				// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
				return systemInfo.platform === 'ios' ? 44 : 48;
				// #endif
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

		.navbar-inner {
			display: flex;
			align-items: center;

			.search,
			.plus {
				padding: 0 12px;
				height: 100%;
			}

			.title {
				flex: 1;
				font-size: 32rpx;
				text-align: center;
				font-weight: bold;

			}
		}

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
				color: $uni-text-color-grey;
				font-weight: 400;
				line-height: 1;
			}

			.tab-item-active {
				color: $uni-text-color;
				position: relative;
				font-size: 30rpx;
				font-weight: 600;
				background: #fff;

				&::before {
					content: "";
					position: absolute;
					border-left: 4px solid $u-type-primary;
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
						border-color: $u-type-primary;
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

					.work-cover {
						image {
							width: 100%;
							height: 260rpx;
							border-radius: 6rpx;
						}
					}

					.work-title {
						font-size: 28rpx;
					}

					.work-remark {
						font-size: 24rpx;
						color: $uni-text-color-grey;
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
