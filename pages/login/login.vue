<template>
	<view class="container">
		<!-- 图片 -->
		<view class="u-p-20 u-p-t-80">
			<u-image showLoading="true" border-radius="25" width="100%" height="375rpx" :src="headImg" :fade="true" duration="450">
				<view class="tui-page-title u-p-t-80 u-p-t-80">登录</view>
			</u-image>
		</view>
		<view class="tui-form">
			<view class="tui-view-input">
				<view class="tui-cell-input">
					<u-input style="width: 100%;" borderColor="#ffffff" placeholderStyle="color: #ffffff;" v-model="mobile" type="text" border height="80" placeholder="账户"></u-input>
				</view>
				<view class="tui-cell-input">
					<u-input style="width: 100%;" borderColor="#ffffff" placeholderStyle="color: #ffffff;" v-model="password" type="password" height="80" border placeholder="密码"></u-input>
				</view>
			</view>
			<view class="tui-btn-box"><u-button type="warning" :loading="islogin" :disabled="disabled" :shadow="true" @click="login">登录</u-button></view>
			<navigator open-type="navigate" hover-class="none" url="/pages/login/register">
				<view class="text-white u-flex u-m-t-50 u-row-center u-font-30">我是店主，想要申请入驻<u-icon name="arrow-right" color="#eeeeee"></u-icon></view>
			</navigator>
		</view>
		
		<u-modal v-model="show" title="请求授权" content="请授权用户信息,拒绝授权可能无法接收到每日营收数据!" confirm-color="#FE8702">
			<button open-type="getUserInfo" class="u-reset-button" slot="confirm-button" @getuserinfo="getUserInfo">授权</button>
		</u-modal>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	computed: {
		disabled: function() {
			let bool = true;
			if (this.mobile && this.password) {
				bool = false;
			}
			return bool;
		}
	},
	data() {
		return {
			show:false,
			headImg:'',
			mobile: '',
			password: '',
			islogin:false
		};
	},
	onLoad() {
		this.getInfo();
		if(this.http.isLogin()){
			uni.switchTab({url:'../home/home'})
		}
	},
	methods: {
		getInfo(){
			this.http.get('/api/v1/Auth/getLoginTopImg',{},true).then((res)=>{
				if(res.code==1000){
					this.headImg=this.http.interfaceUrl()+'/'+res.data.login_top_img;//@/static/uiImg/loginheader.png
				}
			})
		},
		login(){
			this.islogin=true;
			this.http.post('/api/v1/Auth/login',{
				username:this.mobile,
				pwd:this.password
			},true).then((res)=>{
				if(res.code==1000){
					this.http.setUserInfo(res.data.token);
					this.show=res.data.need_openid;
					if(!this.show){
						this.$refs.uToast.show({
							title:'登陆成功',
							type:"success",
							url:'/pages/home/home',
							isTab:true,
							duration:1000,
						})
					}
				}else{
					this.$refs.uToast.show({
						title:res.msg,
						type:'error'
					})
					this.islogin=false;
				}
			})
		},
		getUserInfo(e){
			console.log(e)
			if(e.detail.userInfo){
				//用户按了允许授权按钮
				uni.login({
					provider:'weixin',
					success: (res) => {
						console.log(res)
						this.http.post('/api/v1/Auth/updateCode',{
							code:res.code,
							iv:e.detail.iv,
							data:e.detail.encryptedData
						},false).then((res)=>{
							if(res.code==1000){
								this.$refs.uToast.show({
									title:'授权成功',
									type:"success",
									url:'/pages/home/home',
									isTab:true,
									duration:1000,
								})
							}else{
								this.$refs.uToast.show({
									title:res.msg,
									type:'error',
									url:'/pages/home/home',
									isTab:true,
									duration:2000,
								})
							}
						})
					}
				})
			}
		}
	}
};
</script>

<style lang="scss">
.container {
	background-image: url(https://7368-shemei-6guz7hz29cfb1643-1304922154.tcb.qcloud.la/bg.png?sign=11aac08839b1fbd4f952e0ddfa4b7949&t=1612402858);
	height: 100vh;
	background-size: 100% 100%;
	background-repeat: no-repeat;
	.tui-status-bar {
		width: 100%;
		height: var(--status-bar-height);
	}

	.tui-header {
		width: 100%;
		padding: 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-page-title {
		width: 100%;
		font-size: 48rpx;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 42rpx;
		padding: 40rpx;
		box-sizing: border-box;
	}

	.tui-form {
		padding-top: 0rpx;

		.tui-view-input {
			width: 100%;
			box-sizing: border-box;
			padding: 0 40rpx;

			.tui-cell-input {
				width: 100%;
				display: flex;
				align-items: center;
				padding-top: 48rpx;
				padding-bottom: $uni-spacing-col-base;

				input {
					flex: 1;
					padding-left: $uni-spacing-row-base;
					color: #FFFFFF;
				}

				.tui-icon-close {
					margin-left: auto;
				}
			}
		}

		.tui-cell-text {
			width: 100%;
			padding: $uni-spacing-col-lg $uni-spacing-row-lg;
			box-sizing: border-box;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.tui-color-primary {
				color: $uni-color-primary;
			}
		}

		.tui-btn-box {
			width: 100%;
			padding: 0 $uni-spacing-row-lg;
			box-sizing: border-box;
			margin-top: 80rpx;
		}
	}

	.tui-login-way {
		width: 100%;
		font-size: 26rpx;
		color: $uni-color-primary;
		display: flex;
		justify-content: center;
		position: fixed;
		left: 0;
		bottom: 80rpx;

		view {
			padding: 12rpx 0;
		}
	}
}
</style>
