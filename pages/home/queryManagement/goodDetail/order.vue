<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-col-top solid-bottom">
			<u-image :src="http.resourceUrl()+goodDetail.img" width="226rpx" height="226rpx" ></u-image>
			<view class="u-m-l-20">
				<view class="u-line-3 text-bold text-black u-font-30">{{goodDetail.name}}</view>
				<view class="u-line-1 text-gray u-font-22 u-m-t-20">{{goodDetail.code}}<text class="u-m-l-10">{{goodDetail.storeName}}</text></view>
				<view class="u-m-t-40 u-flex u-row-between u-font-12">
					<!-- <view class="text-gray"><text class="text-sm">￥</text>{{goodDetail.price}}</view> -->
					<view class="text-gray">库存：{{goodDetail.number}}</view>
				</view>
			</view>
		</view>
		<!-- form表单 -->
		<block v-for="(item,k) in fromList" :key="k">
			<form-list :item="item" :index="k" @input="input"></form-list>
		</block>
		<!-- 描述 -->
		<view class="u-p-30 solid-bottom">
			<u-input type="textarea" v-model="textAreaValue" placeholder="可填写预定备注"></u-input>
		</view>
		<!-- 提示 -->
		<view class="u-p-30 text-sm text-gray">
			提示:商品预定后，将锁定对应库存知道转为销售单
		</view>
		
		<u-toast ref="uToast"></u-toast>
		
		<!-- 底部tab -->
		<view class="cu-tabbar-height"></view>
		<u-button type="warning" class="u-type-warning-bg saveBtn" @click="submit">创建预定</u-button>
	</view>
</template>

<script>
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			formList
		},
		onLoad(e) {
			this.goodId=e.good_id;
			this.goodDetail=JSON.parse(decodeURIComponent(e.goodDetail))
			console.log(this.goodDetail);
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseCustomer',(data)=>{
				this.fromList[0].value=data.item.name;
				this.fromList[0].id=data.item.id;
				uni.$off('chooseCustomer')
			});
			uni.$on('chooseEmployees1',(data)=>{
				this.fromList[3].value=data.item.name;
				this.fromList[3].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
		},
		data() {
			return {
				goodId:'',
				goodDetail:{
					img:'',
					name:'',
					code:'',
					storeName:'',
					order:0,
					number:1
				},
				/* from表单 */
				fromList:[
					{type:'picker',name:'销售客户',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:true},
					{type:'input',name:'支付定金',value:'',id:'',placeholder:'请输入支付定金',inputType:'digit',isImport:true},
					{type:'input',name:'预定数量',value:1,id:'',placeholder:'请输入预定数量',inputType:'number',isImport:true},
					{type:'picker',name:'销售员',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:true},
				],
				/* 备注 */
				textAreaValue:''
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/BookOrder/getGoodForBook',{
					good_id:this.goodId
				}).then((res)=>{
					if(res.code==1000){
						this.fromList[3].value=res.data.seller_arr.seller_name;
						this.fromList[3].id=res.data.seller_arr.seller_id;
					}
				})
			},
			/* 输入框 */
			input(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value)
			},
			submit(){
				this.http.post('/api/v1/BookOrder/book',{
					good_id:this.goodId,
					customer_id:this.fromList[0].id,
					book_money:this.fromList[1].value,
					num_book:this.fromList[2].value,
					seller_id:this.fromList[3].id,
					book_remark:this.textarea
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							back :true
						})
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error"
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
