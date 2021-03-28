<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom" @click="choose(item)">
				{{item.store_house_name}}
			</view>
		</block>
		<navigator open-type="navigate" url="/pages/home/inventoryCounting/addWarehouse/addWarehouse" hover-class="none">
			<view class="saveBtn bg-white solid-top u-p-30 u-text-center">+添加仓库</view>
		</navigator>
		
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
				list:[]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/StockCheck/getStoHouseLists').then((res)=>{
					if(res.code==1000){
						this.list=res.data;
					}
				})
			},
			choose(item){
				this.http.modal('提示','是否创建自定义盘点？',true,(e)=>{
					if(e){
						this.http.get('/api/v1/StockCheck/createStockCheck',{
							store_house_id:item.id
						}).then((res)=>{
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
					}
				},'#FE8702')
			}
		}
	}
</script>

<style>

</style>
