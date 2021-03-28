<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<inventory-list :item="item" :index="index" @end="end" @tap="navigateUrl(item.message[0].url)"></inventory-list>
		</block>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<u-toast ref="uToast"></u-toast>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<navigator open-type="navigate" url="/pages/home/inventoryCounting/addInventory/addInventory" hover-class="none">
			<view class="saveBtn bg-white solid-top u-p-30 u-text-center">+添加盘点</view>
		</navigator>
	</view>
</template>

<script>
	import inventoryList from '@/components/inventory-list/inventory-list.vue';
	export default {
		components:{
			inventoryList
		},
		onShow() {
			this.clearGoodList();
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo();
			}, 1000)
		},
		data() {
			return {
				page:1,
				last_page:'',
				list:[],
				/* 加载更多 */
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/StockCheck/getStockCheckLists',{},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							let listData=res.data.stock_check_data.map(v=>{
								return this._formatData(v)
							})
							this.list=listData;
							this.last_page=res.data.last_page;
						}else{
							let listData=res.data.stock_check_data.map(v=>{
								return this._formatData(v)
							})
							this.list=this.list.concat(listData)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}
				})
			},
			_formatData(e){
				return{
					warehouseName:e.store_house_name,
					status:e.status,
					id:e.id,
					message:[
						{title:'应盘',value:e.num_should,url:'/pages/home/inventoryCounting/Inventory/Inventory?type=0&id='+e.id},
						{title:'已盘',value:e.num_actual,url:'/pages/home/inventoryCounting/Inventory/Inventory?type=1&id='+e.id},
						{title:'盘赢',value:e.num_win,url:'/pages/home/inventoryCounting/Inventory/Inventory?type=2&id='+e.id},
						{title:'盘亏',value:e.num_lose,url:'/pages/home/inventoryCounting/Inventory/Inventory?type=3&id='+e.id},
					],
					show_button:e.show_button,
					TesterName:e.user_name,
					time:e.created_at
				}
			},navigateUrl(Link){
				uni.navigateTo({url: Link});
			},
			/* 初始化数据 */
			clearGoodList(){
				this.page=1;
				this.last_page=1;
				this.list=[];
				this.status='loading';
				this.getInfo();
			},
			end(e){
				this.http.get('/api/v1/StockCheck/closeCheck',{
					stock_check_id:e.id
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success"
						});
						this.clearGoodList();
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error"
						})
					}
				});
			}
		}
	}
</script>

<style>

</style>
