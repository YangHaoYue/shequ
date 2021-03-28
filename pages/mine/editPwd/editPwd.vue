<template>
	<view>
		<view class="solid-bottom u-p-15">
			<u-input class="solid-bottom" type="text" v-model="oldPwd" placeholder="请输入原始密码"></u-input>
		</view>
		<view class="solid-bottom u-p-15">
			<u-input class="solid-bottom" type="text" v-model="newPwd" placeholder="请输入新密码"></u-input>
		</view>
		<view class="solid-bottom u-p-15">
			<u-input class="solid-bottom" type="text" v-model="checkPwd" placeholder="确认新密码"></u-input>
		</view>
		<view class="u-p-20">
			<u-button type="warning" class="u-m-20" @click="submit">确认</u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPwd:'',
				newPwd:'',
				checkPwd:'',
			}
		},
		methods: {
			submit(){
				if(this.newPwd !== this.checkPwd){
					this.$refs.uToast.show({
						title:'新密码两次输入不正确，请检查！',
						type:"error"
					})
					return
				}else{
					this.http.get('/api/v1/Auth/editPwd',{
						origin:this.oldPwd,
						pwd:this.newPwd
					}).then(res=>{
						if(res.code==1000){
							this.$refs.uToast.show({
								title:res.msg,
								type:"success"
							});
							uni.clearStorage();
							uni.reLaunch({url:'/pages/login/login'})
						}else{
							this.$refs.uToast.show({
								title:res.msg,
								type:"error"
							})
						}
					})
				}
			}
		}
	}
</script>

<style>

</style>
