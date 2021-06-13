<template>
	<view>
		<u-sticky>
			<view class="bg-white u-p-30">
				<view>以下是{{customer_name||''}}的所有未结款商品</view>
				<view>总计{{info.good_num||0}}件,{{info.consign_num||0}}个商品SKU,总成本:{{info.total_cost_price||0}}元</view>
			</view>
		</u-sticky>
		<!-- 列表 -->
		<block v-for="(item,i) in goodList" :key="i">
			<u-gap height="10" bg-color="#F5F5F5"></u-gap>
			<good-list :item="item" :index="i" :length="orderList.length">
				<view slot="price" class="u-flex">
					<view class="text-bold u-font-36" style="color: #FE8702;">￥{{item.sell_price}}</view>
					<view class="u-font-28 u-m-l-10">成本价:￥{{item.cost_price}}</view>
				</view>
			</good-list>
			<view class="u-flex u-row-right u-p-10 solid-top" @click="selected(item.id)">
				<checkbox class='yellow' style="transform:scale(0.7)"
				 :class="selectedList.indexOf(item.id)!=-1?'checked':''" 
				 :checked="selectedList.indexOf(item.id)!=-1"></checkbox><text class="u-m-l-10">本次结款</text>
				<!-- <checkbox style="transform:scale(0.7)" :checked="selectedList.indexOf(item.id)!=-1" :color="'#FE8702'"></checkbox> -->
				<!-- <view class="u-p-20 u-font-14" :class="selectedList.indexOf(item.id)==-1?'nomal':'selected'" >本次结款</view> -->
			</view>
			<u-gap height="10" bg-color="#F5F5F5"></u-gap>
		</block>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(goodList.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
		<!-- 底部tab -->
		<view class="cu-tabbar-height"></view>
		<u-button class="saveBtn u-type-warning-bg" type="warning" :disabled="isBtn" @click="nextTip">下一步</u-button>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import goodList from '@/components/good-list/good-list.vue';
	export default {
		components:{
			goodList
		},
		onLoad(e) {
			this.customer_id=e.customer_id;
			this.getInfo();
		},
		computed: {
			isBtn() {
				return this.selectedList.length==0 
			}
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo();
			}, 100)
		},
		data() {
			return {
				customer_id:'',
				customer_name:'',
				info:'',
				/* 列表 */
				selectedList:[],
				
				last_page:'',
				page:1,
				goodList:[],
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
				this.http.get('/api/v1/Consign/customerConsignLogs',{
					customer_id:this.customer_id,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.goodList.length==0){
							this.customer_name=res.data.customer_name;
							this.info=res.data.main.top_data;
							this.goodList=res.data.main.consign_data;
							this.last_page=res.data.main.last_page;
						}else{
							this.goodList=this.goodList.concat(res.data.main.consign_data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error",
							back:true,
							duration:1500
						})
					}
				})
			},
			/* 选择结款订单 */
			selected(id){
				console.log(this.selectedList)
				let i=this.selectedList.indexOf(id);
				//之前是选中，取消选中
				if(i>-1){
					//移除选中列表中的当前tag
					return this.selectedList.splice(i,1);
				}
				//选中
				this.selectedList.push(id);
			},
			/* 下一步 */
			nextTip(){
				let list=this.goodList.filter(v=>{
					return this.selectedList.indexOf(v.id) != -1
				})
				let data={
					selectedList:this.selectedList,
					goodList:list,
					customer_name:this.customer_name
				};
				uni.redirectTo({url: `/pages/home/consSaleClosings/bulkClosings/bulkDetail?data=${encodeURIComponent(JSON.stringify(data))}`});
			}
		}
	}
</script>

<style scoped>
	.nomal{
		background-color: #FE8702;
		color: #FFFFFF;
	}
	.selected{
		background-color: #FFFFFF;
		color: #FE8702;
	}
</style>
