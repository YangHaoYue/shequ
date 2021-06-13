<template>
	<view>
		<u-gap height="10" bg-color="#F5F5F5"></u-gap>
		<view>
			<view class="u-p-20 u-flex u-row-between u-font-12 solid-bottom">
				<view class="text-black">订单号：{{item.order_no}}</view>
				<view class="text-gray" v-if="item.status==0">已开单</view>
				<view class="text-gray" v-if="item.status==1">已取消</view>
			</view>
			<view class="u-p-20 u-p-t-30 u-p-b-30 solid u-flex u-flex-wrap u-row-left">
				<block v-for="(son,i) in item.goods" :key="i">
					<u-image class="u-m-r-10" :src="http.resourceUrl()+son.good_pic+'?x-oss-process=sm_200X200'" width="159rpx" height="159rpx"></u-image>
				</block>
			</view>
			<view class="u-p-20 u-flex u-row-between u-font-12 solid-bottom">
				<view class="text-gray">{{item.created_at}}</view>
				<view class="text-gray">共{{item.buy_num}}件 合计：<text class="u-type-error">￥{{item.price}}</text></view>
			</view>
			<view class="u-p-20 u-flex u-row-between u-font-12">
				<view class="text-gray">{{item.staff_name}} {{item.customer_name}}</view>
			</view>
		</view>
		<u-gap height="10" bg-color="#F5F5F5"></u-gap>
	</view>
</template>

<script>
	export default {
		props: {
			item:Object,
			index:Number,
			length:Number
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
