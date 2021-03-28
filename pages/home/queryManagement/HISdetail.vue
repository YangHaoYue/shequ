<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" v-for="(item,index) in list" :key="index">
			<view style="color: #303133;">{{item.name}}</view>
			<u-count-to :start-val="0" :end-val="item.value" separator="," :duration="1500" :use-easing="true" font-size="36" color="#333333"></u-count-to>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.getInfo(JSON.parse(decodeURIComponent(e.urlData)));
		},
		data() {
			return {
				list:[
					{name:'在库商品数(件)',value:0},
					{name:'已售商品数(件)',value:0},
					{name:'历史总数(件)',value:0},
					{name:'退还商品数(件)',value:0},
				]
			}
		},
		methods: {
			getInfo(urlData){
				this.http.post('/api/v1/Index/topStoDetail',urlData,true).then((res)=>{
					if(res.code==1000){
						this.list[0].value=res.data.num_history_detail.num_now||0;
						this.list[1].value=res.data.num_history_detail.num_sold||0;
						this.list[2].value=res.data.num_history_detail.num_history||0;
						this.list[3].value=res.data.num_history_detail.num_return||0;
					}
				})
			}
		}
	}
</script>

<style>

</style>
