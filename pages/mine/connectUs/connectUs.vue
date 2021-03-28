<template>
	<view>
		<u-cell-group>
			<block v-for="(item,index) in list" :key="index">
				<u-cell-item :title="item.name" :value="item.value" @click="copy(item.value)"></u-cell-item>
			</block>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getInfo();
		},
		data() {
			return {
				list:[
					{name:'微信客服',value:''},
					{name:'公众号',value:''},
					{name:'客服邮箱',value:''},
					{name:'客服电话',value:''},
				]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Auth/getContactInfo').then((res)=>{
					if(res.code==1000){
						this.list[0].value=res.data.wechat;
						this.list[1].value=res.data.offical;
						this.list[2].value=res.data.email;
						this.list[3].value=res.data.mobile;
					}
				})
			},
			copy(value){
				uni.setClipboardData({
				    data: value,
				    success: function () {
				    }
				});
			}
		}
	}
</script>

<style>

</style>
