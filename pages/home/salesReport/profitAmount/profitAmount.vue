<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" v-for="(item,index) in list" :key="index">
			<view style="color: #303133;">{{item.name}}</view>
			<view class="u-flex">
				<u-count-to :start-val="0" :end-val="item.value" separator="," :duration="1500" :use-easing="true" font-size="36" color="#333333"></u-count-to>
				<text v-if="item.isPercentage">%</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			let profit_price_detail=JSON.parse(decodeURIComponent(e.profit_price_detail));
			this.list[0].value=profit_price_detail.total_profit;
			this.list[1].value=profit_price_detail.total_price;
			this.list[2].value=profit_price_detail.total_cost_price;
			this.list[3].value=profit_price_detail.gross_profit_rate;
		},
		data() {
			return {
				list:[
					{name:'总利润金额(元)',value:0,isPercentage:false},
					{name:'总销售金额(元)',value:0,isPercentage:false},
					{name:'总成本金额(元)',value:0,isPercentage:false},
					{name:'毛利率',value:0,isPercentage:true},
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
