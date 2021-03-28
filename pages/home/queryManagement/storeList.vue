<template>
	<view>
		<u-cell-group>
			<block v-for="(item,index) in list" :key="index">
				<u-cell-item :title="item.name" :arrow="false"></u-cell-item>
			</block>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[{
					name:'全部店铺',
					id:0
				},{
					name:'测试',
					id:0
				},{
					name:'奢美龙宝店',
					id:0
				},{
					name:'奢美明发店',
					id:0
				},{
					name:'奢美湖明店',
					id:0
				},{
					name:'奢美公司',
					id:0
				},{
					name:'花畔里',
					id:0
				},{
					name:'提香奢品',
					id:0
				},{
					name:'奢美明发店',
					id:0
				},{
					name:'奢美湖明店',
					id:0
				},{
					name:'奢美公司',
					id:0
				},{
					name:'花畔里',
					id:0
				},{
					name:'提香奢品',
					id:0
				},{
					name:'奢美明发店',
					id:0
				},{
					name:'奢美湖明店',
					id:0
				},{
					name:'奢美公司',
					id:0
				},{
					name:'花畔里',
					id:0
				},{
					name:'提香奢品',
					id:0
				}]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
