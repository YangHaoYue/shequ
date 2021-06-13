.toString()<template>
	<view>
		<!-- 顶部搜索商品 -->
		<view class="topSearch u-p-20">
			<!-- 搜索框 -->
			<view class="u-flex">
				<u-search placeholder="请输入关键词" style="width: 100%;" @custom="clearGoodList" @search="clearGoodList" bg-color="#fff"
				 :show-action="keyword==''?false:true" v-model="keyword" shape="square" :action-style="{color:'#ffffff'}"></u-search>
				<u-image class="u-m-10" src="@/static/uiImg/sxicon.png" width="38rpx" height="40rpx" @click="show = true"></u-image>
			</view>
		</view>
		<!-- 排序条件 -->
		<view class="u-flex solid-bottom bg-white" style="height: 80rpx;">
			<view class="u-flex-1 u-flex u-text-center u-col-center u-row-center" v-for="(item,index) in screen.list" :key="index" @click="changeScreen(item)">
				<text :class="item.status==screen.currentIndex?'u-type-warning':''">{{item.name}}({{item.number}})</text>
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
									 :class="item.selected&&item.selected===son.id?'brand-hover':''">{{son.cate_name||son.brand_name||son.val}}</view>
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
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList()">确定</view>
			</view>
		</u-popup>
		<!-- 商品列表 -->
		<scroll-view scroll-y :style="'height:'+scrollHeight+'px;'" @scrolltolower="scrolltolower">
			<block v-for="(item,i) in goodList" :key="i">
				<good-list :item="item" :index="i" :length="goodList.length" :idType="true">
					<view slot="tag">
						<u-tag :text="item.tag_str" type="info" mode="light" :closeable="false" size="mini" color="#A0A0A0" />
						<view  class="u-flex">
							<view  class="text-bold u-font-36" style="color: #FE8702;">￥{{item.sell_price}}</view>
							<view  class="text-gray u-font-12 u-m-l-10">成本价￥{{item.cost_price}}</view>
						</view>
						<view class="u-flex u-row-between u-m-t-10">
							<view class="u-m-t-10 u-font-12">{{item.created_at}}</view>
							<view class="text-black">{{item.sub_tag_str}}</view>
						</view>
					</view>
					<view slot="foot"></view>
				</good-list>
				<view class="u-flex u-row-between u-p-20 solid-top u-line-1" v-if="screen.currentIndex==2">
					备注：{{item.remark}}
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
		
		<u-toast ref="uToast"></u-toast>
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
			if(e.recovery_id){
				this.screen.currentIndex=e.currentIndex;
				this.recovery_id=e.recovery_id;
				this.type_from_arr=JSON.parse(decodeURIComponent(e.type_from_arr))
			}
			if(e.store_house_id){
				this.screen.currentIndex=e.currentIndex;
				this.fromList[0].id=e.store_house_id;
			}
			if(e.good_id){
				this.screen.currentIndex=e.currentIndex;
				this.good_id=e.good_id
			}
			if(e.customer_id){
				this.screen.currentIndex=e.currentIndex;
				this.fromList[1].id=e.customer_id;
			}
			this.scrollHeight=this.$u.sys().windowHeight-uni.upx2px(180);
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
				scrollHeight:0,
				recovery_id:'',
				type_from_arr:'',
				good_id:'',
				/* 搜索值 */
				keyword:'',
				/* 顶部筛选 */
				screen:{
					currentIndex:0,
					list:[
						{name:'回收',status:0,number:0},
						{name:'寄售',status:1,number:0},
						{name:'改库存',status:2,number:0},
						{name:'改成本',status:3,number:0},
					]
				},
				/* 筛选弹出层 */
				show: false,
				popupList:[
					{name:'品牌',selected:"",isBrand:true,list:[]},
					{name:'一级分类',selected:"",isBrand:false,list:[]},
					{name:'二级分类',selected:"",isBrand:false,list:[]},
					{name:'来源',selected:"",isBrand:false,list:[]},
				],
				/* from表单 */
				fromList:[
					{type:'picker',name:'仓库',value:'',id:'',url:'/pages/home/goodsInStorage/Warehouse/Warehouse',isImport:false},
					{type:'picker',name:'相关客户',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:false},
					{type:'picker',name:'相关员工',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:false}
				],
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
				this.http.get('/api/v1/Index/getScreenData',{},true).then((res)=>{
					if(res.code==1000){
						this.popupList[0].list=res.data.brand;
						this.popupList[1].list=res.data.top_cate;
						this.popupList[3].list=res.data.type_from;
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
				this.http.post('/api/v1/History/searchIndex',{
					keyword:this.keyword,
					type_page:this.screen.currentIndex,
					
					good_id:this.good_id,
					recovery_id:this.recovery_id,
					type_from_arr:this.type_from_arr,
					
					brand_id:this.popupList[0].selected.toString(),
					top_cate_id:this.popupList[1].selected.toString()||0,
					cate_id:this.popupList[2].selected.toString(),
					type_from:this.popupList[3].selected.toString()||6,
					
					store_house_id:this.fromList[0].id||0,
					customer_id:this.fromList[1].id||0,
					user_id:this.fromList[2].id||0,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.goodList=res.data.main.good_data;
							this.last_page=res.data.main.last_page;
							if(this.screen.list[0].number==0){
								this.screen.list[0].number=res.data.top.num_rec;
							}
							if(this.screen.list[1].number==0){
								this.screen.list[1].number=res.data.top.num_cons;
							}
							if(this.screen.list[2].number==0){
								this.screen.list[2].number=res.data.top.num_edit_num;
							}
							if(this.screen.list[3].number==0){
								this.screen.list[3].number=res.data.top.num_edit_price;
							}
						}else{
							this.goodList=this.goodList.concat(res.data.main.good_data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error",
							back:true
						})
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
		}
	}
</script>

<style lang="scss">
	.topSearch{
		height: 100rpx;
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
