<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch u-p-t-20">
			<!-- 搜索框 -->
			<view class="u-flex u-p-l-20 u-p-r-20">
				<u-search placeholder="搜索商品" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
			</view>
			<!-- 顶部信息 -->
			<top-nav :list="navList" :urlData="urlData"></top-nav>
		</view>
		<!-- 排序条件 -->
		<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
			<navigator class="u-flex-1 u-text-center u-col-center" hover-class="none" url="/pages/home/queryManagement/storeList/storeList" open-type="navigate">
				{{storeName}}
			</navigator>
			<!-- <view class="u-flex-1 u-text-center u-col-center" @click="showStoreList=true">
				{{storeName}}
			</view> -->
			<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center" v-for="(item,index) in screen.list" :key="index" @tap="debounce(index)">
				<text>{{item.name}}</text>
				<view class="u-flex u-m-l-10" style="flex-direction: column;">
					<u-icon name="arrow-up-fill" size="16" :color="item.status===1?'#FE8702':'#CDCDCD'"></u-icon>
					<u-icon name="arrow-down-fill" size="16" :color="item.status===-1?'#FE8702':'#CDCDCD'"></u-icon>
				</view>
			</view>
		</view>
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
					<form-list :item="item" :index="k" formPadding="u-p-20" @input="input"></form-list>
				</block>
				<card headTitle="入库时间" :headBorderBottom="false" :headTitleWeight="false">
					<u-row gutter="24" justify="between">
						<u-col span="6" @click="showDate=true">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">{{start||'最早时间'}}</view>
						</u-col>
						<u-col span="6" @click="showDate=true">
							<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center">{{end||'最晚时间'}}</view>
						</u-col>
					</u-row>
				</card>
				<card headTitle="价格范围" :headBorderBottom="false" :headTitleWeight="false">
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
			</scroll-view>
			<!-- 按钮 -->
			<view class="u-flex u-abso popupUi">
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="none" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 商品列表 -->
		<scroll-view scroll-y :style="'height:'+scrollHeight+'px;'" @scrolltolower="scrolltolower" lower-threshold="70">
			<block v-for="(item,i) in goodList" :key="i">
				<good-list :item="item" :index="i" :length="goodList.length">
					<view slot="price" class="u-flex">
						<view class="text-bold u-font-36" style="color: #FE8702;">￥{{item.sell_price}}</view>
						<view class="u-font-28 u-m-l-10">{{item.price_str}}:￥{{item.cost_price}}</view>
					</view>
				</good-list>
				<u-gap height="10" bg-color="#F5F5F5"></u-gap>
			</block>
			<!-- 数据为空 -->
			<view class="u-m-t-80" v-if="goodList.length==0&&status=='nomore'" >
				<u-empty text="数据为空" mode="list"></u-empty>
			</view>
			<!-- 加载更多 -->
			<view class="u-m-t-20 u-m-b-20" v-if="!(goodList.length<10&&status=='nomore')">
				<u-loadmore :status="status"/>
			</view>
		</scroll-view>
		
		<u-mask :show="status=='loading'" :mask-click-able="false" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		
		<!-- 店铺选择列表 -->
		<u-select v-model="showStoreList" confirmColor="#FE8702" value-name="id" label-name="store_name" mode="single-column" :list="storeList" @confirm="chooseStore"></u-select>
		<!-- 入库时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange"></u-calendar>
	</view>
</template>

<script>
	import goodList from '@/components/good-list/good-list.vue';
	import topNav from '@/components/top-nav/top-nav.vue';
	import card from '@/components/card/card.vue';
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			goodList,
			topNav,
			card,
			formList
		},
		onLoad(e) {
			if(e.store_house_id){
				this.fromList[0].id=e.store_house_id;
				this.fromList[0].value=e.store_house_name;
				if(e.time){
					let now = new Date();
					this.start = `${now.getFullYear()}-${now.getMonth() + 1}-01`
					this.end = `${now.getFullYear()}-${now.getMonth() + 1}-${this.getMonthLastDateFn()}`;
				}
			}
			if(e.customer_id){
				this.fromList[1].id=e.customer_id;
			}
			this.scrollHeight=this.$u.sys().windowHeight-uni.upx2px(300);
			this.getScreenData();
			/* this.getStoreLists(); */
			this.getIndexStores();
		},
		onShow() {
			uni.$on('chooseStore',(data)=>{
				console.log(data);
				this.storeName=data.item.store_name;
				this.storeId=data.item.id;
				uni.$off('chooseStore')
				this.clearGoodList();
			});
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
				let pages=getCurrentPages()
				if(pages.length==3){
					this.fromList[1].value=data.item.name;
					this.fromList[1].id=data.item.id;
				}
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
			uni.$on('back',(data)=>{
				this.clearGoodList();
				uni.$off('back')
			});
		},
		onPullDownRefresh() {
			this.clearGoodList();
		},
		data() {
			return {
				scrollHeight: 1000,
				/* 搜索值 */
				keyword:'',
				/* 顶部导航栏 */
				navList:[
					{label:'库存量',number:0,unit:'件',url:'',isNav:false,decimals:0},
					{label:'在库成本',number:0,unit:'元',url:'/pages/home/queryManagement/KCdetail',isNav:true,decimals:2},
					{label:'历史总量',number:0,unit:'件',url:'/pages/home/queryManagement/HISdetail',isNav:true,decimals:0},
					{label:'超期限定',number:0,unit:'件',url:'/pages/home/queryManagement/BYdetail',isNav:true,decimals:0}
				],
				/* 排序 */
				storeName:'全部店铺',
				showStoreList: false,
				storeId:0,
				storeList: [
					{id: 0,store_name: "全部店铺"}
				],
				screen:{
					currentIndex:0,
					list:[
						{name:'日期',status:-1},
						{name:'库存',status:0},
						{name:'价格',status:0},
					]
				},
				/* 筛选弹出层 */
				show: false,
				popupList:[
					{name:'品牌',selected:"",isBrand:true,list:[]},
					{name:'一级分类',selected:"",isBrand:false,list:[]},
					{name:'二级分类',selected:"",isBrand:false,list:[]},
					{name:'超期',selected:"",isBrand:false,list:[]},
					{name:'来源',selected:"",isBrand:false,list:[]},
					{name:'成色',selected:"",isBrand:false,list:[]},
					{name:'库存',selected:"",isBrand:false,list:[]},
				],
				/* from表单 */
				fromList:[
					{type:'picker',name:'仓库',value:'',id:'',url:'/pages/home/goodsInStorage/Warehouse/Warehouse',isImport:false},
					{type:'picker',name:'销售客户',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:false},
					{type:'picker',name:'入库人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:false},
					{type:'picker',name:'回收人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=2',isImport:false},
				],
				/* 入库时间 */
				showDate:false,
				start:'',
				end:'',
				/* 价格范围 */
				min:'',
				max:'',
				
				/* 商品列表 */
				page:1,
				last_page:'',
				goodList:[],
				/* 加载更多 */
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				urlData:{}
			}
		},
		methods: {
			getScreenData(){
				this.http.get('/api/v1/Index/getScreenData',{},true).then((res)=>{
					if(res.code==1000){
						this.popupList[0].list=res.data.brand;
						this.popupList[1].list=res.data.top_cate;
						this.popupList[3].list=res.data.time_up;
						this.popupList[4].list=res.data.type_from;
						this.popupList[5].list=res.data.type_condition;
						this.popupList[6].list=res.data.type_sell;
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
			getStoreLists(){
				this.http.post('/api/v1/Common/getStoreLists',{},true).then((res)=>{
					if(res.code==1000){
						this.storeList=this.storeList.concat(res.data);
					}
				})
			},
			/* 获取索引店铺 */
			getIndexStores(){
				this.http.post('/api/v1/Common/getIndexStores',{},true).then((res)=>{
					if(res.code==1000){
						this.storeName=res.data.your_store_name;
						this.storeId=res.data.your_store_id;
						this.getInfo();
						/* this.storeList=this.storeList.concat(res.data); */
					}
				})
			},
			getInfo(){
				this.urlData={
					need_top_data:1,
					keyword:this.keyword,
					store_id:this.storeId,
					date_order:this.screen.list[0].status,
					sto_order:this.screen.list[1].status,
					price_order:this.screen.list[2].status,
					brand_id:this.popupList[0].selected.toString(),
					top_cate_id:this.popupList[1].selected.toString(),
					cate_id:this.popupList[2].selected.toString(),
					time_up:this.popupList[3].selected.toString(),
					type_from:this.popupList[4].selected.toString(),
					type_condition:this.popupList[5].selected.toString(),
					type_sell:this.popupList[6].selected.toString(),
					store_house_id:this.fromList[0].id,
					customer_id:this.fromList[1].id,
					sto_user_id:this.fromList[2].id,
					recovery_id:this.fromList[3].id,
					price_min:this.min,
					price_max:this.max,
					date_min:this.start||0,
					date_max:this.end||0,
					page:this.page
				}
				this.http.get('/api/v1/Index/searchIndex',this.urlData,true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.goodList=res.data.good_data.good_data;
							this.last_page=res.data.good_data.last_page;
							this.navList[0].number=res.data.top_data.num_now;
							this.navList[1].number=res.data.top_data.total_cost_price.value;
							this.navList[2].number=res.data.top_data.num_history_total;
							this.navList[3].number=res.data.top_data.num_time_up;
							this.navList[1].unit=res.data.top_data.total_cost_price.unit
						}else{
							res.data.good_data.good_data.map(v=>{
								this.goodList.push(v)
							})
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
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
				}, 50)
			},
			/* 初始化数据 */
			clearGoodList(){
				this.status='loading';
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.goodList=[];
				this.getInfo();
				uni.stopPullDownRefresh();
			},
			/* 选择店铺 */
			chooseStore(e){
				console.log(e);
				this.storeName=e[0].label;
				this.storeId=e[0].value;
				this.clearGoodList();
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
				if(item.selected===son.id){
					item.selected="";
				}else{
					this.$set(item,'selected',son.id);
					console.log(item.selected.toString()||6);
				}
			},
			/* 入库时间选择 */
			dateChange(e){
				console.log(e);
				this.start=e.startDate;
				this.end=e.endDate;
			},
			/* 输入框 */
			input(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value)
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
			},
			//月份最后一天
			getMonthLastDateFn(dateStr){
				let today = new Date()
				let dateObj = new Date(today.getFullYear(),today.getMonth()+1,0);  //注意：这里传入月份取值范围是1-12
				let theMonthDay = dateObj.getDate();
				return theMonthDay;
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
