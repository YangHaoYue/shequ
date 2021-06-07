<template>
	<view class="u-p-30">
		<u-time-line>
			<u-time-line-item v-for="(item,index) in list" :key="index">
				<!-- 此处自定义了左边内容，用一个图标替代 -->
				<template v-slot:content>
					<view @click="toDetail(item.id)">
						<view class="u-order-desc">{{item.version_name}}</view>
						<view class="u-order-time">{{item.published_at}}</view>
					</view>
				</template>
			</u-time-line-item>
		</u-time-line>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo()
		},
		onReachBottom() {
			this.getInfo()
		},
		data() {
			return {
				page:1,
				last_page:'',
				list:[],
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/Auth/getVersionLists').then((res)=>{
					if(res.code=1000){
						if(this.list.length==0){
							this.list = res.data.version_data;
							this.last_page = res.data.last_page;
						}else{
							this.list=this.list.concat(res.data.version_data)
						}
					}
				})
			},
			toDetail(id){
				uni.navigateTo({url: 'detail?id='+id});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-node {
			width: 44rpx;
			height: 44rpx;
			border-radius: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #d0d0d0;
		}
		
		.u-order-title {
			color: #333333;
			font-weight: bold;
			font-size: 32rpx;
		}
		
		.u-order-desc {
			color: rgb(150, 150, 150);
			font-size: 28rpx;
			margin-bottom: 6rpx;
		}
		
		.u-order-time {
			color: rgb(200, 200, 200);
			font-size: 26rpx;
		}
</style>
