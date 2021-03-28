<template>
	<view>
		<block v-for="(item,index) in fromList" :key="index">
			<form-list :item="item" :index="index" @payChange="Change"></form-list>
		</block>
		<!-- 描述 -->
		<view class="u-p-30 solid-bottom">
			<u-input type="textarea" v-model="textAreaValue" placeholder="请填写仓库备注"></u-input>
		</view>
		<!-- 仓库说明 -->
		
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn u-p-30 u-text-center">保存</view>
	</view>
</template>

<script>
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			formList
		},
		data() {
			return {
				/* from表单 */
				fromList:[
					{type:'input',name:'仓库名',value:'',id:'',placeholder:'请输入仓库名',inputType:'text',isImport:true},
					{type:'payPicker',name:'状态',value:'普通仓库',id:'',isImport:true,
					/* 仓库状态 */
					list:[{value: 0,label: '普通仓库'},
						{value: 1,label: '隐私仓库'}],
					}
					
				],
				textAreaValue:''
			}
		},
		methods: {
			Change(){
				console.log(e);
				this.$set(this.goodInfo[e.index],'value',e.value.label)
			}
		}
	}
</script>

<style>

</style>
