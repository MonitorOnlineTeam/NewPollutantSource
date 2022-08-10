import { message, notification, Button } from 'antd'

export function initVideo(loginData) {
  console.log('111');
  if (WebVideoCtrl.checkPluginInstall() == -1) {
    // if (WebVideoCtrl.checkPluginInstall() == 1) {
    // msg = { flag: true, message: '您还未安装过插件，点击确定下载安装', istrue: false };
    // message.error('您还未安装过插件，点击确定下载安装')
    // 插件下载地址 toduo
    // window.location.href = 'http://172.16.12.82:1025/Content/Video/WebComponents.exe';

    const btn = (
      <Button type="primary" size="small" onClick={() => {
        notification.close();
        window.location.href = '/js/IEVideo/webplugin.exe';
      }}>
        确定
      </Button>
    );
    notification.error({
      message: '请安装插件',
      duration: null,
      description:
        '您还未安装过插件，点击确定下载安装！',
      btn,
    });

    return;
  }

  WebVideoCtrl.insertPluginObject("divPlugin", '100%', '100%');
  WebVideoCtrl.initPlugin("Dahua2");

  // const loginData = {
  //   szIP: '223.84.203.240',
  //   szPort: 8081,
  //   szUsername: 'dshbjk',
  //   szPassword: 'admin123456',
  //   rtspPort: 80,
  //   protocol: 0,
  // }
  clickLogin(loginData);
  //初始化插件
  // WebVideoCtrl.initPlugin("Dahua2", function () {
  //   //创建视频窗口
  //   WebVideoCtrl.createMultiNodeDisplay(1);
  //   console.log('initPlugin')

  //   const loginData = {
  //     szIP: '223.84.203.240',
  //     szPort: 8081,
  //     szUsername: 'dshbjk',
  //     szPassword: 'admin123456',
  //     rtspPort: 80,
  //     protocol: 0,
  //   }
  //   clickLogin(loginData);
  // });

}

//设备登录
function clickLogin(loginData) {
  console.log('loginData=', loginData)
  var szIP = loginData.szIP;
  var szPort = loginData.szPort;
  var szUsername = loginData.szUsername;
  var szPassword = loginData.szPassword;
  var rtspPort = loginData.rtspPort;
  var protocol = loginData.protocol;
  if ("" == szIP || "" == szPort) {
    console.log('loginData2=', loginData);
    return;
  }
  // var port = parseInt($("#port").val());
  //判断当前设备是否已经登录
  var deviceInfo = WebVideoCtrl.getDeviceInfo(szIP);
  if (typeof deviceInfo != "undefined") {
    if (WebVideoCtrl.logout(szIP)) {
      // message.error('注销设备');
      //添加提示
      // showOPInfo(szIP + " Logout Device ");

    }
  }
  WebVideoCtrl.login(szIP, szPort, szUsername, szPassword, rtspPort, protocol,
    function (sIp, iDeviceID) {
      console.log('登录成功！监控视频连接中');
      clickStartRealPlay(szIP, loginData.channels);
      message.success('登录成功！监控视频连接中...');
    },
    function (iErrorCode, sError) {
      message.error('登录失败！');
      console.log('登录失败：', szIP + " Login Fail ", iErrorCode, sError);
    }
  );
}


function clickStartRealPlay(sIP, iChannel) {
  // //获得当前选中的设备IP
  // var sIP = DemoUI.getCurDeviceIP();
  // //获得通道号
  // // var iChannel = $("#channels").val() - 0;
  // var iChannel = 13;
  //获得码流类型
  // var iStreamType = parseInt($("#streamtype").val(), 10);
  var iStreamType = 1;
  //窗口选择模式
  WebVideoCtrl.connectRealVideo(sIP, iChannel, iStreamType, function (iPlayerID) {
    message.success('播放成功！')
    console.log('播放成功=', sIP + " Channel:" + iChannel.toString() + " Live succeed");
  },
    function (status, error) {
      message.success('播放失败！')
      console.log('播放失败=', sIP + " Channel:" + iChannel.toString() + " Live Fail", status, error);
    }


    // WebVideoCtrl.connectRealVideo(sIP,iChannel,iStreamType,function(iPlayerID){
    //   showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live succeed");
    // },
    // function(status,error){
    //   showOPInfo(sIP + " Channel:"+ iChannel.toString() + " Live Fail", status, error);
    // }
  )
}