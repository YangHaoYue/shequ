<template>
	<view>
		<!-- 列表 -->
		<block v-for="(item,i) in list" :key="i">
			<inventory-list :item="item" :index="index" topImg="/static/uiImg/yggl.png" :colorchange="true">
				<view slot="message">
					<view class="u-p-t-20 u-p-l-40 text-gray text-sm">员工人数:{{item.num_user}}</view>
				</view>
				<view slot="tab">
					<view class="u-p-t-20 u-p-l-40 text-gray text-sm">员工:{{item.user_str}}</view>
				</view>
			</inventory-list>
			<view class="u-flex u-row-right u-p-10 solid-top">
				<u-button class="u-m-r-15" :plain="false" type="info" size="mini" @click="setting(item.id)"><text class="u-p-l-20 u-p-r-20">编辑</text></u-button>
				<u-button class="u-m-l-15" type="warning" size="mini" @click="delet"><text class="u-p-l-20 u-p-r-20">删除</text></u-button>
			</view>
		</block>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<navigator open-type="navigate" url="/pages/mine/RoleManagement/addRole/addRole" hover-class="none">
			<view class="saveBtn bg-white solid-top u-p-30 u-text-center">+创建角色</view>
		</navigator>
	</view>
</template>

<script>
	import inventoryList from '@/components/inventory-list/inventory-list.vue';
	export default {
		components:{
			inventoryList
		},
		onShow() {
			this.list=[];
			this.getInfo();
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo();
			}, 1000)
		},
		data() {
			return {
				/* 列表 */
				last_page:1,
				page:1,
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
				this.http.get('/api/v1/Role/listsPage',{},true).then((res)=>{
					if(res.code==1000){
						this.list=res.data;
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}
				})
			},
			/* 编辑 */
			setting(id){
				uni.navigateTo({url: `/pages/mine/RoleManagement/addRole/addRole?role_id=${id}`});
			},
			/* 删除 */
			delet(){
				this.http.modal('提示','确认要删除该客户客户吗?',true,(e)=>{
					console.log(e);
				},'#FE8702')
			}
		}
	}
</script>

<style>

</style>
