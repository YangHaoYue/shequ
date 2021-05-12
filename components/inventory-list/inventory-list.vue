<template>
	<view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<view class="u-p-30 bg-white">
			<view class="u-flex u-row-between">
				<view class="u-flex">
					<u-image showLoading="true" width="34rpx" height="34rpx" :src="topImg" :fade="true" duration="450"></u-image>
					<view class="u-main-color u-m-l-10">{{item.warehouseName||item.name}}
						<text class="u-m-l-10" style="color: #FE8702;" v-if="item.status==0">进行中</text>
						<text class="u-m-l-10" style="color: #FE8702;" v-if="item.status==1">已完成</text>
					</view>
				</view>
				<view class="u-flex">
					<u-tag class="u-m-l-10" type="info" mode="dark" text="无买卖" :show="item.no_deal"></u-tag>
					
					<u-tag class="u-m-l-10" type="info" mode="dark" text="未卖" :show="!item.no_deal&&item.isSellAgain==0"></u-tag>
					<u-tag class="u-m-l-10" bg-color="#FE8702" mode="dark" text="卖过" :show="!item.no_deal&&item.isSellAgain==1"></u-tag>
					<u-tag class="u-m-l-10" bg-color="#FE8702" mode="dark" text="有复卖" :show="!item.no_deal&&item.isSellAgain==2"></u-tag>
					
					<u-tag class="u-m-l-10" type="info" mode="dark" text="未买" :show="!item.no_deal&&item.isBuyAgain==0"></u-tag>
					<u-tag class="u-m-l-10" bg-color="#FE8702" mode="dark" text="买过" :show="!item.no_deal&&item.isBuyAgain==1"></u-tag>
					<u-tag class="u-m-l-10" bg-color="#FE8702" mode="dark" text="有复购" :show="!item.no_deal&&item.isBuyAgain==2"></u-tag>
				</view>
			</view>
			<slot name="message">
				<view class="u-flex u-m-t-30 u-p-l-25">
					<block v-for="(son,i) in item.message" :key="i">
						<view class="text-gray u-p-l-20 u-p-r-20" 
						:class="i+1==item.message.length?'':'solids-right'"
						@tap.stop="navigateUrl(son.url)"
						>{{son.title}}:<text :class="colorchange?'text-orange':''">{{son.value}}</text></view>
					</block>
				</view>
			</slot>
			<slot name="tab">
				<view class="u-flex u-row-between u-m-t-30">
					<view class="u-flex">
						<u-image showLoading="true" width="34rpx" height="34rpx" src="/static/uiImg/yggl.png" :fade="true" duration="450"></u-image>
						<view class="text-gray u-m-l-10">{{item.TesterName}}<text class="u-m-l-10">{{item.time}}</text></view>
					</view>
					<u-button type="warning" size="mini" @click="end" v-if="item.show_button">结束本次盘点</u-button>
				</view>
			</slot>
		</view>
		<!-- <u-gap height="10" bg-color="#F5F5F5"></u-gap> -->
	</view>
</template>

<script>
	export default {
		props: {
			item: Object,
			index:Number,
			topImg:{
				type:String,
				default:'/static/uiImg/wddp.png'
			},
			colorchange:Boolean
		},
		data() {
			return {
				
			};
		},
		methods:{
			end(){
				this.$emit('end',{id:this.item.id})
			},
			compare(val1,val2){
				return val1===val2
			},
			navigateUrl(Link){
				uni.navigateTo({url: Link});
			}
		}
	}
</script>

<style scoped>
	.text-orange{
		color: #FE8702;
	}
</style>
