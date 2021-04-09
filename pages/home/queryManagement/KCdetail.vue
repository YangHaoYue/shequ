<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" v-for="(item,index) in list" :key="index">
			<view style="color: #303133;">{{item.name}}</view>
			<view class="u-font-36" style="color: #333333;" v-if="!compare(item.value)">{{item.value}}</view>
			<u-count-to ref="uCountTo" v-if="compare(item.value)" :end-val="item.value" separator="," :autoplay="true" :duration="1500" font-size="36" color="#333333" :decimals="2"></u-count-to>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.getInfo(JSON.parse(decodeURIComponent(e.urlData)));
		},
		data() {
			return {
				list:[
					{name:'新品囤货成本(元)',value:0},
					{name:'客户回收成本(元)',value:0},
					{name:'客户寄售成本(元)',value:0},
					{name:'同行寄售成本(元)',value:0},
					{name:'同行回收成本(元)',value:0},
					{name:'未知来源成本(元)',value:0},
					{name:'在库成本(元)',value:0},
				]
			}
		},
		methods: {
			getInfo(urlData){
				this.http.post('/api/v1/Index/topCostDetail',urlData,true).then((res)=>{
					if(res.code==1000){
						this.list[0].value=res.data.total_cost_price_detail.new;
						this.list[1].value=res.data.total_cost_price_detail.cus_rec;
						this.list[2].value=res.data.total_cost_price_detail.cus_consign;
						this.list[3].value=res.data.total_cost_price_detail.pe_consign;
						this.list[4].value=res.data.total_cost_price_detail.pe_rec;
						this.list[5].value=res.data.total_cost_price_detail.other;
						this.list[6].value=res.data.total_cost_price_detail.total_cost_price;
					}
				})
			},
			compare(value){
				return typeof(value) == "number"
			}
		}
	}
</script>

<style>

</style>
