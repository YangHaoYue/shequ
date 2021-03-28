<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom" @click="choose(item)">
				{{item.store_house_name}}
			</view>
		</block>
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
				this.http.get('/api/v1/Index/getScreenData').then((res)=>{
					if(res.code==1000){
						this.list=res.data.store_house;
					}
				})
			},
			choose(item){
				uni.$emit('chooseWarehouse',{item:item});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
