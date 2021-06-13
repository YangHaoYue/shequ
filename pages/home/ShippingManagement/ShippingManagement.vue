<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<inventory-list :item="item" :index="index" :colorchange="true" @tap="nvigate(item.id)">
				<view slot="tab"></view>
			</inventory-list>
		</block>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
	</view>
</template>

<script>
	import inventoryList from '@/components/inventory-list/inventory-list.vue';
	export default {
		components:{
			inventoryList
		},
		onLoad() {
			this.getInfo();
		},
		onPullDownRefresh() {
			this.clearGoodList();
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo();
			}, 100)
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
				this.http.get('/api/v1/Delivery/storeHouseLists',{},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							let listData=res.data.sto_delivery_data.store_house_data.map(v=>{
								return this._formatData(v)
							})
							this.list=listData;
							this.last_page=res.data.sto_delivery_data.last_page;
						}else{
							let listData=res.data.sto_delivery_data.store_house_data.map(v=>{
								return this._formatData(v)
							})
							this.list=this.list.concat(listData)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error",
							back:true
						})
					}
				})
			},
			_formatData(e){
				return{
					warehouseName:e.name,
					id:e.id,
					message:[
						{title:'全部',value:e.delivery_data.total_num,url:'/pages/home/ShippingManagement/management/management?type=0&id='+e.id,colorchange:true},
						{title:'已发货',value:e.delivery_data.total_delivered,url:'/pages/home/ShippingManagement/management/management?type=1&id='+e.id,colorchange:true},
						{title:'未发货',value:e.delivery_data.total_undelivered,url:'/pages/home/ShippingManagement/management/management?type=0&id='+e.id,colorchange:true},
					]
				}
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.list=[];
				this.status='loading';
				this.getInfo();
				uni.stopPullDownRefresh();
			},
			nvigate(id){
				uni.navigateTo({url: '/pages/home/ShippingManagement/management/management?type=0&id='+id});
			}
		}
	}
</script>

<style>

</style>
