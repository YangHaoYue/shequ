<template>
	<view>
		<!-- 排序条件 -->
		<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
			<view class="u-flex-1 u-text-center u-col-center" @click="showStoreList=true">
				{{storeName}}
			</view>
			<view class="u-flex u-font-28 u-m-l-20 u-m-r-20" @click="showDate = true" >
				<view class="u-p-10 u-flex u-row-between u-border" style="border-radius: 4rpx;">
					<view>{{start}}</view>
					<u-icon name="calendar" class="u-m-l-35" size="28" color="#999999"></u-icon>
				</view>
				<view class="u-m-l-10 u-m-r-10">-</view>
				<view class="u-p-10 u-flex u-row-between u-border" style="border-radius: 4rpx;">
					<view>{{end}}</view>
					<u-icon name="calendar" class="u-m-l-35" size="28" color="#999999"></u-icon>
				</view>
			</view>
		</view>
		<block v-for="(item,index) in list" :key="index">
			<inventory-list :item="item" :index="index" @end="close" @tap="navigateUrl(item.message[0].url)"></inventory-list>
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
		
		<!-- 日期 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange" max-date="2050-12-31"></u-calendar>
		<!-- 店铺选择列表 -->
		<u-select v-model="showStoreList" confirmColor="#FE8702" value-name="id" label-name="store_house_name" mode="single-column" :list="storeList" @confirm="chooseStore"></u-select>
	</view>
</template>

<script>
	import inventoryList from '@/components/inventory-list/inventory-list.vue';
	export default {
		components:{
			inventoryList
		},
		onLoad() {
			this.start = this.http.getToday();
			this.end = this.http.getToday();
			this.getStoHouseLists();
			this.clearGoodList();
		},
		onShow() {
			uni.$on('icBack',(data)=>{
				console.log('tim');
				setTimeout(()=>{
					this.clearGoodList();
				},1500)
				uni.$off('icBack')
			})
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
				/* 排序 */
				storeName:'全部仓库',
				showStoreList: false,
				storeId:0,
				storeList: [
					{id: 0,store_house_name: "全部仓库"}
				],
				//显示日期
				showDate:false,
				start:'',
				end:'',
				
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
				this.http.get('/api/v1/StockCheck/getStockCheckLists',{
					store_house_id:this.storeId,
					date_min:this.start,
					date_max:this.end,
					page:this.page
				},true).then((res)=>{
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
			getStoHouseLists(){
				this.http.get('/api/v1/StockCheck/getStoHouseLists',{},true).then((res)=>{
					if(res.code==1000){
						res.data.map(v=>{
							this.storeList.push(v)
						})
					}
				})
			},
			//选择仓库
			chooseStore(e){
				this.storeId = e[0].value;
				this.storeName = e[0].label;
				this.clearGoodList();
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
			debounce(index){
				this.$u.debounce(this.changeScreen(index),500)
			},
			/* 排序 */
			changeScreen(index){
				this.status='loading';//设置loadmore，让蒙层mask显示
				let oldIndex = this.screen.currentIndex;
				if(oldIndex==-1){
					let newItem = this.screen.list[index];
					this.screen.currentIndex = index;
					newItem.status=-1;
					this.clearGoodList();
					return;
				}
				let oldItem = this.screen.list[oldIndex];
				if(oldIndex === index){
					oldItem.status = oldItem.status === 1 ? -1 : 1
					return this.clearGoodList();
				}
				let newItem = this.screen.list[index];
				oldItem.status = 0;
				this.screen.currentIndex = index;
				newItem.status=-1;
				this.clearGoodList();
			},
			dateChange(e){
				this.start = e.startDate;
				this.end = e.endDate;
				this.clearGoodList();
			},
			/* 初始化数据 */
			clearGoodList(){
				this.page=1;
				this.last_page=1;
				this.list=[];
				this.status='loading';
				this.getInfo();
				uni.stopPullDownRefresh();
			},
			close(e){
				this.http.modal('提示','是否结束本次盘点？',true,(confirm)=>{
					if(confirm){
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
				},'#FE8702')
			}
		}
	}
</script>

<style>

</style>
