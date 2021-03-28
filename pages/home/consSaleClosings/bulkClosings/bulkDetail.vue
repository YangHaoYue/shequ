<template>
	<view>
		<u-sticky>
			<view class="bg-white u-p-30">
				<view>结算客户：{{customer_name}}</view>
				<view>本次结算商品共计{{totalNumber}}件，合计金额{{totalPrice}}元</view>
			</view>
		</u-sticky>
		<!-- 列表 -->
		<block v-for="(item,i) in goodList" :key="i">
			<u-gap height="10" bg-color="#F5F5F5"></u-gap>
			<good-list :item="item" :index="i" :length="orderList.length"></good-list>
			<u-gap height="10" bg-color="#F5F5F5"></u-gap>
		</block>
		
		<!-- 底部tab -->
		<view class="cu-tabbar-height"></view>
		<u-button class="saveBtn" type="warning" @click="Payment">批量结款</u-button>
	</view>
</template>

<script>
	import goodList from '@/components/good-list/good-list.vue';
	export default {
		components:{
			goodList
		},
		onLoad(e) {
			let data=JSON.parse(decodeURIComponent(e.data));
			console.log(data);
			this.consign_ids=data.selectedList;
			this.goodList=data.goodList;
			this.customer_name=data.customer_name;
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.goodList.forEach((item)=>{
					total+=item.sell_price*item.num
				})
				return total 
			},
			totalNumber() {
				var totalNum=0;
				this.goodList.forEach((item)=>{
					totalNum+=item.num
				})
				return totalNum
			}
		},
		data() {
			return {
				customer_name:'',
				consign_ids:'',
				goodList:[],
			}
		},
		methods: {
			Payment(){
				uni.redirectTo({url: `/pages/home/consSaleClosings/bulkClosings/Payment?consign_ids=${encodeURIComponent(JSON.stringify(this.consign_ids))}`});
			}
		}
	}
</script>

<style>
</style>
