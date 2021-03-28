<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch u-p-t-20">
			<!-- 搜索框 -->
			<view class="u-flex u-p-l-20 u-p-r-20">
				<u-search placeholder="搜索客户" style="width: 100%;" @search="clearGoodList" @custom="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
			</view>
			<!-- 顶部信息 -->
			<top-nav :list="navList" :col="3"></top-nav>
		</view>
		<!-- 排序条件 -->
		<u-sticky>
			<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
				<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center solid-right" v-for="(item,index) in screen.list" :key="index" @click="changeScreen(index)">
					<text>{{item.name}}</text>
					<view class="u-flex u-m-l-10" style="flex-direction: column;">
						<u-icon name="arrow-up-fill" size="16" :color="item.status===1?'#FE8702':'#CDCDCD'"></u-icon>
						<u-icon name="arrow-down-fill" size="16" :color="item.status===-1?'#FE8702':'#CDCDCD'"></u-icon>
					</view>
				</view>
			</view>
		</u-sticky>
		<!-- 筛选弹出层 -->
		<u-popup v-model="show" mode="right" width="589rpx">
			<scroll-view scroll-y style="height: 93vh;">
				<block v-for="(item,v) in popupList" :key="v">
					<card :headTitle="item.name" :headBorderBottom="false" :headTitleWeight="false">
						<u-row gutter="24" justify="between">
							<block v-for="(son,j) in item.list" :key="j">
								<u-col span="4" @click="choose(item,son,v)">
									<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center" 
									:class="item.selected===son.id?'brand-hover':''">{{son.label}}</view>
								</u-col>
							</block>
							<u-col span="4" v-if="item.isBrand">
								<navigator open-type="navigate" url="/pages/home/queryManagement/brandList">
									<view class="bg-white u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-font-26" style="color: #A9A9A9;">全部品牌<u-icon name="arrow-right"></u-icon></view>
								</navigator>
							</u-col>
						</u-row>
					</card>
					<u-line color="#F5F5F5"></u-line>
				</block>
				<block v-for="(item,k) in fromList" :key="k">
					<form-list :item="item" :index="k" formPadding="u-p-20" @input="input"></form-list>
				</block>
				<card headTitle="创建时间" :headBorderBottom="false" :headTitleWeight="false">
					<u-row gutter="24" justify="between">
						<u-col span="6" @click="showDate=true">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">{{start||'最早时间'}}</view>
						</u-col>
						<u-col span="6" @click="showDate=true">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">{{end||'最晚时间'}}</view>
						</u-col>
					</u-row>
				</card>
			</scroll-view>
			<!-- 按钮 -->
			<view class="u-flex u-abso popupUi">
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="none" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="getInfo">确定</view>
			</view>
		</u-popup>
		<!-- 列表 -->
		<block v-for="(item,i) in list" :key="i">
			<inventory-list :item="item" :index="index" topImg="/static/uiImg/yggl.png" :colorchange="true">
				<view slot="tab">
					<view class="u-p-t-20 u-p-l-40 text-gray text-sm">创建时间:{{item.time}}</view>
					<view class="u-p-t-20 u-p-l-40 text-gray text-sm">拥有积分:{{item.integral||0}}</view>
				</view>
			</inventory-list>
			<view class="u-flex u-row-right u-p-10 solid-top">
				<u-button class="u-m-r-15" :plain="false" type="info" size="mini" @click="setting(item.id)"><text class="u-p-l-20 u-p-r-20">编辑</text></u-button>
				<u-button class="u-m-l-15" type="warning" size="mini" @click="delet(item.id)"><text class="u-p-l-20 u-p-r-20">删除</text></u-button>
			</view>
		</block>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<navigator open-type="navigate" url="/pages/home/salesBilling/customerList/addCustomer" hover-class="none">
			<view class="saveBtn bg-white solid-top u-p-30 u-text-center">+创建新客户</view>
		</navigator>
		
		<u-toast ref="uToast"></u-toast>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 入库时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange"></u-calendar>
	</view>
</template>

<script>
	import inventoryList from '@/components/inventory-list/inventory-list.vue';
	import topNav from '@/components/top-nav/top-nav.vue';
	import card from '@/components/card/card.vue';
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			inventoryList,
			topNav,
			card,
			formList
		},
		onLoad() {
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseEmployees1',(data)=>{
				this.fromList[0].value=data.item.name;
				this.fromList[0].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
			uni.$on('back',(data)=>{
				this.clearGoodList();
				uni.$off('back')
			});
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo();
			}, 500)
		},
		onPullDownRefresh() {
			this.clearGoodList();
			uni.stopPullDownRefresh();
		},
		data() {
			return {
				/* 搜索值 */
				keyword:'',
				/* 顶部导航栏 */
				navList:[
					{label:'客户数量',number:0,unit:'',isNav:false,decimals:0},
					{label:'客户复卖率',number:0,unit:'%',isNav:false,decimals:0},
					{label:'客户复购率',number:0,unit:'%',isNav:false,decimals:0}
				],
				screen:{
					currentIndex:-1,
					list:[
						{name:'时间',status:0},
						{name:'订单数',status:0},
						{name:'回收',status:0},
						{name:'寄卖',status:0},
						{name:'在库',status:0},
					]
				},
				/* 筛选弹出层 */
				show: false,
				popupList:[
					{
						name:'业务状态',
						selected:'',
						isBrand:false,
						list:[
							{label:'无买卖',id:0},{label:'买卖过',id:1}
						]
					},
					{
						name:'客户复购度',
						selected:-1,
						isBrand:false,
						list:[
							{label:'未买',id:0},{label:'买过',id:1},{label:'有复购',id:2}
						]
					},
					{
						name:'客户复卖度',
						selected:-1,
						isBrand:false,
						list:[
							{label:'未卖',id:0},{label:'卖过',id:1},{label:'有复卖',id:2}
						]
					}
				],
				/* from表单 */
				fromList:[
					{type:'picker',name:'维护员工',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:false},
				],
				/* 入库时间 */
				showDate:false,
				start:'',
				end:'',
				
				
				/* 列表 */
				page:1,
				last_page:1,
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
				this.http.get('/api/v1/Customer/listsPage',{
					keyword:this.keyword,
					baned_in:true,
					date_order:this.screen.list[0].status,
					order_num_order:this.screen.list[1].status,
					rec_order:this.screen.list[2].status,
					cons_order:this.screen.list[3].status,
					sto_order:this.screen.list[4].status,
					is_no_deal:this.popupList[0].selected.toString()||0,
					repeat_buy:this.popupList[1].selected.toString()||0,
					repeat_sale:this.popupList[2].selected.toString()||0,
					date_min:this.start||0,
					date_max:this.end||0,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							this.list=res.data.page_data.cus_data.map(v=>{
								return this._formatList(v)
							});
							this.last_page=res.data.page_data.last_page||1;
							this.navList[0].number=res.data.top_data.cus_num;
							this.navList[1].number=res.data.top_data.rep_sale_rate;
							this.navList[2].number=res.data.top_data.rep_buy_rate;
						}else{
							let dataList=res.data.page_data.cus_data.map(v=>{
								return this._formatList(v)
							});
							this.list=this.list.concat(dataList)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
						this.show=false;
					}
				})
			},
			// 列表数据转化
			_formatList(e){
				return{
					warehouseName:e.name,
					isSellAgain:e.repeat_sale,
					isBuyAgain:e.repeat_buy,
					id:e.id,
					message:[
						{title:'订单',value:e.order_num_arr.order_num,url:`/pages/home/salesReport/salesReport?customer_id=${e.order_num_arr.customer_id}`},
						{title:'回收',value:e.recovery_num_arr.recovery_num,url:`/pages/home/history/history?currentIndex=0&customer_id=${e.recovery_num_arr.customer_id}`},
						{title:'寄卖',value:e.consign_num_arr.consign_num,url:`/pages/home/history/history?currentIndex=1&customer_id=${e.consign_num_arr.customer_id}`},
						{title:'在库',value:e.stock_num_arr.stock_num,url:`/pages/home/queryManagement/queryManagement?customer_id=${e.stock_num_arr.customer_id}`},
					],
					time:e.created_at
				}
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
			/* 选择筛选 */
			choose(item,son,v){
				if(item.selected==son.id){
					item.selected=-1;
				}else{
					this.$set(item,'selected',son.id)
				}
			},
			/* 入库时间选择 */
			dateChange(e){
				console.log(e);
				this.start=e.startDate;
				this.end=e.endDate;
			},
			/* 重置 */
			reset(){
				this.show=false;
				this.popupList.forEach(item=>{
					item.selected=''
				});
				this.fromList.forEach(item=>{
					item.value='';
					item.id='';
				})
				this.start='';
				this.end='';
				this.getInfo();
			},
			/* 输入框 */
			input(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value)
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.list=[];
				this.page=1;
				this.last_page=1;
				this.status='loading';
				this.getInfo();
			},
			/* 编辑 */
			setting(id){
				uni.navigateTo({url: '/pages/home/salesBilling/customerList/addCustomer?customer_id='+id});
			},
			/* 删除 */
			delet(id){
				this.http.modal('提示','确认要删除该客户吗?',true,(e)=>{
					if(e){
						this.http.get('/api/v1/Customer/deleteCustomer',{
							customer_id:id
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

<style lang="scss" scoped>
	.topSearch{
		height: 220rpx;
		background-color: #FE8702;
	}
	.popupUi{
		bottom: 0;
		width: 100%;
		z-index: 999;
		.reset{
			background-color: #EEEEEE;
		}
		.msure{
			color: #FFFFFF;
			background-color: #FE8702;
		}
	}
	.popupTouch{
		background-color: #B3B2AF;
		color: #FFFFFF;
		height: 100rpx;
	}
	
	.demo-layout {
		height: 70rpx;
		background: #F5F5F5;
		color: #333333;
		border-radius: 5rpx;
	}
	.brand-hover{
		background: #FFFFFF;
		border: solid 2rpx #FE8702;
	}
</style>
