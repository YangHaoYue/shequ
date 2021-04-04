/**
 * 常用方法封装 请求，文件上传等
 * @author echo. 
 **/

const tui = {
	//接口地址
	interfaceUrl: function() {
		return 'https://shequ.0831.run'
	},
	//资源地址
	resourceUrl:function(){
		return 'https://oss.searchfun.com.cn/'
	},
	toast: function(text, duration, success) {
		uni.showToast({
			title: text || "出错啦~",
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	modal: function(title, content, showCancel, callback, confirmColor, confirmText,cancelText) {
		uni.showModal({
			title: title || '提示',
			content: content,
			showCancel: showCancel,
			cancelColor: "#555",
			confirmColor: confirmColor || "#5677fc",
			confirmText: confirmText || "确定",
			cancelText: cancelText || '取消',
			success(res) {
				if (res.confirm) {
					callback && callback(true)
				} else {
					callback && callback(false)
				}
			}
		})
	},
	isAndroid: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android"
	},
	isPhoneX: function() {
		const res = uni.getSystemInfoSync();
		let iphonex = false;
		let models=['iphonex','iphonexr','iphonexsmax','iphone11','iphone11pro','iphone11promax']
		const model=res.model.replace(/\s/g,"").toLowerCase()
		if (models.includes(model)) {
			iphonex = true;
		}
		return iphonex;
	},
	constNum: function() {
		let time = 0;
		// #ifdef APP-PLUS
		time = this.isAndroid() ? 300 : 0;
		// #endif
		return time
	},
	delayed: null,
	/**
	 * 请求数据处理
	 * @param string url 请求地址
	 * @param string method 请求方式
	 *  GET or POST
	 * @param {*} postData 请求参数
	 * @param bool isDelay 是否延迟显示loading
	 * @param bool isForm 数据格式
	 *  true: 'application/x-www-form-urlencoded'
	 *  false:'application/json'
	 * @param bool hideLoading 是否隐藏loading
	 *  true: 隐藏
	 *  false:显示
	 */
	request: function(url, method, postData, isDelay, isForm, hideLoading) {
		//接口请求
		let loadding = false;
		tui.delayed && uni.hideLoading();
		clearTimeout(tui.delayed);
		tui.delayed = null;
		if (!hideLoading) {
			tui.delayed = setTimeout(() => {
				uni.showLoading({
					mask: true,
					title: '请稍候...',
					success(res) {
						loadding = true
					}
				})
			}, isDelay ? 1000 : 0)
		}

		return new Promise((resolve, reject) => {
			uni.request({
				url: tui.interfaceUrl() + url,
				data: postData,
				header: {
					'content-type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
					'Authorization':'Bearer '+ tui.getToken()
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					clearTimeout(tui.delayed)
					tui.delayed = null;
					if (loadding && !hideLoading) {
						uni.hideLoading()
					}
					/* if(res.data.code==2000){
						tui.toast(res.data.msg);
						setTimeout(()=>{uni.navigateBack({delta: 1});},1000)
					} */
					if (res.data.code == 401) {
						uni.clearStorageSync()
						tui.modal("","登录信息已失效，请重新登录", false, () => {
							//store.commit("logout") 登录页面执行
							uni.reLaunch({
								url:'/pages/login/login'
							})
						},'#FE8702')
						return
					}
					return resolve(res.data)
				},
				fail: (res) => {
					clearTimeout(tui.delayed)
					tui.delayed = null;
					tui.toast("网络不给力，请稍后再试~")
					reject(res)
				}
			})
		})
	},
	get:function(url,postData={},hideLoading){
		return this.request(url, "GET", postData, false,false, hideLoading)
	},
	post:function(url,postData={},hideLoading){
		return this.request(url, "POST", postData, false,false, hideLoading)
	},
	/**
	 * 上传文件
	 * @param string url 请求地址
	 * @param string src 文件路径
	 */
	uploadFile: function(url, src) {
		uni.showLoading({
			title: '请稍候...',
			mask:true
		})
		return new Promise((resolve, reject,fileType) => {
			const uploadTask = uni.uploadFile({
				url: tui.interfaceUrl() + url,
				fileType:fileType||'image',
				filePath:src,
				name:'file',
				header: {
					'Authorization':'Bearer '+ tui.getToken()
				},
				formData: {
					// sizeArrayText:""
				},
				success: function(res) {
					console.log(res);
					if(res.data.code==2000){
						tui.toast(res.data.msg);
					}
					let d = JSON.parse(res.data.replace(/\ufeff/g, "") || "{}")
					console.log(d);
					if (d.code % 100 == 0) {
						//返回图片地址
						let fileObj = d;
						resolve(fileObj)
					} else {
						tui.toast(res.msg);
					}
					uni.hideLoading();
				},
				fail: function(res) {
					reject(res)
					tui.toast(res.msg);
				}
			})
		})
	},
	tuiJsonp: function(url, callback, callbackname) {
		// #ifdef H5
		window[callbackname] = callback;
		let tuiScript = document.createElement("script");
		tuiScript.src = url;
		tuiScript.type = "text/javascript";
		document.head.appendChild(tuiScript);
		document.head.removeChild(tuiScript);
		// #endif
	},
	//设置用户信息
	setUserInfo: function(token,avatarUrl,nickName,mobile) {
		uni.setStorageSync("thorui_token", token)
		uni.setStorageSync("thorui_mobile", mobile)
		uni.setStorageSync('personImg',avatarUrl);
		uni.setStorageSync('nickName',nickName);
	},
	//获取token
	getToken() {
		return uni.getStorageSync("thorui_token")
	},
	//判断是否登录
	isLogin: function() {
		return uni.getStorageSync("thorui_token") ? true : false
	},
	//跳转页面，校验登录状态
	href(url, isVerify) {
		if (isVerify && !tui.isLogin()) {
			uni.navigateTo({
				url: '/pages/mine/login'
			})
		} else {
			uni.navigateTo({
				url: url
			});
		}
	},
	//时间格式化
	dateFormat:function(fmt, date) {
	    let ret;
	    const opt = {
	        "Y+": date.getFullYear().toString(),        // 年
	        "m+": (date.getMonth() + 1).toString(),     // 月
	        "d+": date.getDate().toString(),            // 日
	        "H+": date.getHours().toString(),           // 时
	        "M+": date.getMinutes().toString(),         // 分
	        "S+": date.getSeconds().toString()          // 秒
	        // 有其他格式化字符需求可以继续添加，必须转化成字符串
	    };
	    for (let k in opt) {
	        ret = new RegExp("(" + k + ")").exec(fmt);
	        if (ret) {
	            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
	        };
	    };
	    return fmt;
	}
}

export default tui
