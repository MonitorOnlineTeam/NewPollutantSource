//插件加载完毕后，会执行初始化化操作
$(function () {
	WebVideoCtrl.insertPluginObject("divPlugin",500,300);
	//初始化插件
	WebVideoCtrl.initPlugin("Dahua2",function () {
			//创建视频窗口
			WebVideoCtrl.createMultiNodeDisplay(16);
			//设置视频窗口的显示
			var num = parseInt($("#wndNum").find("option:selected").val());
			//设置窗口分割数
			WebVideoCtrl.setSplitNum(num);
			//注册事件
			WebVideoCtrl.registerEvent("SelectedView",responseSelectedViewSignal);
			//初始化路径
			var szDir = WebVideoCtrl.getUserDirectory();
			var szPath = szDir + "\\" + "LiveRecord";
			$("#LiveRecord").val(szPath);
			szPath = szDir + "\\" + "Download";
			$("#Download").val(szPath);
	
			szPath = szDir + "\\" + "LiveSnapshot";
			$("#LiveSnapshot").val(szPath);
	
			szPath = szDir + "\\" + "PlaybackPicPath";
			$("#PlaybackPicPath").val(szPath);
	
			szPath = szDir + "\\" + "PlaybackFilePath";
			$("#PlaybackFilePath").val(szPath);
			$( "#tabs" ).tabs();
			//隐藏窗口序号选择框
			$("#winIndex").hide();
			}
	);
	$("#tabs_ptz").tabs();
	$("#tabs_playback").tabs();
	$("#closePtzLocate").hide();
	$("#openPtzLocate").show();
});

//视频窗口
/**
*@description 处理窗口切换事件
*@param{Num} iNodeIndex  节点序号
*@param{Num} iViewIndex  视图序号
*@param{Num} iWinID      窗口ID
*/
function responseSelectedViewSignal(iNodeIndex,iViewIndex,iWinID){
	//更新对应播放器的信息
	var playrInfo = WebVideoCtrl.getPlayerInfo(iWinID);
	//更新UI信息
	if(typeof playrInfo != "undefined"){
	//设备信息
		var deviceInfo = WebVideoCtrl.getDeviceInfo(playrInfo.ip);
		if(typeof deviceInfo != "undefined"){
			DemoUI.updateDeviceInfo(playrInfo.ip);
			DemoUI.setCurChannel(playrInfo.channle);
			DemoUI.setCurStreamType(playrInfo.streamType);
		}
	}
}

//显示操作信息
function showOPInfo(szInfo, status, error) {
    var szTip = "<div>" + Foundation.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo;
	if (typeof status != "undefined") 
	{
		szTip += "(" + status.toString() + ", " + error.toString() + ")";
    }
    szTip += "</div>";
    $("#opinfo").html(szTip + $("#opinfo").html());
}

//窗口切换事件
function changeWndNum(num)
{
	//设置视频窗口的显示
	var num = parseInt($("#wndNum").find("option:selected").val());
	WebVideoCtrl.setSplitNum(num);
	DemoUI.setWinIndex(num);
}

//设备登录
function clickLogin()
{
	// var szLang = navigator.browserLanguage.toLowerCase();
	// var szUserLang = navigator.userLanguage.toLowerCase();
	// var szLanguage = (navigator.browserLanguage || navigator.language ).toLowerCase();
	// szLanguage = szLanguage.substring(0, 2);
	
	var szIP = $("#loginip").val();
    szPort = $("#port").val() - 0;
    szUsername = $("#username").val();
    szPassword = $("#password").val();
	rtspPort = $("#rtspport").val() - 0;
	protocol = $("#protocolType").val() - 0;
	if ("" == szIP || "" == szPort) {
        return;
    }
	var port = parseInt($("#port").val());
	//判断当前设备是否已经登录
	var deviceInfo = WebVideoCtrl.getDeviceInfo(szIP);
	if(typeof deviceInfo != "undefined"){
		if(WebVideoCtrl.logout(szIP))
		{
			//添加提示
			showOPInfo(szIP + " Logout Device ");
			//删除设备信息
			DemoUI.removeDeviceInfo(szIP);
		}
	}
	WebVideoCtrl.login(szIP,port,szUsername,szPassword,rtspPort,protocol,
			function(sIp,iDeviceID){
				showOPInfo(sIp + " Login Succeed ");
				//插入设备
				DemoUI.addDeviceIP(sIp);
				//获得通道号
				var channelNum = WebVideoCtrl.getChannelNumber(iDeviceID);
				//更新通道数据
				DemoUI.modifyChannelList(channelNum);
			},
			function(iErrorCode,sError){
				showOPInfo(szIP + " Login Fail ", iErrorCode, sError);
		}
	);
}

function switchDeviceInfo(ip)
{
	DemoUI.updateDeviceInfo(ip);
}

function clickLogout()
{
	//获取当前选中的
	var ip = DemoUI.getCurDeviceIP();
	if(WebVideoCtrl.logout(ip))
	{
		//添加提示
		showOPInfo(ip + " Logout Device ");
		//删除设备信息
		DemoUI.removeDeviceInfo(ip);
	}
}

function changeProtocol(protocol){
	//获得当前的协议类型
	var protocol = parseInt($("#protocolType").find("option:selected").val());
	/**
	//获得当前的设备信息
	var ip = DemoUI.getCurDeviceIP();
	//获得设备信息
	var deviceInfo = WebVideoCtrl.getDeviceInfo(ip);
	if(typeof deviceInfo != "undefined")
	{
		//如果协议切换
		if(protocol != deviceInfo.protocol){
			//登出设备
			if(WebVideoCtrl.logout(ip))
			{
				//添加提示
				showOPInfo(ip + " 登出设备！");
				//删除设备信息
				DemoUI.removeDeviceInfo(ip);
			}
			clickLogin();
		}
	}
	**/
}

function clickStartRealPlay(){
	//获得当前选中的设备IP
	var sIP = DemoUI.getCurDeviceIP();
	//获得通道号
	var iChannel = $("#channels").val() - 0;
	//获得码流类型
	var iStreamType = parseInt($("#streamtype").val(), 10); 
	//窗口选择模式
	var iMode = parseInt($("#winMode").val(), 10);
	if(0 == iMode){
			WebVideoCtrl.connectRealVideo(sIP,iChannel,iStreamType,function(iPlayerID){
						showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live succeed");
					},
					function(status,error){
						showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live Fail", status, error);
					}
			)
	}else{
		//窗口序号
		var iWinIndex = parseInt($("#winIndex").val(), 10);
		WebVideoCtrl.connectRealVideoEx(iWinIndex,sIP,iChannel,iStreamType,function(iPlayerID){
						showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live succeed");
					},
					function(status,error){
						showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live Fail", status, error);
					}
				)
		}
}

function changeStreamType(streamtype){
	//获得播放器信息
	if(0 != WebVideoCtrl.getSelectedPlayerID()){
		clickStartRealPlay();
	}
}

//关闭选中窗口的实时监视
function clickStopRealPlay(){
	WebVideoCtrl.closePlayer();
}

//开启对讲
function clickStartVoiceTalk(){
	//获得当前选中的设备IP
	var sIP = DemoUI.getCurDeviceIP();
	WebVideoCtrl.startVoiceTalk(sIP,{
			cbSuccess:function(){
				showOPInfo(sIP + " Enable AudioTalk Succeed");
			},
			cbFailed:function(){
				showOPInfo(sIP + " Enable AudioTalk Fail");
			}
		}
	)
	
}

//关闭对讲
function clickStopVoiceTalk(){
	//获得当前选中的设备IP
	var sIP = DemoUI.getCurDeviceIP();
	WebVideoCtrl.stopVoiceTalk(sIP);
}

// 打开选择框
function clickOpenFileDlg(id) {
    WebVideoCtrl.selectDirectory(id,{
			cbSuccess:function(path){
					    if (path != -1 && path != "" && path != null) {
							$("#" + id).val(path);
						}
				}
		}
	);
}

function clickSetVolume(){
	//设置选中窗口的音量
	WebVideoCtrl.setVolume(parseInt($("#volume").val(), 10),{
			cbSuccess:function(winIndex){
			},
			cbFailed:function(winIndex){
			}
		}
	);
}

function clickOpenSound(){
	WebVideoCtrl.openSound({
			cbSuccess:function(winIndex){
			},
			cbFailed:function(winIndex){
			}
		}
	);
}

function clickCloseSound(){
	WebVideoCtrl.closeSound({
			cbSuccess:function(winIndex){
			},
			cbFailed:function(winIndex){
			}
		}
	);
}

function clickEnableEZoom(){
	if(WebVideoCtrl.enableEZoom()){
		showOPInfo("Enable Enlarger Succeed");
	}else{
		showOPInfo("Enable Enlarger Fail");
	}
}

function clickDisableEZoom(){
	if(WebVideoCtrl.disableEZoom()){
		showOPInfo("Disable Enlarger Succeed");
	}else{
		showOPInfo("Disable Enlarger Fail");
	}
}

function clickFullScreen(){
	WebVideoCtrl.setFullscreen();
}

function clickOpenSound(){
	var winID = WebVideoCtrl.getSelectedWinID();
	if(WebVideoCtrl.openSound()){
		showOPInfo("open Sound Succeed");
	}else{
		showOPInfo( "open Sound Fail");
	}
}

function clickCloseSound(){
	var winID = WebVideoCtrl.getSelectedWinID();
	if(WebVideoCtrl.closeSound()){
		showOPInfo("Close Sound Succeed");
	}else{
		showOPInfo( "Close Sound Fail");
	}	
}

function clickCapturePic(){
	var path = $("#LiveSnapshot").val();
	var format = $("#captureFileFormat").val() - 0;                 
	if(WebVideoCtrl.crabOnePicture(format,path,false)){
		showOPInfo("Snapshot Succeed,Path:"+ path);
	}else{
		showOPInfo("Snapshot Fail");
	}
}

function clickStartRecord(){
	var path = $("#LiveRecord").val();     
	var format = parseInt($("#recordFormat").val(), 10);
	if(WebVideoCtrl.startRecordingVideo(format,path)){
		showOPInfo("Start Record Succeed,Path:"+ path);
	}else{
		showOPInfo("Start Record Fail");
	}
}

function clickStopRecord(){                
	if(WebVideoCtrl.stopRecordingVideo()){
		showOPInfo("Stop Record Succeed");
	}else{
		showOPInfo("Stop Record Fail");
	}
}

function mouseUPLeftPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveUpperLeft(speed,speed,flag);
}

function mouseUpPTZControl(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveUpwards(speed,flag);
}

function mouseUPRightPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveUpperRight(speed,speed,flag);
}

function mouseLefPTZControl(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLeft(speed,flag);
}

function mouseRightPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveRight(speed,flag);
}

function mouseDownLeftPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLowerLeft(speed,speed,flag);
}

function mouseDownRightPTZControl(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLowerRight(speed,speed,flag);
}

function mouseDownPTZControl(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.moveLower(speed,flag);
}

function openPtzLocate(){
	if(WebVideoCtrl.enablePTZLocate()){
		//隐藏开启按钮
		$("#openPtzLocate").hide();
		//显示关闭按钮
		$("#closePtzLocate").show();
	}
}

function closePtzLocate(){
	WebVideoCtrl.disablePTZLocate(false);
	$("#closePtzLocate").hide();
	$("#openPtzLocate").show();
}

function PTZZoomout(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlZoom(speed,1,flag);
}

function PTZZoomIn(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlZoom(speed,0,flag);
}

function PTZFocusIn(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlFocus(speed,0,flag);
}

function PTZFoucusOut(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlFocus(speed,1,flag);
}

function PTZIrisIn(flag){
	//获得移动速度
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlAperture(speed,0,flag);
}

function PTZIrisOut(flag){
	var speed = parseInt($("#ptzspeed").val(), 10)
	WebVideoCtrl.controlAperture(speed,1,flag);
}

function GetPresets(){
	WebVideoCtrl.getPresets(
	function(index,name){
		showOPInfo("Get Presets Succeed");
		var subNode = "<option value=" + index.toString() + ">" + name + "</option>"
		$("#presetList").append(subNode);
	}
	);
	$('#presetList option:last').attr('selected','selected');
}

function GotoPreset(){
	//获得预置点序号
	var index = parseInt($("#presetList").val(), 10);
	WebVideoCtrl.gotoPreset(index,0);
		
	
}

function RemovePreset(){

	//获得预置点序号
	var index = parseInt($("#presetList").val(), 10);
	if(WebVideoCtrl.removePreset(index)){
		$("#presetList" + " option[value='" + index.toString() + "']").remove();
		$("#presetList option:last").attr("selected","selected");
	}
		
}

function SetPreset(){
	//获得预置点长度
	var length = $("#presetList option").length;
	var name = "Preset" + (length + 1).toString();
	WebVideoCtrl.setPreset(length + 1,name);
}

function clickStartTrafficDataQuery(){
	//获得当前选中的设备IP
	var sIP = DemoUI.getCurDeviceIP();
	//获得通道号
	var iChannel = $("#channels").val() - 0;
	var startTime = $("#humanFlowStarttime").val();
	var endTime = $("#humanFlowEndtime").val();
	var ruleType = parseInt($("#humanFlowRule").val(), 10);
	var span = parseInt($("#humanFlowGranularity").val(), 10);
	var minStayTime = parseInt($("#humanFlowMinStayTime").val(), 10); 
	var handle = WebVideoCtrl.startTrafficDataQuery(sIP,0,startTime,endTime,ruleType,span,minStayTime);
	if(handle > 0){
		$("#humanFlowQueryHandle").val(handle.toString());
	}
}

function clickGetTrafficDataTotalCount(){
	var handle = parseInt($("#humanFlowQueryHandle").val(), 10);
	var ret = WebVideoCtrl.getTrafficDataTotalCount(handle);
	if(ret >= 0){
		$("#humanFlowInfoCount").val(ret.toString());
	}
}

function clickQueryTrafficData(){
	var handle = parseInt($("#humanFlowQueryHandle").val(), 10);
	var beginIndex = 0;
	var total = parseInt($("#humanFlowInfoCount").val(), 10);
	var ret = WebVideoCtrl.queryTrafficData(handle,beginIndex,total);
}

function clickStopTrafficDataQuery(){
	var handle = parseInt($("#humanFlowQueryHandle").val(), 10);
	WebVideoCtrl.stopTrafficDataQuery(handle);
	$("#humanFlowQueryHandle").val("");
	$("#humanFlowInfoCount").val("");
}

function clickRecordSearch(){
	
}

function changeWinMode(){
	var mode = parseInt($("#winMode").val(), 10);
	if(0 == mode){
		$("#winIndex").hide();
	}else{
		//设置窗口序号
		var num = parseInt($("#wndNum").find("option:selected").val());
		DemoUI.setWinIndex(num);
		$("#winIndex").show();
	}
}

function changeWndIndex(){
	var iWinIndex = parseInt($("#winIndex").val(), 10);
	//选中视频窗口
	WebVideoCtrl.selectWindow(iWinIndex);
}

function clickStartAllRealPlay(){
	DemoUI.getEachDeviceIP(function(sIP,iIndex){
		//获得通道号
		var iChannel = $("#channels").val() - 0;
		//获得码流类型
		var iStreamType = parseInt($("#streamtype").val(), 10); 
		//窗口数目
		var iWndNum = parseInt($("#wndNum").val(), 10);
		if(iIndex > (iWndNum * iWndNum - 1)){
			return;
		}
		WebVideoCtrl.connectRealVideoEx(iIndex,sIP,iChannel,iStreamType,function(iPlayerID){
						showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live succeed");
					},
					function(status,error){
						showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live Fail", status, error);
					});
				
	});
}

function clickStopAllRealPlay(){
		WebVideoCtrl.closeAllPlayer();
}

//开启注册监听
function startRegisterListen() 
{	
	//注册事件
	WebVideoCtrl.registerEvent("DetectedDeviceInfo", function(ip, port, state){
			DemoUI.setLoginDeviceIP(ip)
			DemoUI.setSvrPort(port);
	});
	var ip = $('#serverip').val();
	var port = $('#serverport').val() - 0;
	WebVideoCtrl.startDevciceDetection(ip, port);
}

//开启录像查询
function clickStartRecordSearch(){
		//清空文件列表
		$("#recordInfor").empty();
		var sIP = DemoUI.getCurDeviceIP();
		var iChannel = $("#channels").val() - 0;
        var iStreamType = parseInt($("#record_streamtype").val(), 10);
        var szStartTime = $("#starttime").val();
        var szEndTime = $("#endtime").val();
		var handle = WebVideoCtrl.startRecordInfoSearch(sIP,iChannel,iStreamType,szStartTime,szEndTime);
		if(handle > 0){
			$("#recordQueyrHandle").val(handle.toString());
			showOPInfo(sIP + " Channel:"+ iChannel.toString() + "start query succeed");
		}else{
			showOPInfo(sIP + " Channel:"+ iChannel.toString() + "start query fail");
		}
}

//查询录像信息
function clickNextRecordSearch(){
	var iChannel = $("#channels").val() - 0;
	var sIP = DemoUI.getCurDeviceIP();
	var handle = parseInt($("#recordQueyrHandle").val(), 10);
	var fileInfor = WebVideoCtrl.findNextRecordInfo(handle,13);
	if(fileInfor.length == 0)
	{
		showOPInfo(sIP + " Channel:"+ iChannel.toString() + "no info");
	}
	else
	{
		var dataObject = $.parseJSON(fileInfor);
		if(("found" in  dataObject))
		{
			var length = dataObject["found"];
			if(0 != parseInt(length))
			{
				//遍历所有的节点并添加到recordInfor中
				$.each(dataObject.infos,function(i,item){
				var infor = item.StartTime + "--" + item.EndTime;
				var subNode = "<option value=" + infor + ">" + infor + "</option>"
				$("#recordInfor").append(subNode);
				});
			}
		}
	}
}

function clickStartPlayback()
{
	var fileID = $("#recordInfor").find("option:selected").text();
	WebVideoCtrl.playRemoteFileByFile(fileID);
}

function clickStopPlayback(){
	WebVideoCtrl.stopPlayBack();
}

function clickPause(){
	WebVideoCtrl.pausePlayBack();
}

function clickResume(){
	WebVideoCtrl.resumePlayBack();
}

function clickPlaySlow(){
	WebVideoCtrl.slowPlayBack();
}

function clickPlayFast(){
	WebVideoCtrl.fastPlayBack();
}

function clickStopRecordSearch(){
	var handle = parseInt($("#recordQueyrHandle").val(), 10);
	WebVideoCtrl.stopRecordInfoQuerying(handle);
}

function enableIVS(){
	WebVideoCtrl.enableIVS();
}

function disableIVS(){
	WebVideoCtrl.disableIVS();
}

function clickSearchRecordStatus()
{	
	var sIP = DemoUI.getCurDeviceIP();
	var iChannel = $("#channels").val() - 0;
	var year = parseInt($("#recordStatus_year").find("option:selected").text());
	var month = parseInt($("#recordStatus_month").find("option:selected").text());
	var sStatus = WebVideoCtrl.queryRecordFileBitmap(sIP,iChannel,year,month,0);
	DemoUI.setRecordStatus(sStatus); 
}