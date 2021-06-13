<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch">
			<!-- 搜索框 -->
			<view class="u-flex u-p-20">
				<u-search placeholder="搜索商品" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true" :fade="false"></u-image>
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
									<view class="demo-layout u-m-b-10 u-p-20 u-p-l-10 u-p-r-10 u-line-1 u-font-26 u-text-center" :class="item.selected==son.id?'brand-hover':''">{{son.label}}</view>
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
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="popupTouch" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="popupTouch" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 商品列表 -->
		<u-checkbox-group @change="checkboxGroupChange" shape="circle" active-color="#FE8702">
			<label v-for="(item,i) in list" :key="i">
				<u-gap height="20" bg-color="#f5f5f5"></u-gap>
				<u-checkbox class="u-flex u-m-l-20" v-model="item.checked" :name="item.id" shape="circle" active-color="#FE8702">
					<view class="bg-white u-p-20 u-flex u-col-top" style="line-height: 1.2;">
						<u-image :src="http.resourceUrl()+item.pic+'?x-oss-process=sm_200X200'" width="199rpx" height="199rpx" ></u-image>
						<view class="u-m-l-20 flex" style="flex-direction: column;width: 430rpx;">
							<view class="u-line-1 text-bold text-black u-font-30 u-m-b-10">{{item.title}}</view>
							<view class="u-line-1 text-gray u-font-22 u-m-b-10">{{item.store_no}}</view>
							<u-tag :text="item.store_name" type="info" mode="light" :closeable="false" size="mini" color="#A0A0A0" />
							<view class="u-flex u-row-between u-m-t-40">
								<slot name="price">
									<view class="text-bold u-font-36" style="color: #FE8702;">￥{{item.cost_price}}</view>
								</slot>
								<slot name="number">
									<view class="text-black">x{{item.num_real}}</view>
								</slot>
							</view>
						</view>
					</view>
				</u-checkbox>
			</label>
		</u-checkbox-group>
		
		<!-- 数据为空 -->
		<view class="u-m-t-80" v-if="list.length==0&&status=='nomore'" >
			<u-empty text="没有可移库商品" mode="list"></u-empty>
		</view>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn bg-white solid-top u-flex u-row-between">
			<label @click="doSelectedAll">
				<u-checkbox class="u-flex u-m-l-20" v-model="isSelectedAll" shape="circle" active-color="#FE8702">全选</u-checkbox>
			</label>
			<view class="u-flex">
				<view class="u-m-r-10">合计：{{allNumber}}件/{{totalPrice}}元</view>
				<view class="u-p-25 u-p-l-50 u-p-r-50 text-white" style="background-color: #FE8702;" @click="submit">下一步</view>
			</view>
		</view>
		<!-- 入库时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="range" @change="dateChange"></u-calendar>
	</view>
</template>

<script>
	import goodList from '@/components/good-list/good-list.vue';
	import card from '@/components/card/card.vue';
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			goodList,
			card,
			formList
		},
		onLoad(e) {
			console.log(e);
			this.store_house_id=e.store_house_id;
			this.warehouseName=e.warehouseName;
			this.getScreenData();
			this.getInfo();
		},
		onShow() {
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
		},
		computed: {
			allNumber() {
				let total = 0;
				this.list.forEach((item)=>{
					if(this.selectedList.indexOf(item.id)!=-1)
					total+=item.num_now
				})
				return total 
			},
			totalPrice() {
				let total = 0;
				this.list.forEach((item)=>{
					if(this.selectedList.indexOf(item.id)!=-1)
					total+=item.cost_price*item.num_now
				})
				return total.toFixed(2)
			},
			isSelectedAll:{
				get:function(){
					return this.list.length === this.selectedList.length
				},
				set:function(){
				}
			}
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo()
			}, 100)
		},
		data() {
			return {
				store_house_id:'',
				warehouseName:'',
				/* 搜索值 */
				keyword:'',
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
					/* {type:'picker',name:'仓库',value:'',id:'',url:'/pages/home/goodsInStorage/Warehouse/Warehouse',isImport:false}, */
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
				},
				/* 是否全选 */
				selectedList:[]
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
			getInfo(){
				this.http.get('/api/v1/StoreHouse/StoMoveGoodsLists',{
					store_house_id:this.store_house_id,
					keyword:this.keyword,
					date_order:0,
					sto_order:0,
					price_order:0,
					brand_id:this.popupList[0].selected,
					top_cate_id:this.popupList[1].selected||0,
					cate_id:this.popupList[2].selected,
					time_up:this.popupList[3].selected||2,
					type_from:this.popupList[4].selected||6,
					type_condition:this.popupList[5].selected||3,
					type_sell:this.popupList[6].selected||2,
					customer_id:this.fromList[0].id,
					sto_user_id:this.fromList[1].id,
					recovery_id:this.fromList[2].id,
					price_min:this.min||0,
					price_max:this.max||0,
					date_min:this.start||0,
					date_max:this.end||0,
					page:this.page
				}).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							this.last_page=res.data.page_data.last_page;
							/* let filterData=res.data.page_data.good_data;
							this.list=filterData.filter(v=>{
								this.$set(v,'checked',false)
								return v.num_now > 0
							}); */
							this.list=res.data.page_data.good_data;
							this.list.map(v=>{
								return this.$set(v,'checked',false)
							});
						}else{
							let dataList=res.data.page_data.good_data.map(v=>{
								this.$set(v,'checked',false)
							});
							this.list=this.list.concat(dataList)
						}
						console.log(this.list);
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
						this.show=false;
					}
				})
			},
			/* 选择筛选 */
			choose(item,son,v){
				if(v==1&&item.selected!=son.id){
					this.getScreenCate(son.id);
				}else if(v==1&&item.selected==son.id){
					this.popupList[2].list=[];
					this.popupList[2].selected="";
				}
				if(item.selected==son.id||item.selected==son){
					item.selected="";
				}else{
					this.$set(item,'selected',son.id||son);
				}
			},
			/* 入库时间选择 */
			dateChange(e){
				console.log(e);
				this.start=e.startDate;
				this.end=e.endDate;
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.goodList=[];
				this.status='loading';
				this.getInfo();
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
				this.start='最早时间';
				this.end='最晚时间';
				this.min='';
				this.max='';
				this.clearGoodList()
			},
			// 选中某个复选框时，由checkbox时触发
			checkboxGroupChange(e) {
				this.selectedList=e;
			},
			doSelectedAll(){
				this.isSelectedAll ? this.unCheckedAll() :this.checkedAll()
			},
			// 全选
			checkedAll() {
				this.selectedList=this.list.map(val => {
					val.checked = true;
					return val.id;
				})
			},
			//取消全选
			unCheckedAll(){
				this.list.forEach(v=>{
					v.checked=false;
				});
				this.selectedList=[];
			},
			submit(){
				if(this.selectedList.length==0) return this.http.toast('请选择要移库的商品！');
				let goodsList=this.list.filter(v=>{
					return this.selectedList.indexOf(v.id) != -1
				})
				let data={
					list:goodsList,
					selectedList:this.selectedList,
					warehouseName:this.warehouseName,
					store_house_id:this.store_house_id,
					totalPrice:this.totalPrice,
					allNumber:this.allNumber
				}
				uni.navigateTo({url: `/pages/mine/WarehouseManagement/MoveTheLibrary/nextStep?data=${encodeURIComponent(JSON.stringify(data))}`});
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
