<template>
	<view class="u-skeleton">
		<cu-custom Color="#FE8702" bgColor="bg-orange" :isBack="true" :showBackImg="false">
			<block slot="backText">首页</block>
		</cu-custom>
		<!-- 搜索框 -->
		<view class="cu-bar search">
			<view class="cuIcon-scan u-margin-20 u-skeleton-circle" style="font-size: 40rpx;" @click="scan"></view>
			<view class="search-form u-skeleton-rect" style="margin-left: 0;">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" type="text" disabled="true" @click="toSearch" placeholder="商品关键词(可多个)、编号、店铺编号" confirm-type="search"></input>
			</view>
		</view>
		<!-- 图片 -->
		<u-swiper class="u-skeleton-rect" :list="list" name="img" :title="true" height="375" @click="toImgDetail"></u-swiper>
		<!-- 九宫格 -->
		<u-grid :col="3">
			<u-grid-item v-for="(item,index) in gridList" :key="index" :index="index" @click="navigator(item.url)" v-if="loading||Permissions.indexOf(item.permission)!=-1">
				<view class="u-flex u-m-t-20 u-m-b-20" style="flex-direction: column;" hover-class='none' :url="item.url" navigateTo>
					<u-image class="u-skeleton-fillet" showLoading="true" width="98rpx" height="98rpx" :src="item.img" :fade="true" duration="450"></u-image>
					<!-- <image :src="item.img" style="width: 88rpx;height: 88rpx;" mode="aspectFit"></image> -->
					<view class="grid-text">{{item.name}}</view>
				</view>
			</u-grid-item>
		</u-grid>
		<!--骨架屏-->
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		onReady() {
			setTimeout(()=>{
				this.loading=false;
			},500)
		},
		onShow() {
			this.getPermission();
		},
		data() {
			return {
				loading: true, // 是否显示骨架屏组件
				gridList:[{
					name:'查询管理',
					img:'/static/uiImg/cxsearchicon.png',
					url:'/pages/home/queryManagement/queryManagement',
					permission:'basic.search'
				},{
					name:'商品入库',
					img:'/static/uiImg/sprkicon.png',
					url:'/pages/home/goodsInStorage/goodsInStorage',
					permission:'basic.goodsto'
				},{
					name:'销售开单',
					img:'/static/uiImg/caricon.png',
					url:'/pages/home/salesBilling/salesBilling',
					permission:'basic.createorder'
				},{
					name:'销售报表',
					img:'/static/uiImg/xsblicon.png',
					url:'/pages/home/salesReport/salesReport',
					permission:'basic.orderlogs'
				},{
					name:'寄卖结款',
					img:'/static/uiImg/jmjkicon.png',
					url:'/pages/home/consSaleClosings/consSaleClosings',
					permission:'basic.conssettle'
				},{
					name:'历史记录',
					img:'/static/uiImg/lsjlicon.png',
					url:'/pages/home/history/history',
					permission:'basic.history'
				},{
					name:'库存盘点',
					img:'/static/uiImg/kcpdicon.png',
					url:'/pages/home/inventoryCounting/inventoryCounting',
					permission:'basic.stocheck'
				},{
					name:'预定管理',
					img:'/static/uiImg/ydglicon.png',
					url:'/pages/home/bookingManagement/bookingManagement',
					permission:'basic.book'
				},{
					name:'发货管理',
					img:'/static/uiImg/fhglicon.png',
					url:'/pages/home/ShippingManagement/ShippingManagement',
					permission:'basic.delivery'
				}],
				/* 图片地址 */
				list:[],
				/* 权限 */
				Permissions:''
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/index',{},true).then((res)=>{
					this.list=res.data.map(v=>{
						return {
							img:this.http.resourceUrl()+v.img,
							id:v.id
						}
					})
				})
			},
			getPermission(){
				this.http.get('/api/v1/Auth/getPermission',{},true).then((res)=>{
					this.Permissions=res.data;
					uni.setStorageSync('Permissions',res.data);
				})
			},
			toSearch(){
				uni.navigateTo({url: '/pages/home/queryManagement/queryManagement'});
			},
			toImgDetail(e){
				uni.navigateTo({url: `/pages/home/imgDetail/imgDetail?id=${this.list[e].id}`});
				console.log(e);
			},
			navigator(link){
				uni.navigateTo({url: link});
			},
			scan(){
				uni.scanCode({
					onlyFromCamera:true,
					success: (res) => {
						console.log(res);
						uni.navigateTo({url: `/pages/home/queryManagement/goodDetail/goodDetail?id=${res.result}`});
						/* this.http.modal('提示','请选择类型',true,(e)=>{
							if(e){
							}
						},'#FE8702','商品详情','库存盘点') */
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.grid-text {
		font-size: 30rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
