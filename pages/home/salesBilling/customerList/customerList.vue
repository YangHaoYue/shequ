<template>
	<view>
		<view class="u-p-20 u-p-t-10 u-p-b-10 solid-bottom">
			<u-search placeholder="请输入姓名或客户代号" v-model="keywordValue" shape="square" @search="clearGoodList" @custom="clearGoodList"></u-search>
		</view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom" @click="choose(item)">
				{{item.name}}
			</view>
		</block>
		
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 底部Tabbar -->
		<view class="cu-tabbar-height"></view>
		<navigator open-type="navigate" url="/pages/home/salesBilling/customerList/addCustomer">
			<view class="saveBtn u-p-30 u-text-center"><u-icon name="plus"></u-icon>创建客户</view>
		</navigator>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		onShow() {
			uni.$on('back',()=>{
				this.clearGoodList();
				uni.$off('back');
			})
		},
		data() {
			return {
				type:'',
				keywordValue:'',
				baned_in:'',
				
				page:1,
				last_page:1,
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
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo();
			}, 1000)
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/Common/getCustomerLists',{
						page:this.page,
						keyword:this.keywordValue
					},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							this.list=res.data.customer.cus_data;
							this.last_page=res.data.customer.last_page;
						}else{
							this.list=this.list.concat(res.data.customer.cus_data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}
				})
			},
			/* 初始化数据 */
			clearGoodList(){
				this.page=1;
				this.last_page=1;
				this.list=[];
				this.status='loading';
				this.getInfo();
				/* this.http.get('/api/v1/Storage/searchCustomer',{
						page:this.page,
						keyword:this.keyword
					},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							this.list=res.data.customer.cus_data;
							this.last_page=res.data.customer.last_page;
						}else{
							this.list=this.list.concat(res.data.customer.cus_data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loading';
					}
				}) */
			},
			choose(item){
				uni.$emit('chooseCustomer',{item:item});
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
