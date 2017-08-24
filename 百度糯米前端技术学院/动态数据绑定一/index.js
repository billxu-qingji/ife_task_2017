/*
* @Author: Administrator
* @Date:   2017-04-14 16:08:33
* @Last Modified by:   Administrator
* @Last Modified time: 2017-04-14 16:54:19
*/

'use strict';

function Observer(obj){
	if(!obj) return;

	//获取所有自有属性
	var ownProps = Object.getOwnPropertyNames(obj);
	obj.data = {};

	ownProps.forEach(function(item){
		Object.defineProperty(obj["data"], item, {
			get: function(){
				console.log("你访问了" + item);
				return obj[item];
			},
			set: function(value){
				console.log("你设置了" + item + ",新的值为：" + value);
				obj[item] = value;
			}
		});
	})
	return obj;
}


var app1 = new Observer({
	name: "yongwind",
	age: 25,
});

var app2 = new Observer({
	university: "bupt",
	major: "computer",
})

app1.data.name;
app1.data.age = 100;