.toString()<template>
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
									 :class="item.selected==son.id||item.selected==son?'brand-hover':''">{{son.cate_name||son.brand_name||son}}</view>
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
			</scroll-view>
			<!-- 按钮 -->
			<view class="u-flex u-abso popupUi">
				<view class="u-flex-1 u-text-center u-p-20 reset" hover-class="none" @click="reset">重置</view>
				<view class="u-flex-1 u-text-center u-p-20 msure" hover-class="none" @click="clearGoodList">确定</view>
			</view>
		</u-popup>
		<!-- 商品列表 -->
		<block v-for="(item,i) in goodList" :key="i">
			<good-list :item="item" :index="i">
				<view slot="price" class="text-black">￥{{item.sell_price}}  x{{item.num_last}}</view>
				<u-icon slot="number" name="plus-circle-fill" color="#FE8702" size="42rpx" @tap.stop="chooseGoods(item)"></u-icon>
			</good-list>
		</block>
		
		<u-toast ref="uToast"></u-toast>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(goodList.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
	</view>
</template>

<script>
	import goodList from '@/components/good-list/good-list.vue';
	import card from '@/components/card/card.vue';
	export default {
		components:{
			goodList,
			card
		},
		onLoad() {
			this.getScreenData();
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseWarehouse',(data)=>{
				this.fromList[0].value=data.item.store_house_name;
				this.fromList[0].id=data.item.id
				uni.$off('chooseWarehouse')
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
					{type:'picker',name:'仓库',value:'',id:'',url:'/pages/home/goodsInStorage/Warehouse/Warehouse',isImport:false},
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
				this.http.get('/api/v1/Order/getGoodListsForOrder',{
					keyword:this.keyword,
					brand_id:this.popupList[0].selected.toString(),
					top_cate_id:this.popupList[1].selected.toString()||0,
					cate_id:this.popupList[2].selected.toString(),
					store_house_id:this.fromList[0].id
				},true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.goodList=res.data.good_data;
							this.last_page=res.data.last_page;
						}else{
							this.goodList=this.goodList.concat(res.data.good_data)
						}
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
			/* 初始化数据 */
			clearGoodList(){
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
				this.clearGoodList();
			},
			/* 选择商品 */
			chooseGoods(item){
				if(item.num_last==0) return this.$refs.uToast.show({title:'库存为0，请选择其他商品！',type:'warning'});
				uni.$emit('salesGoods',{item:item})
				uni.navigateBack({delta: 1});
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
