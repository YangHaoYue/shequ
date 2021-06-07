<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" @click="ChooseImage">
			<view>店铺Logo</view>
			<u-avatar :src="imgList[0]||http.resourceUrl()+storeInfo.logo" size="64"></u-avatar>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>店铺代码</view>
			<view>{{storeInfo.store_code}}</view>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>我的店铺</view>
			<input adjust-position="true" class="u-text-right" v-model="storeInfo.store_name" type="text" placeholder="输入我的店铺" />
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>管理者姓名</view>
			<input adjust-position="true" class="u-text-right" v-model="storeInfo.manager_name" type="text" placeholder="输入管理者姓名" />
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>管理者手机号</view>
			<input adjust-position="true" class="u-text-right" maxlength="11" v-model="storeInfo.manager_phone" type="number" placeholder="输入管理者手机号" />
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>管理者微信</view>
			<input adjust-position="true" class="u-text-right" v-model="storeInfo.manager_wx" type="text" placeholder="输入管理者微信" />
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" @click="showTypeList=true">
			<view>经营性质</view>
			<view>{{storeInfo.storeType}}</view>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom" @click="showArea=true">
			<view>店铺区域</view>
			<view>{{storeInfo.area_name}}</view>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>店铺地址</view>
			<input adjust-position="true" class="u-text-right" v-model="storeInfo.address" type="text" placeholder="输入店铺地址" />
		</view>
		<view class="bg-white u-p-20 solid-bottom">
			<view class="u-flex u-row-between">
				<view>积分奖励</view>
				<input adjust-position="true" class="u-text-right" v-model="storeInfo.integral_per_yuan" type="text" placeholder="输入每元奖励多少积分" />
			</view>
			<view class="text-sm text-gray">开单成功后，一元奖励多少积分</view>
		</view>
		<view class="bg-white u-p-20 solid-bottom">
			<view class="u-flex u-row-between">
				<view>积分抵扣</view>
				<input adjust-position="true" class="u-text-right" v-model="storeInfo.integral_deduction_per_yuan" type="text" placeholder="输入多少积分抵扣一元" />
			</view>
			<view class="text-sm text-gray">开单时，多少积分抵扣一元</view>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>开启积分奖励</view>
			<u-switch v-model="checked1" active-color="#FE8702" active-value="1" inactive-value="0" size="40"></u-switch>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>开启积分抵扣</view>
			<u-switch v-model="checked2" active-color="#FE8702" active-value="1" inactive-value="0" size="40"></u-switch>
		</view>
		<view class="bg-white u-p-20 u-flex u-row-between solid-bottom">
			<view>是否展示给其他商家</view>
			<u-switch v-model="checked3" active-color="#FE8702" active-value="1" inactive-value="0" size="40"></u-switch>
		</view>
		
		<u-toast ref="uToast"></u-toast>
		
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn u-p-30 u-text-center" @click="save" v-if="storeInfo.can_edit!=0">保存</view>
		<u-select v-model="showTypeList" confirmColor="#FE8702" mode="single-column" :list="typeList" @confirm="chooseType"></u-select>
		<u-picker mode="region" v-model="showArea" :default-region="storeInfo.area" confirmColor="#FE8702" @confirm="chooseArea"></u-picker>
	</view>
</template>

<script>
	export default {
		onLoad() {
			this.getUserInfo()
		},
		data() {
			return {
				imgList: [],
				id_card_imgs:[],
				storeInfo:'',
				showTypeList: false,
				typeList: [
					{value: 0,label: '实体店铺'},
					{value: 1,label: '工作室'},
					{value: 2,label: '个人代理'},
					{value: 3,label: '其他'},
				],
				showArea:false,
				checked1:false,
				checked2:false,
				checked3:false
			}
		},
		methods: {
			getUserInfo(){
				this.http.post('/api/v1/Auth/getStoreInfo',{},true).then((res)=>{
					if(res.code==1000){
						this.storeInfo=res.data;
						this.checked1=res.data.get_on==1?true:false;
						this.checked2=res.data.deduct_on==1?true:false;
						this.checked3=res.data.deduct_on==1?true:false;
						this.typeList.map(v=>{
							if(v.value==res.data.store_type)
							this.$set(this.storeInfo,'storeType',v.label)
						})
					}
				})
			},
			/* 选择头像 */
			ChooseImage(e) {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						this.imgList=res.tempFilePaths;
						this.id_card_imgsUpload(res.tempFilePaths[0])
						console.log(this.imgList);
					}
				});
			},
			id_card_imgsUpload(tempFilePaths){
				this.http.uploadFile('/api/v1/Common/fileUploader',tempFilePaths).then((res)=>{
					this.id_card_imgs[0]=res.path;
				})
			},
			// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
			chooseType(e) {
				this.$set(this.storeInfo,'storeType',e[0].label)
				this.$set(this.storeInfo,'store_type',e[0].value)
			},
			/* 选择地区 */
			chooseArea(e){
				this.storeInfo.area_name=e.province.label+e.city.label+e.area.label;
				this.storeInfo.area_code=e.area.value;
			},
			/* 保存 */
			save(){
				this.http.get('/api/v1/Auth/setStoreInfo',{
					logo:this.id_card_imgs[0]||this.storeInfo.logo,
					store_name:this.storeInfo.store_name,
					store_type:this.storeInfo.store_type,
					manager_name:this.storeInfo.manager_name,
					manager_phone:this.storeInfo.manager_phone,
					manager_wx:this.storeInfo.manager_wx,
					area_id:this.storeInfo.area_code,
					address:this.storeInfo.address,
					integral_deduction_per_yuan:this.storeInfo.integral_deduction_per_yuan,
					integral_per_yuan:this.storeInfo.integral_per_yuan,
					get_on:this.checked1?1:0,
					deduct_on:this.checked2?1:0
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							duration:1500,
							back:true
						});
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
</script>

<style>
</style>
