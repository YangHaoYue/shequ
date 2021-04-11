<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch u-p-t-20">
			<!-- 搜索框 -->
			<view class="u-flex u-p-l-20 u-p-r-20">
				<u-search placeholder="销售报表关键词" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
			</view>
			<!-- 顶部信息 -->
			<top-nav :list="navList"></top-nav>
		</view>
		<!-- 排序条件 -->
		<u-sticky>
			<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
				<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center" v-for="(item,index) in screen.list" :key="index" @tap="debounce(item.status)">
					<text :class="item.status==screen.currentIndex?'u-type-warning':''">{{item.name}}</text>
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
									 :class="judge(item.selected,son.id)? 'brand-hover' : '' ">{{son.cate_name||son.brand_name||son.val}}</view>
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
					<form-list :item="item" :index="k" formPadding="u-p-20"></form-list>
				</block>
				<card headTitle="销售时间" :headBorderBottom="false" :headTitleWeight="false">
					<u-row gutter="24" justify="between">
						<u-col span="6" @click="showDate=true">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">{{start||'最早时间'}}</view>
						</u-col>
						<u-col span="6" @click="showDate=true">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">{{end||'最晚时间'}}</view>
						</u-col>
					</u-row>
				</card>
				<card headTitle="商品金额范围" :headBorderBottom="false" :headTitleWeight="false">
					<u-row gutter="24" justify="between">
						<u-col span="6">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">
								<input v-model="min" type="digit" placeholder="最低" />
							</view>
						</u-col>
						<u-col span="6">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">
								<input class="u-text-center" v-model="max" type="digit" placeholder="最高" />
							</view>
						</u-col>
					</u-row>
				</card>
				<card headTitle="是否查看已取消订单" :headBorderBottom="false" :headTitleWeight="false">
					<u-switch v-model="show_cancel" active-color="#FE8702" class="u-flex u-row-right"></u-switch>
				</card>
			</scroll-view>
			<!-- 按钮 -->
			<view class="u-flex u-abso popupUi">
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="none" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 订单列表 -->
		
		<scroll-view scroll-y :style="'height:'+scrollHeight+'px;'" @scrolltolower="scrolltolower" lower-threshold="70">
			<block v-for="(item,i) in orderList" :key="i">
				<navigator open-type="navigate" :url="`/pages/home/salesReport/orderDetail/orderDetail?id=${item.id}&order_no=${item.order_no}`" hover-class="none">
					<order-list :item="item" :index="i" :length="orderList.length"></order-list>
				</navigator>
			</block>
			<view class="u-m-t-80" v-if="orderList.length==0&&status=='nomore'" >
				<u-empty text="数据为空" mode="list"></u-empty>
			</view>
			<!-- 加载更多 -->
			<view class="u-m-t-20 u-m-b-20" v-if="!(orderList.length<3&&status=='nomore')">
				<u-loadmore :status="status"/>
			</view>
		</scroll-view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 入库时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange"></u-calendar>
	</view>
</template>

<script>
	import orderList from '@/components/orderList/order-list.vue';
	import topNav from '@/components/top-nav/top-nav.vue';
	import card from '@/components/card/card.vue';
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			orderList,
			topNav,
			card,
			formList
		},
		onLoad(e) {
			if(e.customer_id){
				this.fromList[1].id=e.customer_id
				this.screen.currentIndex=3;
			}
			if(e.good_id){
				this.screen.currentIndex=3;
				this.good_id=e.good_id;
			}
			if(e.seller_id){
				this.fromList[2].id=e.seller_id
				this.screen.currentIndex=3;
			}
			this.scrollHeight=this.$u.sys().windowHeight-uni.upx2px(300)
			this.getScreenData();
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseBrand',(data)=>{
				var bool=this.popupList[0].list.some(v=>{
					return v.id === data.item.id
				})
				if(!bool){
					this.popupList[0].list.push(data.item);
				}
				this.popupList[0].selected=data.item.id;
				uni.$off('chooseBrand')
			});
			uni.$on('chooseWarehouse',(data)=>{
				this.fromList[0].value=data.item.store_house_name;
				this.fromList[0].id=data.item.id
				uni.$off('chooseWarehouse')
			});
			uni.$on('chooseCustomer',(data)=>{
				this.fromList[1].value=data.item.name;
				this.fromList[1].id=data.item.id;
				uni.$off('chooseCustomer')
			});
			uni.$on('chooseEmployees1',(data)=>{
				this.fromList[2].value=data.item.name;
				this.fromList[2].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
			uni.$on('chooseEmployees2',(data)=>{
				this.fromList[3].value=data.item.name;
				this.fromList[3].id=data.item.id;
				uni.$off('chooseEmployees2')
			});
			uni.$on('back',()=>{
				this.clearGoodList();
				uni.$off('back')
			})
		},
		onPullDownRefresh() {
			this.clearGoodList();
		},
		data() {
			return {
				scrollHeight:0,
				good_id:'',
				/* 搜索值 */
				keyword:'',
				/* 顶部导航栏 */
				navList:[
					{label:'订单数',number:0,unit:'单',url:'',isNav:false,decimals:0},
					{label:'销售金额',number:0,unit:'元',url:'',isNav:true,decimals:1},
					{label:'商品数',number:0,unit:'件',url:'',isNav:false,decimals:0},
					{label:'利润金额',number:0,unit:'元',url:'',isNav:true,decimals:1}
				],
				profit_price_detail:'',
				total_price_detail:'',
				/* 日期筛选 */
				screen:{
					currentIndex:0,
					list:[
						{name:'今日',status:0},
						{name:'本周',status:1},
						{name:'本月',status:2},
						{name:'全部',status:3},
					]
				},
				/* 筛选弹出层 */
				show: false,
				popupList:[
					{name:'品牌',selected:"",isBrand:true,list:[]},
					{name:'一级分类',selected:"",isBrand:false,list:[]},
					{name:'二级分类',selected:"",isBrand:false,list:[]},
					{name:'来源',selected:"",isBrand:false,list:[]},
					{name:'销售途径',selected:"",isBrand:false,list:[]},
				],
				/* from表单 */
				fromList:[
					{type:'picker',name:'仓库',value:'',id:'',url:'/pages/home/goodsInStorage/Warehouse/Warehouse',isImport:false},
					{type:'picker',name:'销售客户',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:false},
					{type:'picker',name:'销售员',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:false},
					{type:'picker',name:'回收人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=2',isImport:false},
				],
				/* 入库时间 */
				showDate:false,
				start:'',
				end:'',
				/* 价格范围 */
				min:'',
				max:'',
				/* 是否查看已取消订单 */
				show_cancel:false,
				
				/* 订单列表 */
				last_page:'',
				page:1,
				orderList:[],
				// {
				// 	orderId:20210129100655273565,
				// 	img:'https://ossweb-img.qq.com/images/lol/web201310/skin/big81020.jpg',
				// 	time:'2021-01-29',
				// 	totalPrice:42000.00,
				// 	number:2,
				// 	desc:'同行 其他快递 销售人员 测试'
				// }
				// /* 加载更多 */
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
			getScreenData(){
				this.http.get('/api/v1/OrderLog/getOrderScreenData',{},true).then((res)=>{
					if(res.code==1000){
						this.popupList[0].list=res.data.brand;
						this.popupList[1].list=res.data.top_cate;
						this.popupList[3].list=res.data.type_from;
						this.popupList[4].list=res.data.type_sale;
					}
				})
			},
			getScreenCate(id){
				this.http.get('/api/v1/Index/getScreenCate',{
					top_cate_id:id
				},true).then((res)=>{
					if(res.code==1000){
						this.popupList[2].list=res.data.cate;
					}
				})
			},
			getInfo(){
				this.http.post('/api/v1/OrderLog/getOrderLogs',{
					need_top_data:1,
					keyword:this.keyword,
					type_time_limit:this.screen.currentIndex,
					brand_id:this.popupList[0].selected.toString(),
					top_cate_id:this.popupList[1].selected.toString(),
					cate_id:this.popupList[2].selected.toString(),
					type_from:this.popupList[3].selected.toString(),
					type_sale:this.popupList[4].selected.toString(),
					
					good_id:this.good_id,
					
					store_house_id:this.fromList[0].id,
					customer_id:this.fromList[1].id,
					seller_id:this.fromList[2].id,
					recovery_id:this.fromList[3].id,
					price_min:this.min,
					price_max:this.max,
					date_min:this.start,
					date_max:this.end,
					show_cancel:this.show_cancel,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.orderList.length==0){
							this.orderList=res.data.main.book_data;
							this.last_page=res.data.main.last_page;
							this.navList[0].number=res.data.top.order_num;
							this.navList[1].unit=res.data.top.total_price.unit;
							this.navList[1].number=res.data.top.total_price.value;
							this.navList[2].number=res.data.top.good_num;
							this.navList[3].number=res.data.top.profit_price.value;
							this.navList[3].unit=res.data.top.profit_price.unit;
							
							this.profit_price_detail=encodeURIComponent(JSON.stringify(res.data.top.profit_price_detail));
							this.total_price_detail=encodeURIComponent(JSON.stringify(res.data.top.total_price_detail));
							
							this.navList[1].url=`/pages/home/salesReport/saleAmount/saleAmount?total_price_detail=${this.total_price_detail}`
							this.navList[3].url=`/pages/home/salesReport/profitAmount/profitAmount?profit_price_detail=${this.profit_price_detail}`
						}else{
							res.data.main.book_data.map(v=>{
								this.orderList.push(v)
							})
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
						this.show=false;
					}
				})
			},
			/* 滚动到底部 */
			scrolltolower(){
				if(this.page >= this.last_page) return ;
				this.status = 'loading';
				this.page = ++ this.page;
				setTimeout(() => {
					this.getInfo();
				}, 500)
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.orderList=[];
				this.status='loading';
				this.getInfo();
				uni.stopPullDownRefresh();
			},
			debounce(status){
				this.$u.throttle(this.changeScreen(status),500)
			},
			/* 排序 */
			changeScreen(status){
				this.screen.currentIndex=status;
				this.clearGoodList();
			},
			judge(v1,v2){
				return v1 === v2;
			},
			/* 选择筛选 */
			choose(item,son,v){
				if(v==1&&item.selected!=son.id){
					this.getScreenCate(son.id);
				}else if(v==1&&item.selected==son.id){
					this.popupList[2].list=[];
					this.popupList[2].selected="";
				}
				if(item.selected==son.id){
					item.selected="";
				}else{
					this.$set(item,'selected',son.id);
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
				this.min='';
				this.max='';
				this.clearGoodList();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topSearch{
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
