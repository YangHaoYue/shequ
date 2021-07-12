.toString()<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch u-p-t-20">
			<!-- 搜索框 -->
			<view class="u-flex u-p-l-20 u-p-r-20">
				<u-search placeholder="输入关键词" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
			</view>
			<!-- 顶部信息 -->
			<top-nav :list="navList"></top-nav>
		</view>
		<!-- 排序条件 -->
		<u-sticky>
			<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
				<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center" v-for="(item,index) in screen.list" :key="index" @click="changeScreen(item)">
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
			</scroll-view>
			<!-- 按钮 -->
			<view class="u-flex u-abso popupUi">
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="none" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 订单列表 -->
		<scroll-view scroll-y :style="'height:'+scrollHeight+'px;'" @scrolltolower="scrolltolower" lower-threshold="70">
			<block v-for="(item,i) in goodList" :key="i">
				<u-gap height="10" bg-color="#F5F5F5"></u-gap>
				<view class="u-flex u-row-between u-p-20" v-if="item.status_pay==1">
					<view>{{item.type_pay}} 结款账号:{{item.consign_account}}</view>
					<view>{{item.customer_name}} {{item.created_at}}</view>
				</view>
				<good-list :item="item" :index="i" :length="orderList.length" :idType="true">
					<view slot="price" class="u-flex">
						<view class="text-bold u-font-36" style="color: #FE8702;">￥{{item.sell_price}}</view>
						<view class="u-font-28 u-m-l-10">成本价:￥{{item.cost_price}}</view>
					</view>
				</good-list>
				<view class="u-flex u-row-between u-p-10 solid-top" v-if="screen.currentIndex==0">
					<view class="u-m-l-10">买家:{{item.customer_name}}</view>
					<view class="u-flex u-row-right">
						<u-button class="u-m-r-15" type="primary" size="mini" @click="toBulk(item.customer_id)"><text class="u-p-l-20 u-p-r-20">批量</text></u-button>
						<u-button class="u-m-l-15" type="warning" size="mini" @click="payment(item.id)"><text class="u-p-l-20 u-p-r-20">结款</text></u-button>
					</view>
				</view>
				<view class="u-flex u-row-between u-p-20 solid-top u-line-1" v-if="item.status_pay==1">
					备注信息：{{item.consign_remark}}
				</view>
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
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
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
			uni.$on('chooseCustomer',(data)=>{
				this.fromList[0].value=data.item.name;
				this.fromList[0].id=data.item.id;
				uni.$off('chooseCustomer')
			});
			uni.$on('chooseEmployees2',(data)=>{
				this.fromList[1].value=data.item.name;
				this.fromList[1].id=data.item.id;
				uni.$off('chooseEmployees2')
			});
			uni.$on('back',()=>{
				setTimeout(()=>{
					this.clearGoodList();
				},2000)
				uni.$off('back')
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
				this.clearGoodList();
			}, 2000)
		},
		data() {
			return {
				scrollHeight:0,
				/* 搜索值 */
				keyword:'',
				/* 顶部导航栏 */
				navList:[
					{label:'金额',number:0,unit:'元',url:'',isNav:false,decimals:2},
					{label:'件数',number:0,unit:'件',url:'',isNav:false,decimals:0},
					{label:'人数',number:0,unit:'个',url:'',isNav:false,decimals:0},
					{label:'商品数',number:0,unit:'种',url:'',isNav:false,decimals:0}
				],
				/* 筛选 */
				screen:{
					currentIndex:0,
					list:[
						{name:'未结款',status:0},
						{name:'已结款',status:1},
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
					{type:'picker',name:'寄卖人',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:false},
					{type:'picker',name:'入库人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=2',isImport:false}
				],
				
				/* 列表 */
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
				this.http.get('/api/v1/Consign/getConsignScreenData',{},true).then((res)=>{
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
				this.http.get('/api/v1/Consign/consignLogs',{
					need_top_data:1,
					keyword:this.keyword,
					status_pay:this.screen.currentIndex,
					brand_id:this.popupList[0].selected.toString(),
					top_cate_id:this.popupList[1].selected.toString()||0,
					cate_id:this.popupList[2].selected.toString(),
					customer_id:this.fromList[0].id,
					sto_user_id:this.fromList[1].id,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.goodList=res.data.main.consign_data;
							this.last_page=res.data.main.last_page;
							this.navList[0].number=res.data.top.total_price.value;
							this.navList[1].number=res.data.top.total_num;
							this.navList[2].number=res.data.top.cus_num;
							this.navList[3].number=res.data.top.good_num;
							this.navList[0].unit=res.data.top.total_price.unit
						}else{
							res.data.main.consign_data.map(v=>{
								this.goodList.push(v)
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
				}, 50)
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.goodList=[];
				this.status='loading';
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
				});
				this.clearGoodList();
			},
			/* 批量结款 */
			toBulk(customer_id){
				uni.navigateTo({url: `/pages/home/consSaleClosings/bulkClosings/bulkClosings?customer_id=${customer_id}`});
			},
			/* 结款 */
			payment(id){
				uni.navigateTo({url: `/pages/home/consSaleClosings/bulkClosings/Payment?consign_ids=${encodeURIComponent(JSON.stringify(id))}`});
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
