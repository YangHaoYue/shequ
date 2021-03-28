<template>
	<view>
		<rich-text :nodes="htmlData"></rich-text>
	</view>
</template>

<script>
	export default {
		onLoad(e) {
			this.id=e.id;
			this.getInfo()
		},
		data() {
			return {
				id:'',
				htmlData:''
			}
		},
		methods: {
			getInfo(){
				this.http.get('/api/v1/Index/getBannerDetail',{
					banner_id:this.id
				}).then(res=>{
					if(res.code==1000){
						this.htmlData=res.data.content;
					}
				})
			}
		}
	}
</script>

<style>

</style>
