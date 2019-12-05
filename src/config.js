/*
 * @desc: 全局配置文件: 修改后需要重启项目重新编译
 */

// 接口地址
//外网：61.50.135.114
//内网：172.16.12.165

//域名服务器
// const apiHost = 'http://api.chsdl.net/NewWryApi/';
// // 文件上传地址
// const uploadHost = 'http://api.chsdl.net/NewWryApi/upload/';

//测试服务器
// const apiHost = 'http://172.16.12.165:9090/';
// // 文件上传地址
// const uploadHost = 'http://172.16.12.165:9090/upload/';

const apiHost = 'http://172.16.12.165:9090/';
// 文件上传地址
const uploadHost = apiHost;
// wensocket推送地址（第一个为内网，第二个为外网）
const webSocketPush='172.16.12.165:50080,61.50.135.114:50080';

module.exports = {
  // name: '污染源智能分析平台',
  // logindesc: 'SDL 您身边的环境污染分析专家',
  prefix: 'monitorEnterprise',
  // footerText: '污染源智能分析平台   2018 sdl',
  amapKey: 'c5cb4ec7ca3ba4618348693dd449002d',
  apiHost,
  uploadHost,
  centerlongitude: '118.510962',
  centerlatitude: '38.976271',
  zoom: 12,
  logo: '/sdlicon.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  onlyOneEnt: false,
  CORS: [],
  cookieName: 'ssToken9001',
  openPages: ['/login'],
  enterpriceid: '51216eae-8f11-4578-ad63-5127f78f6cca',
  isMultiEnterprise: false,
  apiPrefix: '/mock',
  webSocketPushURL: webSocketPush,
  imgaddress: 'http://172.16.9.41:7001/upload/',
  // 年度检测报告路径
  annualmonitoringreportaddress: 'http://172.16.12.152:8066/api/upload/report/pdf/year/',
  // 使用文档路径
  documentationaddress: 'http://172.16.12.152:8066/api/upload/documentation/',
  // 实时视频地址
  realtimevideourl: `${apiHost}/Web/HkVideo/RealtimeCamera.html`,
  // 历史视频地址
  hisvideourl: `${apiHost}/Web/HkVideo/HistoryCamera.html`,
  // 萤石云视频地址
  ysyvideourl: `${apiHost}/Web/YsyVideo/YsyVideo.html`,
  // 视频选择萤石云或海康威视(0：海康，1：萤石云)
  VideoServer: 1,
  // 历史视频定时播放数据时间（单位S）
  PlayDatas: 10 * 1000,
  // 手工数据上传地址
  templateUploadUrl: `${apiHost}/rest/PollutantSourceApi/ManualSupplementApi/UploadFiles`,
  // 设备运转率标准%
  RunningRate: 90,
  // 传输有效率标准%
  TransmissionEffectiveRate: 90,
  mainpollutantInfo: [
    {
      pollutantCode: '01',
      pollutantName: '烟尘',
      unit: 'mg/m³',
    },
    {
      pollutantCode: '02',
      pollutantName: 'SO2',
      unit: 'mg/m³',
    },
    {
      pollutantCode: '03',
      pollutantName: 'NOx',
      unit: 'mg/m³',
    },
  ],
  zspollutantInfo: [
    {
      pollutantCode: 'zs01',
      pollutantName: '烟尘',
      unit: 'mg/m³',
    },
    {
      pollutantCode: 'zs02',
      pollutantName: 'SO2',
      unit: 'mg/m³',
    },
    {
      pollutantCode: 'zs03',
      pollutantName: 'NOx',
      unit: 'mg/m³',
    },
  ],
  // szpollutantInfo: [{
  //     pollutantCode: '001',
  //     pollutantName: 'pH值',
  //     unit: ''
  // }, {
  //     pollutantCode: '011',
  //     pollutantName: 'COD',
  //     unit: 'mg/L'
  // }, {
  //     pollutantCode: '060',
  //     pollutantName: '氨氮',
  //     unit: 'mg/L'
  // }
  // ],

  mainpoll: [
    {
      pollutantCode: 1,
      zspollutant: false,
      unit: 'mg/L',
      // 是否有传输有效率
      csyxl: false,
      pollutantInfo: [
        //     {
        //     pollutantCode: '001',
        //     pollutantName: 'pH值',
        //     unit: ''
        // },
        {
          pollutantCode: '011',
          pollutantName: 'COD',
          unit: 'mg/L',
        },
        {
          pollutantCode: '060',
          pollutantName: '氨氮',
          unit: 'mg/L',
        },
      ],
    },
    {
      pollutantCode: 10,
      zspollutant: false,
      unit: 'mg/m³',
      // 是否有传输有效率
      csyxl: false,
      pollutantInfo: [
        {
          pollutantCode: '200',
          pollutantName: 'VOCS',
          unit: 'mg/m³',
        },
      ],
    },
    {
      pollutantCode: 12,
      zspollutant: false,
      unit: 'mg/m³',
      // 是否有传输有效率
      csyxl: false,
      pollutantInfo: [
        {
          pollutantCode: 'a34002',
          pollutantName: 'PM10',
          unit: 'mg/m³',
        },
      ],
    },
    {
      pollutantCode: 2,
      zspollutant: true,
      unit: 'mg/m³',
      // 是否有传输有效率
      csyxl: true,
      pollutantInfo: [
        {
          pollutantCode: '01',
          pollutantName: '烟尘',
          zspollutantCode: 'zs01',
          zspollutantName: '折算烟尘',
          unit: 'mg/m³',
        },
        {
          pollutantCode: '02',
          pollutantName: 'SO2',
          zspollutantCode: 'zs02',
          zspollutantName: '折算SO2',
          unit: 'mg/m³',
        },
        {
          pollutantCode: '03',
          pollutantName: 'NOx',
          zspollutantCode: 'zs03',
          zspollutantName: '折算NOx',
          unit: 'mg/m³',
        },
      ],
    },
    {
      pollutantCode: '',
      zspollutant: true,
      unit: '',
      csyxl: true,
      pollutantInfo: [
        {
          pollutantCode: '01',
          pollutantName: '烟尘',
          zspollutantCode: 'zs01',
          zspollutantName: '折算烟尘',
          unit: 'mg/m³',
        },
        {
          pollutantCode: '02',
          pollutantName: 'SO2',
          zspollutantCode: 'zs02',
          zspollutantName: '折算SO2',
          unit: 'mg/m³',
        },
        {
          pollutantCode: '03',
          pollutantName: 'NOx',
          zspollutantCode: 'zs03',
          zspollutantName: '折算NOx',
          unit: 'mg/m³',
        },
        {
          pollutantCode: '011',
          pollutantName: 'COD',
          unit: 'mg/L',
        },
        {
          pollutantCode: '060',
          pollutantName: '氨氮',
          unit: 'mg/L',
        },
      ],
    },
  ],
  summaryPolluntantCode: 'zs01,zs02,zs03',
};
