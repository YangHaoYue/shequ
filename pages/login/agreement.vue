<template>
	<view>
		<rich-text :nodes="data"></rich-text>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.type = e.type;
			this.getInfo(e.type);
		},
		data() {
			return {
				type:'',
				data:''
			}
		},
		methods: {
			getInfo(type){
				let urlData = '';
				if(type == 0){
					urlData = '/api/v1/Auth/getUserAgreement'
				}else{
					urlData = '/api/v1/Auth/getUserPriAgreement'
				}
				this.http.post(urlData).then((res)=>{
					console.log(res);
					if(type == 0){
						this.data = res.data.user_agreement
					}else{
						this.data = res.data.user_pri_agreement
					}
				})
			}
		}
	}
</script>

<style>

</style>
