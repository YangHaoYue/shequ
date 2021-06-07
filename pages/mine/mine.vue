<template>
	<view>
		<cu-custom Color="#FE8702" bgColor="bg-orange" :isBack="true" :showBackImg="false">
			<block slot="backText">个人中心</block>
		</cu-custom>
		<!-- 头像 -->
		<navigator class="u-flex u-p-t-20 u-p-b-20 u-p-l-20 mine_bg" hover-class='none' url="/pages/mine/userInfo/userInfo" navigateTo>
			<u-avatar :src="avaterUrl" size="124"></u-avatar>
			<text class="nickname">{{nickname}}</text>
		</navigator>
		<!-- 列表 -->
		<u-cell-group>
			<block v-for="(item,index) in cellList" :key="index">
				<navigator hover-class='none' :url="item.url" navigateTo v-if="Permissions.indexOf(item.permission)!=-1||item.permission==''">
					<u-cell-item :arrow="false" :title="item.name" :title-style="{'font-size':'30rpx'}" iconSize="40rpx">
						<u-image slot="icon" class="u-m-r-20" :fade="false" showLoading="false" width="48rpx" height="48rpx" :src="item.img"></u-image>
					</u-cell-item>
				</navigator>
			</block>
		</u-cell-group>
		<!-- 退出登录 -->
		<view class="u-p-40">
			<u-button class="u-m-40 u-p-40" @click="logout">退出登录</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		onShow() {
			this.getUserInfo();
			this.Permissions=uni.getStorageSync('Permissions')
		},
		data() {
			return {
				avaterUrl: '',
				nickname:'',
				cellList:[{
					name:'客户管理',
					img:'../../../static/uiImg/khglicon.png',
					url:'/pages/mine/CustomerManagement/CustomerManagement',
					permission:'basic.cusmng'
				},{
					name:'角色管理',
					img:'../../../static/uiImg/User-folder.png',
					url:'/pages/mine/RoleManagement/RoleManagement',
					permission:'basic.role_mng'
				},{
					name:'员工管理',
					img:'../../../static/uiImg/add-users.png',
					url:'/pages/mine/EmployeeManagement/EmployeeManagement',
					permission:'basic.staffmng'
				},{
					name:'仓库管理',
					img:'../../../static/uiImg/ckgl.png',
					url:'/pages/mine/WarehouseManagement/WarehouseManagement',
					permission:'basic.stohousemng'
				},{
					name:'帮助中心',
					img:'../../../static/uiImg/bzzx.png',
					url:'/pages/mine/helpCenter/helpCenter',
					permission:''
				},{
					name:'联系我们',
					img:'../../../static/uiImg/lxwm.png',
					url:'/pages/mine/connectUs/connectUs',
					permission:''
				},{
					name:'修改密码',
					img:'../../../static/uiImg/xgmm.png',
					url:'/pages/mine/editPwd/editPwd',
					permission:''
				},
				//奢趣独有功能
				/* {
					name:'版本说明',
					img:'../../../static/uiImg/bbsm.png',
					url:'/pages/mine/edition/edition',
					permission:''
				} */
				],
				Permissions:''
			}
		},
		methods: {
			getUserInfo(){
				this.http.post('/api/v1/Auth/getStoreInfo',{},true).then((res)=>{
					if(res.code==1000){
						this.avaterUrl=this.http.resourceUrl()+res.data.logo;
						this.nickname=res.data.manager_name+'('+res.data.store_name+')'
					}
				})
			},
			/* 退出登录 */
			logout(){
				uni.clearStorageSync();
				uni.reLaunch({url:'/pages/login/login'})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mine_bg{
		background-color: #FE8702;
		height: 280rpx;
		width: 100%;
		.nickname{
			color: #FFFFFF;
			font-size: 40rpx;
			margin-left: 32rpx;
		}
	}
</style>
