<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 flex solid-bottom" style="flex-direction: column;height: 120rpx;" @click="chooseFineness(item)">
				<view class="u-type-warning" style="margin-bottom: auto;">{{item.label}}</view>
				<view class="text-sm">{{item.desc}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo()
		},
		data() {
			return {
				list:[
					{label:'全新品',desc:'全新品 全套附件',id:0},
					{label:'闲置品',desc:'未使用物品 仅存放痕迹或极轻微使用痕迹',id:1},
					{label:'二手物品',desc:'有不同程度使用感或破损以及存放痕迹',id:2}
				]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/getScreenData').then((res)=>{
					if(res.code==1000){
						// this.list=res.data.
					}
				})
			},
			chooseFineness(item){
				uni.$emit('chooseFineness',{item:item});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
