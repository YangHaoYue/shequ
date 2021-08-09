<template>
	<view>
		<view class="bg-white u-p-30 u-flex u-row-between solid-bottom">
			<view class="u-flex u-m-b-10 u-m-r-20">姓名<text class="u-type-error">*</text></view>
			<input adjust-position="true" class="u-text-right" v-model="customerInfo.customer_name" type="text" placeholder="请输入姓名" />
		</view>
		<view class="bg-white u-p-30 u-flex u-row-between">
			<view>代号</view>
			<input adjust-position="true" class="u-text-right" v-model="customerInfo.code_name" type="text" placeholder="请输入代号" />
		</view>
		<u-cell-group>
			<u-cell-item :value="maintainer" @click="showMaintainerList=true">
				<view slot="title" class="u-flex u-m-b-10 u-m-r-20">维护人<text class="u-type-error">*</text></view>
			</u-cell-item>
			<u-cell-item title="性别" :value="sexName" @click="showSexList=true"></u-cell-item>
			<u-cell-item :value="privacyName" @click="showPrivacyList=true">
				<view slot="title" class="u-flex u-m-b-10 u-m-r-20">是否为自管客户<text class="u-type-error">*</text></view>
			</u-cell-item>
			<u-cell-item :value="typeName" @click="showTypeList=true">
				<view slot="title" class="u-flex u-m-b-10 u-m-r-20">类型<text class="u-type-error">*</text></view>
			</u-cell-item>
			<u-cell-item :value="statusName" @click="showStatusList=true">
				<view slot="title" class="u-flex u-m-b-10 u-m-r-20">状态<text class="u-type-error">*</text></view>
			</u-cell-item>
		</u-cell-group>
		
		<view class="bg-white u-p-30 u-flex u-row-between solid-bottom">
			<view>身份证号码</view>
			<input adjust-position="true" class="u-text-right" v-model="customerInfo.id_card" type="number" placeholder="请输入身份证号码" />
		</view>
		<view class="bg-white u-p-30 u-flex u-row-between solid-bottom">
			<view>手机号码</view>
			<input adjust-position="true" class="u-text-right" v-model="customerInfo.mobile" maxlength="11" type="number" placeholder="请输入手机号吗" />
		</view>
		<view class="bg-white u-p-30 u-flex u-row-between solid-bottom">
			<view>微信</view>
			<input adjust-position="true" class="u-text-right" v-model="customerInfo.wx" type="text" placeholder="请输入微信" />
		</view>
		<view class="bg-white u-p-30 u-flex u-row-between solid-bottom">
			<view>地址</view>
			<input adjust-position="true" class="u-text-right" v-model="customerInfo.address" type="text" placeholder="请输入地址" />
		</view>
		
		<view class="u-m-30">
			<u-button  type="warning" @click="submit">保存</u-button>
		</view>
		
		<u-toast ref="uToast"></u-toast>
		
		<u-select v-model="showMaintainerList" confirmColor="#FE8702" mode="single-column" value-name="id" label-name="name" :list="maintainerList" @confirm="chooseMaintainer"></u-select>
		<u-select v-model="showSexList" confirmColor="#FE8702" mode="single-column" :list="sexList" @confirm="chooseSex"></u-select>
		<u-select v-model="showPrivacyList" confirmColor="#FE8702" mode="single-column" :list="privacyList" @confirm="choosePrivacy"></u-select>
		<u-select v-model="showTypeList" confirmColor="#FE8702" mode="single-column" :list="typeList" @confirm="chooseType"></u-select>
		<u-select v-model="showStatusList" confirmColor="#FE8702" mode="single-column" :list="statusList" @confirm="chooseStatus"></u-select>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.customer_id=e.customer_id||0;
			if(this.customer_id!=0){
				this.getCustomerEditPageData();
			}
			this.getInfo();
		},
		computed: {
			maintainer() {
				let item=this.maintainerList.filter((v,index)=>{
					return v.id==this.customerInfo.maintain_user_id
				})
				let text=this.maintainerList.some((v,index)=>{
					return v.id==this.customerInfo.maintain_user_id
				})
				return item[0]&&item[0].name||'';
			},
			sexName() {
				let item=this.sexList.filter((v,index)=>{
					return v.value==this.customerInfo.sex
				})
				return item[0]&&item[0].label||'';
			},
			privacyName() {
				let item=this.privacyList.filter((v,index)=>{
					return v.value==this.customerInfo.private
				})
				return item[0]&&item[0].label||'';
			},
			typeName() {
				let item=this.typeList.filter((v,index)=>{
					return v.value==this.customerInfo.type
				})
				return item[0]&&item[0].label||'';
			},
			statusName() {
				let item=this.statusList.filter((v,index)=>{
					return v.value==this.customerInfo.status
				})
				return item[0]&&item[0].label||'';
			}
		},
		data() {
			return {
				customer_id:'',
				customerInfo:{
					customer_name:'',
					code_name:'',
					maintain_user_id:'',
					sex:0,
					type:0,
					status:0,
					id_card:'',
					mobile:'',
					wx:'',
					address:''
				},
				/* 维护人 */
				showMaintainerList:false,
				maintainerList:[],
				/* 性别 */
				showSexList:false,
				sexList:[
					{value: 0,label: '默认'},
					{value: 1,label: '男'},
					{value: 2,label: '女'},
				],
				/* 隐私和公共 */
				showPrivacyList:false,
				privacyList:[
					{value: 0,label: '公共客户'},
					{value: 1,label: '自管客户'},
				],
				/* 类型 */
				showTypeList:false,
				typeList:[
					{value: 0,label: '同行'},
					{value: 1,label: '直客'},
				],
				/* 状态 */
				showStatusList:false,
				statusList:[
					{value: 0,label: '正常'},
					{value: 1,label: '冻结'},
				],
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Common/getAllStaffByMember').then((res)=>{
					if(res.code==1000){
						this.maintainerList=res.data;
					}
				})
			},
			getCustomerEditPageData(){
				this.http.get('/api/v1/Customer/getCustomerEditPageData',{
					customer_id:this.customer_id
				},true).then((res)=>{
					if(res.code==1000){
						this.customerInfo=res.data;
					}
				})
			},
			/* 选择维护人 */
			chooseMaintainer(e){
				this.$set(this.customerInfo,'maintain_user_id',e[0].value)
			},
			/* 选择性别 */
			chooseSex(e){
				this.$set(this.customerInfo,'sex',e[0].value)
			},
			/* 选择客户 */
			choosePrivacy(e){
				this.$set(this.customerInfo,'private',e[0].value)
			},
			/* 选择类型 */
			chooseType(e){
				this.$set(this.customerInfo,'type',e[0].value)
			},
			/* 选择状态 */
			chooseStatus(e){
				this.$set(this.customerInfo,'status',e[0].value)
			},
			submit(){
				this.http.post('/api/v1/Customer/customerEditOrCreate',{
					customer_id:this.customer_id||0,
					name:this.customerInfo.customer_name,
					code_name:this.customerInfo.code_name,
					maintain_user_id:this.customerInfo.maintain_user_id,
					sex:this.customerInfo.sex,
					private:this.customerInfo.private,
					type:this.customerInfo.type,
					status:this.customerInfo.status,
					id_card:this.customerInfo.id_card,
					wx:this.customerInfo.wx,
					mobile:this.customerInfo.mobile,
					address:this.customerInfo.address
				}).then((res)=>{
					if(res.code==1000){
						uni.$emit('back')
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							back:true
						})
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
