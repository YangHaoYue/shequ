<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-col-top" :class="index==0?'':'solid-top'" @tap="navigateTo">
			<view style="width: 199rpx;height: 199rpx;background-size: 100% 100%;" :style="'background-image: url('+http.resourceUrl()+item.pic+');'">
				<view v-if="item.type_sell===1" class="imageType">已下架</view>
				<view v-if="item.type_sell===2" class="imageType">已预定</view>
				<view v-if="item.type_sell===3" class="imageType">已售罄</view>
			</view>
			<!-- <image :src="item.pic" mode="aspectFill" style="width: 199rpx;height: 199rpx;"></image> -->
			<!-- <u-image :src="http.resourceUrl()+item.pic" width="199rpx" height="199rpx" :fade="false" :lazy-load="false" mode="scaleToFill"></u-image> -->
			<view class="u-m-l-20 flex" style="flex-direction: column;width: 490rpx;">
				<view class="u-line-1 text-bold text-black u-font-30 u-m-b-10">{{item.title||item.good_name}}</view>
				<view class="u-line-1  u-font-22 u-m-b-10" style="color: #000000;" @tap.stop="copy">{{item.store_no}}</view>
				<slot name="tag">
					<u-tag :text="item.store_name||item.tag_str" type="info" mode="light" :closeable="false" size="mini" color="#A0A0A0" />
				</slot>
				<slot name="foot">
					<view class="u-flex u-row-between u-m-t-40">
						<slot name="price">
							<view class="text-bold u-font-36" style="color: #FE8702;">￥{{item.sell_price||item.price}}</view>
						</slot>
						<slot name="number">
							<view class="text-black">x{{item.num_now||item.num||item.book_num||0}}</view>
						</slot>
					</view>
				</slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item:Object,
			index:Number,
			length:Number,
			idType:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			navigateTo(){
				let id=new Number;
				if(this.idType){
					id=this.item.good_id
				}else{
					id=this.item.id
				}
				uni.navigateTo({url: `/pages/home/queryManagement/goodDetail/goodDetail?id=${id}`});
			},
			/* 复制粘贴 */
			copy(){
				uni.setClipboardData({
					data:this.item.store_no
				})
			}
		}
	}
</script>

<style>
	.imageType{
		text-align: center;
		/* opacity: 0.3; */
		background-color:rgba(1,0,0,0.4);
		color: #FFFFFF;
		padding: 10rpx 0;
		font-size: 24rpx;
		line-height: 1;
		margin-top: 155rpx;
	}
</style>
