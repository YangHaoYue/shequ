<template>
	<view>
		<u-grid :col="col" :border="false" hover-class="none">
			<block v-for="(item,index) in list" :key="index">
				<u-grid-item  bg-color="#FE8702" :index="index" @click="navItem(item.url)">
					<view class="u-flex text-bold u-font-36" style="color: #FFFFFF;">
						<view class="u-font-36">{{item.number}}</view>
						<!-- <u-count-to :end-val="item.number" :decimals="item.decimals" :duration="800" bold font-size="36" color="#fff"></u-count-to> -->
						<text class="u-font-sm">{{item.unit}}</text>
					</view>
					<view class="grid-text u-flex">
						<text>{{item.label}}</text>
						<u-icon name="arrow-rightward" color="#fff" v-if="item.isNav"></u-icon>
					</view>
				</u-grid-item>
			</block>
		</u-grid>
	</view>
</template>

<script>
	export default {
		props: {
			col:{
				type:Number,
				default:4
			},
			list: {
				type: Array
			},
			urlData:{
				type:Object
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			navItem(link){
				uni.navigateTo({url: link+'?urlData='+encodeURIComponent(JSON.stringify(this.urlData))});
			}
		}
	}
</script>

<style scoped>
	.grid-text {
		font-size: 28rpx;
		margin-top: 12rpx;
		color: #FFFFFF;
	}
</style>
