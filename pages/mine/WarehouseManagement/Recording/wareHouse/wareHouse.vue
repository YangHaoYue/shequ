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
		onLoad(e) {
			this.type=e.type;
			this.getInfo();
		},
		data() {
			return {
				keyword:'',
				type:'',
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
				if(this.type==1){
					uni.$emit('chooseWarehouse1',{item:item});
				}else if(this.type==2){
					uni.$emit('chooseWarehouse2',{item:item});
				}
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
