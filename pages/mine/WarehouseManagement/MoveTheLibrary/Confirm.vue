<template>
	<view>
		<view class="u-p-30">
			<view class="u-p-b-30">将这些商品移至</view>
			<u-radio-group v-model="value" @change="radioGroupChange" width="100%" active-color="#FE8702">
				<u-radio v-for="(item, index) in list" :key="index" :name="item.id">
					{{item.store_house_name}}
				</u-radio>
			</u-radio-group>
		</view>
		
		<u-toast ref="uToast"></u-toast>
		<!-- 底部tab -->
		<view class="cu-tabbar-height"></view>
		<u-button class="saveBtn u-type-warning-bg" type="warning" @click="nextTip">确认移库</u-button>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.selectedList=JSON.parse(decodeURIComponent(e.selectedList))
			this.getInfo();
		},
		data() {
			return {
				selectedList:[],
				list: [],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 1,
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/StoreHouse/getAvailableSto',{
					good_ids:this.selectedList
				}).then((res)=>{
					if(res.code==1000){
						this.list=res.data.store_house_lists;
						this.value=this.list[0].id;
					}
				})
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				this.value=e;
			},
			nextTip(){
				this.http.post('/api/v1/StoreHouse/goodsMoveSto',{
					store_house_id:this.value,
					good_ids:this.selectedList
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							duration:1500
						});
						setTimeout(()=>{uni.navigateBack({delta: 3});},1500)
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
