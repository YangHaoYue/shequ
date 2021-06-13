<template>
	<view>
		<view class="u-p-30 u-flex u-row-between u-font-12 solid-bottom bg-white">
			<view class="text-gray">订单号：{{order_no}}</view>
			<view class="text-black" v-if="status==0">已开单</view>
			<view class="text-black" v-if="status==1">已取消</view>
		</view>
		
		<block v-for="(item,i) in good_lists" :key="i">
			<navigator :url="`/pages/home/queryManagement/goodDetail/goodDetail?id=${item.id}`" open-type="navigate" hover-class="none">
				<view class="bg-white u-p-30 u-flex u-col-top solid-bottom">
					<u-image :src="http.resourceUrl()+item.pic+'?x-oss-process=sm_200X200'" width="159rpx" height="159rpx" ></u-image>
					<view class="u-m-l-20" style="width: 511rpx;">
						<view class="u-line-1 text-bold text-black u-font-30">{{item.title}}</view>
						<view class="u-line-1 text-gray u-font-22 u-m-t-20">{{item.store_no}}</view>
						<view class="u-flex u-row-between u-m-t-20">
							<view class="u-flex u-col-bottom" style="line-height: 1;">
								<view class="text-bold u-font-36 u-col-center" style="color: #FE8702;">￥{{item.sell_price}}</view>
								<view class="text-black u-m-l-10">x{{item.buy_num}}</view>
							</view>
							<u-button class="u-m-10" size="mini" plain type="warning" @click="showModal(item.id)">修改成本价</u-button>
						</view>
					</view>
				</view>
			</navigator>
		</block>
		<!-- 快递照 -->
		<view class="u-p-30 solid-bottom bg-white" v-if="img_delivery">
			<view class="u-flex u-m-b-10 u-flex-1" style="color: #A5A5A5;">快递面单照</view>
			<view class="u-flex u-flex-wrap u-row-left">
				<u-image show-menu-by-longpress @click="showImgDelivery" :src="http.resourceUrl()+img_delivery+'?x-oss-process=sm_200X200'" height="159rpx" width="159rpx" class="u-m-b-15 u-m-r-10"></u-image>
			</view>
		</view>
		<block v-for="(item,index) in priceList" :key="index">
			<view class="u-p-l-30 u-p-r-30 u-p-t-10 u-p-b-10 u-flex u-row-between bg-white">
				<view class="text-gray">{{item.name}}</view>
				<view class="text-black">{{item.price}}</view>
			</view>
		</block>
		
		<view class="u-p-30 u-m-b-10 u-flex u-row-right u-font-12 solid-bottom bg-white solid-top">
			<view class="text-gray">共{{totalNumber}}件 合计：<text class="u-type-error">￥{{totalPrice}}</text></view>
		</view>
		
		<block v-for="(item,i) in infoList" :key="i">
			<view class="u-p-30 u-flex u-row-between u-font-12 solid-bottom bg-white">
				<view class="text-gray">{{item.name}}</view>
				<view class="text-black">{{item.value}}</view>
			</view>
		</block>
		
		<u-toast ref="uToast"></u-toast>
		
		<u-modal v-model="show" title="请输入成本价" :show-cancel-button="true" confirm-text="确认修改" confirm-color="#FE8702" @confirm="editOrderCostPrice">
			<view class="slot-content u-p-15">
				<u-input border placeholder="请输入成本价" type="number" :focus="true" v-model="costPrice"></u-input>
			</view>
		</u-modal>
		
		<!-- 底部导航栏 -->
		<view class="cu-tabbar-height" v-if="status==0"></view>
		<view class="addTabBtn bg-white u-flex u-row-right u-text-center u-p-10" v-if="status==0">
			<!-- <u-button class="u-m-10" size="mini" plain type="warning" @click="show = true">修改成本价</u-button> -->
			<u-button class="u-m-10" size="mini" plain type="warning" @click="print">打印订单</u-button>
			<u-button class="u-m-10" size="mini" plain type="warning" @click="toSetting">修改订单</u-button>
			<u-button class="u-m-10" size="mini" plain type="warning" @click="cancelOrder">取消订单</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.order_id=e.id;
			this.order_no=e.order_no;
		},
		onShow() {
			this.getInfo();
		},
		computed: {
			totalNumber() {
				var totalNum=0;
				this.good_lists.forEach((item)=>{
					totalNum+=item.buy_num
				})
				return totalNum
			}
		},
		data() {
			return {
				order_no:'',//订单号
				status:1,//订单状态
				order_id:'',
				totalPrice:"",
				good_lists:[],
				/* 快递照 */
				img_delivery:'',
				priceList:[
					{name:'商品原总价',price:0},
					{name:'折扣后总价',price:0},
					{name:'积分抵扣',price:0},
					{name:'积分获得',price:0},
					{name:'成本价',price:0},
				],
				/* 商品信息列表 */
				infoList:[
					{name:'销售客户',value:''},
					{name:'结算方式',value:''},
					{name:'销售员',value:''},
					{name:'销售途径',value:''},
					{name:'配送方式',value:''},
					{name:'销售时间',value:''},
					{name:'备注',value:''},
				],
				/* 成本价格 */
				good_id:'',
				show:false,
				costPrice:''
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/OrderLog/getOrderDetail',{
					order_id:this.order_id
				},true).then((res)=>{
					if(res.code=1000){
						this.good_lists=res.data.good_lists;
						this.status=res.data.order_detail.status;
						this.img_delivery=res.data.order_detail.img_delivery;
						this.infoList[0].value=res.data.order_detail.customer;
						this.infoList[1].value=res.data.order_detail.type_pay;
						this.infoList[2].value=res.data.order_detail.seller;
						this.infoList[3].value=res.data.order_detail.type_sale;
						this.infoList[4].value=res.data.order_detail.type_send;
						this.infoList[5].value=res.data.order_detail.created_at;
						this.infoList[6].value=res.data.order_detail.remark;
						
						this.priceList[0].price='￥'+res.data.order_detail.price;
						this.priceList[1].price='￥'+res.data.order_detail.deduct_price;
						this.priceList[2].price='￥'+res.data.order_detail.integral_price;
						this.priceList[3].price=res.data.order_detail.integral_get;
						this.priceList[4].price='￥'+res.data.order_detail.cost_price;
						this.totalPrice=res.data.order_detail.deduct_price;
					}
				})
			},
			/* 显示快递单照 */
			showImgDelivery(){
				uni.previewImage({
					urls:[this.http.resourceUrl()+this.img_delivery]
				})
			},
			/* 打印 */
			print(){
				this.http.modal('提示','您要打印销售单吗？',true,(e)=>{
					if(e){
						this.http.get('/api/v1/Printer/goods',{
							type:1,//0商品信息打印1销售单
							order_no:this.order_id
						}).then((res)=>{
							if(res.code==1000){
								this.$refs.uToast.show({
									title:res.msg,
									type:"success"
								});
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
			/* 编译 */
			toSetting(){
				uni.navigateTo({url: `/pages/home/salesBilling/salesBilling?order_id=${this.order_id}`});
			},
			//显示编辑成本价modal
			showModal(id){
				this.good_id = id;
				this.show = true;
			},
			/* 编辑订单成本价 */
			editOrderCostPrice(){
				this.http.post('/api/v1/OrderLog/editGoodCostPrice',{
					good_id:this.good_id,
					cost_price:this.costPrice
				}).then((res)=>{
					if(res.code===1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success"
						});
						this.costPrice='';
						this.getInfo();
					}else{
						this.good_id = '';
						this.$refs.uToast.show({
							title:res.msg,
							type:"error"
						})
					}
				})
			},
			/* 取消订单 */
			cancelOrder(){
				this.http.modal('提示','是否取消订单？',true,(e)=>{
					if(e){
						this.http.get('/api/v1/Order/cancelOrder',{
							order_id:this.order_id
						}).then((res)=>{
							if(res.code==1000){
								uni.$emit('back')
								this.$refs.uToast.show({
									title:res.msg,
									type:"success",
									back:true
								});
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
	page{
		height: 100vh;
		background-color: #F5F5F5;
	}
	.addTabBtn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		box-shadow: -5px 0px 3px #F5F5F5 ;
	}
</style>
