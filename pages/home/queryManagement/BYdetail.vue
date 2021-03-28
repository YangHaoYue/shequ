<template>
	<view>
		<view class="bg-white u-p-20 u-flex solid-bottom" v-for="(item,index) in list" :key="index">
			<view class="u-m-r-10" style="color: #303133;">{{item.name}}</view>
			<u-input v-model="item.value" type="number" border></u-input>
			<view class="u-m-l-10">天</view>
		</view>
		<view class="saveBtn u-p-30 u-text-center" @click="save">保存</view>
		<u-toast ref="uToast"></u-toast>
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
					{name:'新品囤货',value:0},
					{name:'客户回收',value:0},
					{name:'客户寄售',value:0},
					{name:'同行寄售',value:0},
					{name:'同行回收',value:0},
					{name:'未知来源',value:0},
				]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/getGoodTimeUp').then((res)=>{
					if(res.code==1000){
						this.list[0].value=res.data.sto_new_goods;
						this.list[1].value=res.data.custo_recovery;
						this.list[2].value=res.data.custo_consign;
						this.list[3].value=res.data.peer_consign;
						this.list[4].value=res.data.peer_recovery;
						this.list[5].value=res.data.unknown;
					}
				})
			},
			save(){
				this.http.get('/api/v1/Index/setGoodTimeUp',{
					sto_new_goods:this.list[0].value,
					custo_recovery:this.list[1].value,
					custo_consign:this.list[2].value,
					peer_consign:this.list[3].value,
					peer_recovery:this.list[4].value,
					unknown:this.list[5].value,
				}).then(res=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							duration:1500,
							back:true
						})
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:'error'
						})
						this.islogin=false;
					}
				})
			}
		}
	}
</script>

<style>
</style>
