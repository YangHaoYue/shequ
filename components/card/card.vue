<template>
	<view class="card" :style="cardStyle">
		<!-- head -->
		<view v-if="showhead" class="p-2 main-border-color d-flex a-center j-sb"
		:class="getHeadClass">
			<slot name="title">
				<text v-if="headTitle" class="font-md"
				:class="headTitleWeight?'font-weight':''">{{headTitle}}</text>
			</slot>
			<slot name="right"></slot>
		</view>
		<!-- body -->
		<view :class="getBodyClass" :style="bodyStyle">
			<image v-if="bodyCover" :src="bodyCover" 
			mode="widthFix" style="height: 300rpx;width: 750rpx;"></image>
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			bodyStyle:String,
			// 头部标题
			headTitle:String,
			// 封面图
			bodyCover:String,
			// 是否显示头部
			showhead:{
				type:Boolean,
				default:true
			},
			// 是否显示下边线
			headBorderBottom:{
				type:Boolean,
				default:true
			},
			// 标题是否加粗
			headTitleWeight:{
				type:Boolean,
				default:true
			},
			// 是否给body加padding
			bodyPadding:{
				type:Boolean,
				default:false
			},
			cardStyle:{
				type:String,
				default:""
			}
		},
		computed: {
			getHeadClass() {
				let BorderBottom = this.headBorderBottom ? 'border-bottom':''
				return `${BorderBottom}`
			},
			getBodyClass(){
				let padding = this.bodyPadding ? 'p-2' : ''
				return `${padding}`
			}
		},
	}
</script>

<style scoped>
	.p-2 {padding-left: 20upx;padding-right: 20upx;padding-top: 20upx;padding-bottom: 20upx;}
	.border-bottom{ border-bottom-width: 1upx;border-bottom-style: solid;border-bottom-color:var(--borderColor);}
	.main-border-color{ border-color: #F1F1F1; }
	.d-flex{ display: flex;flex-direction: row!important; }
	.a-center{ align-items:center!important; }
	.j-sb{ justify-content: space-between; }
	.font-weight{ font-weight: bold!important; }
	.font-md{ font-size: 30upx; }
</style>
