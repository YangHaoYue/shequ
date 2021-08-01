<template>
	<view>
		<u-sticky>
			<view class="u-flex bg-white">
				<block v-for="(item,index) in navList.list" :key="index">
					<view class="u-p-60 u-flex-1 u-text-center solid-right" @click="navChange(item.status)" :class="navList.currentIndex==item.status?'border-bottom':''">
						<view class="u-main-color u-m-b-15 text-bold">{{item.value}}</view>
						<view class="u-tips-color">{{item.title}}</view>
					</view>
				</block>
			</view>
		</u-sticky>
		
		<block v-for="(item,i) in list" :key="i">
			<u-gap height="10" bg-color="#F5F5F5"></u-gap>
			<view class="bg-white u-p-20 u-flex u-col-top" :class="index==0?'':'solid-top'" @click="navigateTo(item.good_id)">
				<u-image :src="http.resourceUrl()+item.pic+'?x-oss-process=sm_200X200'" width="199rpx" height="199rpx" :fade="false" :lazy-load="false" mode="scaleToFill"></u-image>
				<view class="u-m-l-20 flex" style="flex-direction: column;width: 490rpx;">
					<view class="u-line-1 text-bold text-black u-font-30 u-m-b-10">{{item.title||item.good_name}}</view>
					<view class="u-line-1 text-gray u-font-22 u-m-b-10">{{item.store_no}}</view>
					<u-tag :text="item.store_house_name+'/'+item.customer_name+'/'+item.type_from" type="info" mode="light" :closeable="false" size="mini" color="#A0A0A0" />
					<view class="u-flex u-row-between u-m-t-40">
						<view class="text-bold u-font-24">库存{{item.num_now}}<text v-if="navList.currentIndex!=0">|已盘{{item.num_check}}</text></view>
						<u-button :type="item.num_check>0?'info':'warning'" size="mini" v-if="navList.currentIndex==0&&can_check" @click="showM(item.good_id)">盘点</u-button>
						<view v-if="navList.currentIndex!=0&&!can_check"></view>
					</view>
				</view>
			</view>
			<u-gap height="10" bg-color="#F5F5F5"></u-gap>
		</block>
		
		<u-modal v-model="showModal" title="请输入盘点数量" confirm-color="#FE8702" :show-cancel-button="true" @confirm="confirm" @cancel="cancel">
			<view class="slot-content u-p-30">
				<u-input border type="number" v-model="number" placeholder="请输入盘点数量" inputAlign="center"></u-input>
			</view>
		</u-modal>
		
		<u-toast ref="uToast"></u-toast>
		
		<view class="round circle u-flex bg-grey text-xs text-white u-row-center" v-if="can_check" @click="scan"><text>扫码盘点</text></view>
		<!-- 加载更多 -->
		<view class="u-m-t-20 u-m-b-20" v-if="!(list.length<10&&status=='nomore')">
			<u-loadmore :status="status"/>
		</view>
		<u-mask :show="status=='loading'" :custom-style="{background:'rgba(0, 0, 0, 0)'}"></u-mask>
	</view>
</template>

<script>
	import goodList from '@/components/good-list/good-list.vue';
	export default {
		components:{
			goodList
		},
		onLoad(e) {
			this.stock_check_id=e.id;
			this.navList.currentIndex=e.type||0;
			this.getInfo();
		},
		onReachBottom() {
			if(this.page >= this.last_page) return ;
			this.status = 'loading';
			this.page = ++ this.page;
			setTimeout(() => {
				this.getInfo()
			}, 100)
		},
		data() {
			return {
				can_check:'',
				stock_check_id:'',
				navList:{
					currentIndex:0,
					list:[
						{title:'应盘',value:0,status:0},
						{title:'已盘',value:0,status:1},
						{title:'盘赢',value:0,status:2},
						{title:'盘亏',value:0,status:3},
					]
				},
				/* 列表 */
				last_page:"",
				page:1,
				list:[],
				/* 盘点Modal */
				showModal:false,
				stock_check_detail_id:'',
				good_id:'',
				number:1,
				//是否一直使用扫码盘点
				isUseScan:false,
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
				this.http.get('/api/v1/StockCheck/getStockCheckDetailLists',{
					stock_check_id:this.stock_check_id,
					type:this.navList.currentIndex,
					page:this.page
				},true).then((res)=>{
					if(res.code==1000){
						if(this.list.length==0){
							this.can_check=res.data.can_check;
							this.stock_check_id=res.data.stock_check_id;
							this.list=res.data.main.stock_check_detail_data;
							this.last_page=res.data.main.last_page;
							this.navList.list[0].value=res.data.top.top.num_should;
							this.navList.list[1].value=res.data.top.top.num_checked;
							this.navList.list[2].value=res.data.top.top.num_win;
							this.navList.list[3].value=res.data.top.top.num_lose;
						}else{
							this.list=this.list.concat(res.data.main.stock_check_detail_data)
						}
						if(this.page >= this.last_page) this.status = 'nomore';
						else this.status = 'loadmore';
					}
				})
			},
			/* 初始化数据 */
			clearGoodList(){
				this.show=false;
				this.page=1;
				this.last_page=1;
				this.list=[];
				this.status='loading';
				this.getInfo();
			},
			navChange(status){
				this.navList.currentIndex=status;
				this.clearGoodList();
			},
			navigateTo(good_id){
				uni.navigateTo({url: `/pages/home/queryManagement/goodDetail/goodDetail?id=${good_id}`});
			},
			/* 盘点 */
			showM(good_id){
				this.showModal=true;
				this.good_id=good_id;
			},
			cancel(){
				this.number=1;
				this.good_id='';
				this.showModal=false;
			},
			confirm(e){
				this.http.post('/api/v1/StockCheck/stoManualCheck',{
					stock_check_detail_id:this.stock_check_id,
					good_id:this.good_id,
					num:Number(this.number)
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							duration:1000
						});
						setTimeout(()=>{
							/* this.clearGoodList(); */
							if(this.isUseScan) this.scan();
						},1000)
						this.cancel();
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error"
						});
						this.cancel();
					}
				})
			},
			scan(){
				uni.scanCode({
					onlyFromCamera:true,
					success: (res) => {
						console.log(res);
						this.isUseScan = true;
						this.showM(res.result)
						// this.http.get('/api/v1/StockCheck/stoCheck',{
						// 	stock_check_id:res.stock_check_id,
						// 	good_id:res.good_id,
						// }).then((res)=>{
						// 	if(res.code==1000){
						// 		this.$refs.uToast.show({
						// 			title:res.msg,
						// 			type:"success"
						// 		});
						// 	}else{
						// 		this.$refs.uToast.show({
						// 			title:res.msg,
						// 			type:"error"
						// 		})
						// 	}
						// })
					},
					fail:(ref)=> {
						console.log(ref);
						this.isUseScan = false;
					}
				})
			}
}
	}
</script>

<style>
	.border-bottom{
		border-bottom: 2rpx solid #FE8702;
	}
	.circle{
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		bottom: 200rpx;
		right: 30rpx;
		z-index: 9999;
	}
</style>
