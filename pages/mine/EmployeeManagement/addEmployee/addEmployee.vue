<template>
	<view>
		<!-- form表单 -->
		<block v-for="(item,i) in list" :key="i">
			<form-list :item="item" :index="i" @payChange="payChange" @input="input" @timeChange="timeChange"></form-list>
		</block>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn solid-top u-p-30 u-text-center" @click="submit">保存</view>
		
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			formList
		},
		onLoad(e) {
			this.user_id=e.user_id||0;
			this.getInfo();
		},
		data() {
			return {
				user_id:'',
				/* from表单 */
				list:[
					{type:'input',name:'员工姓名',value:'',id:'',placeholder:'请输入员工姓名',inputType:'text',isImport:false},
					{type:'input',name:'登陆账号',value:'',id:'',placeholder:'请输入登陆账号(账号长度应在50个字符内，且不能与其他账号重复)',inputType:'text',isImport:false},
					{type:'input',name:'登陆密码',value:'',id:'',placeholder:'请输入登陆密码(密码长度应在50个字符内)',inputType:'text',isImport:false},
					{type:'payPicker',name:'性别',value:'男',id:'',isImport:false,list:[{value: 0,label: '男'},{value: 1,label: '女'}]},
					{type:'payPicker',name:'状态',value:'正常',id:'',isImport:false,list:[{value: 0,label: '正常'},{value: 1,label: '冻结'}]},
					{type:'payPicker',name:'员工角色',value:'',id:'',isImport:false,list:[{value: 0,label: '666'},{value: 1,label: '777'}]},
					//奢趣/吉嘉人独有功能
					{type:'timePicker',name:'到期时间',value:'留空则无到期限制',id:'',placeholder:'',inputType:'text',isImport:false},
				],
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Staff/getUserEditPageData',{
					user_id:this.user_id
				},true).then((res)=>{
					if(res.code==1000){
						this.list[5].list=res.data.roles.map(v=>{
							if(v.id==res.data.role_id){
								this.list[5].id=v.id;
								this.list[5].value=v.name;
							}
							return this._format(v);
						});
						this.list[0].value=res.data.name;
						this.list[1].value=res.data.username;
						this.list[3].list.map(v=>{
							if(v.value==res.data.sex)
							this.list[3].value=v.label;
						})
						this.list[3].id=res.data.sex;
						this.list[4].list.map(v=>{
							if(v.value==res.data.status)
							this.list[4].value=v.label;
						})
						this.list[4].id=res.data.status;
						//奢趣/吉嘉人独有功能
						this.list[6].value=res.data.expire_at||'留空则无到期限制'
					}
				})
			},
			_format(e){
				return{
					value:e.id,
					label:e.name
				}
			},
			/* 输入框 */
			input(e){
				console.log(e);
				this.$set(this.list[e.index],'value',e.value)
			},
			/* 时间 */
			timeChange(e){
				console.log(e);
				this.$set(this.list[e.index],'value',e.value)
			},
			payChange(e){
				console.log(e);
				this.$set(this.list[e.index],'value',e.value.label)
				this.$set(this.list[e.index],'id',e.value.value)
			},
			submit(){
				let data={
					user_id:this.user_id,
					name:this.list[0].value,
					username:this.list[1].value,
					pwd:this.list[2].value,
					sex:this.list[3].id,
					status:this.list[4].id,
					role_id:this.list[5].id
				};
				if(this.list[6]&&this.list[6].value !== '留空则无到期限制'){
					this.$set(data,'expire_at',this.list[6].value)
				}
				this.http.post('/api/v1/Staff/createOrUpdateUser',data).then((res)=>{
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
						this.islogin=false;
					}
				})
			}
		}
	}
</script>

<style>

</style>
