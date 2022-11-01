var Foundation = (function()
{
	var dateFormat = function dateFormat(oDate, fmt) {
    var o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        "S": oDate.getMilliseconds()//毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
	}
	
	return {
		dateFormat:dateFormat
	};
})();

/**
*
*
*@returns{Map}
*/
function IEMap(){
var node = function(key, value){
	this.key = key;
	this.value = value;
};

//添加map键值对
var put = function(key,value){
	for(var i = 0;i < this.arr.length;i ++){
		if(this.arr[i].key == key){
			this.arr[i].value = value;
			return;
		}
	};
	this.arr[this.arr.length] = new node(key,value);
};

//根据key获取value
var get = function(key){
	for(var i = 0;i < this.arr.length; i ++){
		if(this.arr[i].key == key){
			return this.arr[i].value;
		}
	}
};

//删除Key
var remove = function(key){
	var v;
	for(var i = 0;i < this.arr.length;i ++){
		v = this.arr.pop();
		if(v.key == key){
			continue;
		}
		this.arr.unshift(v);
	}
};

//遍历
var each = function(fCallback){
	for(var i = 0;i < this.arr.length;i ++){
		fCallback(this.arr[i].value);
	}
}

this.arr = new Array();
this.get = get;
this.put = put;
this.remove = remove;
this.each = each
}

