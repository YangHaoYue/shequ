<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom" @click="choose(item)">
				{{item.name}}
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.getInfo();
			this.type=e.type;
		},
		data() {
			return {
				keyword:'',
				list:[]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/BookOrder/getBookScreenData').then((res)=>{
					if(res.code==1000){
						this.list=res.data.seller;
					}
				})
			},
			choose(item){
				uni.$emit('chooseSeller',{item:item});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
