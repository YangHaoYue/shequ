<template>
	<view>
		<u-sticky>
			<view class="bg-white u-p-30">
				<view>原仓库：<text style="color: #FE8702;">{{warehouseName}}</text></view>
				<view>本次移库商品总计<text style="color: #FE8702;">{{allNumber}}件</text> 合计金额：<text style="color: #FE8702;">{{totalPrice}}元</text></view>
			</view>
		</u-sticky>
		<!-- 列表 -->
		<block v-for="(item,i) in goodList" :key="i">
			<good-list :item="item" :index="i" :length="goodList.length"></good-list>
		</block>
		
		<!-- 底部tab -->
		<view class="cu-tabbar-height"></view>
		<u-button class="saveBtn u-type-warning-bg" type="warning" @click="nextTip">下一步</u-button>
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
			this.$set(this,'selectedList',data.selectedList);
			this.$set(this,'goodList',data.list);
			this.$set(this,'warehouseName',data.warehouseName);
			this.$set(this,'totalPrice',data.totalPrice);
			this.$set(this,'allNumber',data.allNumber);
		},
		data() {
			return {
				warehouseName:'',
				allNumber:'',
				totalPrice:'',
				/* 列表 */
				selectedList:[],
				goodList:[]
			}
		},
		methods: {
			/* 下一步 */
			nextTip(){
				uni.navigateTo({url: `/pages/mine/WarehouseManagement/MoveTheLibrary/Confirm?selectedList=${encodeURIComponent(JSON.stringify(this.selectedList))}`});
			}
		}
	}
</script>

<style>
</style>
