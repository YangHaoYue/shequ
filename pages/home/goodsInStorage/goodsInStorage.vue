<template>
	<view>
		<!-- 上传图片 -->
		<view class="u-p-30 solid-bottom">
			<view class="u-flex u-p-b-20">
				<view class="u-m-r-20">商品图片</view>
				<view class="text-sm text-gray">(默认第一张为商品主图，点击切换主图)</view>
			</view>
			<u-upload :before-remove="beforeRemove" ref="uUpload" :action="action" :file-list="fileList" :show-progress="true" :header="header"
			 :preview-full-image="false" @on-preview="preview" :deletable="true" height="170rpx" :max-count="99" @on-list-change="onListChange">
			</u-upload>
		</view>
		<!-- 上传隐私图片 -->
		<view class="u-p-30 solid-bottom" v-if="showPri_img">
			<view class="u-flex u-p-b-20">
				<view class="u-m-r-20">隐私图片</view>
			</view>
			<u-upload ref="uUpload" :action="action" :file-list="scfileList" :show-progress="true" :header="header"
			:deletable="true" height="170rpx" :max-count="99" @on-list-change="onscListChange">
			</u-upload>
		</view>
		<!-- 上传商品视频 -->
		<view class="u-p-30 solid-bottom" v-if="showPri_img">
			<view class="u-flex u-p-b-20">
				<view class="u-m-r-20">商品视频</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in videoList" :key="index">
					 <!-- <image :src="item.thumbTempFilePath" mode="aspectFill"></image> -->
					 <video id="myvideo" @click="playVideo" :src="item.tempFilePath" muted :show-play-btn="false"
					  :controls="false" :show-center-play-btn="false" objectFit="cover" @fullscreenchange="fullscreenchange" style="width: 130rpx;height: 130rpx;">
						  <cover-view class="cu-tag bg-red u-font-14" @tap.stop="DelVideo" :data-index="index">
								x
						  </cover-view>
					  </video>
					</view>
					<view class="solids" @tap="chooseVideo" v-if="videoList.length<1">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
		</view>
		<!-- 护理情况 -->
		<view class="u-p-30 solid-bottom">
			<view class="u-flex u-flex-wrap">
				<view class="u-flex u-m-b-10 u-m-r-20">护理情况<text class="u-type-error">*</text></view>
				<block v-for="(item,index) in tagList" :key="index">
					<u-tag class="u-m-l-10 u-m-r-10 u-m-b-10" @click="selectTag(item,index)" :text="item.content" mode="plain" shape="circle" type="info" :closeable="false"
					:bg-color="tagSelectedList.indexOf(item.id)==-1?'':'#FE8702'"
					:color="tagSelectedList.indexOf(item.id)==-1?'':'#fff'"
					:border-color="tagSelectedList.indexOf(item.id)==-1?'':'#FE8702'"/>
				</block>
			</view>
			<view class="u-m-l-80 u-p-l-60">
				<u-input type="text" border v-model="otherTag" placeholder="输入其他"></u-input>
			</view>
		</view>
		<!-- form表单 -->
		<block v-for="(item,i) in fromList" :key="i">
			<form-list :item="item" :index="i" :toDay="toDay" @change="dateChange" @input="input" @payChange="payChange"></form-list>
		</block>
		<!-- 附件情况 -->
		<view class="u-p-30 solid-bottom">
			<view class="u-flex u-col-top">
				<view class="u-flex u-m-b-10 u-flex-1">附件情况<text class="u-type-error">*</text></view>
				<view class="u-flex u-flex-wrap u-flex-4">
					<block v-for="(item,j) in attachmentList" :key="j">
						<u-tag class="u-m-l-10 u-m-r-10 u-m-b-10" @click="selectAttachment(item,j)" :text="item.content" mode="plain" shape="circle" type="info" :closeable="false"
						:bg-color="attachmentSelectedList.indexOf(item.id)==-1?'':'#FE8702'"
						:color="attachmentSelectedList.indexOf(item.id)==-1?'':'#fff'"
						:border-color="attachmentSelectedList.indexOf(item.id)==-1?'':'#FE8702'"/>
					</block>
				</view>
			</view>
		</view>
		<!-- 描述 -->
		<view class="u-p-30 solid-bottom">
			<u-input v-if="showTextArea" type="textarea" :focus="true" @blur="hideTextArea" @confirm="hideTextArea"
			height="100"  v-model="textAreaValue" placeholder="请填写综合描述(留空，自动生成描述)"></u-input>
			<view class="u-p-t-6" style="height: 100rpx;" :style="{'color':textAreaValue==''?'#CCC4CF':'#333333'}" v-else @click="inputTextArea">{{textAreaValue||"请填写综合描述(留空，自动生成描述)"}}</view>
		</view>
		<!-- 底部Tabbar -->
		<view class="cu-tabbar-height"></view>
		<cover-view  style="z-index: 999;" class="saveBtn u-p-30 u-text-center" @click="submit">确认入库</cover-view>
		
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
			var ti= new Date();
			this.toDay=this.http.dateFormat("YYYY-mm-dd",ti);
			this.fromList[13].value=this.toDay;
			this.good_id=e.good_id||0;
			this.type_for=e.type_for||0;
			this.getInfo();
		},
		onShow() {
			uni.$on('chooseBrand',(data)=>{
				console.log(data);
				this.fromList[1].value=data.item.brand_name;
				this.fromList[1].id=data.item.id;
				uni.$off('chooseBrand')
			});
			uni.$on('chooseType',(data)=>{
				this.fromList[2].value=data.item.cate_name;
				this.fromList[2].id=data.item.id;
				uni.$off('chooseType')
			});
			uni.$on('chooseFineness',(data)=>{
				this.fromList[3].value=data.item.label;
				this.fromList[3].id=data.item.id;
				uni.$off('chooseFineness')
			});
			uni.$on('chooseSource',(data)=>{
				this.fromList[10].value=data.item.val;
				this.fromList[10].id=data.item.id;
				uni.$off('chooseSource')
			});
			uni.$on('chooseCustomer',(data)=>{
				this.fromList[11].value=data.item.name;
				this.fromList[11].id=data.item.id;
				uni.$off('chooseCustomer')
			});
			uni.$on('chooseWarehouse',(data)=>{
				this.fromList[12].value=data.item.store_house_name;
				this.fromList[12].id=data.item.id
				uni.$off('chooseWarehouse')
			});
			uni.$on('chooseEmployees1',(data)=>{
				this.fromList[15].value=data.item.name;
				this.fromList[15].id=data.item.id;
				uni.$off('chooseEmployees1')
			});
			uni.$on('chooseEmployees2',(data)=>{
				this.fromList[16].value=data.item.name;
				this.fromList[16].id=data.item.id;
				uni.$off('chooseEmployees2')
			});
		},
		computed: {
			tagTitle() {
				let data='';
				this.tagList.forEach(v=>{
					if(this.tagSelectedList.indexOf(v.id)!=-1){
						data+=v.content
					}
				})
				return data+this.otherTag 
			},
			attachmentTitle() {
				let data='';
				this.attachmentList.forEach(v=>{
					if(this.attachmentSelectedList.indexOf(v.id)!=-1){
						data+=v.content
					}
				})
				return data
			},
			counterPrice(){
				return this.fromList[9].value?'专柜价'+this.fromList[9].value:''
			},
			descAll(){
				let data='';
				data=this.fromList[1].value+this.fromList[2].value+
				this.fromList[3].value+this.attachmentTitle+this.tagTitle+
				this.counterPrice+'我们现在好价'+this.fromList[8].value
				
				return data
			}
		},
		watch: {
			descAll(newValue, oldValue) {
				if(this.good_id == ''){
					this.textAreaValue=newValue;
				}
			}
		},
		data() {
			return {
				good_id:'',
				type_for:'',
				/* 今天 */
				toDay:'',
				action: 'https://shequ.0831.run/api/v1/Common/fileUploader',
				header:{'Authorization':'Bearer '+ this.http.getToken()},
				// 预置上传列表
				fileList: [],
				// fileList: [{
				// 	url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
				// 	error: false,
				// 	progress: 100
				// }],
				lists: [], // 组件内部的文件列表
				showPri_img:true,//显示隐私文件上传
				scfileList: [],
				sclists: [], // 组件内部的文件列表
				/* 视频 */
				videoContext:'',//video的上下文
				videoList:[],
				resource:'',
				
				/* 备注 */
				showTextArea:false,
				textAreaValue:'',
				/* 护理情况 */
				tagList:[],
				tagSelectedList:[],
				otherTag:'',
				/* from表单 */
				fromList:[
					{type:'input2',name:'商品名称',value:'',id:'',placeholder:'请输入商品名字',inputType:'text',isImport:true},
					{type:'picker',name:'所属品牌',value:'',id:'',url:'/pages/home/goodsInStorage/brandList/brandList',isImport:true},
					{type:'picker',name:'所属类别',value:'',id:'',url:'/pages/home/goodsInStorage/typeList/typeList',isImport:true},
					{type:'picker',name:'商品成色',value:'二手物品',id:2,url:'/pages/home/goodsInStorage/finenessList/finenessList',isImport:true},
					{type:'payPicker',name:'商品类型',value:'现代',id:0,list:[{value:0,label:"现代"},{value:1,label:'古中'}],isImport:true},
					{type:'input',name:'成本价',value:'1',id:'',placeholder:'请输入成本价',inputType:'digit',isImport:true},
					{type:'input',name:'共享价',value:'1',id:'',placeholder:'请输入共享价',inputType:'digit',isImport:true},
					{type:'input',name:'同行价',value:'1',id:'',placeholder:'请输入同行价',inputType:'digit',isImport:true},
					{type:'input',name:'销售价',value:'1',id:'',placeholder:'请输入销售价',inputType:'digit',isImport:true},
					{type:'input',name:'专柜价',value:'',id:'',placeholder:'请输入专柜价',inputType:'digit',isImport:false},
					{type:'picker',name:'商品来源',value:'',id:'',url:'/pages/home/goodsInStorage/goodsSource/goodsSource',isImport:true},
					{type:'picker',name:'商品来源方',value:'',id:'',url:'/pages/home/salesBilling/customerList/customerList',isImport:true},
					{type:'picker',name:'存放仓库',value:'',id:'',url:'/pages/home/goodsInStorage/Warehouse/Warehouse',isImport:true},
					{type:'datePicker',name:'入库时间',value:'',isImport:true},
					{type:'input',name:'商品数量',value:'1',id:'',placeholder:'请输入商品数量',inputType:'number',isImport:true},
					{type:'picker',name:'入库人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=1',isImport:true},
					{type:'picker',name:'回收人',value:'',id:'',url:'/pages/home/goodsInStorage/Employees/Employees?type=2',isImport:true},
					{type:'input',name:'商品序列号',value:'',id:'',placeholder:'请输入商品序列号',inputType:'text',isImport:false},
					{type:'input',name:'规格型号',value:'',id:'',placeholder:'请输入规格型号',inputType:'text',isImport:false},
					{type:'input',name:'商品颜色',value:'',id:'',placeholder:'请输入商品颜色',inputType:'text',isImport:false},
					{type:'input',name:'材料说明',value:'',id:'',placeholder:'请输入材料说明',inputType:'text',isImport:false},
					{type:'input',name:'商品备注',value:'',id:'',placeholder:'请输入商品备注',inputType:'text',isImport:false},
					{type:'payPicker',name:'是否展现给其他同行',value:'',id:'',list:[],isImport:false},
				],
				/* 成色 */
				type_condition:'',
				/* 附件情况 */
				attachmentList:[],
				attachmentSelectedList:[],
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/Storage/getStoOption',{
					good_id:this.good_id,
					type_for:this.type_for
				}).then((res)=>{
					if(res.code==1000){
						uni.setStorageSync('goodsSourceData',res.data.type_from)
						this.tagList=res.data.care;
						this.attachmentList=res.data.annex;
						this.type_condition=res.data.type_condition;
						this.fromList[4].list=res.data.type_times.map((v,index)=>{
							if(index==0){
								this.fromList[4].value=v.val;
								this.fromList[4].id=v.id;
							}
							return{value:v.id,label:v.val}
						})
						this.fromList[22].list=res.data.visible_out.map((v,index)=>{
							if(index==0){
								this.fromList[22].value=v.val;
								this.fromList[22].id=v.id;
							}
							return{value:v.id,label:v.val}
						})
						if(this.type_for==1){
							this.$set(this.fromList[14],'type','')
							/* this.$set(this.fromList[9],'disable',true)
							this.$set(this.fromList[11],'disable',true)
							this.$set(this.fromList[14],'disable',true)
							this.$set(this.fromList[15],'disable',true) */
						}
						if(this.good_id!=0){
							this.textAreaValue=res.data.desc;
							this.tagSelectedList=res.data.care_fill_ids;
							this.attachmentSelectedList=res.data.annex_ids;
							this.showPri_img=res.data.pri_img_arr.is_show;
							this.scfileList=res.data.pri_img_arr.pri_img.map(v=>{
								return this._formatImg(v)
							});
							this.fileList=res.data.img.map(v=>{
								return this._formatImg(v)
							});
							res.data.pri_video?this.videoList.push({tempFilePath:this.http.resourceUrl() + res.data.pri_video}):''
							res.data.pri_video?this.resource=res.data.pri_video:''
							this.fromList[0].value=res.data.good_name;
							this.fromList[1].value=res.data.brand_fill_arr.brand_name;
							this.fromList[1].id=res.data.brand_fill_arr.brand_id;
							this.fromList[2].value=res.data.cate_fill_arr.cate_name;
							this.fromList[2].id=res.data.cate_fill_arr.cate_id;
							
							res.data.type_condition.map(v=>{
								if(v.id==res.data.type_condition_id)
								this.fromList[3].value=v.val;
							})
							this.fromList[3].id=res.data.type_condition_id;
							
							res.data.type_times.map(v=>{
								if(v.id==res.data.type_times_id)
								this.fromList[4].value=v.val;
							})
							this.fromList[4].id=res.data.type_times_id;
							
							this.fromList[5].value=res.data.cost_price;
							this.fromList[6].value=res.data.share_price;
							this.fromList[7].value=res.data.peer_price;
							this.fromList[8].value=res.data.sell_price;
							this.fromList[9].value=res.data.counter_price;
							
							res.data.type_from.map(v=>{
								if(v.id==res.data.type_from_id)
								this.fromList[10].value=v.val;
							})
							this.fromList[10].id=res.data.type_from_id;
							
							this.fromList[11].value=res.data.customer_option.customer_name;
							this.fromList[11].id=res.data.customer_option.customer_id;
							
							res.data.store_house.map(v=>{
								if(v.id==res.data.store_house_id)
								this.fromList[12].value=v.name;
							})
							this.fromList[12].id=res.data.store_house_id;
							this.$set(this.fromList[13],'value',res.data.date_in);
							this.$set(this.fromList[14],'value',res.data.num_now)
							res.data.user_for_choose.map(v=>{
								if(v.id==res.data.sto_user_id)
								this.fromList[15].value=v.name;
							})
							this.fromList[15].id=res.data.sto_user_id;
							
							res.data.user_for_choose.map(v=>{
								if(v.id==res.data.rec_user_id)
								this.fromList[16].value=v.name;
							})
							this.fromList[16].id=res.data.rec_user_id;
							
							this.fromList[17].value=res.data.serial_num;
							this.fromList[18].value=res.data.specs;
							this.fromList[19].value=res.data.color;
							this.fromList[20].value=res.data.material_info;
							this.fromList[21].value=res.data.remark;
							res.data.visible_out.map(v=>{
								if(v.id==res.data.visible_out_id)
								this.fromList[22].value=v.val;
							})
							this.fromList[22].id=res.data.visible_out_id;
						}else{
							this.fromList[12].value=res.data.store_house.name;
							this.fromList[12].id=res.data.store_house.id;
							res.data.user_for_choose.map(v=>{
								if(v.id==res.data.sto_user_id){
									this.fromList[15].value=v.name;
									this.fromList[15].id=v.id;
									this.fromList[16].value=v.name;
									this.fromList[16].id=v.id;
								}
							})
						}
					}else{
						this.$refs.uToast.show({							title:res.msg,							type:"error"						})
					}
				})
			},
			_formatImg(e){
				return{
					url: this.http.resourceUrl()+e
				}
			},
			onListChange(lists) {
				console.log('onListChange', lists);
				this.lists = lists;
			},
			onscListChange(lists) {
				console.log('onListChange', lists);
				this.sclists = lists;
			},
			chooseVideo(){
				uni.chooseMedia({
					count: 1,
					mediaType:['video'],
					sourceType: ['camera', 'album'],
					maxDuration:15,
					success:(res)=> {
						if(res.tempFiles[0].duration>15) return this.$refs.uToast.show({title:"请选择或拍摄15s以下的视频！",type:"warning"})
						console.log(res);
						this.videoList=res.tempFiles;
						this.http.uploadFile('/api/v1/Common/fileUploader',res.tempFiles[0].tempFilePath,'video').then((data)=>{
							if(data.code==1000){
								this.$refs.uToast.show({									title:'上传成功',									type:"success"								})
								this.resource=data.data.path;
								console.log(data);
								console.log(this.resource);
							}
						})
					}
				});
			},
			DelVideo(){
				this.videoList=[];
				this.resource=''
			},
			/* 播放视频 */
			playVideo(){
				this.videoContext = uni.createVideoContext("myvideo",this);
				this.videoContext.requestFullScreen();
				this.videoContext.play();
			},
			/* 退出全屏时停止播放 */
			fullscreenchange (e){
				if(!e.detail.fullScreen){
					this.videoContext.pause()
				}
			},
			preview(url,lists,index){
				const item=lists[index];
				lists.splice(index, 1);
				lists.unshift(item)
			},
			/* 选择标签 */
			selectTag(item,index){
				let id=item.id;
				let i=this.tagSelectedList.indexOf(id);
				//之前是选中，取消选中
				if(i>-1){
					//移除选中列表中的当前tag
					return this.tagSelectedList.splice(i,1);
				}
				//选中
				this.tagSelectedList.push(id);
			},
			/* 日期 */
			dateChange(e){
				this.$set(this.fromList[e.index],'value',e.value)
			},
			/* 输入框 */
			input(e){
				this.$set(this.fromList[e.index],'value',e.value);
				if(e.index==0){
					this.goodNameUsage();
					/* this.$u.throttle(this.goodNameUsage,2000,false); */
				}
			},
			/* 选择输入框 */
			payChange(e){
				console.log(e);
				this.$set(this.fromList[e.index],'value',e.value.label)
				this.$set(this.fromList[e.index],'id',e.value.value)
			},
			/* 获取商品名称智能填充 */
			goodNameUsage(){
				this.http.get('/api/v1/Storage/goodNameUsage',{
					keyword:this.fromList[0].value
				},true).then((res)=>{
					if(res.code==1000){
						if(res.data.brand_fill_arr.brand_id>0){
							this.fromList[1].value=res.data.brand_fill_arr.brand_name;
							this.fromList[1].id=res.data.brand_fill_arr.brand_id;
						}
						if(res.data.cate_fill_arr.cate_id>0){
							this.fromList[2].value=res.data.cate_fill_arr.cate_name;
							this.fromList[2].id=res.data.cate_fill_arr.cate_id;
						}
						this.type_condition.map(v=>{
							if(v.id==res.data.type_condition){
								this.fromList[3].value=v.val;
								this.fromList[3].id=v.id;
							}
						})
					}
				})
			},
			/* 选择附件 */
			selectAttachment(item,index){
				let id=item.id;
				let i=this.attachmentSelectedList.indexOf(id);
				//之前是选中，取消选中
				if(i>-1){
					//移除选中列表中的当前tag
					return this.attachmentSelectedList.splice(i,1);
				}
				//选中
				this.attachmentSelectedList.push(id);
			},
			/* 显示testarea，并获取焦点 */
			inputTextArea(){
				this.showTextArea = true;
			},
			/* 隐藏textarea */
			hideTextArea(){
				this.showTextArea = false;
			},
			/* 提交入库 */
			submit(){
				console.log(this.fromList);
				let img=[]
				this.lists.map(item=>{
					if(item.response&&item.response.code==1000){
						img.push(item.response.data.path);
					}else if(!item.error){
						img.push(item.url)
					}
				});
				let scimg=[]
				this.sclists.map(item=>{
					if(item.response&&item.response.code==1000){
						scimg.push(item.response.data.path);
					}else if(!item.error){
						scimg.push(item.url)
					}
				});
				this.http.post('/api/v1/Storage/goodSto',{
					pic:img[0],
					img:img,
					pri_img:scimg,
					type_for:this.type_for,
					good_id:this.good_id,
					good_name:this.fromList[0].value,
					brand_id:this.fromList[1].id,
					cate_id:this.fromList[2].id||0,
					type_condition:this.fromList[3].id,
					type_times:this.fromList[4].id||0,
					cost_price:this.fromList[5].value,
					share_price:this.fromList[6].value,
					peer_price:this.fromList[7].value,
					sell_price:this.fromList[8].value,
					counter_price:this.fromList[9].value||0,
					type_from:this.fromList[10].id,
					from_cus_id:this.fromList[11].id||0,
					store_house_id:this.fromList[12].id,
					date_in:this.fromList[13].value,
					num:this.fromList[14].value,
					sto_user_id:this.fromList[15].id,
					rec_user_id:this.fromList[16].id,
					serial_num:this.fromList[17].value,
					specs:this.fromList[18].value,
					color:this.fromList[19].value,
					material_info:this.fromList[20].value,
					remark:this.fromList[21].value,
					visible_out:this.fromList[22].id,
					annex_ids:this.attachmentSelectedList,
					care_ids:this.tagSelectedList,
					desc:this.textAreaValue||descAll,
					new_care_condition:this.otherTag,
					pri_video:this.resource
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:'提交成功',
							type:"success",
							back :true
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

<style lang="scss" scoped>
	.pre-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	.pre-item {
		flex: 0 0 48.5%;
		border-radius: 10rpx;
		height: 100rpx;
		overflow: hidden;
		position: relative;
		margin-bottom: 20rpx;
	}
	
	.u-progress {
		position: absolute;
		bottom: 10rpx;
		left: 8rpx;
		right: 8rpx;
		z-index: 9;
		width: auto;
	}
	
	.pre-item-image {
		width: 100%;
		height: 100rpx;
	}
	
	.u-delete-icon {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		z-index: 10;
		background-color: $u-type-error;
		border-radius: 100rpx;
		width: 44rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.u-list-item {
		width: 200rpx;
		height: 200rpx;
		overflow: hidden;
		margin: 10rpx;
		background: rgb(244, 245, 246);
		/* position: relative; */
		border-radius: 10rpx;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		justify-content: center;
	}
	.u-add-wrap {
		flex-direction: column;
		color: $u-content-color;
		font-size: 26rpx;
	}
	.u-add-tips {
		margin-top: 20rpx;
		line-height: 40rpx;
	}
	
	.u-add-wrap__hover {
		background-color: rgb(235, 236, 238);
	}
</style>
