<template>
	<view>
		<view :class="formPadding" class="bg-white u-flex u-row-between solid-bottom" v-if="item.type=='input'">
			<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
			<input adjust-position="true" class="u-text-right" :value="item.value" @input="handleInput" :maxlength="item.length||140" :type="item.inputType" :placeholder="item.placeholder" />
		</view>
		<view :class="formPadding" class="bg-white u-flex u-row-between solid-bottom" v-if="item.type=='input2'">
			<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
			<input adjust-position="true" class="u-text-right" :value="item.value" @blur="handleInput" :maxlength="item.length||140" :type="item.inputType" :placeholder="item.placeholder" />
		</view>
		<view v-else-if="item.type=='picker'" @click="navigator(item.url,item.disable)" :class="formPadding" class="bg-white u-flex u-row-between solid-bottom">
			<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
			<view class="u-flex">
				<view>{{item.value||''}}</view>
				<u-icon name="arrow-right" size="32rpx" color="#D8D8D8"></u-icon>
			</view>
		</view>
		<block v-else-if="item.type=='datePicker'">
			<view :class="formPadding" class="bg-white u-flex u-row-between solid-bottom" @click="showDate=true">
				<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
				<view class="u-flex">
					<view>{{item.value||''}}</view>
					<u-icon name="arrow-right" size="32rpx" color="#D8D8D8"></u-icon>
				</view>
			</view>
			<u-calendar v-model="showDate" btn-type="warning" active-bg-color="#FE8702" mode="date" @change="dateChange" :min-date="toDay" max-date="2050-12-31"></u-calendar>
		</block>
		<block v-else-if="item.type=='payPicker'">
			<view :class="formPadding" class="bg-white u-flex u-row-between solid-bottom" @click="showPayList=true">
				<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
				<view class="u-flex">
					<view>{{item.value||''}}</view>
					<u-icon name="arrow-right" size="32rpx" color="#D8D8D8"></u-icon>
				</view>
			</view>
			<u-select v-model="showPayList" confirmColor="#FE8702" mode="single-column" :list="item.list" @confirm="choosePay"></u-select>
		</block>
		<block v-else-if="item.type=='switch'">
			<view :class="formPadding" class="bg-white u-flex u-row-between solid-bottom">
				<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
				<u-switch v-model="item.value" active-color="#FE8702" active-value="1" inactive-value="0" size="40"></u-switch>
			</view>
		</block>
		<block v-else-if="item.type=='timePicker'">
			<view :class="formPadding" class="bg-white u-flex u-row-between solid-bottom" @click="showTime=true">
				<view class="u-flex u-m-b-10 u-m-r-20">{{item.name}}<text class="u-type-error" v-if="item.isImport">*</text></view>
				<view>{{item.value}}</view>
			</view>
			<u-picker mode="time" v-model="showTime" start-year="2021" :default-time="item.value" :params="params" confirm-color="#FE8702" @confirm="timeChange"></u-picker>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			item:Object,
			index:Number,
			toDay:String,
			formPadding:{
				type:String,
				default:"u-p-30"
			}
		},
		data() {
			return {
				showDate: false,
				showPayList:false,
				showTime:false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
			};
		},
		methods:{
			/* 日期 */
			dateChange(e){
				this.$emit('change',{value:e.result,index:this.index})
			},
			/* 时间 */
			timeChange(e){
				console.log(e);
				this.$emit('timeChange',{value:e.year+'-'+e.month+'-'+e.day+'  '+e.hour+':'+e.minute+':'+e.second,index:this.index})
			},
			/* 支付 */
			choosePay(e){
				this.$emit('payChange',{value:e[0],index:this.index})
			},
			/* 输入框 */
			handleInput(e){
				this.$emit('input',{value:e.detail.value,index:this.index})
			},
			navigator(Link,disable){
				if(disable) return;
				uni.navigateTo({url: Link});
			}
		}
	}
</script>

<style>
</style>
