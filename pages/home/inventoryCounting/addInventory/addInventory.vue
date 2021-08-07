<template>
	<view>
		<checkbox-group class="uni-list" @change="checkboxGroupChange">
			<label class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom u-flex" v-for="(item, index) in list" :key="index">
				<checkbox class="orange" :value="item.id" :checked="item.checked" style="transform:scale(0.7);"></checkbox>
				<view class="u-m-l-20">{{item.name}}</view>
			</label>
		</checkbox-group>
		
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn bg-white solid-top u-flex u-row-between">
			<label @click="checkedAll">
				<u-checkbox class="u-flex u-m-l-20" v-model="isSelectedAll" shape="circle" active-color="#FE8702">全选</u-checkbox>
			</label>
			<view class="u-p-25 u-p-l-50 u-p-r-50 text-white" style="background-color: #FE8702;" @click="choose">添加盘点</view>
		</view>
		
		<view class="round circle u-flex bg-orange text-xs text-white u-row-center" @click="toAddWarehouse"><text>添加仓库</text></view>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		data() {
			return {
				keyword:'',
				list:[],
				selectedList:[]
			}
		},
		computed: {
			isSelectedAll:{
				get:function(){
					return this.list.length === this.selectedList.length
				},
				set:function(){
				}
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/StockCheck/getStoHouseLists').then((res)=>{
					if(res.code==1000){
						this.list=res.data.map(v=>{
							return{
								name: v.store_house_name,
								checked: false,
								id:v.id
							}
						});
					}
				})
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.selectedList = e.detail.value;
			},
			// 全选
			checkedAll() {
				this.selectedList = []
				this.list.map(val => {
					val.checked = true;
					this.selectedList.push(val.id)
				})
			},
			toAddWarehouse(){
				uni.navigateTo({url: '/pages/home/inventoryCounting/addWarehouse/addWarehouse'});
			},
			choose(item){
				this.http.modal('提示','是否创建自定义盘点？',true,(e)=>{
					if(e){
						this.http.post('/api/v1/StockCheck/createStockCheck',{
							store_house_ids:this.selectedList
						}).then((res)=>{
							if(res.code==1000){
								uni.$emit('icBack',true)
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
	.circle{
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 200rpx;
		right: 30rpx;
		z-index: 9999;
	}
</style>
