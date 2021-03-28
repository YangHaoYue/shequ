<template>
	<view class="u-wrap">
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.cate_name}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in tabbar" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<view class="solid-bottom u-p-20 u-text-center" v-for="(item1, index1) in value" :key="index1" @click="chooseType(item1)">
								<view class="item-menu-name">{{item1.cate_name}}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		data() {
			return {
				tabbar: '',
				value:'',
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/getScreenData').then((res)=>{
					if(res.code==1000){
						this.tabbar=res.data.top_cate;
						this.getScreenCate(this.tabbar[0].id);
					}
				})
			},
			getScreenCate(id){
				this.http.get('/api/v1/Index/getScreenCate',{
					top_cate_id:id
				},true).then((res)=>{
					if(res.code==1000){
						this.value=res.data.cate;
					}
				})
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.getScreenCate(this.tabbar[index].id)
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			chooseType(item){
				uni.$emit('chooseType',{item:item});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-warning;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 32rpx;
		color: $u-main-color;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
</style>
