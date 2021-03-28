<template>
	<view>
		<u-cell-group>
			<block v-for="(item,index) in list" :key="index">
				<u-cell-item :title="item.title" @click="toDetail(item.id)"></u-cell-item>
			</block>
		</u-cell-group>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		data() {
			return {
				page:1,
				last_page:'',
				list:[],
				/* 加载更多 */
				status: 'loading',
				iconType: 'flower',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				}
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Help/getList').then((res)=>{
					if(res.code=1000){
						if(this.list.length==0){
							this.list=res.data.data;
							this.last_page=res.data.last_page;
						}else{
							this.list=this.list.concat(res.data.data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}
				})
			},
			toDetail(id){
				uni.navigateTo({url: `/pages/mine/helpCenter/detail?id=${id}`});
			}
		}
	}
</script>

<style>

</style>
