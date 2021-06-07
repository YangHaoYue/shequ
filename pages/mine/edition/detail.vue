<template>
	<view>
		<rich-text :nodes="data"></rich-text>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.id = e.id;
			this.getInfo()
		},
		data() {
			return {
				id:'',
				data:''
			}
		},
		methods: {
			getInfo(){
				this.http.post('/api/v1/Auth/getVersionDetail',{
					version_id:this.id
				}).then((res)=>{
					this.data = res.data.content;
				})
			}
		}
	}
</script>

<style>

</style>
