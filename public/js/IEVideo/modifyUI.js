var DemoUI = (function(e)
{
	return {
		setLoginDeviceIP:function(){},
		getLoginDeviceIP:function(){},
		removeDeviceInfo:function(ip){},
		updateDeviceInfo:function(ip){},
		setSvrPort:function(){},
		getSvrPort:function(){},
		setRtspPort:function(){},
		getRtspPort:function(){},
		setUsrName:function(){},
		getUsrName:function(){},
		setPassword:function(){},
		getPassword:function(){},
		addDeviceIP:function(){},
		removeDeviceIP:function(){},
		getCurDeviceIP:function(){},
		getEachDeviceIP:function(){},
		modifyChannelList:function(){},
		setCurChannel:function(){},
		getCurChannel:function(){},
		setCurStreamType:function(){},
		getCurStreamType:function(){},
		setCurProtocol:function(){},
		getCurProtocol:function(){},
		clearPresets:function(){},
		setWinIndex:function(){},
		setRecordStatus:function(){},
	};
})(this);

$(function () {

	DemoUI.setLoginDeviceIP = function(ip){
		$("#loginip").val(ip);
	};
	
	DemoUI.getLoginDeviceIP = function(){
		return $("#loginip").val();
	};
	
	DemoUI.removeDeviceInfo = function(ip){
		//将设备信息清除
		DemoUI.removeDeviceIP();
		//设置当前的设备信息
		var selectDevice = DemoUI.getCurDeviceIP();
		DemoUI.updateDeviceInfo(selectDevice);
	}
	
	DemoUI.updateDeviceInfo = function(ip){
		var info = WebVideoCtrl.getDeviceInfo(ip);
		if(typeof info != "undefined")
		{
			//更新选中设备的信息
			DemoUI.setLoginDeviceIP(ip);
			DemoUI.setUsrName(info.userName);
			DemoUI.setPassword(info.password);
			DemoUI.setRtspPort(info.rtspPort);
			DemoUI.setSvrPort(info.port);
			DemoUI.setCurProtocol(info.protocol);
			$("#ips").val(ip);
			//更新通道数据
			DemoUI.modifyChannelList(info.channelNum);
		}else{
			//清理通道列表数据
			DemoUI.modifyChannelList(0);
		}
	}
	
	DemoUI.setSvrPort = function(port){
		$("#port").val(port.toString());
	};
	
	DemoUI.getSvrPort = function(){
		return ($("#port").val() - 0);
	};
	
	DemoUI.setRtspPort = function(port){
		$("#rtspport").val(port.toString());
	};
	
	DemoUI.getRtspPort = function(){
		return ($("#rtspport").val() - 0);
	};
	
	DemoUI.setUsrName = function(usrName){
		$("#username").val(usrName);
	};
	
	DemoUI.getUsrName = function(){
		return $("#username").val();
	};
	
	DemoUI.setPassword = function(password){
		$("#password").val(password);
	};
	
	DemoUI.getPassword = function(){
		return $("#password").val();
	};
	
	DemoUI.addDeviceIP = function(ip){
		$("#ips").append("<option value='" + ip + "'>" + ip + "</option>");
		$("#ips").val(ip)
	};
	
	DemoUI.removeDeviceIP = function(){
		var selectDevice = $("#ips").find("option:selected").text();
		$("#ips" + " option[value='" + selectDevice + "']").remove();
	};
	
	DemoUI.getCurDeviceIP = function(){
		return $("#ips").find("option:selected").text();
	};
	
	DemoUI.getEachDeviceIP = function(fCallback){
		var index = 0;
		$("#ips option").each(function(){
			fCallback(this.text, index ++);
		});
	}
	
	DemoUI.modifyChannelList = function(num){
		$("#channels").empty();
		//更新通道列表信息
		if(-1 != num)
		{
			var i = 1;
			for(;i <= num;i ++)
			{
				var subNode = "<option value=" + i.toString() + ">" + i.toString() + "</option>"
				$("#channels").append(subNode);
			}
		}
	};
	
	DemoUI.setCurChannel = function(chan){
		$("#channels").val(chan.toString());
	};
	
	DemoUI.getCurChannel = function(){
		return $("#channels").val();
	};

	DemoUI.setCurStreamType = function(type){
		$("#streamtype").val(type.toString());
	};
	
	DemoUI.getCurStreamType = function(){
		return $("#streamtype").val();
	};
	
	DemoUI.setCurProtocol = function(protocol){
		$("#protocolType").val(protocol.toString());
	};
	
	DemoUI.getCurProtocol = function(){
		return $("#protocolType").val();
	};
	
	DemoUI.clearPresets = function(){
		$("#presetList").empty();
	}
	
	DemoUI.setWinIndex = function(num){
		$("#winIndex").empty();
		//更新通道列表信息
		var i = 0;
		for(;i < num * num;i ++)
		{
			var subNode = "<option value=" + i.toString() + ">" + i.toString() + "</option>"
			$("#winIndex").append(subNode);
		}
	}
	
	DemoUI.setRecordStatus = function(status){
		//添加有录像的日期
		var i = 0;
		for(;(i < 32) && (i < status.length);i++)
		{
			if("1" == status.charAt(i))
			{
				var day = 31 - i;
				var subNode = "<option value=" + day.toString() + ">" + day.toString() + "</option>";
				$("#record_Status").prepend(subNode);
			}
		}
	}
	
	//初始化月份信息
	var i = 1;
	for(;i <= 12;i ++)
	{
		var subNode = "<option value=" + i.toString() + ">" + i.toString() + "</option>"
		$("#recordStatus_month").append(subNode);
	}
	
	
	
});