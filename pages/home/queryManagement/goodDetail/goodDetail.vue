<template>
	<view>
		<view class="bg-white u-p-20 u-flex u-col-top solid-bottom">
			<u-image :src="http.resourceUrl()+goodDetail.img" width="226rpx" height="226rpx" ></u-image>
			<view class="u-m-l-20" style="width: 464rpx;">
				<view class="u-line-3 text-bold text-black u-font-28">{{goodDetail.name}}</view>
				<view class="u-line-1 text-gray u-font-22 u-m-t-20" @tap="copy(goodDetail.code)">{{goodDetail.code}}<text class="u-m-l-10">{{goodDetail.storeName}}</text></view>
				<view class="text-gray u-m-t-20">x{{goodDetail.number}}</view>
				<view class="u-m-t-20 u-flex u-row-between u-font-12">
					<navigator open-type="navigate" hover-class="none" url="/pages/home/bookingManagement/bookingManagement">
						<view class="text-gray">当前预定({{goodDetail.order}})</view>
					</navigator>
					<view v-if="goodDetail.is_own==1" style="color: #FE8702;" @click="order">点击预定</view>
				</view>
			</view>
		</view>
		<view class="u-p-30 u-m-l-20 u-m-r-20 u-flex u-row-around">
			<block v-for="(item,k) in priceList" :key="k">
				<view class="u-text-center u-flex-1">
					<view class="u-text-center flex align-center" v-if="item.price">
						<view class="u-font-28 text-black text-bold" style="margin: 0 auto;"><text class="u-font-20">￥</text>{{item.price}}</view>
						<!-- <u-count-to :start-val="0" :end-val="item.price" :decimals="2" :duration="1500" font-size="28" color="#333333"></u-count-to> -->
					</view>
					<view v-else class="u-text-center">---</view>
					<view class="text-gray u-text-center u-font-22">{{item.name}}</view>
				</view>
			</block>
		</view>
		<!-- 间隔槽 -->
		<u-gap height="20" bg-color="#F5F5F5"></u-gap>
		<view class="u-text-center u-flex u-row-between solid-bottom">
			<view class="u-flex-1 u-p-20" :class="currentIndex==0?'bg-orange':''" @click="currentChange(0)">商品信息</view>
			<view v-if="goodDetail.is_own==1" class="u-flex-1 u-p-20 solid-left"  :class="currentIndex==1?'bg-orange':''" @click="currentChange(1)">业务状态</view>
		</view>
		<!-- 商品信息 -->
		<block v-if="currentIndex==0">
			<!-- 护理情况 -->
			<view class="u-p-30 solid-bottom">
				<view class="u-flex u-flex-wrap">
					<view class="u-flex u-m-b-10 u-m-r-20" style="color: #A5A5A5;">护理情况</view>
					<block v-for="(item,index) in tagList" :key="index">
						<u-tag class="u-m-l-10 u-m-r-10 u-m-b-10" :text="item.content" mode="plain" shape="circle" type="info" :closeable="false"
						bg-color="#FE8702" color="#fff" border-color="#FE8702"/>
					</block>
				</view>
			</view>
			<!-- 商品详情信息列表 -->
			<u-cell-group>
				<block v-for="(item,i) in infoList" :key="i">
					<u-cell-item :title="item.name" :title-style="{'color': '#A5A5A5'}" :value="item.value"
					 :value-style="{'font-size':'28rpx','color':'#333333'}" :arrow="false"></u-cell-item>
				</block>
			</u-cell-group>
			<!-- 附件情况 -->
			<view class="u-p-30 solid-bottom">
				<view class="u-flex u-col-top">
					<view class="u-flex u-m-b-10 u-flex-1" style="color: #A5A5A5;">附件情况</view>
					<view class="u-flex u-flex-wrap u-flex-4">
						<block v-for="(item,j) in attachmentList" :key="j">
							<u-tag class="u-m-l-10 u-m-r-10 u-m-b-10" :text="item.content" mode="plain" shape="circle" type="info" :closeable="false"
							bg-color="#FE8702" color="#fff" border-color="#FE8702"/>
						</block>
					</view>
				</view>
			</view>
			<!-- 商品图片 -->
			<view class="u-p-30 solid-bottom">
				<view class="u-flex u-row-between">
					<view class="u-flex u-m-b-10 u-flex-1" style="color: #A5A5A5;">商品图片</view>
					<view class="text-yellow text-sm" @click="getSaveImgRole">一键下载到手机</view>
				</view>
				<view class="u-flex u-flex-wrap u-row-left">
					<block v-for="(item,v) in imgList" :key="v">
						<u-image @click="showImg(0,v)" show-menu-by-longpress :src="item" height="159rpx" width="159rpx" class="u-m-b-15 u-m-r-10"></u-image>
					</block>
				</view>
			</view>
			<!-- 隐私图片 -->
			<view class="u-p-30 solid-bottom" v-if="scimgList.length!=0">
				<view class="u-flex u-row-between">
					<view class="u-flex u-m-b-10 u-flex-1" style="color: #A5A5A5;">隐私图片</view>
					<view class="text-yellow text-sm" @click="downLoadscImg">一键下载到手机</view>
				</view>
				<view class="u-flex u-flex-wrap u-row-left">
					<block v-for="(item,s) in scimgList" :key="s">
						<u-image @click="showImg(1,s)" show-menu-by-longpress :src="item" height="159rpx" width="159rpx" class="u-m-b-15 u-m-r-10"></u-image>
					</block>
				</view>
			</view>
			<!-- 视频 -->
			<view class="u-p-30 solid-bottom" v-if="videoResource">
				<view class="u-flex u-row-between">
					<view class="u-flex u-m-b-10 u-flex-1" style="color: #A5A5A5;">视频</view>
					<view class="text-yellow text-sm" @click="uploadVideo">一键下载到手机</view>
				</view>
				<view class="u-flex u-flex-wrap u-row-left u-m-t-10">
					<video :src="videoResource" style="width: 100%;" objectFit="cover"></video>
				</view>
			</view>
			<!-- 商品描述 -->
			<u-cell-group>
				<!-- <u-cell-item title="商品描述" :title-style="{'color': '#A5A5A5'}" :value="desc||''"
				  :value-style="{'font-size':'32rpx','color':'#333333'}" :arrow="false" :hover-class="false"></u-cell-item> -->
				<u-cell-item title="综合描述" :title-style="{'color': '#A5A5A5'}" :value="totalDesc||''"
				  :value-style="{'font-size':'32rpx','color':'#333333'}" :arrow="false" :hover-class="false" @click="copy(totalDesc)"></u-cell-item>
			</u-cell-group>
		</block>
		
		<!-- 业务状态 -->
		<block v-else>
			<!-- 业务信息 -->
			<u-cell-group>
				<block v-for="(item,j) in businesList" :key="j">
					<u-cell-item :title="item.name" :title-style="{'color': '#A5A5A5'}"
					  :value-style="{'font-size':'28rpx','color':'#333333'}" :value="item.value" :arrow="false"></u-cell-item>
				</block>
				<view class="u-p-30">入库记录</view>
				<block v-for="(item,q) in wareHouseList" :key="q">
					<u-cell-item :title="item.name" :title-style="{'color': '#A5A5A5'}"
					  :value-style="{'font-size':'28rpx','color':'#333333'}" :value="item.value" :arrow="false"></u-cell-item>
				</block>
				<view class="u-p-l-30 u-p-t-10 u-p-b-10 u-flex u-row-between">
					<view>销售记录</view>
					<view class="u-flex u-row-between">
						<!-- <view class="text-sm u-m-t-10" style="color: #FE8702;" @click="toDetail">查看销售单详情</view> -->
						<view class="text-sm u-m-t-10 u-m-r-30" style="color: #FE8702;" @click="toList">查看更多</view>
					</view>
				</view>
				<block v-for="(item,z) in saleList" :key="z">
					<u-cell-item :title="item.name" :title-style="{'color': '#A5A5A5'}"
					 :value-style="{'font-size':'28rpx','color':'#333333'}" :value="item.value" :arrow="false"></u-cell-item>
				</block>
				<view class="u-p-l-30 u-p-t-10 u-p-b-10 u-flex u-row-between">
					<view>库存编辑记录</view>
					<view class="u-flex u-row-between">
						<!-- <view class="text-sm u-m-t-10" style="color: #FE8702;" @click="toDetail">查看销售单详情</view> -->
						<view class="text-sm u-m-t-10 u-m-r-30" style="color: #FE8702;" @click="toHistory">查看更多</view>
					</view>
				</view>
				<block v-for="(item,n) in setList" :key="n">
					<u-cell-item :title="item.name" :title-style="{'color': '#A5A5A5'}"
					  :value-style="{'font-size':'28rpx','color':'#333333'}" :value="item.value" :arrow="false"></u-cell-item>
				</block>
			</u-cell-group>
		</block>
		<!-- 改库存 -->
		<u-popup v-model="showPopup" mode="bottom">
			<view class="u-p-20 bg-gray u-text-center">修改库存商品</view>
			<u-cell-group>
				<u-cell-item icon="clock-fill" title="退还来源方" iconSize="40rpx" @click="showItem(0)"></u-cell-item>
				<u-cell-item icon="checkmark-circle-fill" title="其他" iconSize="40rpx" @click="showItem(1)"></u-cell-item>
				<!-- <u-cell-item icon="close-circle" :arrow="false" title="取消订单" iconSize="40rpx" @click="toDetail"></u-cell-item> -->
				<u-cell-item icon="close-circle-fill" :arrow="false" title="删除" iconSize="40rpx" @click="delet"></u-cell-item>
			</u-cell-group>
		</u-popup>
		<u-popup v-model="showReason" mode="bottom">
			<view class="u-p-20 bg-gray u-text-center">{{reason}}</view>
			<view class="u-p-20 bg-white u-flex u-row-between solid-bottom">
				<view>商品数量调整为</view>
				<u-number-box v-model="number"></u-number-box>
			</view>
			<view class="u-p-20 bg-white u-flex u-row-between solid-bottom" @click="showDate=true">
				<view>改库存时间</view>
				<view>{{time}}</view>
			</view>
			<view class="u-p-20 bg-white u-flex u-row-between solid-bottom">
				<view>填写备注</view>
				<input adjust-position="true" class="u-text-right" v-model="memo" type="text" placeholder="输入备注" />
			</view>
			<u-gap bg-color="#f0f0f0" height="80"></u-gap>
			<view class="u-p-20 bg-white">
				<u-button type="warning" @click="editStoNum">确定</u-button>
			</view>
		</u-popup>
		
		<u-toast ref="uToast"></u-toast>
		
		<!-- 显示电话和微信号 -->
		<u-modal v-model="showModal" confirm-text="点击微信或电话复制">
			<view slot="default">
				<view class="u-m-20 u-m-b-10 u-text-center" @click="copy(goodDetail.store_mobile)">卖家电话:{{goodDetail.store_mobile}}</view>
				<view class="u-m-20 u-m-t-10 u-text-center" @click="copy(goodDetail.store_wx)">卖家微信:{{goodDetail.store_wx}}</view>
			</view>
		</u-modal>
		
		<!-- 调整原因和时间 -->
		<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="date" @change="dateChange" :min-date="toDay" max-date="2050-12-31"></u-calendar>
		<!-- <u-action-sheet :list="reasonList" v-model="showReason" border-radius="25" @click="chooseReason" :cancel-btn="true"></u-action-sheet> -->
		<!-- 底部导航栏 -->
		<view class="cu-tabbar-height"></view>
		<view class="addTabBtn bg-white u-flex u-text-center u-row-between" v-if="goodDetail.is_own==1">
			<navigator open-type="navigate" :url="`/pages/home/goodsInStorage/goodsInStorage?good_id=${goodId}&type_for=1`" hover-class="none" class="u-flex u-flex-1 u-row-center">
				<u-icon name="https://7778-wxpay-yai0c-1303163285.tcb.qcloud.la/editbutton.png?sign=91e5e85bfe4fb4d78e66f3d9057340c0&t=1611937089"
				 label="编辑" label-pos="bottom"  size="40rpx" margin-top="12rpx" label-size="25rpx"></u-icon>
			</navigator>
			<view class="u-flex u-flex-1 u-row-center" @click="showPopup=true">
				<u-icon name="https://7778-wxpay-yai0c-1303163285.tcb.qcloud.la/gcjbutton.png?sign=26259e5946c3578186402f0ce5c4539e&t=1611937039"
				 label="改库存" label-pos="bottom" size="40rpx" margin-top="12rpx" label-size="25rpx"></u-icon>
			</view>
			<navigator open-type="navigate" :url="`/pages/home/goodsInStorage/goodsInStorage?good_id=${goodId}&type_for=2`" hover-class="none" class="u-flex u-flex-1 u-row-center">
				<u-icon name="https://7778-wxpay-yai0c-1303163285.tcb.qcloud.la/copybutton.png?sign=6b088ad78391bccc16f8dcaca7739149&t=1611937124"
				 label="复制新建" label-pos="bottom" size="40rpx" margin-top="12rpx" label-size="25rpx"></u-icon>
			</navigator>
			<view class="u-flex u-flex-1 u-row-center" @click="print">
				<u-icon name="https://7778-wxpay-yai0c-1303163285.tcb.qcloud.la/print.png?sign=02f9ececc30e9cd790753fa2e9791bd7&t=1611937146"
				 label="打印" label-pos="bottom" size="40rpx" margin-top="12rpx" label-size="25rpx"></u-icon>
			</view>
			<navigator open-type="navigate" :url="`/pages/home/salesBilling/salesBilling?good_id=${goodId}`" hover-class="none"
			 class="u-flex-1 u-p-30 text-white" style="background-color: #FE8702;">开单</navigator>
		</view>
		
		<view class="addTabBtn bg-white u-flex u-text-center u-row-between" v-else>
			<navigator open-type="navigate" :url="`/pages/home/goodsInStorage/goodsInStorage?good_id=${goodId}&type_for=2`" hover-class="none" class="u-flex u-flex-1 u-row-center">
				<u-icon name="https://7778-wxpay-yai0c-1303163285.tcb.qcloud.la/copybutton.png?sign=6b088ad78391bccc16f8dcaca7739149&t=1611937124"
				 label="复制新建" label-pos="bottom" size="40rpx" margin-top="12rpx" label-size="25rpx"></u-icon>
			</navigator>
			<view class="u-flex u-flex-1 u-row-center" @click="showModal = true">
				<u-icon name="phone" label="联系卖家" label-pos="bottom" size="40rpx" margin-top="12rpx" label-size="25rpx"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.goodId=e.id;
			var ti= new Date();
			this.toDay=this.http.dateFormat("YYYY-mm-dd",ti);
			this.time=this.toDay;
		},
		onShow() {
			this.getInfo();
		},
		data() {
			return {
				goodId:'',
				order_id:'',
				goodDetail:{
					img:'',
					name:'',
					code:'',
					storeName:'',
					order:0,
					number:1,
					is_own:'',
					store_mobile:'',
					store_wx:''
				},
				priceList:[
					{name:'共享价',price:''},
					{name:'同行价',price:''},
					{name:'销售价',price:''},
					{name:'专柜价',price:''},
					{name:'成本价',price:''}
				],
				/* 导航栏 */
				currentIndex:0,
				/* 护理情况 */
				tagList:[],
				/* 商品信息列表 */
				infoList:[
					{name:'店铺货号',value:'BLEW210129001'},
					{name:'商品序列号',value:'未知'},
					{name:'规格型号',value:'未知'},
					{name:'商品颜色',value:'未知'},
					{name:'材料说明',value:'未知'},
					{name:'商品成色',value:'二手货品'},
				],
				/* 附件情况 */
				attachmentList:[],
				/* 图片 */
				imgList:[],
				scimgList:[],
				/* 视频地址 */
				videoResource:'',
				/* 商品描述 */
				desc:'',
				/* 综合描述 */
				totalDesc:'',
				
				/* 业务状态信息列表 */
				businesList:[
					{name:'商品来源',value:''},
					{name:'商品来源方',value:''},
					{name:'入库人',value:''},
					{name:'回收人',value:''},
					{name:'入库时间',value:''}
				],
				/* 入库记录 */
				wareHouseList:[
					{name:'操作时间',value:''},
					{name:'入库日期',value:''},
					{name:'入库人',value:''},
					{name:'商品来源',value:''},
					{name:'商品来源方',value:''},
				],
				/* 销售记录 */
				saleList:[
					{name:'操作时间',value:''},
					{name:'销售日期',value:''},
					{name:'销售员',value:''},
					{name:'销售客户',value:''},
				],
				/* 库存编辑记录 */
				setList:[
					{name:'操作时间',value:''},
					{name:'改库存时间',value:''},
					{name:'操作者',value:''},
					{name:'操作数量',value:''},
					{name:'操作类型',value:''},
					{name:'备注',value:''},
				],
				/* 改库存 */
				showPopup:false,
				number:0,
				reason:'退还来源方',
				reasonId:0,
				showReason:false,
				reasonList:[{
					text: '退还来源方',
					color: 'black',
					fontSize: 28,
					id:0
				},{
					text: '其他',
					color: 'black',
					fontSize: 28,
					id:1
				}],
				//时间
				showDate:false,
				toDay:"",//今天
				time:'',
				memo:'',
				showModal:false
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/getGoodDetail',{
					good_id:this.goodId
				},true).then((res)=>{
					if(res.code==1000){
						this.goodDetail.name=res.data.title;
						this.goodDetail.code=res.data.store_no;
						this.goodDetail.storeName=res.data.store_name;
						this.goodDetail.img=res.data.pic;
						this.goodDetail.number=res.data.num_now;
						this.goodDetail.order=res.data.num_book;
						this.goodDetail.is_own=res.data.is_own;
						this.goodDetail.store_mobile=res.data.store_mobile;
						this.goodDetail.store_wx=res.data.store_wx;
						this.desc=res.data.desc;
						this.totalDesc=res.data.desc;
						
						this.priceList[0].price=res.data.share_price;
						this.priceList[1].price=res.data.peer_price;
						this.priceList[2].price=res.data.sell_price;
						this.priceList[3].price=res.data.counter_price;
						this.priceList[4].price=res.data.cost_price;
						
						this.tagList=res.data.care;
						this.attachmentList=res.data.annex;
						
						this.infoList[0].value=res.data.store_no;
						this.infoList[1].value=res.data.good_serial_num;
						this.infoList[2].value=res.data.specs;
						this.infoList[3].value=res.data.color;
						this.infoList[4].value=res.data.material_info;
						this.infoList[5].value=res.data.type_condition;
						
						this.imgList=res.data.img.map(v=>{
							return v=this.http.resourceUrl()+v
						});
						
						this.videoResource=res.data.pri_video&&res.data.pri_video!='[]'?this.http.resourceUrl()+res.data.pri_video:''
						
						if(res.data.pri_img_arr.is_show)
						this.scimgList=res.data.pri_img_arr.pri_img.map(v=>{
							return v=this.http.resourceUrl()+v
						});
						/* this.imgList=res.data.img; */
						
						this.businesList[0].value=res.data.business.type_from;
						this.businesList[1].value=res.data.business.type_from_cus;
						this.businesList[2].value=res.data.business.sto_user;
						this.businesList[3].value=res.data.business.recovery_user;
						this.businesList[4].value=res.data.business.created_at;
						
						this.wareHouseList[0].value=res.data.sto_log.created_at;
						this.wareHouseList[1].value=res.data.sto_log.date_in;
						this.wareHouseList[2].value=res.data.sto_log.sto_user;
						this.wareHouseList[3].value=res.data.sto_log.type_from;
						this.wareHouseList[4].value=res.data.sto_log.type_from_cus;
						
						this.saleList[0].value=res.data.order.created_at;
						this.saleList[1].value=res.data.order.date_in;
						this.saleList[2].value=res.data.order.seller;
						this.saleList[3].value=res.data.order.customer;
						
						this.setList[0].value=res.data.sto_edit_log.created_at;
						this.setList[1].value=res.data.sto_edit_log.edit_at;
						this.setList[2].value=res.data.sto_edit_log.user;
						this.setList[3].value=res.data.sto_edit_log.str;
						this.setList[4].value=res.data.sto_edit_log.reason;
						this.setList[5].value=res.data.sto_edit_log.remark;
						
						this.order_id=res.data.order.order_id;
					}
				})
			},
			/* 导航栏切换 */
			currentChange(e){
				this.currentIndex=e;
			},
			order(){
				uni.navigateTo({url: `/pages/home/queryManagement/goodDetail/order?good_id=${this.goodId}&goodDetail=${encodeURIComponent(JSON.stringify(this.goodDetail))}`});
			},
			showImg(index,v){
				/* let imgs=this.imgList.map(item=>{
					console.log(item);
					return this.http.resourceUrl()+item
				}) */
				uni.previewImage({
					current:v,
					urls:index==0?this.imgList:this.scimgList
				})
			},
			//获取微信用户保存图片权限
			getSaveImgRole(){
				wx.getSetting({
				  success:(res)=>{
				    if (!res.authSetting['scope.writePhotosAlbum']) {
				      wx.authorize({
				        scope: 'scope.writePhotosAlbum',
				        success:()=> {
				          console.log('success')
						  this.downLoadImg();
				        }
				      })
				    }else{
						this.downLoadImg();
					}
				  }
				})
			},
			/* 下载到手机上 */
			downLoadImg(){
				let length =this.imgList.length;
				this.imgList.map((item,index)=>{
					console.log(index);
					if(index === 0 && length != 1){
						this.$refs.uToast.show({
							title:"正在保存，请稍后！",
							type:"warning"
						});
					}
					uni.downloadFile({
						url:item,
						success:(res)=>{
							console.log(res.tempFilePath);
							uni.saveImageToPhotosAlbum({
								filePath:res.tempFilePath,
								success: (e) => {
									if(index === length-1){
										this.$refs.uToast.show({
											title:"保存成功！请在相册中查看！",
											type:"success"
										});
										this.copy(this.totalDesc)
									}
								},
								fail: (re) => {
									console.log(re);
								}
							})
						}
					})
				})
			},
			downLoadscImg(){
				this.scimgList.map(item=>{
					uni.downloadFile({
						url:item,
						success:(res)=>{
							console.log(res.tempFilePath);
							uni.saveImageToPhotosAlbum({
								filePath:res.tempFilePath,
								success: (e) => {
									console.log(e);
								},
								fail: (re) => {
									console.log(re);
								}
							})
						}
					})
				})
			},
			/* 视频下载保存相册 */
			uploadVideo() {
				uni.showLoading();
				const downloadTask = uni.downloadFile({
					// 视频路径 测试视频demo时长有1分钟
					url: this.videoResource, 
					success: res => {
						if (res.statusCode === 200) {
							// 视频保存到手机相册
							uni.saveVideoToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功',
										icon: 'none'
									});
								},
								fail: function() {
									uni.hideLoading();
									uni.showToast({
										title: '保存失败，请稍后重试',
										icon: 'none'
									});
								}
							});
						}
					}
				});
				// 下载进度监听
				downloadTask.onProgressUpdate(res => {
					console.log('下载进度' + res.progress);
					console.log('已经下载的数据长度' + res.totalBytesWritten);
					console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
				});
			},
			/* 联系我 */
			makePhonecall(){
				uni.makePhoneCall({
					phoneNumber:this.goodDetail.store_mobile
				})
			},
			/* 删除 */
			delet(){
				this.http.modal('提示','您确定要删除商品吗，删除后不可恢复？',true,(e)=>{
					if(e){
						this.http.post('/api/v1/Storage/goodDelete',{
							good_id:this.goodId
						}).then((res)=>{
							if(res.code==1000){
								uni.$emit('back');
								this.$refs.uToast.show({
									title:res.msg,
									type:"success",
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
				},'#FE8702')
			},
			/* 选择调整原因 */
			chooseReason(e){
				this.reason=this.reasonList[e].text;
				this.reasonId=this.reasonList[e].id;
			},
			/* 打印 */
			print(){
				this.http.modal('提示','您要打印商品详情吗？',true,(e)=>{
					if(e){
						this.http.get('/api/v1/Printer/goods',{
							type:0,//0商品信息打印1销售单
							goods_id:this.goodId
						}).then((res)=>{
							if(res.code==1000){
								this.$refs.uToast.show({
									title:res.msg,
									type:"success"
								});
							}else{
								this.$refs.uToast.show({
									title:res.msg,
									type:"error"
								})
							}
						})
					}
				},'#FE8702')
			},
			/* 修改库存 */
			editStoNum(){
				this.http.post('/api/v1/History/editStoNum',{
					good_id:this.goodId,
					num_now:this.number,
					reason:this.reasonId,
					edit_at:this.time,
					remark:this.memo,
				}).then((res)=>{
					if(res.code==1000){
						this.$refs.uToast.show({
							title:res.msg,
							type:"success"
						});
						this.showPopup=false;
						this.showReason=false;
						this.number=0;
						this.getInfo();
					}else{
						this.$refs.uToast.show({
							title:res.msg,
							type:"error"
						})
					}
				})
			},
			/* 复制粘贴 */
			copy(data){
				uni.setClipboardData({
					data:data
				})
			},
			toDetail(){
				if(this.order_id!=''){
					uni.navigateTo({url: `/pages/home/salesReport/orderDetail/orderDetail?id=${this.order_id}`});
				}else{
					this.$refs.uToast.show({
						title:'本商品暂无销售记录',
						type:"warning"
					})
				}
			},
			showItem(index){
				this.chooseReason(index);
				this.showReason=true;
			},
			toList(){
				if(this.order_id!=''){
					uni.navigateTo({url: `/pages/home/salesReport/salesReport?good_id=${this.goodId}`});
				}else{
					this.$refs.uToast.show({
						title:'本商品暂无销售记录',
						type:"warning"
					})
				}
			},
			toHistory(){
				if(this.setList[1].value!=''){
					uni.navigateTo({url: `/pages/home/history/history?good_id=${this.goodId}&currentIndex=2`});
				}else{
					this.$refs.uToast.show({
						title:'本商品暂无库存编辑记录',
						type:"warning"
					})
				}
			}
		}
	}
</script>

<style scoped>
	.addTabBtn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		box-shadow: -5px 0px 3px #F5F5F5 ;
	}
	.bg-orange{
		color: #FFFFFF;
		background-color: #FE8702;
	}
</style>
