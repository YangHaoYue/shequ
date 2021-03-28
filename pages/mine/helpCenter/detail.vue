<template>
	<view>
		<rich-text :nodes="data"></rich-text>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.getInfo(e.id);
		},
		data() {
			return {
				data:''
			}
		},
		methods: {
			getInfo(id){
				this.http.get('/api/v1/Help/getDetail',{
					help_id:id
				}).then((res)=>{
					if(res.code==1000){
						uni.setNavigationBarTitle({
							title:res.data.title
						});
						this.data=res.data.content;
					}
				})
			}
		}
	}
</script>

<style>

</style>
