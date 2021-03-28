<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" v-for="(item,index) in list" :key="index">
			<view style="color: #303133;">{{item.name}}</view>
			<u-count-to :start-val="0" :end-val="item.value" separator="," :duration="1500" :use-easing="true" font-size="36" color="#333333"></u-count-to>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			let total_price_detail=JSON.parse(decodeURIComponent(e.total_price_detail));
			this.list[0].value=total_price_detail.former_total;
			this.list[1].value=total_price_detail.manual_decrease;
			this.list[2].value=total_price_detail.manual_increase;
			this.list[3].value=total_price_detail.integral_decrease;
			this.list[4].value=total_price_detail.final_total;
		},
		data() {
			return {
				list:[
					{name:'订单原总金额(元)',value:0},
					{name:'开单手动折扣扣除金额(元)',value:0},
					{name:'开单手动增加的金额(元)',value:0},
					{name:'积分抵扣部分(元)',value:0},
					{name:'最终销售金额(元)',value:0},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
