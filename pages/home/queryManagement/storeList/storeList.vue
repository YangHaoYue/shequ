<template>
	<u-index-list :scrollTop="scrollTop" activeColor="#FE8702">
		<view v-for="(item, index) in indexList" :key="index" v-if="item.list.length!=0">
			<u-index-anchor :index="item.name" />
			<view class="list-cell solid-bottom" v-for="(son,i) in item.list" :key="i" @click="chooseBrand(son)">
				{{son.store_name}}
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
				indexList: [{name:'*',list:[{id: 0,store_name: "全部店铺"}]}]
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods:{
			getInfo(){
				this.http.post('/api/v1/Common/getIndexStores',{},true).then((res)=>{
					if(res.code==1000){
						this.indexList[0].list.unshift({
							id:res.data.your_store_id,
							store_name:res.data.your_store_name
						})
						this.indexList=this.indexList.concat(res.data.index_stores);
						
					}
				})
			},
			chooseBrand(son){
				uni.$emit('chooseStore',{item:son});
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