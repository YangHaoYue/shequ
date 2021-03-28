<template>
	<view>
		<!-- 排序条件 -->
		<u-sticky>
			<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
				<view class="u-flex-1 u-text-center u-col-center solid-right" @click="reset">
					默认排序
				</view>
				<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center solid-right" v-for="(item,index) in screen.list" :key="index" @click="changeScreen(index)">
					<text>{{item.name}}</text>
					<view class="u-flex u-m-l-10" style="flex-direction: column;">
						<u-icon name="arrow-up-fill" size="16" :color="item.status===1?'#FE8702':'#CDCDCD'"></u-icon>
						<u-icon name="arrow-down-fill" size="16" :color="item.status===-1?'#FE8702':'#CDCDCD'"></u-icon>
					</view>
				</view>
			</view>
		</u-sticky>
		<!-- 列表 -->
		<block v-for="(item,i) in list" :key="i">
			<inventory-list :item="item" :index="index" topImg="/static/uiImg/yggl.png" :colorchange="false" @tap="navigate(item)">
				<view slot="tab">
					<view class="u-p-t-20 u-p-l-40 text-gray text-sm">备注:{{item.remark}}</view>
				</view>
			</inventory-list>
			<view class="u-flex u-row-right u-p-20 u-p-t-30 u-p-b-30 solid-top">
				<navigator open-type="navigate" :url="`/pages/mine/WarehouseManagement/MoveTheLibrary/MoveTheLibrary?store_house_id=${item.id}&warehouseName=${item.warehouseName}`" hover-class="none">
					<u-icon class="u-m-l-25" label="移库" name="edit-pen" color="#A0A0A0" label-color="#A0A0A0" label-size="28rpx"></u-icon>
				</navigator>
				<navigator open-type="navigate" :url="`/pages/mine/WarehouseManagement/addWarehouse/addWarehouse?store_house_id=${item.id}`" hover-class="none">
					<u-icon class="u-m-l-25" label="修改" name="edit-pen" color="#A0A0A0" label-color="#A0A0A0" label-size="28rpx"></u-icon>
				</navigator>
				<u-icon class="u-m-l-25" label="删除" name="edit-pen" color="#A0A0A0" label-color="#A0A0A0" label-size="28rpx" @click="delet(item.id)"></u-icon>
			</view>
		</block>
		
		<navigator open-type="navigate" url="/pages/mine/WarehouseManagement/Recording/Recording">
			<view class="round circle u-flex bg-grey text-xs text-white u-row-center"><text>移库记录</text></view>
		</navigator>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<u-toast ref="uToast"></u-toast>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<navigator open-type="navigate" url="/pages/mine/WarehouseManagement/addWarehouse/addWarehouse" hover-class="none">
			<view class="saveBtn bg-white solid-top u-p-30 u-text-center">+添加仓库</view>
		</navigator>
		
		<!-- 入库时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange"></u-calendar>
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
		 onBackPress(options) {  
			if (options.from === 'navigateBack') {  
				return this.clearGoodList();  
			}  
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
				screen:{
					currentIndex:-1,
					list:[
						{name:'库存',status:0},
						{name:'本月入库',status:0},
						{name:'总成本',status:0},
					]
				},
				/* 列表 */
				last_page:1,
				page:1,
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
				this.http.get('/api/v1/StoreHouse/listsPage',{
					stock_num_order:this.screen.list[0].status,
					stock_num_month_order:this.screen.list[1].status,
					total_cost_price_order:this.screen.list[2].status,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							this.list=res.data.page_data.store_house_data.map(v=>{
								return this._formatList(v)
							});
							this.last_page=res.data.page_data.last_page;
						}else{
							let dataList=res.data.page_data.store_house_data.map(v=>{
								return this._formatList(v)
							});
							this.list=this.list.concat(dataList)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}
				})
			},
			// 列表数据转化
			_formatList(e){
				return{
					warehouseName:e.name,
					id:e.id,
					message:[
						{title:'库存',value:e.stock_count,url:`/pages/home/queryManagement/queryManagement?store_house_id=${e.id}&store_house_name=${e.name}`},
						{title:'本月入库',value:e.stock_this_month,url:`/pages/home/queryManagement/queryManagement?store_house_id=${e.id}&store_house_name=${e.name}`},
						{title:'总成本',value:e.total_value+'元',url:`/pages/home/queryManagement/queryManagement?store_house_id=${e.id}`},
					],
					remark:e.remark
				}
			},
			navigate(e){
				uni.navigateTo({
					url: `/pages/home/queryManagement/queryManagement?store_house_id=${e.id}&store_house_name=${e.warehouseName}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.list=[];
				this.status='loading';
				this.getInfo();
			},
			/* 排序 */
			changeScreen(index){
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
			/* 重置排序 */
			reset(){
				if(this.screen.currentIndex!=-1){
					this.screen.list[this.screen.currentIndex].status=0;
					this.clearGoodList();
				}
			},
			/* 删除仓库 */
			delet(id){
				this.http.modal('提示','确认要删除此仓库吗?',true,(e)=>{
					if(e){
						this.http.get('/api/v1/StoreHouse/deleteStoHouse',{
							store_house_id:id
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
						})
					}
				},'#FE8702')
				
			}
		}
	}
</script>

<style scoped>
	.circle{
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 200rpx;
		right: 30rpx;
	}
</style>
