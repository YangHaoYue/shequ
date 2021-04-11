<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom" @click="choose(item)">
				{{item.val}}
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.list=uni.getStorageSync('goodsSourceData')
		},
		data() {
			return {
				keyword:'',
				list:[]
			}
		},
		methods: {
			getInfo(){
				/* this.http.get('/api/v1/Storage/getStoOption').then((res)=>{
					if(res.code==1000){
						this.list=res.data.type_from;
					}
				}) */
			},
			choose(item){
				uni.$emit('chooseSource',{item:item});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
