import React, { PureComponent } from 'react';
import $ from 'jquery'
import loader from '@/utils/loader'

class Test extends PureComponent {
  initCount = 0;
  pubKey = '';
  state = {}

  componentDidMount() {
    // this.initPlugin()
    this._loadJSEncryptFile();
    this._loadWebControlFile();
  }

  // 文件加载
  _loadJSEncryptFile = () => {
    if (window.JSEncrypt) {
      if (!this.JSEncrypt) this.JSEncrypt = window.JSEncrypt;
      return Promise.resolve();
    } else {
      return loader('/js/jsencrypt.js', 'JSEncrypt')
        .then(() => {
          this.JSEncrypt = window.JSEncrypt;
          return Promise.resolve();
        }).catch(error => {
          console.error('Load file fail!');
        });
    }
  }

  // 文件加载
  _loadWebControlFile = () => {
    if (window.WebControl) {
      if (!this.WebControl) this.WebControl = window.WebControl;
      return Promise.resolve();
    } else {
      return loader('/js/jsWebControl.js', 'WebControl')
        .then(() => {
          this.WebControl = window.WebControl;
          this.initPlugin();
          return Promise.resolve();
        }).catch(error => {
          console.error('Load file fail2!');
        });
    }
  }

  // componentDidUpdate(prevProps) {
  //   this.initPlugin();
  // }

  // 创建播放实例
  initPlugin = () => {
    console.log(" window.WebControl=", window.WebControl)
    this.oWebControl = new window.WebControl({
      szPluginContainer: "playWnd",                       // 指定容器id
      iServicePortStart: 15900,                           // 指定起止端口号，建议使用该值
      iServicePortEnd: 15909,
      szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",   // 用于IE10使用ActiveX的clsid
      cbConnectSuccess: () => {
        console.log("this.oWebControl=",this.oWebControl)                     // 创建WebControl实例成功											
        this.oWebControl.JS_StartService("window", {         // WebControl实例创建成功后需要启动服务
          dllPath: "./VideoPluginConnect.dll"         // 值"./VideoPluginConnect.dll"写死 
        }).then(() => {                           // 启动插件服务成功
          this.oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
            // cbIntegrationCallBack: this.cbIntegrationCallBack()
          });

          this.oWebControl.JS_CreateWnd("playWnd", 1000, 600).then(() => { //JS_CreateWnd创建视频播放窗口，宽高可设定
            this.init();  // 创建播放实例成功后初始化
          });
        }, function () { // 启动插件服务失败
        });
      },
      cbConnectError: () => { // 创建WebControl实例失败
        this.oWebControl = null;
        $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
        window.WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来启动程序
        this.initCount++;
        if (this.initCount < 3) {
          setTimeout(() => {
            initPlugin();
          }, 3000)
        } else {
          $("#playWnd").html("插件启动失败，请检查插件是否安装！");
        }
      },
      cbConnectClose: (bNormalClose) => {
        // 异常断开：bNormalClose = false
        // JS_Disconnect正常断开：bNormalClose = true	
        console.log("cbConnectClose");
        this.oWebControl = null;
      }
    });
  }

  //初始化
  init = () => {
    this.getPubKey(() => {
      ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////		
      var appkey = "25286180";                           //综合安防管理平台提供的appkey，必填
      var secret = this.setEncrypt("uiLDe0abqlg6Txjmf8Sc");   //综合安防管理平台提供的secret，必填
      var ip = "172.16.12.234";                           //综合安防管理平台IP地址，必填
      var playMode = 0;                                  //初始播放模式：0-预览，1-回放
      var port = 443;                                    //综合安防管理平台端口，若启用HTTPS协议，默认443
      var snapDir = "D:\\SnapDir";                       //抓图存储路径
      var videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
      var layout = "1x1";                                //playMode指定模式的布局
      var enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
      var encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
      var showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
      var showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
      var buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769";  //自定义工具条按钮
      ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

      this.oWebControl.JS_RequestInterface({
        funcName: "init",
        argument: JSON.stringify({
          appkey: appkey,                            //API网关提供的appkey
          secret: secret,                            //API网关提供的secret
          ip: ip,                                    //API网关IP地址
          playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
          port: port,                                //端口
          snapDir: snapDir,                          //抓图存储路径
          videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
          layout: layout,                            //布局
          enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
          encryptedFields: encryptedFields,          //加密字段
          showToolbar: showToolbar,                  //是否显示工具栏
          showSmart: showSmart,                      //是否显示智能信息
          buttonIDs: buttonIDs                       //自定义工具条按钮
        })
      }).then((oData) => {
        this.oWebControl.JS_Resize(1000, 600);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        this.oWebControl.JS_RequestInterface({
          funcName: "startPreview",
          argument: JSON.stringify({
              cameraIndexCode:'18507478f7cf4c2883a75c030d59b847',                //监控点编号
              streamMode: 0,                         //主子码流标识
              transMode: 1,                           //传输协议
              gpuMode: 0,                               //是否开启GPU硬解
              wndId:-1                                     //可指定播放窗口
          })
      })
      });
    });
  }

  //获取公钥
  getPubKey = (callback) => {
    this.oWebControl.JS_RequestInterface({
      funcName: "getRSAPubKey",
      argument: JSON.stringify({
        keyLength: 1024
      })
    }).then((oData) => {
      if (oData.responseMsg.data) {
        this.pubKey = oData.responseMsg.data;
        callback()
      }
    })
  }

  //RSA加密
  setEncrypt = (value) => {
    var encrypt = new this.JSEncrypt();
    encrypt.setPublicKey(this.pubKey);
    return encrypt.encrypt(value);
  }

  render() {
    return (
      <div id="playWnd" className="playWnd" style={{ left: 109, top: 133 }}></div>
    );
  }
}

export default Test;