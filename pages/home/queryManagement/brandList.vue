<template>
	<u-index-list :scrollTop="scrollTop" activeColor="#FE8702">
		<view v-for="(item, index) in indexList" :key="index">
			<u-index-anchor :index="item.name" />
			<view class="list-cell solid-bottom" v-for="(son,i) in item.list" :key="i" @click="chooseBrand(son)">
				{{son.brand_name}}
			</view>
		</view>
	</u-index-list>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		data() {
			return {
				scrollTop: 0,
				indexList: []
				
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			getInfo(){
				this.http.get('/api/v1/Common/getIndexBrands').then((res)=>{
					if(res.code==1000){
						this.indexList=res.data
					}
				})
			},
			chooseBrand(son){
				uni.$emit('chooseBrand',{item:son});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
</style>