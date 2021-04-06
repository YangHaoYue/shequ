.toString()<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch u-p-t-20">
			<!-- 搜索框 -->
			<view class="u-flex u-p-l-20 u-p-r-20">
				<u-search placeholder="商品关键词(可多个)、编号、店铺编号" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
			</view>
			<!-- 顶部信息 -->
			<top-nav :list="navList"></top-nav>
		</view>
		<!-- 排序条件 -->
		<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
			<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center" v-for="(item,index) in screen.list" :key="index" @click="changeScreen(item)">
				<text :class="item.status==screen.currentIndex?'u-type-warning':''">{{item.name}}</text>
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
					<form-list :item="item" :index="k" formPadding="u-p-20"></form-list>
				</block>
			</scroll-view>
			<!-- 按钮 -->
			<view class="u-flex u-abso popupUi">
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="none" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 列表 -->
		<scroll-view scroll-y :style="'height:'+scrollHeight+'px;'" @scrolltolower="scrolltolower" lower-threshold="70">
			<block v-for="(item,i) in goodList" :key="i">
				<u-gap height="10" bg-color="#F5F5F5"></u-gap>
				<good-list :item="item" :index="i" :length="orderList.length" :idType="true">
					<view slot="price" class="text-bold u-font-24" style="color: #FE8702;">定金:￥{{item.book_money}}</view>
					<u-tag slot="tag" :text="item.customer_type+'/'+item.customer_name" type="info" mode="light" :closeable="false" size="mini" color="#A0A0A0" />
				</good-list>
				<view class="u-flex u-row-between u-p-10 u-p-l-20 u-p-r-20 solid-top" v-if="screen.currentIndex==0">
					<u-checkbox v-model="item.checked" active-color="#FE8702" @change="book($event,item,i)">合并开单</u-checkbox>
					<view>
						<u-button class="u-m-r-15" type="default" size="mini" @click="cancel(item.id)">取消预订</u-button>
						<u-button class="u-m-l-15" type="warning" size="mini" @click="open(item.id)">正式开单</u-button>
					</view>
				</view>
				<u-gap height="10" bg-color="#F5F5F5"></u-gap>
			</block>
			<!-- 底部Tabbar -->
			<view class="cu-tabbar-height" v-if="isShowTab&&screen.currentIndex===0"></view>
			<view class="saveBtn u-text-center bg-white u-flex  solid-top u-p-l-20" :class="showCheckAll?'u-row-between':'u-row-right'" v-if="isShowTab&&screen.currentIndex===0">
				<u-checkbox v-if="showCheckAll" v-model="checkedAll" active-color="#FE8702" @change="bookAll">全选</u-checkbox>
				<view class="u-p-25 u-p-l-50 u-p-r-50 text-white" style="background-color: #FE8702;" @click="bookOrders">合并开单</view>
			</view>
			<!-- 数据为空 -->
			<view class="u-m-t-80" v-if="goodList.length==0&&status=='nomore'" >
				<u-empty text="数据为空" mode="list"></u-empty>
			</view>
			<!-- 加载更多 -->
			<view class="u-m-t-20 u-m-b-20" v-if="!(goodList.length<3&&status=='nomore')">
				<u-loadmore :status="status"/>
			</view>
		</scroll-view>
		
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<u-toast ref="uToast"></u-toast>
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
			this.scrollHeight=this.$u.sys().windowHeight-uni.upx2px(300);
			this.getScreenData();
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseCustomer',(data)=>{
				this.fromList[0].value=data.item.name;
				this.fromList[0].id=data.item.id;
				uni.$off('chooseCustomer')
			});
			uni.$on('chooseSeller',(data)=>{
				this.fromList[1].value=data.item.name;
				this.fromList[1].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
		},
		computed: {
			isShowTab() {
				return this.book_order_ids.length === 0?false:true 
			},
			checkedAll:{
				  get(){
					 return this.goodList.every(v=>{
					 	return v.checked===true
					 })
				  },
				  set(val){
				  }
			},
			showCheckAll() {
				return this.fromList[0].id!=''?true:false
			}
		},
		onPullDownRefresh() {
			this.clearGoodList();
		},
		data() {
			return {
				scrollHeight:0,
				/* 合并开单数组 */
				customer_id:'',//客户id
				book_order_ids:[],
				/* 搜索值 */
				keyword:'',
				/* 顶部导航栏 */
				navList:[
					{label:'定金金额',number:0,unit:'元',url:'',isNav:false,decimals:2},
					{label:'件数',number:0,unit:'件',url:'t',isNav:false,decimals:0},
					{label:'人数',number:0,unit:'个',url:'',isNav:false,decimals:0},
					{label:'商品数',number:0,unit:'种',url:'',isNav:false,decimals:0}
				],
				/* 顶部筛选 */
				screen:{
					currentIndex:0,
					list:[
						{name:'待开单',status:0},
						{name:'已开单',status:1},
					]
				},
				/* 筛选弹出层 */
				show: false,
				popupList:[
					{name:'品牌',selected:"",isBrand:true,list:[]},
					{name:'一级分类',selected:"",isBrand:false,list:[]},
					{name:'二级分类',selected:"",isBrand:false,list:[]},
				],
				/* from表单 */
				fromList:[
					{type:'picker',name:'相关客户',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:false},
					{type:'picker',name:'销售员',value:'',id:'',url:'/pages/home/bookingManagement/Employees/Employees',isImport:false}
				],
				/* 列表 */
				page:1,
				last_page:1,
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
				this.http.get('/api/v1/BookOrder/getBookScreenData',{},true).then((res)=>{
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
				this.http.get('/api/v1/BookOrder/bookOrderLogs',{
					keyword:this.keyword,
					status:this.screen.currentIndex,
					brand_id:this.popupList[0].selected.toString()||0,
					top_cate_id:this.popupList[1].selected.toString()||0,
					cate_id:this.popupList[2].selected.toString(),
					customer_id:this.fromList[0].id,
					seller_id:this.fromList[1].id,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.goodList=res.data.main.book_data||[];
							this.last_page=res.data.main.last_page||1;
							this.navList[0].number=res.data.top.total_price.value;
							this.navList[1].number=res.data.top.book_num;
							this.navList[2].number=res.data.top.book_cus_num;
							this.navList[3].number=res.data.top.book_good_num;
							this.navList[0].unit=res.data.top.total_price.unit
						}else{
							res.data.main.book_data.map(v=>{
								this.goodList.push(v)
							})
						}
						this.goodList.map(v=>{
							if(!v.hasOwnProperty('checked')){
								this.$set(v,'checked',false)
							}
						})
						console.log(this.goodList);
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
				this.goodList=[];
				this.status='loading';
				this.book_order_ids=[];
				this.customer_id='';
				this.getInfo();
				uni.stopPullDownRefresh();
			},
			/* 排序 */
			changeScreen(item){
				this.screen.currentIndex=item.status;
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
				this.clearGoodList();
			},
			/* 取消预定 */
			cancel(id){
				this.http.modal('警告','是否取消此预定？',true,(e)=>{
					if(e){
						this.http.get('/api/v1/BookOrder/cancelBook',{
							book_order_id:id
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
			},
			/* 合并开单全选 */
			bookAll(e){
				if(e.value){
					let list=[];
					this.goodList.forEach(v=>{
						v.checked = true;
						list.push(v.id)
					});
					this.book_order_ids = list
				}else{
					this.goodList.forEach(v=>{
						v.checked = false;
					});
					this.book_order_ids = [];
				}
			},
			/* 选择合并的订单 */
			book(e,item,i){
				if(!this.customer_id){
					this.customer_id = item.customer_id
				}
				
				if(e.value&&item.customer_id === this.customer_id){
					this.book_order_ids.push(item.id)
				}else if(!e.value&&item.customer_id === this.customer_id){
					let index = this.book_order_ids.indexOf(item.id);
					this.book_order_ids.splice(index,1);
				}else if(e.value&&item.customer_id != this.customer_id){
					setTimeout(()=>{
						this.$set(item, 'checked', false);
						console.log('settimeout');
					},50)
					this.$refs.uToast.show({
						title:"请选择同一客户的预订单！",
						type:"error"
					});
				}
				if(this.book_order_ids.length==0){
					this.customer_id = '';
				}
			},
			/* 合并开单 */
			bookOrders(){
				this.http.modal('警告','前往开单后，这些预定记录将立即更改为已开单，是否前往？',true,(e)=>{
					if(e){
						uni.navigateTo({url: '/pages/home/salesBilling/salesBilling?book_order_ids='+JSON.stringify(this.book_order_ids)});
					}
				},'#FE8702')
			},
			/* 开单 */
			open(id){
				this.http.modal('警告','前往开单后，此预定记录将立即更改为已开单，是否前往？',true,(e)=>{
					if(e){
						uni.navigateTo({url: '/pages/home/salesBilling/salesBilling?book_order_ids='+JSON.stringify([id])});
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
