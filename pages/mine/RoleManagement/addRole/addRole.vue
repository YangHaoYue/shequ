<template>
	<view>
		<view class="bg-white u-p-30 u-flex u-row-between">
			<view>角色名称</view>
			<input adjust-position="true" class="u-text-right" v-model="roleName" type="text" placeholder="输入角色名称" />
		</view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<!-- 描述 -->
		<view class="u-p-30">
			<u-input type="textarea" v-model="textAreaValue" placeholder="请输入备注"></u-input>
		</view>
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		
		
		<block v-for="(item,i) in formList" :key="i">
			<view class="u-flex u-col-top u-p-30 solid-bottom"><!-- v-if="item.type=='checkbox'" -->
				<view class="u-flex-1">{{item.title}}</view>
				<view class="u-flex-3">
					<u-checkbox-group @change="checkboxGroupChange($event,item)" width="50%" shape="square" active-color="#FE8702">
						<u-checkbox 
							v-model="son.checked" 
							v-for="(son, j) in item.items" :key="j" 
							:name="son.id"
						>{{son.name}}</u-checkbox>
					</u-checkbox-group>
					<view class="text-gray u-line-2 text-sm">{{item.help||''}}</view>
				</view>
			</view>
			<!-- <view class="u-flex u-col-top u-row-left u-p-30 solid-bottom" v-else-if="item.type=='radio'">
				<view class="u-flex-1">{{item.title}}</view>
				<view class="u-flex-3">
					<u-radio-group v-model="item.value" :width="item.width" active-color="#FE8702">
						<u-radio 
							@change="radioChange($event,item)" 
							v-for="(son, k) in item.list" :key="k" 
							:name="son.id"
						>{{son.name}}</u-radio>
					</u-radio-group>
					<view class="text-gray u-line-2">{{item.desc}}</view>
				</view>
			</view>
			<view class="u-flex u-col-top u-row-left u-p-30 solid-bottom" v-else-if="item.type=='radioList'">
				<view class="u-flex-1">{{item.title}}</view>
				<view class="u-flex-3">
					<block v-for="(son,v) in item.radioList" :key="v">
						<u-radio-group v-model="son.value" :width="son.width" active-color="#FE8702">
							<u-radio 
								@change="radioChange($event,son)" 
								v-for="(child, k) in son.list" :key="k" 
								:name="child.id"
							>
								{{child.name}}
							</u-radio>
						</u-radio-group>
						<view class="text-gray u-line-2">{{son.desc}}</view>
					</block>
				</view>
			</view> -->
		</block>
		
		<u-toast ref="uToast"></u-toast>
		<!-- 底部Tab -->
		<view class="cu-tabbar-height"></view>
		<view class="saveBtn bg-white solid-top u-p-30 u-text-center" @click="submit">保存</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.role_id=e.role_id||0;
			if(this.role_id!=0){
				uni.setNavigationBarTitle({
					title:'编辑角色'
				})
			}
			this.getInfo();
		},
		data() {
			return {
				role_id:'',
				roleName:'',
				textAreaValue:'',
				
				formList:[
					// {
					// 	type:"checkbox",
					// 	title:'基础权限',
					// 	list: [
					// 		{name: '查询管理',checked: false,id:0},
					// 		{name: '商品入库',checked: false,id:1},
					// 		{name: '员工管理',checked: false,id:2},
					// 		{name: '销售报表',checked: false,id:3},
					// 		{name: '销售开单',checked: false,id:4},
					// 		{name: '仓库管理',checked: false,id:5},
					// 		{name: '库存盘点',checked: false,id:6},
					// 		{name: '历史记录',checked: false,id:7},
					// 		{name: '客户管理',checked: false,id:8},
					// 		{name: '同行清仓',checked: false,id:9},
					// 		{name: '寄卖结款',checked: false,id:10},
					// 		{name: '同行大仓',checked: false,id:11},
					// 		{name: '发货管理',checked: false,id:12},
					// 		{name: '预定管理',checked: false,id:13},
					// 		{name: '会员运营',checked: false,id:14},
					// 		{name: '批量移库',checked: false,id:15},
					// 		{name: '商家后台',checked: false,id:16},
					// 		{name: '角色管理',checked: false,id:17},
					// 	],
					// 	checkList:[]
					// },
					// {
					// 	type:"checkbox",
					// 	title:'编辑能力',
					// 	list: [
					// 		{name: '商品来源客户',checked: false,id:0},
					// 		{name: '商品基本信息',checked: false,id:1},
					// 		{name: '商品库存',checked: false,id:2},
					// 		{name: '编辑客户维护人',checked: false,id:3},
					// 		{name: '仓库编辑',checked: false,id:4}
					// 	],
					// 	checkList:[]
					// },
					// {
					// 	type:"radio",
					// 	title:'销售数据',
					// 	list: [
					// 		{name: '仅自己',id:0},
					// 		{name: '全店数据',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'控制“销售报表、历史记录”的查看范围'
					// },
					// {
					// 	type:"radio",
					// 	title:'成本数据',
					// 	list: [
					// 		{name: '不可见',id:0},
					// 		{name: '可见',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'控制商品信息中的成本信息是否可见'
					// },
					// {
					// 	type:"radio",
					// 	title:'利润数据',
					// 	list: [
					// 		{name: '不可见',id:0},
					// 		{name: '可见',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'控制在销售报表中的利润信息是否可见'
					// },
					// {
					// 	type:"radio",
					// 	title:'删除商品',
					// 	list: [
					// 		{name: '不可删除',id:0},
					// 		{name: '可删除',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'删除后不可恢复，建议仅对老板本人和店长开发该权限'
					// },
					// {
					// 	type:"radio",
					// 	title:'共享价数据',
					// 	list: [
					// 		{name: '不可见',id:0},
					// 		{name: '可见',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'控制在商品信息中的共享信息是否可见'
					// },
					// {
					// 	type:"radio",
					// 	title:'客户维护人',
					// 	list: [
					// 		{name: '全部客户',id:0},
					// 		{name: '仅自己维护的客户',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'控制客人维护人权限'
					// },
					// {
					// 	type:"radio",
					// 	title:'隐藏仓库',
					// 	list: [
					// 		{name: '不可见',id:0},
					// 		{name: '可见',id:1},
					// 	],
					// 	width:'50%',
					// 	value: 0,
					// 	desc:'控制隐藏仓库是否可见'
					// },
					// {
					// 	type:"radioList",
					// 	title:'客户数据',
					// 	radioList: [
					// 		{
					// 			list: [
					// 				{name: '仅自己',id:0},
					// 				{name: '全店数据',id:1},
					// 			],
					// 			width:'50%',
					// 			value: 0,
					// 			desc:'控制“销售报表、历史记录”的查看范围'
					// 		},
					// 		{
					// 			list: [
					// 				{name: '仅自己',id:0},
					// 				{name: '全店数据',id:1},
					// 			],
					// 			width:'100%',
					// 			value: 0,
					// 			desc:'控制“销售报表、历史记录”的查看范围'
					// 		},
					// 	]
						
					// },
				]
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Role/getRoleEditPageData',{
					role_id:this.role_id
				}).then((res)=>{
					if(res.code==1000){
						this.roleName=res.data.name;
						this.formList=res.data.permissions;
						/* this.formList.push(res.data.permissions.backstage);
						this.formList.push(res.data.permissions.basic);
						this.formList.push(res.data.permissions.customer);
						this.formList.push(res.data.permissions.edit);
						this.formList.push(res.data.permissions.good);
						this.formList.push(res.data.permissions.good_cost);
						this.formList.push(res.data.permissions.good_peer);
						this.formList.push(res.data.permissions.good_sell);
						this.formList.push(res.data.permissions.order);
						this.formList.push(res.data.permissions.order_profit);
						this.formList.push(res.data.permissions.pri_stohouse);
						this.formList.push(res.data.permissions.share_price);
						this.formList.push(res.data.permissions.type_from);
						this.formList.push(res.data.permissions.type_from_cus); */
						this.textAreaValue=res.data.remark;
						this.formList.map(v=>{
							v.items.map(t=>{
								if(t.checked){
									if(v.checkList){
										v.checkList.push(t.id)
									}else{
										this.$set(v,'checkList',[t.id])
									}
								}
							})
						})
					}
				})
			},
			_formatRadio(e){
				return{
					name:e.name
				}
			},
			_formatCheckbox(e){
				return{
					name:e.name,
					id:e.id,
					checked:e.checked==0?true:false
				}
			},
			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e,item) {
				this.$set(item,'checkList',e)
				console.log(e);
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e,item) {
				console.log(e);
				console.log(item.value);
			},
			/* 保存 */
			submit(){
				console.log(this.formList);
				let permission_ids = new Array;
				this.formList.map(v=>{
					if(v.checkList) {
						permission_ids = permission_ids.concat(v.checkList)
					}
				})
				this.http.post('/api/v1/Role/createOrUpdateRole',{
					role_id:this.role_id,
					name:this.roleName,
					remark:this.textAreaValue,
					permission_ids:permission_ids
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success",
							back:true,
							duration:1000,
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
