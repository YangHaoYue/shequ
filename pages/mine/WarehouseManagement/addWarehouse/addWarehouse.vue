<template>
	<view>
		<!-- form表单 -->
		<block v-for="(item,i) in list" :key="i">
			<form-list :item="item" :index="i" @payChange="payChange" @input="input"></form-list>
		</block>
		<!-- 描述 -->
		<view class="u-p-30 solid-bottom">
			<u-input type="textarea" v-model="textAreaValue" placeholder="请填写仓库备注"></u-input>
		</view>
		<view class="u-p-30 u-m-t-20">
			{{info}}
		</view>
		
		<u-toast ref="uToast"></u-toast>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn solid-top u-p-30 u-text-center" @click="submit">保存</view>
	</view>
</template>

<script>
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			formList
		},
		onLoad(e) {
			this.store_house_id=e.store_house_id;
			this.StoCreateInfo();
		},
		data() {
			return {
				store_house_id:'',
				/* from表单 */
				list:[
					{type:'input',name:'仓库名',value:'',id:'',placeholder:'请输入仓库名',inputType:'text',isImport:true},
					{type:'payPicker',name:'状态',value:'普通仓库',id:0,isImport:true,list:[{value: 0,label: '普通仓库'},{value: 1,label: '隐私仓库'}]},
				],
				textarea:'',
				info:''
			}
		},
		methods: {
			getInfo(){
				this.http.get('')
			},
			StoCreateInfo(){
				this.http.get('/api/v1/StoreHouse/StoCreateInfo',{
					store_house_id:this.store_house_id
				},true).then((res)=>{
					if(res.code==1000){
						this.info=res.data.info;
						this.list[0].value=res.data.store_house_data[0].store_house_name;
						this.list[1].list.forEach(v=>{
							if(v.value==res.data.store_house_data[0].type_store_house){
								this.list[1].value=v.label;
								this.list[1].id=v.value;
							}
						})
						this.textarea=res.data.store_house_data[0].remark;
					}
				})
			},
			payChange(e){
				console.log(e);
				this.$set(this.list[e.index],'value',e.value.label);
				this.$set(this.list[e.index],'id',e.value.value);
			},
			/* 输入框 */
			input(e){
				console.log(e);
				this.$set(this.list[e.index],'value',e.value)
			},
			/* 提交 */
			submit(){
				this.http.get('/api/v1/StoreHouse/createStoreHouse',{
					store_house_id:this.store_house_id||0,
					store_house_name:this.list[0].value,
					type:this.list[1].id,
					remark:this.textarea
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
