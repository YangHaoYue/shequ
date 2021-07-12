<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="店铺logo" prop="photo" label-width="150">
				<u-upload width="160" ref="uUpload" height="160" :action="http.interfaceUrl()+action" @on-list-change="onLogoChange" :max-count="1" :isImage="true"></u-upload>
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="店铺名称" prop="storeName">
				<u-input type="text" :border="border" placeholder="请填写店铺名称" v-model="model.storeName" />
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account" label-width="120" :label-position="labelPosition" label="姓名" prop="name">
				<u-input :border="border" placeholder="请输入姓名" v-model="model.name" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="性别" prop="sex">
				<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="model.sex" placeholder="请选择性别" @click="actionSheetShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :rightIconStyle="{color: '#888', fontSize: '32rpx'}" right-icon="kefu-ermai" :label-position="labelPosition" label="手机号码" prop="phone" label-width="150">
				<u-input :border="border" placeholder="请输入手机号" v-model="model.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="店主微信号" prop="wx">
				<u-input type="text" :border="border" placeholder="请填写店主微信号" v-model="model.wx" />
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="经营性质" prop="storesType" label-width="150">
				<u-input :border="border" type="select" :select-open="selectShow" v-model="model.storesType" placeholder="请选择商品类型" @click="selectShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="所在地区" prop="region" label-width="150">
				<u-input :border="border" type="select" :select-open="pickerShow" v-model="model.region" placeholder="请选择地区" @click="pickerShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="店铺/工作室地址" prop="address">
				<u-input type="text" :border="border" placeholder="请填写店铺/工作室地址" v-model="model.address" />
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="付款方式" prop="payType" label-width="150">
				<u-radio-group v-model="radio" @change="radioGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
					<u-radio shape="circle" v-for="(item, index) in radioList" :key="index" :name="item.name">{{ item.name }}</u-radio>
				</u-radio-group>
				<u-input type="text" :border="border" placeholder="请填写其他付款方式" v-model="model.other" v-if="model.payType=='其他'" />
			</u-form-item>
			<u-form-item :label-style="labelStyle" :required="true" :label-position="labelPosition" label="转账截图" prop="photo" label-width="150">
				<u-upload width="160" height="160" :action="http.interfaceUrl()+action" :header="header" :max-count="1" @on-list-change="onPayChange" :isImage="true"></u-upload>
			</u-form-item>
		</u-form>
		<u-button @click="submit">提交</u-button>
		<u-toast ref="uToast"></u-toast>
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-select mode="single-column" confirm-color="#FE8702" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
		<u-picker mode="region" confirm-color="#FE8702" v-model="pickerShow" @confirm="regionConfirm"></u-picker>
	</view>
</template>

<script>
export default {
	data() {
		let that = this;
		return {
			labelStyle:{fontSize: '28rpx'},
			action: '/api/v1/Common/fileUploader',
			header:{'Authorization':'Bearer '+ this.http.getToken()},
			model: {
				logo:'',
				storeName:'',
				name: '',
				sex: '',
				phone: '',
				wx:'',
				storesType: '',
				region: '',
				area_id:'',
				address:'',
				payType: '支付宝',
				other:'',
				payPhoto: ''
			},
			logoLists:[],
			payLists:[],
			/* 店铺类型 */
			selectList: [
				{
					value: '实体店铺',
					label: '实体店铺'
				},
				{
					value: '工作室',
					label: '工作室'
				},
				{
					value: '其他',
					label: '其他'
				}
			],
			rules: {
				name: [
					{
						required: true,
						message: '请输入姓名',
						trigger: 'blur' ,
					},
					{
						// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.chinese(value);
						},
						message: '姓名必须为中文',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change','blur'],
					},
				],
				sex: [
					{
						required: true,
						message: '请选择性别',
						trigger: 'change'
					},
				],
				storeName: [
					{
						required: true,
						message: '请填写店铺名称',
						trigger: 'change',
					}
				],
				address: [
					{
						required: true,
						message: '请填写店铺/工作室地址',
						trigger: 'change',
					}
				],
				payType: [
					{
						required: true,
						message: '请选择任意一种支付方式',
						trigger: 'change',
					}
				],
				region: [
					{
						required: true,
						message: '请选择地区',
						trigger: 'change',
					}
				],
				storesType: [
					{
						required: true,
						message: '请选择商品类型',
						trigger: 'change',
					}
				],
				wx: [
					{
						required: true,
						message: '请填写店主微信',
						trigger: 'change',
					}
				],
				phone: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change','blur'],
					},
					{
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change','blur'],
					}
				]
			},
			border: true,
			check: false,
			selectStatus: 'close',
			radioList: [
				{
					name: '支付宝',
					checked: true,
					disabled: false
				},
				{
					name: '微信',
					checked: false,
					disabled: false
				},
				{
					name: '银行转账',
					checked: false,
					disabled: false
				},
				{
					name: '其他',
					checked: false,
					disabled: false
				}
			],
			radio: '支付宝',
			actionSheetList: [
				{
					text: '男'
				},
				{
					text: '女'
				}
			],
			actionSheetShow: false,
			pickerShow: false,
			selectShow: false,
			radioCheckWidth: 'auto',
			radioCheckWrap: false,
			labelPosition: 'top',
			codeTips: '',
			errorType: ['message'],
		};
	},
	onLoad() {
		
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.http.post('/api/v1/Apply/save',{
						logo:this.logoLists[0]&&this.logoLists[0].response.data.path||'',
						pay_img:this.payLists[0]&&this.payLists[0].response.data.path||'',
						store_name:this.model.storeName,
						person_name:this.model.name,
						person_mobile:this.model.phone,
						person_wx:this.model.wx,
						business_type:this.model.storesType,
						pay_type:this.model.payType=='其他'?this.model.other:this.model.payType,
						area_id:this.model.area_id,
						address:this.model.address,
						sex:this.model.sex=='男'?1:0
					}).then((res)=>{
						if(res.code==1000){
							this.$refs.uToast.show({
								title:res.msg,
								type:"success",
								back:true
							})
						}else{
							this.$refs.uToast.show({
								title:res.msg,
								type:'error'
							})
						}
					})
				} else {
					this.$refs.uToast.show({
						title:"请填写完带*号的选项再提交",
						type:'error'
					})
				}
			});
		},
		//上传logo图片
		onLogoChange(lists){
			console.log('onListChange', lists[0]);
			this.logoLists=lists;
		},
		//上传转账截图
		onPayChange(lists){
			console.log('onListChange', lists[0]);
			this.payLists=lists
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.model.sex = this.actionSheetList[index].text;
		},
		// radio选择发生变化
		radioGroupChange(e) {
			this.model.payType = e;
		},
		// 选择地区回调
		regionConfirm(e) {
			console.log(e);
			this.model.region = e.province.label + '-' + e.city.label + '-' + e.area.label;
			this.model.area_id = e.area.value;
		},
		// 选择商品类型回调
		selectConfirm(e) {
			this.model.storesType = '';
			e.map((val, index) => {
				this.model.storesType += this.model.storesType == '' ? val.label : '-' + val.label;
			})
		}
	}
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}

.agreement {
	display: flex;
	align-items: center;
	margin: 40rpx 0;

	.agreement-text {
		padding-left: 8rpx;
		color: $u-tips-color;
	}
}
</style>
