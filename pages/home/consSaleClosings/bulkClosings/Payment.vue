<template>
	<view>
		<!-- form表单 -->
		<block v-for="(item,i) in fromList" :key="i">
			<form-list :item="item" :index="i" :toDay="toDay" @change="dateChange" @payChange="payChange" @input="input"></form-list>
		</block>
		
		<u-toast ref="uToast"></u-toast>
		<!-- 底部tab -->
		<view class="cu-tabbar-height"></view>
		<u-button type="warning" class="saveBtn u-type-warning-bg" @click="payConsign">确定</u-button>
	</view>
</template>

<script>
	import formList from '@/components/form-list/form-list.vue';
	export default {
		components:{
			formList
		},
		onLoad(e) {
			this.consign_ids=JSON.parse(decodeURIComponent(e.consign_ids));
			var ti= new Date();
			this.toDay=this.http.dateFormat("YYYY-mm-dd",ti);
			this.fromList[3].value=this.toDay
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseEmployees1',(data)=>{
				this.fromList[0].value=data.item.name;
				this.fromList[0].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
		},
		beforeDestroy() {
			uni.$off('chooseEmployees1');
		},
		data() {
			return {
				/* 今天 */
				toDay:'',
				/* from表单 */
				fromList:[
					{type:'picker',name:'结款人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:false},
					{type:'input',name:'结款账户',value:'',id:'',placeholder:'请输入结款账户(选填)',inputType:'text',isImport:false},
					{type:'payPicker',name:'结算方式',value:'',isImport:false,
					/* 支付方式 */
					list:[{value: 0,label: '店铺'},
						{value: 1,label: '微信'},
						{value: 2,label: '淘宝'},
						{value: 3,label: '平台'},
						{value: 4,label: '其他'}],
					},
					{type:'datePicker',name:'结款时间',value:'',isImport:false},
					{type:'input',name:'备注信息',value:'',id:'',placeholder:'10个字以内，可不填',inputType:'text',isImport:false,length:10},
				],
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/Consign/getPayInfo').then((res)=>{
					if(res.code==1000){
						this.fromList[2].list=res.data.type_pay.map(v=>{
							return this._format(v)
						})
					}
				})
			},
			_format(e){
				return{
					value:e.id,
					label:e.val
				}
			},
			/* 日期 */
			dateChange(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value)
			},
			/* 输入框 */
			input(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value)
			},
			/* 支付方式 */
			payChange(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value.label)
				this.$set(this.fromList[e.index],'id',e.value.value)
			},
			payConsign(){
				this.http.post('/api/v1/Consign/payConsign',{
					consign_ids:typeof(this.consign_ids)=='number'?[this.consign_ids]:this.consign_ids,
					settler_id:this.fromList[0].id,
					consign_account:this.fromList[1].value,
					type_pay:this.fromList[2].id,
					settle_time:this.fromList[3].value,
					remark:this.fromList[4].value,
				}).then((res)=>{
					if(res.code==1000){
						uni.$emit('back');
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
			}
		}
	}
</script>

<style>

</style>
