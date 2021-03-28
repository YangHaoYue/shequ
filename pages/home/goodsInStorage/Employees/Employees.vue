<template>
	<view>
		<block v-for="(item,index) in list" :key="index">
			<view class="u-p-20 u-p-t-25 u-p-b-25 solid-bottom" @click="choose(item)">
				{{item.name}}
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.getInfo();
			this.type=e.type;
		},
		data() {
			return {
				keyword:'',
				list:[]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/getScreenData').then((res)=>{
					if(res.code==1000){
						if(this.type==1){
							this.list=res.data.sto_user;
						}else if(this.type==2){
							this.list=res.data.recovery_user;
						}
					}
				})
			},
			choose(item){
				if(this.type==1){
					uni.$emit('chooseEmployees1',{item:item});
				}else if(this.type==2){
					uni.$emit('chooseEmployees2',{item:item});
				}
				uni.navigateBack({delta: 1});
			}
		}
	}
</script>

<style>

</style>
