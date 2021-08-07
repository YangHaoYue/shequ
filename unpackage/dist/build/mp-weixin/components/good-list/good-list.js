(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/good-list/good-list"],{"00d0":function(t,e,n){"use strict";n.d(e,"b",(function(){return a})),n.d(e,"c",(function(){return u})),n.d(e,"a",(function(){return i}));var i={uTag:function(){return n.e("uview-ui/components/u-tag/u-tag").then(n.bind(null,"5cea"))}},a=function(){var t=this,e=t.$createElement;t._self._c},u=[]},"6b84":function(t,e,n){"use strict";var i=n("9ae5"),a=n.n(i);a.a},"7f13":function(t,e,n){"use strict";n.r(e);var i=n("aa66"),a=n.n(i);for(var u in i)"default"!==u&&function(t){n.d(e,t,(function(){return i[t]}))}(u);e["default"]=a.a},"9ae5":function(t,e,n){},a545:function(t,e,n){"use strict";n.r(e);var i=n("00d0"),a=n("7f13");for(var u in a)"default"!==u&&function(t){n.d(e,t,(function(){return a[t]}))}(u);n("6b84");var o,r=n("f0c5"),c=Object(r["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],o);e["default"]=c.exports},aa66:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={props:{item:Object,index:Number,length:Number,idType:{type:Boolean,default:!1}},data:function(){return{img:this.item.pic?"background-image: url("+this.http.resourceUrl()+this.item.pic+");":""}},methods:{navigateTo:function(){var e=new Number;e=this.idType?this.item.good_id:this.item.id,t.navigateTo({url:"/pages/home/queryManagement/goodDetail/goodDetail?id=".concat(e)})},copy:function(){t.setClipboardData({data:this.item.store_no})}}};e.default=n}).call(this,n("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/good-list/good-list-create-component',
    {
        'components/good-list/good-list-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("a545"))
        })
    },
    [['components/good-list/good-list-create-component']]
]);
