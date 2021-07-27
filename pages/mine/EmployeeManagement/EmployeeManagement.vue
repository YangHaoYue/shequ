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
			<inventory-list :item="item" :index="index" topImg="/static/uiImg/yggl.png" :colorchange="false">
				<view slot="tab">
					<view class="u-p-t-20 u-p-l-40 text-gray text-sm">最后登录:{{item.time}}</view>
				</view>
			</inventory-list>
			<view class="u-flex u-row-right u-p-10 solid-top">
				<u-button class="u-m-r-15" :plain="false" type="info" size="mini" @click="setting(item.id)"><text class="u-p-l-20 u-p-r-20">修改</text></u-button>
				<u-button class="u-m-l-15" type="warning" size="mini" @click="delet(item.id)"><text class="u-p-l-20 u-p-r-20">删除</text></u-button>
			</view>
		</block>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<navigator open-type="navigate" url="/pages/mine/EmployeeManagement/addEmployee/addEmployee" hover-class="none">
			<view class="saveBtn bg-white solid-top u-p-30 u-text-center">+添加员工</view>
		</navigator>
		
		<!-- 入库时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange"></u-calendar>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import inventoryList from '@/components/inventory-list/inventory-list.vue';
	export default {
		components:{
			inventoryList
		},
		onLoad() {
			this.clearGoodList();
		},
		onShow() {
			uni.$on('emBack',(data)=>{
				console.log('emback');
				setTimeout(()=>{
					this.clearGoodList();
				},1500)
				uni.$off('emBack')
			})
		},
		beforeDestroy () {
		    uni.$off('emBack');
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
				screen:{
					currentIndex:-1,
					list:[
						{name:'订单数',status:0},
						{name:'回收',status:0},
						{name:'寄卖',status:0},
					]
				},
				/* 列表 */
				last_page:'',
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
				this.http.get('/api/v1/Staff/listsPage',{
					order_num_order:this.screen.list[0].status,
					rec_order:this.screen.list[1].status,
					cons_order:this.screen.list[2].status,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							let listData=res.data.user_data.map(v=>{
								return this._formatData(v)
							})
							this.list=listData;
							this.last_page=res.data.last_page||1;
						}else{
							let listData=res.data.user_data.map(v=>{
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
					warehouseName:e.name,
					id:e.id,
					message:[
						{title:'订单',value:e.order_num_arr.order_num,url:`/pages/home/salesReport/salesReport?seller_id=${e.order_num_arr.seller_id}`},
						{title:'回收',value:e.recovery_num_arr.recovery_num,
						url:`/pages/home/history/history?currentIndex=0&recovery_id=${e.recovery_num_arr.recovery_id}&type_from_arr=${encodeURIComponent(JSON.stringify(e.recovery_num_arr.type_from_arr))}`},
						{title:'寄卖',value:e.consign_num_arr.consign_num,
						url:`/pages/home/history/history?currentIndex=1&recovery_id=${e.consign_num_arr.recovery_id}&type_from_arr=${encodeURIComponent(JSON.stringify(e.consign_num_arr.type_from_arr))}`},
					],
					time:e.last_login
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
					this.screen.list[this.screen.currentIndex].status=0
				}
				this.clearGoodList();
			},
			/* 编辑 */
			setting(id){
				uni.navigateTo({url: `/pages/mine/EmployeeManagement/addEmployee/addEmployee?user_id=${id}`});
			},
			/* 删除 */
			delet(id){
				this.http.modal('提示','确认要删除该员工吗?',true,(e)=>{
					if(e){
						this.http.post('/api/v1/Staff/deleteUser',{
							user_id:id
						},true).then((res)=>{
							if(res.code==1000){
								this.$refs.uToast.show({
									title:res.msg,
									type:"success"
								})
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

<style>
	
</style>
