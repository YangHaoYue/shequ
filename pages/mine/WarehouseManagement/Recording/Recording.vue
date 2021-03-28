<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch">
			<!-- 搜索框 -->
			<view class="u-flex u-p-20">
				<u-search placeholder="搜索商品" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
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
									 :class="judge(item.selected,son.id)? 'brand-hover' : ''">{{son.cate_name||son.brand_name||son}}</view>
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
				<card headTitle="操作时间" :headBorderBottom="false" :headTitleWeight="false">
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
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 商品列表 -->
		<block v-for="(item,i) in goodList" :key="i">
			<good-list :item="item" :index="i" :length="goodList.length" :idType="true">
				<view slot="tag" class="text-sm text-gray">{{item.former_store_house_name}}>{{item.now_store_house_name}} 操作人:{{item.operate_user}}</view>
			</good-list>
		</block>
		<view class="u-m-t-80" v-if="goodList.length==0&&status=='nomore'" >
			<u-empty text="数据为空" mode="list"></u-empty>
		</view>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(goodList.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
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
		onLoad() {
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
			uni.$on('chooseWarehouse1',(data)=>{
				this.fromList[0].value=data.item.store_house_name;
				this.fromList[0].id=data.item.id
				uni.$off('chooseWarehouse1')
			});
			uni.$on('chooseWarehouse2',(data)=>{
				this.fromList[1].value=data.item.store_house_name;
				this.fromList[1].id=data.item.id
				uni.$off('chooseWarehouse2')
			});
			uni.$on('chooseEmployees1',(data)=>{
				this.fromList[2].value=data.item.name;
				this.fromList[2].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
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
				/* 搜索值 */
				keyword:'',
				/* 筛选弹出层 */
				show: false,
				popupList:[
					{name:'品牌',selected:"",isBrand:true,list:[]},
					{name:'一级分类',selected:"",isBrand:false,list:[]},
					{name:'二级分类',selected:"",isBrand:false,list:[]},
				],
				/* from表单 */
				fromList:[
					{type:'picker',name:'源仓库',value:'',id:'',url:'/pages/mine/WarehouseManagement/Recording/wareHouse/wareHouse?type=1',isImport:false},
					{type:'picker',name:'目标仓库',value:'',id:'',url:'/pages/mine/WarehouseManagement/Recording/wareHouse/wareHouse?type=2',isImport:false},
					{type:'picker',name:'操作人',value:'',id:'',url:'/pages/mine/WarehouseManagement/Recording/Employees/Employees?type=1',isImport:false},
				],
				/* 入库时间 */
				showDate:false,
				start:'',
				end:'',
				
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
				}
			}
		},
		methods: {
			getScreenData(){
				this.http.get('/api/v1/StoreHouse/getStoMoveLogScreenData',{},true).then((res)=>{
					if(res.code==1000){
						this.popupList[0].list=res.data.brand;
						this.popupList[1].list=res.data.top_cate;
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
				this.http.get('/api/v1/StoreHouse/stoMoveLogs',{
					keyword:this.keyword,
					brand_id:this.popupList[0].selected||0,
					top_cate_id:this.popupList[1].selected||0,
					cate_id:this.popupList[2].selected||0,
					former_store_house_id:this.fromList[0].id||0,
					now_store_house_id:this.fromList[1].id||0,
					operate_user_id:this.fromList[2].id||0,
					date_min:this.start||0,
					date_max:this.end||0,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.goodList=res.data.page_data.log_data;
							this.last_page=res.data.page_data.last_page;
						}else{
							this.goodList=this.goodList.concat(res.data.page_data.log_data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
						this.show=false;
					}
				})
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
