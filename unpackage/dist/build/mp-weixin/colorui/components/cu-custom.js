(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["colorui/components/cu-custom"],{"0770":function(t,a,n){"use strict";var o;n.d(a,"b",(function(){return u})),n.d(a,"c",(function(){return e})),n.d(a,"a",(function(){return o}));var u=function(){var t=this,a=t.$createElement;t._self._c},e=[]},5541:function(t,a,n){"use strict";(function(t){Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var n={data:function(){return{StatusBar:this.StatusBar,CustomBar:this.CustomBar}},name:"cu-custom",computed:{style:function(){var t=this.StatusBar,a=this.CustomBar,n=this.bgImage,o=this.Color,u="height:".concat(a,"px;padding-top:").concat(t,"px;");return this.bgImage&&(u="".concat(u,"background-image:url(").concat(n,");")),this.Color&&(u="".concat(u,"background-color:").concat(o,";")),u}},props:{bgColor:{type:String,default:""},Color:{type:String,default:""},isBack:{type:[Boolean,String],default:!1},showBackImg:{type:[Boolean,String],default:!1},bgImage:{type:String,default:""}},methods:{BackPage:function(){t.navigateBack({delta:1})}}};a.default=n}).call(this,n("543d")["default"])},5963:function(t,a,n){"use strict";n.r(a);var o=n("5541"),u=n.n(o);for(var e in o)"default"!==e&&function(t){n.d(a,t,(function(){return o[t]}))}(e);a["default"]=u.a},"7db6":function(t,a,n){"use strict";n.r(a);var o=n("0770"),u=n("5963");for(var e in u)"default"!==e&&function(t){n.d(a,t,(function(){return u[t]}))}(e);var r,c=n("f0c5"),i=Object(c["a"])(u["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],r);a["default"]=i.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'colorui/components/cu-custom-create-component',
    {
        'colorui/components/cu-custom-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("7db6"))
        })
    },
    [['colorui/components/cu-custom-create-component']]
]);
