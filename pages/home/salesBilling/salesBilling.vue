<template>
	<view>
		<u-cell-group>
			<navigator open-type="navigate" url="/pages/home/salesBilling/customerList/customerList">
				<u-cell-item title="销售客户" :value="customer.name||''"></u-cell-item>
			</navigator>
			<u-cell-item title="结算方式" :value="settleWay" @click="showSettleList=true"></u-cell-item>
			<u-cell-item title="销售员" :value="salesman" @click="showSalesmanList=true"></u-cell-item>
			<u-cell-item title="销售途径" :value="salesChannels" @click="showSalesChannelsList=true"></u-cell-item>
			<u-cell-item title="配送方式" :value="delivery" @click="showDeliveryList=true"></u-cell-item>
			<u-cell-item title="销售时间" :value="date" @click="showDate=true"></u-cell-item>
		</u-cell-group>
		<!-- 快递单号图片 -->
		<view class="u-p-30 solid-bottom" v-if="delivery_id==2">
			<view class="u-flex u-p-b-20">
				<view class="u-m-r-20">快递面单照</view>
			</view>
			<u-upload ref="uUpload" :action="action" :file-list="fileList" :show-progress="true" :header="header"
			:deletable="true" height="170rpx" :max-count="1" @on-list-change="onListChange">
			</u-upload>
		</view>
		<!-- 积分 -->
		<view class="u-flex u-row-between u-p-30 solid-bottom" v-if="integral_on!=0">
			<view>
				<view>积分兑换</view>
				<view class="text-sm text-gray">客户拥有积分：{{integral}},可抵扣{{integral_yuan||0}}元</view>
			</view>
			<input adjust-position="true" :disabled="edit_good_data==0" class="u-text-right" v-model="user_integral" type="number" placeholder="输入积分数量" />
		</view>
		<!-- 销售商品 -->
		<view class="u-p-l-30 u-p-t-30 u-p-r-30">
			<view class="u-flex u-row-between u-p-b-30">
				<view>销售商品(右滑删除商品)</view>
				<navigator open-type="navigate" v-if="edit_good_data==1" url="/pages/home/salesBilling/goodsList/goodsList" class="u-p-l-10 u-p-r-10 u-p-t-5 addIcon" >
					<u-icon name="plus" color="#fff" size="22rpx"></u-icon>
				</navigator>
			</view>
			
			
			<view class="cu-list menu-avatar">
				<view class="cu-item" style="height: 100% !important;" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in goodsList" :key="index" v-if="goodsList.length!=0"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
					<view class="bg-white u-p-t-20 u-p-b-20 u-flex u-col-top solid-bottom">
						<u-image :src="http.resourceUrl()+item.pic" width="159rpx" height="159rpx" ></u-image>
						<view class="u-m-l-20 flex" style="flex-direction: column;width: 510rpx;">
							<view class="u-line-1 text-bold text-black u-font-30 u-m-b-20">{{item.title}}</view>
							<view class="u-line-1 text-gray u-font-22" style="margin-bottom: auto;">{{item.store_no}} / {{item.date_in}}</view>
							<view class="u-flex u-row-between u-m-t-20 text-black">
								<view class="text-bold u-font-36 u-flex">
									<text>￥</text>
									<u-input v-model="item.cost_price" :disabled="edit_good_data==0" placeholder="请输入价格" style="width: 200rpx;" height="80rpx" type="digit" border></u-input>
								</view>
								<u-number-box v-model="item.number" :disabled="edit_good_data==0"></u-number-box>
							</view>
						</view>
					</view>
					<view class="move">
						<view class="bg-red" @click="delet(index)">删除</view>
					</view>
				</view>
			</view>
			
			<!-- <block v-for="(item,index) in goodsList" :key="index" v-if="goodsList.length!=0">
				<view class="bg-white u-p-t-20 u-p-b-20 u-flex u-col-top solid-bottom">
					<u-image :src="http.resourceUrl()+item.pic" width="159rpx" height="159rpx" ></u-image>
					<view class="u-m-l-20 flex" style="flex-direction: column;width: 510rpx;">
						<view class="u-line-1 text-bold text-black u-font-30 u-m-b-20">{{item.title}}</view>
						<view class="u-line-1 text-gray u-font-22" style="margin-bottom: auto;">{{item.store_no}} / {{item.date_in}}</view>
						<view class="u-flex u-row-between u-m-t-20 text-black">
							<view class="text-bold u-font-36 u-flex">
								<text>￥</text>
								<u-input v-model="item.cost_price" :disabled="edit_good_data==0" placeholder="请输入价格" style="width: 200rpx;" height="80rpx" type="digit" border></u-input>
							</view>
							<u-number-box v-model="item.number" :disabled="edit_good_data==0"></u-number-box>
						</view>
					</view>
				</view>
			</block> -->
			<view class="u-flex u-row-between u-p-t-30 u-p-b-30 solid-bottom" v-if="goodsList.length!=0">
				<view>调整后总价</view>
				<view>￥{{totalPrice}}</view>
			</view>
			<view class="u-flex justify-end u-p-t-30 u-p-b-30" v-if="goodsList.length!=0">
				<view>共{{totalNumber}}件</view>
				<view>￥{{totalPrice}}</view>
			</view>
		</view>
		<!-- 间隔槽/订单备注 -->
		<u-gap height="30" bg-color="#F5F5F5"></u-gap>
		<view class="u-p-30 solid-bottom">
			<u-input v-if="showTextArea" type="textarea" :focus="true" @blur="hideTextArea" @confirm="hideTextArea"
			height="100"  v-model="textAreaValue" placeholder="请填写综合描述(留空，自动生成描述)"></u-input>
			<view class="u-p-t-6" style="height: 100rpx;" :style="{'color':textAreaValue==''?'#CCC4CF':'#333333'}" v-else @click="inputTextArea">{{textAreaValue||"请填写综合描述(留空，自动生成描述)"}}</view>
		</view>
		<u-gap height="30" bg-color="#F5F5F5"></u-gap>
		<!-- 底部Tabbar -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn u-text-center bg-white u-flex u-row-between solid-top">
			<view class="u-p-25">合计<text class="u-font-30 u-type-error">￥{{totalPrice}}</text></view>
			<view class="u-p-25 u-p-l-50 u-p-r-50 text-white" style="background-color: #FE8702;" v-if="order_id==0" @click="submit">开单</view>
			<view class="u-p-25 u-p-l-50 u-p-r-50 text-white" style="background-color: #FE8702;" v-else @click="setting">编辑</view>
		</view>
		
		<!-- 消息提示 -->
		<u-toast ref="uToast" />
		
		<u-select v-model="showSalesmanList" confirmColor="#FE8702" value-name="id" label-name="name" mode="single-column" :list="salesmanList" @confirm="chooseSalesman"></u-select>
		<u-select v-model="showSettleList" confirmColor="#FE8702" value-name="id" label-name="val" mode="single-column" :list="settleList" @confirm="chooseSettle"></u-select>
		<u-select v-model="showSalesChannelsList" confirmColor="#FE8702" value-name="id" label-name="val" mode="single-column" :list="salesChannelsList" @confirm="chooseChannelsList"></u-select>
		<u-select v-model="showDeliveryList" confirmColor="#FE8702" value-name="id" label-name="val" mode="single-column" :list="deliveryList" @confirm="choosedDelivery"></u-select>
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="date" @change="dateChange" :min-date="toDay" max-date="2050-12-31"></u-calendar>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			if(e.book_order_ids){
				this.book_order_ids=JSON.parse(e.book_order_ids);
			}
			this.good_id=e.good_id||0;
			this.order_id=e.order_id||0;
			var ti= new Date();
			this.toDay=this.http.dateFormat("YYYY-mm-dd",ti);
			this.date=this.toDay
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseCustomer',(data)=>{
				this.customer=data.item;
				this.getIntegralByCustomerId(data.item.id);
				uni.$off('chooseCustomer')
			})
			uni.$on('salesGoods',(data)=>{
				let bool= this.goodsList.some(v=>{
					return v.id===data.item.id
				})
				this.$set(data.item,'number',1);
				if(!bool){
					this.goodsList.push(data.item);
				}
				uni.$off('salesGoods');
			})
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.goodsList.forEach((item)=>{
					total+=item.cost_price*100000000*item.number
				})
				return total/100000000
			},
			totalNumber() {
				var totalNum=0;
				this.goodsList.forEach((item)=>{
					totalNum+=item.number
				})
				return totalNum
			},
			integral_yuan() {
				return this.integral/this.integral_rate
			}
		},
		data() {
			return {
				book_order_ids:[0],
				good_id:'',
				order_id:'',
				
				customer:{
					name:'',
					id:'',
				},
				/* 积分 */
				user_integral:0,
				integral:0,
				integral_on:0,
				integral_rate:1,
				/* 结算方式 */
				settleWay:'',
				settleWay_id:'',
				showSettleList:false,
				settleList:[],
				/* 销售员 */
				salesman:'',
				seller_id:'',
				showSalesmanList:false,
				salesmanList:[],
				/* 销售途径 */
				salesChannels:'',
				salesChannels_id:'',
				showSalesChannelsList:false,
				salesChannelsList:[],
				/* 配送方式 */
				delivery:'',
				delivery_id:'',
				showDeliveryList:false,
				deliveryList:[],
				/* 快递单号 */
				action: 'https://shequ.0831.run/api/v1/Common/fileUploader',
				header:{'Authorization':'Bearer '+ this.http.getToken()},
				// 预置上传列表
				fileList: [],
				// fileList: [{
				// 	url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
				// 	error: false,
				// 	progress: 100
				// }],
				lists: [], // 组件内部的文件列表
				showPri_img:true,//显示隐私文件上传
				/* 销售日期 */
				toDay:'',
				date:'',
				showDate:false,
				/* 商品列表 */
				edit_good_data:'',//控制商品选择按钮
				modalName:'',//滑动
				listTouchStart: 0,
				listTouchDirection: null,
				goodsList:[],
				/* 备注 */
				showTextArea:false,
				textAreaValue:''
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/Order/getPreOrderInfo',{
					book_order_ids:this.book_order_ids,
					good_id:this.good_id||0,
					order_id:this.order_id||0
				},true).then((res)=>{
					if(res.code==1000){
						this.settleList=res.data.type_pay;
						this.salesmanList=res.data.seller;
						this.salesChannelsList=res.data.type_sale;
						this.deliveryList=res.data.type_send;
						
						this.edit_good_data=res.data.edit_good_data;
						
						this.integral_on=res.data.integral_on;
						this.integral_rate=Number(res.data.integral_rate);
						if(this.good_id!=0){
							this.goodsList=res.data.good_data.map(v=>{
								return this._formatData(v);
							});
						}
						res.data.type_pay.map(v=>{
							if(v.id==res.data.type_pay_id)
							this.settleWay=v.val
						})
						this.settleWay_id=res.data.type_pay_id;
						res.data.seller.map(v=>{
							if(v.id==res.data.seller_id)
							this.salesman=v.name
						})
						this.seller_id=res.data.seller_id;
						if(this.order_id!=0||this.book_order_ids.length!=0){
							this.customer.id=res.data.customer_arr.customer_id;
							this.customer.name=res.data.customer_arr.customer_name;
							res.data.type_sale.map(v=>{
								if(v.id==res.data.type_sale_id)
								this.salesChannels=v.val
							})
							this.salesChannels_id=res.data.type_sale_id;
							res.data.type_send.map(v=>{
								if(v.id==res.data.type_send_id)
								this.delivery=v.val
							})
							this.delivery_id=res.data.type_send_id;
							
							if(this.delivery_id==2){
								this.fileList.push({
									url: this.http.resourceUrl() + res.data.img_delivery,
									error: false,
									progress: 100
								})
							}
							this.textAreaValue=res.data.remark;
							this.goodsList=res.data.good_data.map(v=>{
								return this._formatData(v);
							});
						}
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error",
							back:true
						})
					}
				})
			},
			_formatData(e){
				return{
					pic:e.pic,
					title:e.good_name,
					num_now:e.num_now,
					id:e.id,
					cost_price:e.sell_price,
					date_in:e.created_at,
					store_no:e.store_no,
					number:e.buy_num||1
				}
			},
			/* 获取客户积分 */
			getIntegralByCustomerId(id){
				this.http.get('/api/v1/Common/getIntegralByCustomerId',{
					customer_id:id
				},true).then((res)=>{
					if(res.code==1000){
						this.integral=res.data.integral
					}
				})
			},
			/* 选择结算方式 */
			chooseSettle(e){
				this.settleWay=e[0].label;
				this.settleWay_id=e[0].value;
			},
			/* 选择销售员 */
			chooseSalesman(e){
				this.salesman=e[0].label;
				this.seller_id=e[0].value;
			},
			/* 选择销售途径 */
			chooseChannelsList(e){
				this.salesChannels=e[0].label;
				this.salesChannels_id=e[0].value;
			},
			/* 选择配送方式 */
			choosedDelivery(e){
				this.delivery=e[0].label;
				this.delivery_id=e[0].value;
			},
			/* 图片上传 */
			onListChange(lists) {
				console.log('onListChange', lists);
				this.lists = lists;
			},
			/* 日期 */
			dateChange(e){
				console.log(e)
				this.date=e.result;
			},
			/* 商品数据转化 */
			_formatGood(e){
				return{
					good_id:e.id,
					buy_num:e.number,
					sale_price:e.cost_price
				}
			},
			/* 显示testarea，并获取焦点 */
			inputTextArea(){
				this.showTextArea = true;
			},
			/* 隐藏textarea */
			hideTextArea(){
				this.showTextArea = false;
			},
			/* 开单 */
			submit(){
				let goods=this.goodsList.map(v=>{
					return this._formatGood(v);
				})
				this.http.post('/api/v1/Order/createOrder',{
					book_order_ids:this.book_order_ids,
					customer_id:this.customer.id,
					seller_id:this.seller_id,
					type_pay:this.settleWay_id,
					type_sale:this.salesChannels_id,
					type_send:this.delivery_id,
					date:this.date,
					integral:this.user_integral||0,
					remark:this.textAreaValue,
					good_data:goods,
					img_delivery:this.lists[0]&&this.lists[0].response.data.path||''
				}).then(res=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							back:true
						});
						uni.$emit('back',{
							back:true
						})
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error"
						})
					}
				})
			},
			/* 编辑 */
			setting(){
				let goods=this.goodsList.map(v=>{
					return this._formatGood(v);
				})
				console.log(this.lists);
				this.http.post('/api/v1/Order/editOrder',{
					order_id:this.order_id,
					customer_id:this.customer.id,
					seller_id:this.seller_id,
					type_pay:this.settleWay_id,
					type_sale:this.salesChannels_id,
					type_send:this.delivery_id,
					integral:this.user_integral||0,
					date:this.date,
					remark:this.textAreaValue,
					img_delivery:this.lists.length!=0?this.lists[0].response.data.path:'',
					good_data:goods
				}).then(res=>{
					if(res.code==1000){
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
			},
			
			delet(index){
				if(this.edit_good_data==0) return this.$refs.uToast.show({title:"编辑时不可删除商品！",type:"error"})
				this.goodsList.splice(index,1)
			},
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style scoped>
	.addIcon{
		background-color: #FE8702;
		border-radius: 15rpx;
		height: 42rpx;
		width: 42rpx;
	}
</style>
