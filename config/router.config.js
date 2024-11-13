const routes = [
  // {
  //   path: '/auto',
  //   component: '../layouts/BlankLayout',
  //   routes: [
  //     {
  //       path: '/autoLogin',
  //       component: './user/login/AutoLogin'
  //     },
  //   ],
  // },
  {
    path: '/hrefLogin',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/hrefLogin',
        component: './user/login/hrefLogin',
      },
    ],
  },
  {
    path: '/ControlCabin',
    component: '../layouts/ControlCabinLayout',
    routes: [
      {
        name: 'ControlCabin',
        path: '/ControlCabin/Monitoring',
        component: './ControlCabin/Monitoring',
      },
      {
        name: 'ControlCabin',
        path: '/ControlCabin/QualityControl',
        component: './ControlCabin/QualityControl',
      },
    ],
  },
  {
    path: '/console',
    component: '../layouts/ConsoleLayout',
    routes: [
      {
        path: '/console',
        redirect: '/console/baseConfig',
      },
      /* 配置中心-AutoForm配置 */
      {
        path: '/console/baseConfig',
        routes: [
          // // 常规配置
          // {
          //   name: 'normal',
          //   path: '/console/baseConfig/normal',
          //   component: './Console/Normal',
          // },
          // 数据采集
          {
            path: '/console/baseConfig',
            redirect: '/console/baseConfig/database',
          },
          {
            name: 'collect',
            path: '/console/baseConfig/collect',
            component: './Console/Collect',
          },
          // 数据转发
          {
            name: 'dataForwarding',
            path: '/console/baseConfig/dataForwarding',
            component: './Console/DataForwarding',
          },
          // 定时任务
          {
            name: 'crontab',
            path: '/console/baseConfig/crontab',
            component: './Console/Crontab',
          },
          // 数据库配置
          {
            path: '/console/baseConfig/database',
            component: './autoformConfig/DatabaseConfig',
          },
          /* 配置中心-系统配置-菜单管理 */
          {
            path: '/console/baseConfig/menuManagement',
            component: './autoformConfig/MenuManagement',
          },
          /* 配置中心-系统配置-按钮管理 */
          {
            path: '/console/baseConfig/buttonManagement',
            component: './autoformConfig/ButtonManagement',
          },
          /* 配置中心-AutoForm配置-AutoForm数据源配置 */
          {
            path: '/console/baseConfig/datasource',
            component: './autoformConfig/AutoFormDataSource',
          },
          /* 配置中心-AutoForm配置-AutoForm数据源配置 */
          {
            path: '/console/baseConfig/datasource2',
            component: './autoformConfig/AutoFormDataSource2',
          },
          // 数据源备份还原
          {
            path: '/console/baseConfig/SyncBackSE',
            component: './autoformConfig/DataSourceSyncBackSE',
          },
        ],
      },
    ],
  },
  {
    name: 'changePassword',
    path: '/user/changePassword', //修改密码
    component: './account/settings',
  },
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/autoLogin',
        component: './user/login/AutoLogin',
      },
      {
        name: 'homepage_ys',
        path: '/homepage_ys',
        component: './home_ys',
      },
      {
        name: 'homepage',
        path: '/homepage',
        component: './home',
      },
      {
        name: 'hometangy',
        path: '/hometangy',
        component: './hometangy',
      },
      {
        name: 'sysTypeMiddlePage',
        path: '/sysTypeMiddlePage',
        component: './sysTypeMiddlePage',
      },
      // {
      //   name: 'sysTypeMiddlePage',
      //   path: '/sysTypeMiddlePage',
      //   component: './sysTypeMiddlePage/index2.js',
      // },
      {
        name: 'sessionMiddlePage',
        path: '/sessionMiddlePage',
        component: './sysTypeMiddlePage/SaveSessionPage',
      },
      {
        name: 'summaryProject',
        path: '/summaryProject',
        component: './projectSummary/index',
      },
      {
        name: 'dataFlowChart',
        path: '/dataFlowChart',
        component: './home/yanshi/DataFolwChart',
      },
      {
        // 异常数据识别大屏 - 第一版
        name: 'ModelStatisticsScreen',
        path: '/ModelStatisticsScreen',
        component: './DataAnalyticalWarningModel/Statistics/Screen',
      },
      {
        // 模型首页 - 区域和行业
        name: 'AbnormalIdentifyModelHome',
        path: '/AbnormalIdentifyModel/Home/RegionAndIndustry',
        component: './AbnormalIdentifyModel/Home/RegionAndIndustryPage/index.js',
      },
      {
        // 成套驾驶舱
        name: 'ctDataScreen',
        path: '/ctDataScreen',
        component: './ctDebuggAfterSaleServiceManage/HomeDataScreen',
      },
      {
        // 驾驶舱
        name: 'SystemDashboard',
        path: '/SystemDashboard',
        routes: [
          {
            // 运维
            name: 'Operation',
            path: '/SystemDashboard/Operation',
            component: './SystemDashboard/Operation',
          },
          {
            // 安装调试、成套
            name: 'Operation',
            path: '/SystemDashboard/CT',
            component: './SystemDashboard/CT',
          },
          {
            // 异常识别模型
            name: 'Operation',
            path: '/SystemDashboard/AbnormalIdentify',
            component: './SystemDashboard/AbnormalIdentify',
          },
          {
            // 监督核查
            name: 'SupervisionVerifica',
            path: '/SystemDashboard/SupervisionVerifica',
            component: './SystemDashboard/SupervisionVerifica',
          },
          {
            //监控
            name: 'Monitoring',
            path: '/SystemDashboard/Monitoring',
            component: './SystemDashboard/Monitoring',
          },
          {
            // 质控
            name: 'Monitoring',
            path: '/SystemDashboard/QualityControl',
            component: './SystemDashboard/QualityControl',
          },
        ],
      },
      // appoperation
      {
        path: '/appoperation',
        component: '../layouts/BlankLayout',
        routes: [
          /* 督查详情 移动端 */
          {
            path: '/appoperation/appRemoteSupervisionDetail/:id',
            component: './AppOperation/AppRemoteSupervisionDetail',
          },
          /*帮助中心详情 移动端 */
          {
            path: '/appoperation/appQuestionDetail/:id',
            component: './systemManger/helpCenter/QueDetail',
          },
          /* 公告内容 移动端 */
          {
            path: '/appoperation/noticeContentDetail/:id',
            component: './systemManger/noticeManger/NoticeContentDetail',
          },
          /* 维修记录 */
          {
            path: '/appoperation/apprepairrecord/:TaskID/:TypeID',
            component: './AppOperation/AppRepairRecord',
          },
          /* 停机记录 */
          {
            path: '/appoperation/appstopcemsrecord/:TaskID/:TypeID',
            component: './AppOperation/AppStopCemsRecord',
          },
          /* 易耗品更换记录 */
          {
            path: '/appoperation/appconsumablesreplacerecord/:TaskID/:TypeID',
            component: './AppOperation/AppConsumablesReplaceRecord',
          },
          /* 标气更换记录 */
          {
            path: '/appoperation/appstandardgasrepalcerecord/:TaskID/:TypeID',
            component: './AppOperation/AppStandardGasRepalceRecord',
          },
          /* 完全抽取法CEMS巡检记录表 */
          {
            path: '/appoperation/appcompleteextractionrecord/:TaskID/:TypeID',
            component: './AppOperation/AppCompleteExtractionRecord',
          },
          /* 稀释采样法CEMS巡检记录表 */
          {
            path: '/appoperation/appdilutionsamplingrecord/:TaskID/:TypeID',
            component: './AppOperation/AppDilutionSamplingRecord',
          },
          /* 直接测量法CEMS巡检记录表 */
          {
            path: '/appoperation/appdirectmeasurementrecord/:TaskID/:TypeID',
            component: './AppOperation/AppDirectMeasurementRecord',
          },
          /* CEMS零点量程漂移与校准记录表记录表 */
          {
            path: '/appoperation/appjzrecord/:TaskID/:TypeID',
            component: './AppOperation/AppJzRecord',
          },
          /* CEMS校验测试记录 */
          {
            path: '/appoperation/appbdtestrecord/:TaskID/:TypeID',
            component: './AppOperation/AppBdTestRecord',
          },
          /* CEMS设备异常记录表 */
          {
            path: '/appoperation/appdeviceexceptionrecord/:TaskID/:TypeID',
            component: './AppOperation/AppDeviceExceptionRecord',
          },
          /* 故障小时数记录表 */
          {
            path: '/appoperation/appfailurehoursrecord/:TaskID/:TypeID',
            component: './AppOperation/AppFailureHoursRecord',
          },
          /* 保养项更换记录表 */
          {
            path: '/appoperation/appmaintainrepalcerecord/:TaskID/:TypeID',
            component: './AppOperation/AppMaintainRepalceRecord',
          },
          /* 备件更换记录表 */
          {
            path: '/appoperation/appsparepartreplacerecord/:TaskID/:TypeID',
            component: './AppOperation/AppSparePartReplaceRecord',
          },
          /* 试剂更换记录表 */
          {
            path: '/appoperation/appreagentreplaceRecord/:TaskID/:TypeID',
            component: './AppOperation/AppReagentReplaceRecord',
          },
          /* 配合检查记录表 */
          {
            path: '/appoperation/appCooperaInspection/:TaskID/:TypeID',
            component: './AppOperation/AppCooperaInspection',
          },

          /* 数据一致性记录表 小时与日数据 */
          {
            path: '/appoperation/appDataConsistencyRealDate/:TaskID/:TypeID',
            component: './AppOperation/AppDataConsistencyRealDate',
          },
          /* 数据一致性记录表 实时数据 */
          {
            path: '/appoperation/appDataConsistencyRealTime/:TaskID/:TypeID',
            component: './AppOperation/AppDataConsistencyRealTime',
          },
          /* 上月委托第三方检测次数 */
          {
            path: '/appoperation/appThirdPartyTestingContent/:TaskID/:TypeID',
            component: './AppOperation/AppThirdPartyTestingContent',
          },
          /* 校准记录 */
          {
            path: '/appoperation/appWaterQualityCalibrationRecord/:TaskID/:TypeID',
            component: './AppOperation/AppWaterQualityCalibrationRecord',
          },
          /* 标准溶液核查记录 */
          {
            path: '/appoperation/appStandardSolutionVerificationRecord/:TaskID/:TypeID',
            component: './AppOperation/AppStandardSolutionVerificationRecord',
          },
          /* 设备参数变动记录 废水*/
          {
            path: '/appoperation/appDeviceParameterChange/:TaskID/:TypeID',
            component: './AppOperation/AppDeviceParameterChange',
          },
          /* 设备参数变动记录 废气*/
          {
            path: '/appoperation/appGasDeviceParameterChange/:TaskID/:TypeID',
            component: './AppOperation/AppGasDeviceParameterChange',
          },
          /* 实际水样对比实验结果记录表*/
          {
            path: '/appoperation/comparisonTestResults/:TaskID/:TypeID',
            component: './AppOperation/AppComparisonTestResults',
          },
          /* 手机端二维码 */
          { path: '/appoperation/appqrcodemain', component: './AppOperation/AppQRCodeMain' },
          /* 扫码查运维页面 */
          { path: '/appoperation/scanningCode/:DGIMN', component: './AppOperation/ScanningCode' },
          /* 扫码查运维页面(更多) */
          {
            path: '/appoperation/operationFormDetail/:DGIMN/:TaskID',
            component: './AppOperation/OperationFormDetail',
          },
        ],
      },
      // 新登录
      // {
      //   path: '/user/login',
      //   component: '../layouts/UserLayout2',
      //   routes: [
      //     {
      //       name: 'newLogin',
      //       path: '/user/login',
      //       component: './user/login/NewLogin',
      //     },
      //   ],
      // },
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
          {
            name: 'register-result',
            path: '/user/register-result',
            component: './user/register-result',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './user/register',
          },
          {
            component: '404',
          },
        ],
      },
      {
        name: 'oneEntsOneArchives', //一企一档进入进入页面 企业列表
        path: '/oneEntsOneArchives/entList',
        component: './oneEntsOneArchives/entList',
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        // authority: ['admin', 'user'],
        routes: [
          { path: '/', redirect: '' },

          {
            path: '/Demo',
            name: 'Demo',
            routes: [
              {
                name: 'DH',
                path: '/Demo/DH',
                component: './Demo/DH/Demo',
              },
              {
                name: 'video',
                path: '/Demo/video/live',
                component: './Demo/Video/Live',
              },
              // {
              //   name: 'video',
              //   path: '/Demo/yuanxing/tongji',
              //   component: './Demo/yuanxing',
              // },
              // {
              //   name: 'video',
              //   path: '/Demo/yuanxing/1',
              //   component: './Demo/yuanxing/index2',
              // },
            ],
          },
          // 唐银钢铁项目 - 台账
          {
            name: 'standingBook',
            path: '/standingBook',
            routes: [
              // 排放源清单台账
              {
                name: 'emissionSource',
                path: '/standingBook/emissionSource/:entCode',
                component: './TYGT/standingBook/emissionSource',
              },
              // 除尘器清单台账
              {
                name: 'Deduster',
                path: '/standingBook/deduster',
                component: './TYGT/standingBook/Deduster',
              },
              // 雾炮清单台账
              {
                name: 'fogGun',
                path: '/standingBook/fogGun',
                component: './TYGT/standingBook/FogGun',
              },
              // 生产清单台账
              {
                name: 'production',
                path: '/standingBook/production',
                component: './TYGT/standingBook/Production',
              },
              // 环保车清单台账
              {
                name: 'greenCar',
                path: '/standingBook/greenCar',
                component: './TYGT/standingBook/GreenCar',
              },
            ],
          },
          // 唐银钢铁项目 - 生产及环保数据管理
          {
            name: 'EPAndProduction',
            path: '/EPAndProduction',
            routes: [
              // 治理设施及生产数据
              {
                name: 'facilityAndProduction',
                path: '/EPAndProduction/facilityAndProductionData',
                component: './TYGT/EPAndProduction/FacilityAndProductionData',
              },
            ],
          },
          // 报警
          {
            name: 'alarm',
            path: '/alarm',
            routes: [
              // 报警记录
              {
                name: 'emissionSource',
                path: '/alarm/alarmRecord',
                component: './Alarm/alarmRecord',
              },
            ],
          },
          // 视频
          // {
          //   name: 'video',
          //   path: '/video',
          //   routes: [
          //     // 海康视频 - 预览
          //     // {
          //     //   name: 'emissionSource',
          //     //   path: '/video/HK/view',
          //     //   component: './Video/HKPlatform/index',
          //     // component: './Video/HKPlatform/Live',
          //     // },
          //   ],
          // },
          // 克里斯金差值图
          {
            name: 'krigingMap',
            path: '/krigingMap',
            component: './krigingMap/index',
          },
          // 克里斯金差值图
          {
            name: 'emissionsKrigingMap',
            path: '/emissionsKrigingMap',
            component: './krigingMap/emissions/index',
          },
          {
            name: 'realtimeLive',
            path: '/realtimeLive',
            component: './SC/realtimeLive/M3U8Video',
          },
          {
            name: 'test',
            path: '/test',
            component: './Test/Test',
          },
          {
            name: 'home',
            path: '/home',
            component: './newHome',
          },
          {
            name: 'newestHome',
            path: '/newestHome',
            component: './newestHome',
          },
          // 空气质量分析
          {
            path: '/airQualityAnalysis',
            name: 'airQualityAnalysis',
            routes: [
              {
                name: 'monthAQI',
                path: '/airQualityAnalysis/monthAQI/:type',
                component: './airQualityAnalysis/monthAQI',
              },
              {
                name: 'primaryPol',
                path: '/airQualityAnalysis/primaryPol/:type',
                component: './airQualityAnalysis/primaryPol',
              },
              {
                name: 'index',
                path: '/airQualityAnalysis/yearAndChain',
                component: './airQualityAnalysis/yearAndChain',
              },
              // 污染日历 - 单站点
              {
                name: 'pollutionCalendar',
                path: '/airQualityAnalysis/pollutionCalendar/single',
                component: './airQualityAnalysis/pollutionCalendar/Single',
              },
              // 污染日历 - 多站点
              {
                name: 'pollutionCalendar',
                path: '/airQualityAnalysis/pollutionCalendar/multiple',
                component: './airQualityAnalysis/pollutionCalendar/Multiple',
              },
              // 气象图
              {
                name: 'weatherAnalysis',
                path: '/airQualityAnalysis/weatherAnalysis',
                component: './airQualityAnalysis/weatherAnalysis',
              },
            ],
          },
          // 目标考核台账
          {
            name: 'monitorTest',
            path: '/monitorTest',
            component: './monitorTest',
          },
          // 污染玫瑰
          {
            name: 'polRose',
            path: '/polRose/:type',
            component: './polRose',
          },
          // 应急
          {
            path: '/emergency',
            name: 'emergency',
            routes: [
              {
                name: 'index',
                path: '/emergency/emergencyDuty',
                component: './emergency/emergencyDuty',
              },
              // 甄别基本信息
              {
                name: 'index',
                path: '/emergency/emergencyDuty/details',
                component: './emergency/identify/Details',
              },
              // 应急甄别
              {
                name: 'index',
                path: '/emergency/identify',
                component: './emergency/identify',
              },
              // 应急处置
              {
                name: 'index',
                path: '/emergency/disposal',
                component: './emergency/disposal',
              },
              // 应急处置
              {
                name: 'index',
                path: '/emergency/disposalReport',
                component: './emergency/disposal/DisposalReport',
              },
              // 应急调度
              {
                name: 'index',
                path: '/emergency/dispatch',
                component: './emergency/dispatch/DispatchPage',
              },
              // 应急调度 - 地图
              {
                name: 'index',
                path: '/emergency/dispatchMap',
                component: './emergency/dispatch/DispatchMap',
              },
              // 预案
              {
                name: 'index',
                path: '/emergency/plan',
                component: './emergency/plan',
              },
              // 环境应急监测
              {
                name: 'index',
                path: '/emergency/monitor',
                component: './emergency/monitor',
              },
              // 值班计划
              {
                name: 'dutyPlan',
                path: '/emergency/dutyPlan',
                component: './emergency/dutyPlan',
              },
            ],
          },
          // 地理信息系统
          {
            name: 'map',
            path: '/map',
            routes: [
              {
                name: 'multimediaConference',
                path: '/map/multimediaConference',
                component: './mapPages/MultimediaConference',
              },
              {
                name: 'thematicMap',
                path: '/map/thematicMap/:pollutantCode',
                component: './mapPages/ThematicMap_SC',
              },
              {
                name: 'thematicMap',
                path: '/map/thematicMap',
                component: './mapPages/ThematicMap_SC',
              },
              // {
              //   name: 'thematicMap',
              //   path: '/map/thematicMap/:pollutantCode',
              //   component: './mapPages/ThematicMap',
              // },
              // {
              //   name: 'thematicMap',
              //   path: '/map/thematicMap',
              //   component: './mapPages/ThematicMap',
              // },
              {
                name: 'emissionsHeatMap',
                path: '/map/emissionsHeatMap',
                component: './mapPages/EmissionsHeatMap',
              },
              {
                name: 'characteristicPollutant',
                path: '/map/characteristicPollutant',
                component: './mapPages/CharacteristicPollutant',
              },
            ],
          },
          {
            path: '/:parentcode/autoformmanager/:configId',
            name: 'AutoFormManager',
            routes: [
              {
                name: 'index',
                path: '/:parentcode/autoformmanager/:configId',
                component: './AutoFormManager',
              },
              {
                name: 'add',
                path: '/:parentcode/autoformmanager/:configId/autoformadd',
                // redirect: '/platformconfig/autoformmanager/:configId/autoformadd',
                component: './AutoFormManager/AutoFormAdd',
              },
              {
                name: 'edit',
                path: '/:parentcode/autoformmanager/:configId/autoformedit/:keysParams/:uid',
                component: './AutoFormManager/AutoFormEdit',
              },
              {
                name: 'view',
                path: '/:parentcode/autoformmanager/:configId/autoformview/:keysParams',
                component: './AutoFormManager/AutoFormView',
              },
            ],
          },
          {
            path: '/:parentcode/:parentcode/autoformmanager/:configId',
            name: 'AutoFormManager',
            routes: [
              // { path: '/:parentcode/autoformmanager/:configId', redirect: '/:parentcode/autoformmanager/:configId/AutoFormList' },
              {
                name: 'index',
                path: '/:parentcode/:parentcode/autoformmanager/:configId',
                component: './AutoFormManager',
              },
              {
                name: 'add',
                path: '/:parentcode/:parentcode/autoformmanager/:configId/autoformadd',
                // redirect: '/platformconfig/autoformmanager/:configId/autoformadd',
                component: './AutoFormManager/AutoFormAdd',
              },
              {
                name: 'edit',
                path:
                  '/:parentcode/:parentcode/autoformmanager/:configId/autoformedit/:keysParams/:uid',
                component: './AutoFormManager/AutoFormEdit',
              },
              {
                name: 'view',
                path: '/:parentcode/:parentcode/autoformmanager/:configId/autoformview/:keysParams',
                component: './AutoFormManager/AutoFormView',
              },
            ],
          },
          {
            path: '/:parentcode/:parentcode/:parentcode/autoformmanager/:configId',
            name: 'AutoFormManager',
            routes: [
              // { path: '/:parentcode/autoformmanager/:configId', redirect: '/:parentcode/autoformmanager/:configId/AutoFormList' },
              {
                name: 'index',
                path: '/:parentcode/:parentcode/:parentcode/autoformmanager/:configId',
                component: './AutoFormManager',
              },
              {
                name: 'add',
                path: '/:parentcode/:parentcode/:parentcode/autoformmanager/:configId/autoformadd',
                // redirect: '/platformconfig/autoformmanager/:configId/autoformadd',
                component: './AutoFormManager/AutoFormAdd',
              },
              {
                name: 'edit',
                path:
                  '/:parentcode/:parentcode/:parentcode/autoformmanager/:configId/autoformedit/:keysParams/:uid',
                component: './AutoFormManager/AutoFormEdit',
              },
              {
                name: 'view',
                path:
                  '/:parentcode/:parentcode/:parentcode/autoformmanager/:configId/autoformview/:keysParams',
                component: './AutoFormManager/AutoFormView',
              },
            ],
          },
          /* 配置中心-AutoForm配置 */
          // {
          //   path: '/console',
          //   routes: [
          //     /* 配置中心-AutoForm配置-AutoForm数据库配置 */
          //     {
          //       path: '/console',
          //       redirect: '/sessionMiddlePage?sysInfo={"ID":"559becbf-bf68-46c0-8eda-664457b355cf","Name":"Autoform配置","TipsName":"Autoform配置","CodeList":""}'
          //     },
          //     {
          //       path: '/console/database',
          //       component: './autoformConfig/DatabaseConfig'
          //     },
          //     /* 配置中心-系统配置-菜单管理 */
          //     {
          //       path: '/console/menuManagement',
          //       component: './autoformConfig/MenuManagement'
          //     },
          //     /* 配置中心-AutoForm配置-AutoForm数据源配置 */
          //     {
          //       path: '/console/datasource',
          //       component: './autoformConfig/AutoFormDataSource'
          //     }
          //   ]
          // },
          //污水处理台
          // {
          //   path: '/SewagePlant',
          //   name: 'SewagePlant',
          //   routes: [
          //     {
          //       path: '/SewagePlant',
          //       redirect: 'SewagePlant/DataReporting/DataReporting/1/1',
          //     },
          //     // 数据上报列表
          //     {
          //         name: 'DataReporting',
          //         path: '/SewagePlant/DataReporting/:configId/:monitortime/:entcode',
          //         ///:monitortime/:entcode
          //         component: './platformManager/dataReport/',
          //     },
          //     // 数据上报添加或修改
          //     {
          //         name: 'DataReportingAdd',
          //         path: '/SewagePlant/DataReportingAdd/:configId/:id/:monitortime/:entcode',
          //         component: './platformManager/dataReport/components/addDataReport',
          //     },
          //     //统计报表
          //     {
          //       name:'statisticsReportDataList',
          //       path:'/SewagePlant/dataReportList/statisticsReportDataList',
          //       component: './report/StatisticsReportDataList',
          //     }
          //   ]
          // },
          {
            path: '/operaAchiev', //运维绩效
            name: 'operaAchiev',
            routes: [
              {
                path: '/operaAchiev',
                redirect: '/operaAchiev/personalAchiev', // 重定向 默认为
              },
              {
                // 个人绩效
                name: 'personalAchiev',
                path: '/operaAchiev/personalAchiev',
                component: './operaAchiev/personalAchiev',
              },
              {
                // 绩效信息
                name: 'achievInfo',
                path: '/operaAchiev/achievInfo',
                component: './operaAchiev/achievInfo',
              },
              {
                // 点位系数清单
                name: 'pointCoefficientList',
                path: '/operaAchiev/pointCoefficientList',
                component: './operaAchiev/pointCoefficients',
              },
              {
                // 工单系数清单
                name: 'workCoefficientList',
                path: '/operaAchiev/workCoefficientList',
                component: './operaAchiev/workCoefficients',
              },
              {
                // 绩效定时器
                name: 'operaAchievTimer',
                path: '/operaAchiev/operaAchievTimer',
                component: './operaAchiev/operaAchievTimer',
              },
              {
                // 积分信息查询
                name: 'operaUserIntegral',
                path: '/operaAchiev/operaUserIntegral',
                component: './operaAchiev/operaUserIntegral',
              },
              {
                // 现场工作时长
                name: 'operationSiteAttendanceStatistics',
                path: '/operaAchiev/operationSiteAttendanceStatistics',
                component: './operaAchiev/operationSiteAttendanceStatistics',
              },
              {
                // 签到考勤查询 运维
                name: 'OperaCheckAttendanceQuery',
                path: '/operaAchiev/operaCheckAttendanceQuery',
                component: './operaAchiev/operaCheckAttendanceQuery',
              },
            ],
          },
          {
            path: '/commissionTest', //调试检测
            name: 'commissionTest',
            routes: [
              {
                path: '/commissionTest',
                redirect: '/commissionTest/equipmentAccount',
              },
              {
                name: 'equipmentAccount',
                path: '/commissionTest/equipmentAccount', //调试检测 设备台账
                routes: [
                  {
                    path: '/commissionTest/equipmentAccount',
                    redirect: '/commissionTest',
                  },
                  {
                    name: 'pollutantManager', //调试检测 污染源管理
                    path: '/commissionTest/equipmentAccount/pollutantManager/:configId',
                    component: './commissionTest/equipmentAccount/pollutantManager',
                  },
                  {
                    name: 'commissionTestPoint', //调试检测 污染源管理 监测点
                    path: '/commissionTest/equipmentAccount/pollutantManager/TestEnterprise/point',
                    component: './commissionTest/equipmentAccount/pollutantManager/point',
                  },
                  {
                    name: 'pollutantManager', //调试检测 污染源查询
                    path: '/commissionTest/equipmentAccount/pollutantQuery',
                    component: './commissionTest/equipmentAccount/pollutantQuery',
                  },
                  {
                    name: 'pollutantManager', //调试检测 设备厂家名录
                    path: '/commissionTest/equipmentAccount/equipmentManufacturList',
                    component: './commissionTest/equipmentAccount/equipmentManufacturList',
                  },
                  {
                    name: 'cemsEquipmentList', //cems设备清单
                    path: '/commissionTest/equipmentAccount/cemsEquipmentList',
                    component: './commissionTest/equipmentAccount/cemsEquipmentList',
                  },
                  {
                    name: 'cemsModelList', //cems型号清单
                    path: '/commissionTest/equipmentAccount/cemsModelList',
                    component: './commissionTest/equipmentAccount/cemsModelList',
                  },
                  {
                    name: 'referenceInstruList', //参比仪器清单
                    path: '/commissionTest/equipmentAccount/referenceInstruList',
                    component: './commissionTest/equipmentAccount/referenceInstruList',
                  },
                ],
              },
              {
                name: '72HourCommissionTest', //72小时调试检测
                path: '/commissionTest/72HourCommissionTest',
                component: './commissionTest/72HourCommissionTest',
              },
              {
                name: '72HourCommissionTestQuery', //72小时调试检测查询
                path: '/commissionTest/72HourCommissionTestQuery',
                component: './commissionTest/72HourCommissionTest',
              },
              {
                name: 'areaPermissManage', //区域权限管理
                path: '/commissionTest/areaPermissManage',
                component: './commissionTest/areaPermissManage',
              },
            ],
          },
          {
            path: '/systemManger', //系统管理
            name: 'systemManger',
            routes: [
              {
                path: '/systemManger',
                redirect: '/systemManger/noticeManger/noticeManger',
              },
              {
                name: 'noticeManger',
                path: '/systemManger/noticeManger', // 公告管理
                component: './systemManger/noticeManger',
              },
              {
                name: 'noticeMangerDetail',
                path: '/systemManger/noticeManger/detail', // 公告管理详情
                component: './systemManger/noticeManger/detail',
              },
              {
                name: 'problemManger',
                path: '/systemManger/problemManger', // 问题管理
                component: './systemManger/problemManger',
              },
              {
                name: 'problemMangerDetail',
                path: '/systemManger/problemManger/detail', // 问题管理详情
                component: './systemManger/problemManger/detail',
              },
              {
                name: 'helpCenter',
                path: '/systemManger/helpCenter', // 帮助中心
                component: './systemManger/helpCenter',
              },
              {
                name: 'pollutantModel',
                path: '/systemManger/pollutantMold', // 污染源模型
                component: './systemManger/pollutantMold',
              },
              {
                name: 'logManger',
                path: '/systemManger/logManger', // 日志管理
                component: './systemManger/logManger',
              },
              {
                name: 'dataSourceStatistics',
                path: '/systemManger/dataSourceStatistic', // 数据来源统计
                component: './systemManger/dataSourceStatistic',
              },
              {
                name: 'operationBasConfig',
                path: '/systemManger/operationBasConfig', // 运维基础配置
                component: './systemManger/operationBasConfig',
              },
            ],
          },
          {
            path: '/assetManage/customOrder', //客户订单
            routes: [
              {
                path: '/assetManage/customOrder',
                redirect: '/assetManage/customOrder/custopmRenew', // 重定向 默认为
              },
              {
                // 客户续费
                name: 'custopmRenew',
                path: '/assetManage/customOrder/custopmRenew',
                component: './platformManager/assetManage/custopmRenew',
              },
              {
                // 续费日志
                name: 'custopmRenew',
                path: '/assetManage/customOrder/renewalLog',
                component: './platformManager/assetManage/renewalLog',
              },
              {
                // 续费管理
                name: 'renewManage',
                path: '/assetManage/customOrder/renewManage',
                component: './platformManager/assetManage/renewalLog',
              },
            ],
          },
          {
            path: '/assetManage/basicSet', //基础设置
            routes: [
              {
                path: '/assetManage/basicSet',
                redirect: '/assetManage/basicSet/contractChangeSet', // 重定向 默认为
              },
              {
                name: 'operationProjectUser', // 合同变更设置
                path: '/assetManage/basicSet/contractChangeSet',
                component: './assetManage/basicSet/contractChangeSet',
              },
            ],
          },
          {
            //项目权限管理
            name: 'projectManageAuthor',
            path: '/assetManagement/equipmentAccount/projectManageAuthor',
            component: './platformManager/assetManage/equipmentAccount/projectManageAuthor',
          },
          {
            path: '/platformconfig',
            name: 'platformconfig',
            routes: [
              {
                path: '/platformconfig',
                redirect: '/platformconfig/AEnterpriseTest',
              },
              // 项目管理
              {
                name: 'projectManage',
                path: '/platformconfig/projectManage',
                component: './platformManager/projectManage',
              },
              {
                name: 'UnitInfoPage',
                path:
                  '/platformconfig/monitortarget/AEnterpriseTest/1/unitInfoPage/:entCode/:entName',
                component: './platformManager/point/UnitInfoPage',
              },
              {
                name: 'monitortarget',
                path: '/platformconfig/monitortarget/:configId/:targetType',
                component: './platformManager/monitortarget',
              },
              {
                name: 'entOperationInfo', //企业下的运维信息
                path: '/platformconfig/monitortarget/AEnterpriseTest/1/1,2/operationInfo',
                component: './platformManager/monitortarget/operationInfo',
              },
              {
                name: 'entImport', //企业导入
                path: '/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2/entImport',
                component: './platformManager/monitortarget/entImport',
              },
              {
                name: 'dischargepermit',
                path:
                  '/platformconfig/monitortarget/AEnterpriseTest/:targetType/dischargepermit/:configId/:EntCode/:EntName',
                component: './platformManager/dischargepermit',
              },
              {
                name: 'maintainbase',
                path: '/platformconfig/maintain/:configId/',
                component: './platformManager/maintain',
              },
              {
                name: 'monitortarget',
                path: '/platformconfig/monitortarget/:configId/:targetType/:pollutantTypes',
                component: './platformManager/monitortarget',
              },
              {
                name: 'monitorpoint',
                path:
                  '/platformconfig/monitortarget/:configId/:targetType/:pollutantTypes/monitorpoint/:targetId/:targetName',
                component: './platformManager/point',
              },
              {
                name: 'usestandardlibrary',
                path:
                  '/platformconfig/monitortarget/:configId/:targetType/:pollutantTypes/usestandardlibrary/:DGIMN/:PointName/:targetId/:targetName/:pollutantType',
                component: './platformManager/point/components/setStandard',
              },
              {
                name: 'ysyvideo',
                path:
                  '/platformconfig/ysycameramanager/:Pointname/:Pointcode/:DGIMN/:EntCode/:EntName',
                component: './platformManager/ysyvideo/YsyCameraIndex',
              },
              {
                name: 'ysyshowvideo',
                path: '/platformconfig/ysyshowvideo/:ID/:pointcode/',
                component: './platformManager/ysyvideo/index',
              },
              {
                name: 'hkvideo',
                path:
                  '/platformconfig/hkcameramanager/:Pointname/:Pointcode/:DGIMN/:EntCode/:EntName',
                component: './platformManager/hkvideo/hkCameraIndex',
              },
              {
                name: 'hkshowvideo',
                path: '/platformconfig/hkshowvideo/:pointcode/',
                component: './platformManager/hkvideo/index',
              },
              {
                name: 'manualupload',
                path: '/platformconfig/manualupload/',
                component: './platformManager/manualupload',
              },

              {
                name: 'manualuploadauto',
                path: '/platformconfig/manualuploadauto/',
                component: './platformManager/manualuploadauto',
              },
              // 碳排放 - 参比监控数据
              {
                name: 'carbonMonitoringData',
                path: '/platformconfig/carbonMonitoringData',
                component: './platformManager/manualuploadauto/CarbonMonitoringDataPage',

                // component: './platformManager/manualuploadauto/CarbonMonitoringData.js',
              },
              {
                name: 'maintenancedatabase',
                path: '/platformconfig/maintenancedatabase/:configId',
                component: './OperationSysManager/MaintenanceDatabaseManage/',
              },

              {
                name: 'sparepartmanage',
                path: '/platformconfig/sparepartmanage/:configId',
                component: './OperationSysManager/SparepartManage/',
              },
              {
                name: 'standardgasmanage',
                path: '/platformconfig/standardgasmanage/:configId',
                component: './OperationSysManager/StandardGasManage/',
              },
              {
                name: 'handhelddevicesmanage',
                path: '/platformconfig/handhelddevicesmanage/:configId',
                component: './OperationSysManager/HandheldDevicesManage/',
              },

              {
                name: 'certificatemanage',
                path: '/platformconfig/certificatemanage/:configId',
                component: './OperationSysManager/CertificateManage/',
              },
              {
                //监测标准
                name: 'monitortarget',
                path: '/platformconfig/monitoringstandard',
                component: './platformManager/monitoringstandard',
              },
              //排口数据来源
              {
                name: 'pointDataSource',
                path: '/platformconfig/pointDataSource',
                component: './platformManager/pointDataSource',
              },
              //停运参数管理
              {
                name: 'stopParams',
                path: '/platformconfig/stopParams',
                component: './platformManager/stopParams',
              },
              //燃烧工艺管理
              {
                name: 'combustionProcess',
                path: '/platformconfig/combustionProcess',
                component: './platformManager/combustionProcess',
              },
              //备案参数管理
              {
                name: 'recordParams',
                path: '/platformconfig/recordParams',
                component: './platformManager/recordParams',
              },
              {
                //视频管理
                name: 'videomanager',
                path: '/platformconfig/videomanager',
                component: './Video/videomanager',
              },
              {
                //运维周期
                name: 'maintenancecycle',
                path: '/platformconfig/maintenancecycle',
                component: './platformManager/maintenancecycle',
              },
              // 标准库管理
              {
                name: 'StandardLibrary',
                path: '/platformconfig/StandardLibrary',
                component: './platformManager/standardLibrary',
              },
              // 添加标准库
              {
                name: 'addLibrary',
                path: '/platformconfig/StandardLibrary/addLibrary',
                component: './platformManager/standardLibrary/AddLibrary',
              },
              // 编辑标准库
              {
                name: 'editLibrary',
                path: '/platformconfig/StandardLibrary/editLibrary/:id/:cuid',
                component: './platformManager/standardLibrary/AddLibrary',
              },
              // 编辑标准库
              {
                name: 'viewLibrary',
                path: '/platformconfig/StandardLibrary/viewLibrary/:guid',
                component: './platformManager/standardLibrary/ViewLibrary',
              },
              {
                name: 'equipmentinfomanage',
                path: '/platformconfig/equipmentinfomanage/:configId',
                component: './OperationSysManager/EquipmentInfoManage/',
              },
              {
                name: 'factorytest',
                path: '/platformconfig/factorytest',
                component: './platformManager/factorytest',
              },
              //停产管理
              {
                name: 'outputstopmanage',
                path: '/platformconfig/outputstopmanage/:configId',
                component: './platformManager/outputstopManager/',
              }, //年度考核企业
              {
                name: 'yearCheckEnt',
                path: '/platformconfig/yearCheckEnt',
                component: './platformManager/yearCheckEnt/',
              },
              //企业排放量统计
              {
                name: 'emissionEnt',
                path: '/platformconfig/emissionEnt',
                component: './platformManager/emissionEnt/',
              },
              // {
              //   path: '/platformconfig/basicInfo',
              //   redirect: '/platformconfig/basicInfo/projectManager',
              // },
              {
                //仓库管理
                name: 'warehouse',
                path: '/platformconfig/basicInfo/monitortarget/warehouse/:configId',
                component: './platformManager/basicInfo/storehouseManager/AutoFormManager',
              },
              {
                //设备交接资料管理
                name: 'equiptmentHandManager',
                path: '/platformconfig/basicInfo/equiptmentHandManager',
                component: './platformManager/basicInfo/equiptmentHandManager',
              },
              {
                //配置信息
                name: 'configurationInfo',
                path: '/platformconfig/configurationInfo',
                routes: [
                  {
                    path: '/platformconfig/configurationInfo',
                    redirect: '/platformconfig/configurationInfo/OperationCycle',
                  },
                  {
                    name: 'operationCycle', //运维频次管理
                    path: '/platformconfig/configurationInfo/:configId',
                    component: './platformManager/configurationInfo/AutoFormManager',
                  },
                  {
                    name: 'timerManage', //定时器管理
                    path: '/platformconfig/configurationInfo/timer/timerManage',
                    component: './platformManager/configurationInfo/timerManage',
                  },
                  {
                    name: 'equipmentFacturer', //设备厂家名录
                    path: '/platformconfig/configurationInfo/deveice/equipmentFacturer',
                    component: './platformManager/configurationInfo/equipmentFacturer',
                  },
                  {
                    name: 'systemMarker', //系统型号
                    path: '/platformconfig/configurationInfo/deveice/systemMarker',
                    component: './platformManager/configurationInfo/systemMarker',
                  },
                  {
                    //故障单元管理
                    name: 'faultUnitManager',
                    path: '/platformconfig/configurationInfo/faultUnit/faultUnitManager',
                    component: './platformManager/configurationInfo/faultUnitManager',
                  },
                  {
                    name: 'checkInfo', //核查信息
                    path: '/platformconfig/configurationInfo/check/checkInfo',
                    component: './platformManager/configurationInfo/checkInfo',
                  },
                  {
                    name: 'pointMatchingSet', //点位匹配设置
                    path: '/platformconfig/configurationInfo/pointMatching/pointMatchingSet',
                    component: './platformManager/configurationInfo/pointMatchingSet',
                  },
                  {
                    name: 'accountFillingSet', //台账填报设置
                    path: '/platformconfig/configurationInfo/accountFilling/accountFillingSet',
                    component: './platformManager/configurationInfo/accountFillingSet',
                  },
                  {
                    name: 'noDataPointExport', //无数据点位导出
                    path: '/platformconfig/configurationInfo/noDataPoint/noDataPointExport',
                    component: './platformManager/configurationInfo/noDataPointExport',
                  },
                  {
                    name: 'newOldProtocolConversManger', // 新老协议转换管理
                    path:
                      '/platformconfig/configurationInfo/newOldProtocol/newOldProtocolConversManger',
                    component: './platformManager/configurationInfo/newOldProtocolConversManger',
                  },
                  {
                    name: 'handoverReport', // 交接和报告
                    path: '/platformconfig/configurationInfo/handoverReporting/handoverReport',
                    component: './platformManager/configurationInfo/handoverReport',
                  },
                ],
              },
              {
                //资产管理
                name: 'assetManage',
                path: '/platformconfig/assetManage',
                routes: [
                  {
                    path: '/platformconfig/assetManage',
                    redirect: '/platformconfig/assetManage/deviceInfo',
                  },
                  {
                    name: 'deviceInfo', //设备管理
                    path: '/platformconfig/assetManage/deviceInfo',
                    component: './platformManager/assetManage/deviceInfo',
                  },
                  {
                    name: 'spareParts', //备品备件
                    path: '/platformconfig/assetManage/spareParts/:configId',
                    component: './OperationSysManager/SparepartManage',
                  },
                  // {
                  //   name: 'referenceMaterial',//标准物质
                  //   path: '/platformconfig/assetManage/referenceMaterial/:configId',
                  //   component: './OperationSysManager/StandardGasManage',
                  // },
                  {
                    name: 'referenceMaterial', //标准物质
                    path: '/platformconfig/assetManage/referenceMaterial',
                    component: './platformManager/assetManage/referenceMaterial',
                  },
                  {
                    name: 'StandardLiquid', //试剂信息
                    path: '/platformconfig/assetManage/reagentInfo',
                    component: './platformManager/assetManage/referenceMaterial',
                  },
                ],
              },
              {
                // 项目管理
                name: 'projectManager',
                path: '/platformconfig/basicInfo/projectManager/list/:listType',
                component: './platformManager/basicInfo/projectManager',
              },
              {
                // 项目管理详情
                name: 'projectManagerDetail',
                path: '/platformconfig/basicInfo/projectManager/detail',
                component: './platformManager/basicInfo/projectManager/detail',
              },
              {
                // 设备管理
                name: 'equipmentManage',
                path: '/platformconfig/equipmentManage',
                component: './platformManager/equipmentManage',
              },
              {
                // 设备参数管理
                name: 'equipmentManage',
                path: '/platformconfig/equipmentParmars',
                component: './platformManager/equipmentParmars',
              },
              {
                // 设备管理 - 添加、编辑
                name: 'addEditEquipment',
                path: '/platformconfig/equipmentManage/:DGIMN/:id',
                component: './platformManager/equipmentManage/AddEditEquipmentPage',
              },
            ],
          },
          {
            path: '/report',
            name: 'report',
            routes: [
              {
                path: '/report',
                redirect: '/report/wry',
              },
              // {
              //   name: 'dateReportPage',
              //   path: '/report/:reportType',
              //   component: './report/DateReportPage',
              // },
              // {
              //   name: 'summaryReportPage',
              //   path: '/report/summary/:reportType',
              //   component: './report/summaryReportPage',
              // },
              {
                name: 'wryReport',
                path: '/report/wry',
                // component: "./operations/CalendarPage",
                routes: [
                  {
                    path: '/report/wry',
                    redirect: '/report/wry/siteDaily',
                  },
                  {
                    name: 'dateReportPage',
                    path: '/report/wry/siteReport',
                    component: './report/DateReportPage',
                  },
                  {
                    name: 'summaryReportPage',
                    path: '/report/wry/summary',
                    component: './report/summaryReportPage',
                  },
                ],
              },
              {
                name: 'wryReport',
                path: '/report/water',
                // component: "./operations/CalendarPage",
                routes: [
                  {
                    path: '/report/water',
                    redirect: '/report/water/DailyReport',
                  },
                  //小时平均值日报
                  {
                    name: 'DailyReport',
                    path: '/report/water/DailyReport',
                    component: './report/DailyReport/DailyReport',
                  },
                  //日平均值月报
                  {
                    name: 'MonthReport',
                    path: '/report/water/MonthReport',
                    component: './report/MonthReport/MonthReport',
                  },
                  //月平均值季报
                  {
                    name: 'SeasonReport',
                    path: '/report/water/SeasonReport',
                    component: './report/SeasonReport/SeasonReport',
                  },
                  //月平均值年报
                  {
                    name: 'YearReport',
                    path: '/report/water/YearReport',
                    component: './report/YearReport/YearReport',
                  },
                ],
              },

              {
                name: 'smokeReportPage',
                path: '/report/smoke',
                routes: [
                  {
                    path: '/report/smoke',
                    redirect: '/report/smoke/day',
                  },
                  {
                    name: 'smokeReport',
                    path: '/report/smoke/:reportType',
                    component: './report/SmokeReportPage',
                  },
                  {
                    name: 'CO2DayReport',
                    path: '/report/smoke/CO2/day',
                    component: './report/CO2/DayReportPage',
                  },
                ],
              },
              {
                name: 'statisticsReportDataList',
                path: '/report/dataReportList/statisticsReportDataList',
                component: './report/StatisticsReportDataList',
              },
            ],
          },
          {
            path: '/operations',
            name: 'operations',
            routes: [
              {
                path: '/operations',
                redirect: '/operations/log', // 重定向 默认为 运维日志页面
              },
              {
                path: '/operations/dataImport',
                name: 'index',
                component: './platformManager/manualuploadauto',
              },
              {
                path: '/operations/calendar',
                name: 'calendar',
                // component: "./operations/CalendarPage",
                routes: [
                  {
                    path: '/operations/calendar',
                    redirect: '/operations/calendar/index',
                  },
                  {
                    path: '/operations/calendar/index',
                    name: 'index',
                    component: './operations/CalendarPage',
                  },
                  {
                    path: '/operations/calendar/details/:TaskID/:DGIMN',
                    name: 'calendar',
                    component: './EmergencyTodoList/EmergencyDetailInfoLayout',
                  },
                ],
              },

              {
                path: '/operations/log', //运维日志
                name: 'log',
                component: './operations/operationRecord',
              },
              {
                path: '/operations/operationRecordList', //运维记录
                name: 'operationRecordList',
                component: './operations/operationRecordList',
              },
              {
                path: '/operations/operationLedger', //运维台账
                name: 'ledger',
                component: './operations/operationLedger',
              },
              {
                path: '/operations/operationRecordnalysis', //运维记录分析
                name: 'operationRecordnalysis',
                component: './operations/operationRecordnalysis',
              },
              {
                path: '/operations/alarmResponseTimelyRate', //报警响应及时率
                name: 'alarmResponseTimelyRate',
                component: './operations/alarmResponseTimelyRate',
              },
              {
                name: 'materielmanager',
                path: '/operations/materielmanager',
                routes: [
                  {
                    path: '/operations/materielmanager',
                    redirect: '/operations/materielmanager/sparepartmanage/SparepartManage',
                  },
                  {
                    name: 'sparepartmanage',
                    path: '/operations/materielmanager/sparepartmanage/:configId',
                    component: './OperationSysManager/SparepartManage/',
                  },
                  {
                    name: 'standardgasmanage',
                    path: '/operations/materielmanager/standardgasmanage/:configId',
                    component: './OperationSysManager/StandardGasManage/',
                  },
                  {
                    name: 'handhelddevicesmanage',
                    path: '/operations/materielmanager/handhelddevicesmanage/:configId',
                    component: './OperationSysManager/HandheldDevicesManage/',
                  },
                ],
              },
              {
                name: 'sparepartsstation',
                path: '/operations/serviceSite',
                component: './OperationSysManager/SparePartsStation',
              },
              {
                name: 'usermanager',
                path: '/operations/usermanager',
                routes: [
                  {
                    path: '/operations/usermanager',
                    redirect: '/operations/usermanager/certificatemanage/CertificateManage',
                  },
                  {
                    name: 'certificatemanage',
                    path: '/operations/usermanager/certificatemanage/:configId',
                    component: './OperationSysManager/CertificateManage/',
                  },
                ],
              },
              {
                //运维资料
                name: 'maintenancedatabase',
                path: '/operations/maintenancedatabase/:configId',
                component: './OperationSysManager/MaintenanceDatabaseManage/',
              },
              {
                name: 'sparepartsstation', //服务站信息
                path: '/operations/sparepartsstation/:configId',
                component: './OperationSysManager/SparePartsStation/',
              },
              {
                name: 'carmanager',
                path: '/operations/carmanager',
                routes: [
                  {
                    path: '/operations/carmanager',
                    redirect: '/operations/carmanager/vehicleApplication',
                  },
                  {
                    path: '/operations/carmanager/vehicleApplication',
                    name: 'vehicleApplication',
                    component: './operations/VehicleApplication',
                  },
                  {
                    path: '/operations/carmanager/:parentName/trajectory/:ApplicantID',
                    name: 'trajectory',
                    component: './operations/vehicleTrajectory',
                  },
                  {
                    path: '/operations/carmanager/vehicleApprove',
                    name: 'vehicleApprove',
                    component: './operations/VehicleApprove',
                  },
                  {
                    name: 'vehiclemanage',
                    path: '/operations/carmanager/vehiclemanage/:configId',
                    component: './OperationSysManager/VehicleManage/',
                  },
                ],
              },

              // {
              //   path: '/operations/operationRecord',
              //   name: "operationRecord",
              //   component: "./operations/operationRecord"
              // },
              {
                path: '/operations/taskRecord1',
                redirect: '/operations/calendar/index',
              },
              {
                path: '/operations/taskRecord2',
                redirect: '/operations/calendar/index',
              },
              {
                path: '/operations/taskRecordTotal',
                name: 'taskRecordTotal', //测试环境运维工单总览
                component: './operations/TaskRecord',
              },
              {
                path: '/operations/taskRecord',
                name: 'taskRecord',
                component: './operations/TaskRecord',
              },
              {
                path: '/operations/taskRecord/:type',
                name: 'taskRecord',
                component: './operations/TaskRecord',
              },

              {
                path: '/operations/taskRecord/details/:TaskID/:DGIMN',
                name: 'taskRecordDetail',
                component: './EmergencyTodoList/EmergencyDetailInfoLayout',
              },

              {
                path: '/operations/:from/recordForm/:typeID/:taskID',
                name: 'recordForm',
                component: './operations/recordForm',
              },
              {
                path: '/operations/recordForm/:typeID/:taskID',
                name: 'recordForm',
                component: './operations/recordForm',
              },
              {
                path: '/operations/CommandDispatchReport',
                name: 'CommandDispatchReport',
                component: './operations/CommandDispatchReport',
              },
              {
                path: '/operations/equipmentFeedback', //开发设备故障反馈
                name: 'EquipmentFeedback',
                component: './operations/equipmentFeedback',
              },
              {
                path: '/operations/equipmentFeedback/detail', //开发设备故障反馈 详情
                name: 'EquipmentFeedback',
                component: './operations/equipmentFeedback/detail',
              },
              {
                path: '/operations/operationEntManage/details/:TaskID/:DGIMN',
                name: 'CommandDispatchReportDetails',
                component: './EmergencyTodoList/EmergencyDetailInfoLayout',
              },
              {
                name: 'operationUnit', //运维单位管理
                path: '/operations/operationEntManage/operationUnit/:configId',
                component: './operations/operationEntManage/operationUnit',
              },
              {
                name: 'operationPerson', //运维人员管理
                path: '/operations/operationEntManage/operationPerson/:configId',
                component: './operations/operationEntManage/operationPerson',
              },
              {
                name: 'operationPerson', //运维人员管理  详情
                path: '/operations/operationEntManage/operationPerson/detail/:configId/:personId',
                component: './operations/operationEntManage/operationPerson/OperationPersonDetail',
              },
              {
                path: '/operations/CommandDispatchReport/details/:TaskID/:DGIMN',
                name: 'CommandDispatchReportDetails',
                component: './EmergencyTodoList/EmergencyDetailInfoLayout',
              },
              {
                path: '/operations/supervisionWorkbench', //督查核查软件 60 工作台
                name: 'remoteSupervision',
                component: './operations/supervisionWorkbench',
              },
              {
                path: '/operations/remoteSupervision', //远程督查
                name: 'remoteSupervision',
                component: './operations/remoteSupervision',
              },
              {
                path: '/operations/remoteSupervisionRecord', //远程督查记录
                name: 'remoteSupervisionRecord',
                component: './operations/remoteSupervision',
              },
              {
                path: '/operations/remoteSupervision/detail/:id', //远程督查 详情
                name: 'remoteSupervisionDetail',
                component: './operations/remoteSupervision/detail',
              },
              {
                path: '/operations/supervisionList', //督查项清单
                name: 'supervisionList',
                component: './operations/supervisionList',
              },
              {
                path: '/operations/supervisionManager', //运维督查管理 远程督查
                name: 'supervisionList',
                component: './operations/supervisionManager',
              },
              {
                path: '/operations/siteInspector', //运维督查管理 现场督查
                name: 'siteInspector',
                component: './operations/supervisionManager',
              },
              {
                path: '/operations/supervisionRecod', //运维督查记录 远程督查
                name: 'supervisionRecod',
                component: './operations/supervisionManager',
              },
              {
                path: '/operations/siteSupervisionRecod', //运维督查记录 现场督查
                name: 'siteSupervisionRecod',
                component: './operations/supervisionManager',
              },
              {
                path: '/operations/supervisionAnalySumm', //督查分析总结
                name: 'supervisionAnalySumm',
                component: './operations/supervisionAnalySumm',
              },
              {
                path: '/operations/superviseRectification', //系统设施核查整改
                name: 'superviseRectification',
                component: './operations/superviseRectification',
              },
              {
                path: '/operations/provincialManager', //省区经理管理
                name: 'provincialManager',
                component: './operations/provincialManager',
              },
              {
                path: '/operations/cruxParSupervision', //关键参数督查
                name: 'cruxParSupervision',
                component: './operations/cruxParSupervision',
              },
              {
                path: '/operations/cruxParSupervisionRecord', //关键参数督查记录
                name: 'superviseRectification',
                component: './operations/cruxParSupervision',
              },
              {
                path: '/operations/cruxParSupervisionRectifica', //关键参数核查整改
                name: 'cruxParSupervisionRectifica',
                // component: './operations/cruxParSupervisionRectifica',
                component: './operations/cruxParSupervisionRectifica3.0',
              },
              // {
              //   path: '/operations/cruxParSupervisionAnalysis', //关键参数核查分析
              //   name: 'cruxParSupervisionAnalysis',
              //   component: './operations/cruxParSupervisionAnalysis',
              // },
              {
                path: '/operations/cruxParSupervisionStatistics', //关键参数核查统计
                name: 'cruxParSupervisionStatistics',
                component: './operations/cruxParSupervisionAnalysis',
              },
              {
                path: '/operations/operatioSupervisionKpi', //运维督查KPI
                name: 'operatioSupervisionKpi',
                component: './operations/operatioSupervisionKpi',
              },
              {
                //运维任务管理 重定向
                path: '/operations/operaTaskManager',
                redirect: '/operations/operaTaskManager/operaTask',
              },
              {
                path: '/operations/operaTaskManager',
                name: 'operaTask',
                routes: [
                  {
                    path: '/operations/operaTaskManager/operaTask', //运维任务
                    name: 'operaTask',
                    component: './operations/operaTaskManager/operaTask',
                  },
                ],
              },
              {
                //运维任务报告
                path: '/operations/operaTaskReportManager',
                redirect: '/operations/operaTaskReportManager/operaTaskReport',
              },
              {
                path: '/operations/operaTaskReportManager',
                name: 'operaTask',
                routes: [
                  {
                    path: '/operations/operaTaskReportManager/operaTaskReport', //运维任务报告
                    name: 'operaTask',
                    component: './operations/operaTaskReportManager/operaTaskReport',
                  },
                ],
              },
              {
                //运维计划
                path: '/operations/operaPlan',
                name: 'operaPlan',
                routes: [
                  {
                    path: '/operations/operaPlan',
                    redirect: '/operations/operaPlan/formulateOperaTask',
                  },
                  {
                    path: '/operations/operaPlan/formulateOperaTask', //制定运维计划
                    name: 'formulateOperaTask',
                    component: './operations/operaPlan/formulateOperaTask',
                  },
                  {
                    path: '/operations/operaPlan/afootPlan', //进行中计划
                    name: 'afootPlan',
                    component: './operations/operaPlan/afootPlan',
                  },
                  {
                    path: '/operations/operaPlan/completedPlan', //已完结计划
                    name: 'completedPlan',
                    component: './operations/operaPlan/planQuery',
                  },
                  {
                    path: '/operations/operaPlan/operaPlanQuery', //运维计划查询
                    name: 'operaPlanQuery',
                    component: './operations/operaPlan/planQuery',
                  },
                ],
              },
            ],
          },
          {
            //设备运维过程管理
            path: '/operaProcess',
            name: 'operaProcess',
            routes: [
              {
                path: '/operaProcess',
                redirect: '/operaProcess/taskRecord?tasktype=1,7',
              },
              {
                path: '/operaProcess/routine/taskRecord/:type',
                name: 'routine',
                component: './operations/TaskRecord',
              },
              {
                path: '/operaProcess/emergency/taskRecord/:type',
                name: 'emergency',
                component: './operations/TaskRecord',
              },
            ],
          },
          {
            path: '/rolesmanager',
            name: 'rolesmanager',
            // redirect: './rolesmanager/user',
            // component: './authorized/user',
            // authority: ['admin', 'user'],
            routes: [
              {
                path: '/rolesmanager',
                redirect: '/rolesmanager/user/userinfoindex/UserInfo',
              },
              {
                name: 'user',
                path: '/rolesmanager/user',
                routes: [
                  // {
                  //   path: '/rolesmanager',
                  //   redirect: '/rolesmanager/user',
                  // },
                  {
                    path: '/rolesmanager/user',
                    redirect: '/rolesmanager/user/newUserInfo',
                  },
                  // 用户管理-未合并
                  // {
                  //   name: 'index',
                  //   path: '/rolesmanager/user/userinfoindex/UserInfo',
                  //   component: './authorized/user',
                  // },
                  {
                    name: 'newUserInfo',
                    path: '/rolesmanager/user/newUserInfo',
                    component: './authorized/newUser',
                  },
                  {
                    // 用户权限
                    name: 'userAuthority',
                    path: '/rolesmanager/user/userAuthority',
                    component: './authorized/userAuthority',
                  },
                  {
                    name: 'add',
                    path: '/rolesmanager/user/userinfoadd',
                    component: './authorized/user/UserInfoAdd',
                  },
                  {
                    name: 'edit',
                    path: '/rolesmanager/user/userinfoedit/:userid',
                    component: './authorized/user/UserInfoEdit',
                  },
                  {
                    name: 'view',
                    path: '/rolesmanager/user/userinfoview/:userid',
                    component: './authorized/user/UserInfoView',
                  },
                ],
              },
              {
                name: 'roleInfo',
                path: '/rolesmanager/role',
                routes: [
                  {
                    name: 'index',
                    path: '/rolesmanager/role/roleindex',
                    component: './authorized/roleInfo',
                  },
                  {
                    name: 'menu',
                    path: '/rolesmanager/rolemenu/:roleid',
                    component: './authorized/roleInfo/menu',
                  },
                ],
              },
              {
                name: 'departInfo',
                path: '/rolesmanager/depart',
                routes: [
                  {
                    name: 'index',
                    path: '/rolesmanager/depart/departindex',
                    component: './authorized/departInfo',
                  },
                ],
              },
              {
                //用户恢复
                name: 'userRecovery',
                path: '/rolesmanager/userRecovery',
                component: './authorized/userRecovery',
              },
              {
                name: 'operaGroup', //运维小组
                path: '/rolesmanager/operaGroup',
                component: './authorized/operaGroup',
              },
              {
                name: 'smsSend', //短信发送
                path: '/rolesmanager/smsSend',
                component: './authorized/smsSend',
              },
            ],
          },
          // {
          //   path: '/overview',
          //   name: 'overview',
          //   // redirect: '/AutoFormManager',
          //   // component: './authorized/user',
          //   // authority: ['admin', 'user'],
          //   routes: [
          //     // {
          //     //   name: 'datalist',
          //     //   path: '/overview/datalist',
          //     //   routes:[
          //     {
          //       name: 'index',
          //       path: '/overview/datalist',
          //       component: './overView',
          //     },
          //     //   ]
          //     // },
          //   ],
          // },
          {
            name: 'alarmmanager',
            path: '/alarmmanager',
            routes: [
              {
                path: '/alarmmanager',
                redirect: '/alarmmanager/alarmrecord',
              },
              {
                name: 'alarmrecord',
                path: '/alarmmanager/alarmrecord',
                component: './monitoring/alarmrecord/index',
              },
              {
                name: 'alarmverifyrecord',
                path: '/alarmmanager/alarmverifyrecord/exceptionVerify',
                component: './monitoring/alarmverifyrecord/index',
              },
            ],
          },

          {
            name: 'dataquerymanager',
            path: '/dataquerymanager',
            routes: [
              {
                path: '/dataquerymanager',
                redirect: '/dataquerymanager/exceptionrecord',
              },
              {
                name: 'exceptionrecord',
                path: '/dataquerymanager/exceptionrecord',
                component: './monitoring/exceptionrecord',
              },
              {
                name: 'overrecord',
                path: '/dataquerymanager/overrecord',
                component: './monitoring/overRecord',
              },
              {
                name: 'originaldata',
                path: '/dataquerymanager/originaldata',
                component: './monitoring/originaldata',
              },
              {
                // 数据审核
                name: 'dataAudit',
                path: '/dataquerymanager/dataAudit/:type',
                component: './monitoring/dataquery/DataAuditPage',
              },
              {
                // 数据打标
                name: 'dataFlag',
                path: '/dataquerymanager/dataFlag',
                component: './monitoring/dataquery/DataTagPage',
              },
              // {
              //   name: 'defectData',
              //   //数据缺失
              //   path: '/dataquerymanager/alarmInfo/defectData',
              //   component: './monitoring/defectData/ent',
              // },
              // {
              //   name: 'defectDataAir',
              //   //数据缺失(空气站)
              //   path: '/dataquerymanager/alarmInfo/defectDataAir',
              //   component: './monitoring/defectData/air',
              // },
              {
                name: 'airStation',
                //空气站查询
                path: '/dataquerymanager/airStation',
                component: './monitoring/airStation',
              },
              // {
              //   name: 'exceedData',
              //   //超标数据查询
              //   path: '/dataquerymanager/exceedData',
              //   component: './monitoring/exceedData',
              // },
            ],
          },
          {
            //监督核查 重定向
            path: '/supervisionCheck',
            redirect: '/operations/remoteSupervision',
          },
          {
            path: '/supervisionCheck/noScene', //非现场监督核查 重定向
            redirect: '/operations/remoteSupervision',
          },
          {
            path: '/supervisionCheck/scene', //现场监督核查 重定向
            redirect: '/operations/siteInspector',
          },
          {
            //资产管理 重定向
            path: '/assetManagement',
            redirect: '/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2',
          },
          {
            path: '/assetManagement/equipmentAccount', //设备台账 重定向
            redirect: '/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2',
          },
          {
            path: '/assetManagement/operationAccount', //运维台账 重定向
            redirect: '/operations/maintenancedatabase/MaintenanceDatabase',
          },
          {
            path: '/assetManagement/consumables', //备件耗材 重定向
            redirect: '/platformconfig/basicInfo/monitortarget/warehouse/Storehouse',
          },
          {
            path: '/assetManagement/authorityManage', //权限管理 重定向
            redirect: '/rolesmanager/user/newUserInfo',
          },
          {
            path: '/monitoring',
            name: 'monitoring',
            routes: [
              {
                path: '/monitoring',
                redirect: '/monitoring/mapview/realtimeDataView',
              },
              {
                name: 'outputstopmanage',
                path: '/monitoring/outputstopmanage/:configId',
                component: './platformManager/outputstopManager/',
              },
              {
                name: 'realtimedata',
                path: '/monitoring/realtimedata',
                component: './monitoring/realtimedata',
              },
              // 数据总览 - 运维
              {
                name: 'realtimedataent',
                path: '/monitoring/realtimedata/ent',
                component: './monitoring/overView/realtime/Ent',
              },
              {
                name: 'air',
                path: '/monitoring/realtimedata/air',
                component: './monitoring/overView/realtime/Air',
              },
              // 数据一览 - 实时
              {
                name: 'realtimeDataView',
                path: '/monitoring/mapview/realtimeDataView',
                component: './monitoring/overView/realtime',
              },
              // 数据一览 - 唐银钢铁
              {
                name: 'realtimeDataView',
                path: '/monitoring/mapview/realtime_TY',
                component: './monitoring/overView/realtime/index_TYGT',
              },
              // 电能数据一览
              {
                name: 'ElectricDataView',
                path: '/monitoring/ElectricDataView',
                component: './monitoring/overView/ElectricDataView',
              },
              // 数采仪在线情况统计
              {
                name: 'onlineStatistics',
                path: '/monitoring/onlineStatistics',
                component: './monitoring/overView/OnlineStatistics',
              },
              {
                name: 'datalist',
                path: '/monitoring/mapview/datalist',
                component: './monitoring/overView',
              },
              {
                name: 'mapview',
                path: '/monitoring/mapview',
                component: './monitoring/mapview',
              },
              {
                name: 'videopreview',
                path: '/monitoring/videopreview',
                // component: `${JSON.parse(window.localStorage.getItem('sysConfigInfo')).VideoServer === 0
                //   ? './monitoring/videopreview/hkvideo/index'
                //   : './monitoring/videopreview/ysyvideo/VideoReact'
                //   }`,
                component: './Video/videoView',
              },
              {
                name: 'videopreview',
                path: '/monitoring/videopreview/:key',
                component: './Video/videoView',
              },
              {
                path: '/monitoring/videoMonitor',
                redirect: '/monitoring/videoMonitor/ent',
              },
              {
                //视频监控 企业
                path: '/monitoring/videoMonitor/ent',
                component: './monitoring/videoMonitor/ent',
              },
              {
                name: 'realtimedata',
                path: '/monitoring/realtimedata',
                component: './monitoring/realtimedata',
              },
              // 历史数据
              {
                name: 'dataquery',
                path: '/monitoring/dataquery',
                component: './monitoring/dataquery/index',
              },
              // 历史用电量查询
              {
                name: 'electricDataquery',
                path: '/monitoring/electric/dataquery',
                component: './monitoring/dataquery/index',
              },
              // 企业异常上报
              {
                name: 'entExceptionReported',
                path: '/monitoring/entExceptionReported',
                component: './monitoring/entExceptionReported',
              },
              {
                name: 'dynamicControlData', //动态管控数据查询
                path: '/monitoring/dynamicControlData',
                component: './monitoring/dynamicControlData',
              },
              {
                name: 'workCondiData', //工况数据查询
                path: '/monitoring/workCondiData',
                component: './monitoring/workCondiData',
              },
              {
                name: 'alarmInfo',
                path: '/monitoring/alarmInfo',
                routes: [
                  // {
                  //   path: '/monitoring/alarmInfo',
                  //   redirect: '/monitoring/alarmInfo/exceptionrecord',
                  // },
                  // {
                  //   //缺失数据报警  企业
                  //   name: 'missingData',
                  //   path: '/monitoring/alarmInfo/missingData',
                  //   component: './monitoring/missingData/ent',
                  // },
                  // {
                  //   //缺失数据报警(空气站)
                  //   name: 'missingData',
                  //   path: '/monitoring/alarmInfo/missingDataAir',
                  //   component: './monitoring/missingData/air',
                  // },
                  // {
                  //   //缺失数据报警 二级页面
                  //   name: 'missDataSecond',
                  //   path: '/monitoring/alarmInfo/missDataSecond',
                  //   component: './monitoring/missingData/missDataSecond',
                  // },

                  // {
                  //   //缺失数据报警响应  企业
                  //   name: 'missingData',
                  //   path: '/monitoring/alarmInfo/missingDataRes',
                  //   component: './monitoring/missingData/entRes',
                  // },
                  // {
                  //   //缺失数据报警响应(空气站)
                  //   name: 'missingData',
                  //   path: '/monitoring/alarmInfo/missingDataAirRes',
                  //   component: './monitoring/missingData/airRes',
                  // },
                  // {
                  //   //缺失数据报警响应 二级页面
                  //   name: 'missDataSecond',
                  //   path: '/monitoring/alarmInfo/missDataResSecond',
                  //   component: './monitoring/missingData/missDataResSecond',
                  // },
                  {
                    //超标数据报警核实记录查询
                    name: 'exceedDataAlarm',
                    path: '/monitoring/alarmInfo/exceedDataAlarmRecord',
                    component: './dataSearch/exceedDataAlarmRecord/exceedDataAlarm',
                  },
                  {
                    //超标数据报警记录查询
                    name: 'exceedDataAlarm',
                    path: '/monitoring/alarmInfo/exceedDataAlarmOnlyQuery',
                    component: './dataSearch/exceedDataAlarmRecord/exceedDataAlarm_onlyQuery',
                  },
                  // {
                  //   //异常报警响应查询
                  //   name: 'exceptionrecord',
                  //   path: '/monitoring/alarmInfo/exceptionrecord',
                  //   component: './monitoring/alarmInfo/exceptionrecordNew',
                  // },
                  // {
                  //   //异常报警查询
                  //   name: 'exceptionrecordOnlyQuery',
                  //   path: '/monitoring/alarmInfo/exceptionrecordOnlyQuery',
                  //   component: './monitoring/alarmInfo/exceptionrecordNew/OnlyQuery',
                  // },
                  // {
                  //   name: 'exceptionrecordDetails',
                  //   path: '/monitoring/alarmInfo/exceptionrecord/details',
                  //   component: './monitoring/alarmInfo/exceptionrecordNew/RegionDetails',
                  // },
                  {
                    //超标报警处置查询
                    name: 'exceedDataDispositionRecord',
                    path: '/monitoring/alarmInfo/exceedDataDispositionRecord',
                    component:
                      './monitoring/alarmInfo/exceedDataDispositionRecord/exceedDataDispositionRecord',
                  },
                ],
              },

              // {
              //   name: 'exceptionrecord',
              //   path: '/monitoring/exceptionrecord',
              //   component: './monitoring/exceptionrecord',
              // },
              // {
              //   name: 'overrecord',
              //   path: '/monitoring/overrecord',
              //   component: './monitoring/overRecord',
              // },
              {
                name: 'originaldata', //原始数据包
                path: '/monitoring/missingData/originaldata',
                component: './monitoring/originaldata',
              },
              {
                name: 'platformAnalysReport', //平台分析报告
                path: '/monitoring/platformAnalysReport',
                component: './monitoring/platformAnalysReport',
              },
            ],
          },
          {
            name: 'abnormaRecall',
            path: '/abnormaRecall',
            routes: [
              // {
              //   //智能诊断 重定向
              //   path: '/abnormaRecall',
              //   redirect: '/monitoring/outputstopmanage/OutputStopNew',
              // },
              // {
              //   path: '/abnormaRecall/abnormalDataAnalysis', ///异常数据分析 重定向
              //   redirect: '/dataSearch/exceedData',
              // },
              // 异常报警响应查询
              {
                name: 'exceptionrecord',
                path: '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord',
                // component: './monitoring/exceptionrecord',
                component: './monitoring/alarmInfo/exceptionrecordNew',
              },
              {
                //异常报警查询
                name: 'exceptionrecordOnlyQuery',
                path:
                  '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord/onlyQuery',
                component: './monitoring/alarmInfo/exceptionrecordNew/OnlyQuery',
              },
              // 异常报警响应查询 - 行政区
              {
                name: 'exceptionrecordCity', //异常数据报警 城市级页面
                path:
                  '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord/cityLevel',
                component: './monitoring/alarmInfo/exceptionrecordNew/cityLevel',
              },
              // 异常报警响应查询 - 市
              {
                name: 'exceptionrecordDetails',
                path:
                  '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/exceptionrecord/details',
                component: './monitoring/alarmInfo/exceptionrecordNew/RegionDetails',
              },

              {
                //缺失数据报警  企业
                path: '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/ent',
                component: './monitoring/missingData/ent',
              },
              {
                //缺失数据报警  城市级别 企业
                path: '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/ent/cityLevel',
                component: './monitoring/missingData/cityLevel/index',
              },
              {
                //缺失数据报警 二级页面
                path:
                  '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/ent/missDataSecond',
                component: './monitoring/missingData/missDataSecond',
              },
              {
                //缺失数据报警 空气站
                path: '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/air',
                component: './monitoring/missingData/air',
              },
              {
                //缺失数据报警 城市级别 空气站
                path: '/abnormaRecall/abnormalDataAnalysis/monitoring/missingData/cityLevel/air',
                component: './monitoring/missingData/cityLevel/index',
              },
            ],
          },
          {
            path: '/platformconfig',
            name: 'platformconfig',
            routes: [
              {
                path: '/platformconfig',
                redirect: '/platformconfig/monitortarget/AEnterpriseTest/1/1,2',
              },
              {
                // 设备管理
                name: 'equipmentManage',
                path: '/platformconfig/equipmentManage',
                component: './platformManager/equipmentManage',
              },
              {
                // 设备管理 - 添加、编辑
                name: 'addEditEquipment',
                path: '/platformconfig/equipmentManage/:DGIMN/:id',
                component: './platformManager/equipmentManage/AddEditEquipmentPage',
              },
              {
                name: 'monitortarget',
                path: '/platformconfig/monitortarget/:configId/:targetType',
                component: './platformManager/monitortarget',
              },
              {
                name: 'dischargepermit',
                path:
                  '/platformconfig/monitortarget/AEnterpriseTest/:targetType/dischargepermit/:configId/:EntCode/:EntName',
                component: './platformManager/dischargepermit',
              },
              {
                name: 'maintainbase',
                path: '/platformconfig/maintain/:configId/',
                component: './platformManager/maintain',
              },
              {
                name: 'monitortarget',
                path: '/platformconfig/monitortarget/:configId/:targetType/:pollutantTypes',
                component: './platformManager/monitortarget',
              },
              {
                name: 'monitorpoint',
                path:
                  '/platformconfig/monitortarget/:configId/:targetType/:pollutantTypes/monitorpoint/:targetId/:targetName',
                component: './platformManager/point',
              },
              {
                name: 'usestandardlibrary',
                path:
                  '/platformconfig/monitortarget/:configId/:targetType/:pollutantTypes/usestandardlibrary/:DGIMN/:PointName/:targetId/:targetName/:pollutantType',
                component: './platformManager/point/components/setStandard',
              },
              {
                name: 'ysyvideo',
                path:
                  '/platformconfig/ysycameramanager/:Pointname/:Pointcode/:DGIMN/:EntCode/:EntName',
                component: './platformManager/ysyvideo/YsyCameraIndex',
              },
              {
                name: 'ysyshowvideo',
                path: '/platformconfig/ysyshowvideo/:ID/:pointcode/',
                component: './platformManager/ysyvideo/index',
              },
              {
                name: 'hkvideo',
                path:
                  '/platformconfig/hkcameramanager/:Pointname/:Pointcode/:DGIMN/:EntCode/:EntName',
                component: './platformManager/hkvideo/hkCameraIndex',
              },
              {
                name: 'hkshowvideo',
                path: '/platformconfig/hkshowvideo/:pointcode/',
                component: './platformManager/hkvideo/index',
              },
              {
                name: 'manualupload',
                path: '/platformconfig/manualupload/',
                component: './platformManager/manualupload',
              },

              // {
              //   name: 'manualuploadauto',
              //   path: '/platformconfig/manualuploadauto',
              //   component: './platformManager/manualuploadauto/CarbonMonitoringDataPage',
              // },

              {
                name: 'maintenancedatabase',
                path: '/platformconfig/maintenancedatabase/:configId',
                component: './OperationSysManager/MaintenanceDatabaseManage/',
              },

              {
                name: 'sparepartmanage',
                path: '/platformconfig/sparepartmanage/:configId',
                component: './OperationSysManager/SparepartManage/',
              },
              {
                name: 'standardgasmanage',
                path: '/platformconfig/standardgasmanage/:configId',
                component: './OperationSysManager/StandardGasManage/',
              },
              {
                name: 'handhelddevicesmanage',
                path: '/platformconfig/handhelddevicesmanage/:configId',
                component: './OperationSysManager/HandheldDevicesManage/',
              },

              {
                name: 'certificatemanage',
                path: '/platformconfig/certificatemanage/:configId',
                component: './OperationSysManager/CertificateManage/',
              },
              {
                //监测标准
                name: 'monitortarget',
                path: '/platformconfig/monitoringstandard',
                component: './platformManager/monitoringstandard',
              },
              {
                //运维周期
                name: 'maintenancecycle',
                path: '/platformconfig/maintenancecycle',
                component: './platformManager/maintenancecycle',
              },
              // 标准库管理
              {
                name: 'StandardLibrary',
                path: '/platformconfig/StandardLibrary',
                component: './platformManager/standardLibrary',
              },
              // 添加标准库
              {
                name: 'addLibrary',
                path: '/platformconfig/StandardLibrary/addLibrary',
                component: './platformManager/standardLibrary/AddLibrary',
              },
              // 编辑标准库
              {
                name: 'editLibrary',
                path: '/platformconfig/StandardLibrary/editLibrary/:id/:cuid',
                component: './platformManager/standardLibrary/AddLibrary',
              },
              // 编辑标准库
              {
                name: 'viewLibrary',
                path: '/platformconfig/StandardLibrary/viewLibrary/:guid',
                component: './platformManager/standardLibrary/ViewLibrary',
              },
              {
                name: 'equipmentinfomanage',
                path: '/platformconfig/equipmentinfomanage/:configId',
                component: './OperationSysManager/EquipmentInfoManage/',
              },
              {
                name: 'factorytest',
                path: '/platformconfig/factorytest',
                component: './platformManager/factorytest',
              },
              //停产管理
              {
                name: 'outputstopmanage',
                path: '/platformconfig/outputstopmanage/:configId',
                component: './platformManager/outputstopManager/',
              },
            ],
          },
          {
            path: '/Intelligentanalysis',
            name: 'Intelligentanalysis',
            routes: [
              {
                path: '/Intelligentanalysis',
                redirect: '/Intelligentanalysis/SewagePlant',
              },
              {
                path: '/Intelligentanalysis/SewagePlant',
                name: 'SewagePlant',
                routes: [
                  {
                    path: '/Intelligentanalysis/SewagePlant',
                    redirect: '/Intelligentanalysis/SewagePlant/DataReporting/DataReporting/1/1',
                  },
                  // 数据上报列表
                  {
                    name: 'DataReporting',
                    path:
                      '/Intelligentanalysis/SewagePlant/DataReporting/:configId/:monitortime/:entcode',
                    ///:monitortime/:entcode
                    component: './platformManager/dataReport/',
                  },
                  // 数据上报添加或修改
                  {
                    name: 'DataReportingAdd',
                    path:
                      '/Intelligentanalysis/SewagePlant/DataReportingAdd/:configId/:id/:monitortime/:entcode',
                    component: './platformManager/dataReport/components/addDataReport',
                  },
                  //统计报表
                  {
                    name: 'statisticsReportDataList',
                    path:
                      '/Intelligentanalysis/SewagePlant/dataReportList/statisticsReportDataList',
                    component: './report/StatisticsReportDataList',
                  },
                  {
                    name: 'statisticsReportDataListView',
                    path:
                      '/Intelligentanalysis/SewagePlant/dataReportList/statisticsReportDataList/statisticsReportDataListView/:configId/:monitortime/:entcode',
                    component: './platformManager/dataReport/components/dataReportView',
                  },
                ],
              },
              // {
              //   name: 'Intelligentanalysis',
              //   path: '/Intelligentanalysis/transmissionefficiency',
              //   component: './Intelligentanalysis/transmissionefficiency/entIndex',
              // },
              // {
              //   name: 'Intelligentanalysis',
              //   path: '/Intelligentanalysis/transmissionefficiency/point/:entcode/:entname',
              //   component: './Intelligentanalysis/transmissionefficiency/pointIndex',
              // },
              {
                // 超标情况统计
                name: 'ChaoStatistic',
                path: '/Intelligentanalysis/chaoStatistics',
                component: './IntelligentAnalysis/chaoStatistics',
              },
              //传输有效率统计
              {
                name: 'Intelligentanalysis',
                path: '/Intelligentanalysis/transmissionefficiency',
                component: './IntelligentAnalysis/newTransmissionefficiency',
              },
              //传输有效率 城市级别
              {
                name: 'Intelligentanalysis',
                path: '/Intelligentanalysis/transmissionefficiency/cityLevel',
                component: './Intelligentanalysis/newTransmissionefficiency/CityLevel',
              },
              //传输有效率 企业级别
              {
                name: 'Intelligentanalysis',
                path: '/Intelligentanalysis/transmissionefficiency/qutDetail',
                component: './Intelligentanalysis/newTransmissionefficiency/qutPage',
              },
              //季度有效数据捕集率 - 碳排放
              {
                name: 'Intelligentanalysis',
                path: '/Intelligentanalysis/carbonQuartDataCaptureRate',
                component:
                  './IntelligentAnalysis/newTransmissionefficiency/CarbonQuartDataCaptureRate',
              },
              {
                name: 'IntelligentanalysisDetail',
                path: '/Intelligentanalysis/carbonQuartDataCaptureRate/qutDetail',
                component: './IntelligentAnalysis/newTransmissionefficiency/qutPage',
              },
              {
                name: 'IntelligentanalysisDetail',
                path: '/Intelligentanalysis/transmissionefficiency/qutDetail',
                component: './IntelligentAnalysis/newTransmissionefficiency/qutPage',
              },
              //故障率
              {
                name: 'FailureRate',
                path: '/Intelligentanalysis/failureRate',
                component: './IntelligentAnalysis/failureRate/Enterprise',
              },
              // 综合指数范围同比报表
              {
                name: 'CompositeRangeYOYReport',
                path: '/Intelligentanalysis/compositeIndexYOYRange',
                component: './dataAnalyze/CompositeRangeYOYReport',
              },
              // 站点平均值对比分析
              {
                name: 'PointAVGAnalyse',
                path: '/Intelligentanalysis/pointAVGAnalyse',
                component: './dataAnalyze/PointAVGAnalyse',
              },
              // 优良天数报表
              {
                name: 'excellentDaysReport',
                path: '/Intelligentanalysis/excellentDaysReport',
                component: './dataAnalyze/ExcellentDaysReport',
              },
              // 空气质量日排名
              {
                name: 'airRank',
                path: '/Intelligentanalysis/airRank',
                component: './dataAnalyze/AirQualityDayRank',
              },
              // 累计综合空气质量排名
              {
                name: 'addUpAirRank',
                path: '/Intelligentanalysis/addUpAirRank',
                component: './dataAnalyze/AddUpAirRankPage',
              },
              //数据报警统计
              {
                path: '/Intelligentanalysis/dataAlarm',
                name: 'dataAlarm',
                routes: [
                  /* 缺失数据报警统计 */
                  {
                    path: '/Intelligentanalysis/dataAlarm',
                    redirect: '/IntelligentAnalysis/dataAlarm/missingDataRate/ent',
                  },
                  {
                    //缺失数据报警响应率 企业
                    name: 'missingDataRate',
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/ent',
                    component: './IntelligentAnalysis/dataAlarm/missingDataRate/ent',
                  },
                  {
                    //缺失数据报警响应率 企业  城市级别
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/ent/citylevel',
                    component: './Intelligentanalysis/dataAlarm/missingDataRate/ent/Citylevel',
                  },
                  {
                    //缺失数据报警响应率 空气站
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/air',
                    component: './IntelligentAnalysis/dataAlarm/missingDataRate/air',
                  },
                  {
                    //缺失数据报警响应率 空气站  城市级别
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/air/citylevel',
                    component: './Intelligentanalysis/dataAlarm/missingDataRate/air/Citylevel',
                  },
                  {
                    //缺失数据报警响应率 二级页面
                    name: 'missRateDataSecond',
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/missRateDataSecond',
                    component: './IntelligentAnalysis/dataAlarm/missingDataRate/missRateDataSecond',
                  },
                  {
                    // 数据异常报警响应率
                    path: '/Intelligentanalysis/dataAlarm/abnormal',
                    component: './IntelligentAnalysis/dataAlarm/abnormalResRate',
                  },
                  {
                    // 数据异常报警响应率 城市级别
                    path: '/Intelligentanalysis/dataAlarm/abnormal/cityLevel',
                    component: './IntelligentAnalysis/dataAlarm/abnormalResRate/CityLevel',
                  },
                  {
                    // 数据异常报警响应率 详情
                    path: '/Intelligentanalysis/dataAlarm/abnormal/details',
                    component: './IntelligentAnalysis/dataAlarm/abnormalResRate/RegionDetails',
                  },
                  {
                    //超标数据核实率
                    path: '/Intelligentanalysis/dataAlarm/overVerifyRate',
                    component: './IntelligentAnalysis/dataAlarm/overVerifyRate',
                  },
                  {
                    //超标数据核实率  城市级别
                    path: '/Intelligentanalysis/dataAlarm/overVerifyRate/cityLevel',
                    component: './Intelligentanalysis/dataAlarm/overVerifyRate',
                  },
                  {
                    //超标数据核实率二级页面
                    path: '/Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                    component: './IntelligentAnalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                  },
                  {
                    //超标报警处置率
                    name: 'overAlarmDisposalRate',
                    path: '/Intelligentanalysis/dataAlarm/overAlarmDisposalRate',
                    component: './IntelligentAnalysis/dataAlarm/overAlarmDisposalRate',
                  },
                  {
                    //超标报警处置率-二级
                    name: 'RegionOverAlarmDisposalRate',
                    path:
                      '/Intelligentanalysis/dataAlarm/overAlarmDisposalRate/RegionOverAlarmDisposalRate',
                    component:
                      './Intelligentanalysis/dataAlarm/overAlarmDisposalRate/RegionOverAlarmDisposalRate',
                  },
                ],
              },
              // 统计-运维工单
              {
                path: '/Intelligentanalysis/operationWorkStatis',
                name: 'operationWorkStatis',
                routes: [
                  {
                    // 运维工单统计（企业）
                    path: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics',
                    component: './Intelligentanalysis/planWorkOrderStatistics',
                  },
                  // {
                  //   //行政区运维工单统计（企业）
                  //   name: 'regionStaticstics',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',
                  //   component:
                  //     './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',
                  // },
                  // {
                  //   //企业运维工单统计（企业）
                  //   name: 'entWorkOrderStatistics',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/EntStaticstics',
                  //   component:
                  //     './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/EntStaticstics',
                  // },
                  // /* 缺失台账工单统计 空气站 */
                  // {
                  //   name: 'noAccountAirStatistics',
                  //   path: '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                  //   component: './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                  // },
                  // {
                  //   name: 'noAccountStatisticsEnt', //无台账上传统计 企业
                  //   path: '/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent',
                  //   component: './IntelligentAnalysis/operationWorkStatis/noAccountStatistics/ent',
                  // },
                  // /* 缺失台账照片统计 */
                  // {
                  //   name: 'noAccountAirStatisticsPhoto',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
                  //   component:
                  //     './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
                  // },
                  // /* 缺失台账工单详情 */
                  // {
                  //   name: 'noAccountAirStatisticsDetails',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
                  //   component:
                  //     './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
                  // },
                  // {
                  //   /** 运维工单统计-空气站 */
                  //   name: 'AirWorkOrderStatistics',
                  //   path: '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation',
                  //   component: './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics',
                  // },
                  // {
                  //   /** 单区域 运维工单统计-空气站 排口 */
                  //   name: 'RegionAirQualityMonitoringStation',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/RegionAirQualityMonitoringStation',
                  //   component:
                  //     './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/RegionAirQualityMonitoringStation',
                  // },
                  // {
                  //   /** 单站点 运维工单统计-空气站 排口 */
                  //   name: 'SingleStationAirQualityMonitoringStation',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/SingleStationAirQualityMonitoringStation',
                  //   component:
                  //     './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/SingleStationAirQualityMonitoringStation',
                  // },
                  // {
                  //   /** 单区域 运维工单统计-空气站 */
                  //   name: 'AirWorkOrderStatistics',
                  //   path:
                  //     '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/StationAirQualityMonitoringStation',
                  //   component:
                  //     './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/StationAirQualityMonitoringStation',
                  // },
                  {
                    //异常工单统计
                    name: 'abnormalWorkStatistics',
                    path: '/Intelligentanalysis/operationWorkStatis/abnormalWorkStatistics',
                    component: './Intelligentanalysis/abnormalWorkStatistics',
                  },
                  {
                    //异常工单统计 市一级
                    name: 'abnormalWorkStatisticsDetail',
                    path:
                      '/Intelligentanalysis/operationWorkStatis/abnormalWorkStatistics/regionDetail',
                    component: './Intelligentanalysis/abnormalWorkStatistics/regionDetail',
                  },
                ],
              },

              {
                name: 'emissions',
                path: '/Intelligentanalysis/emissions',
                component: './IntelligentAnalysis/emissions',
              },
              {
                name: 'effluentFee',
                path: '/Intelligentanalysis/effluentFee',
                component: './Intelligentanalysis/effluentFee',
              },
              // 电力实时同比环比分析
              {
                name: 'ElectricYoYAndMoM',
                path: '/Intelligentanalysis/ElectricYoYAndMoM',
                component: './dataAnalyze/ElectricYoYAndMoM',
              },
              // 单站多参对比分析
              {
                name: 'siteParamsPage',
                path: '/Intelligentanalysis/siteParamsPage/:type',
                component: './dataAnalyze/SiteParamsPage',
              },
              // 多站多参对比分析
              {
                name: 'multiSiteParamsPage',
                path: '/Intelligentanalysis/multiSiteParamsPage/:type',
                component: './dataAnalyze/MultiSiteParamsPage',
              },
              // 数据获取率
              {
                name: 'dataGainRate',
                path: '/Intelligentanalysis/dataGainRatePage',
                component: './dataAnalyze/DataGainRatePage',
              },
              // 空气质量日报
              {
                name: 'report',
                path: '/Intelligentanalysis/report/:type',
                component: './dataAnalyze/Report',
              },
              // 综合指数报表
              {
                name: 'compositeIndexReport',
                path: '/Intelligentanalysis/compositeIndex/:reportType',
                component: './dataAnalyze/CompositeIndexReport',
              },
              // 综合指数范围报表
              {
                name: 'compositeIndexRangeReport',
                path: '/Intelligentanalysis/compositeIndexRange',
                component: './dataAnalyze/CompositeRangeReport',
              },
              // 综合指数对比
              {
                name: 'compositeIndexContrast',
                path: '/Intelligentanalysis/compositeIndexContrast',
                component: './dataAnalyze/CompositeIndexContrast',
              },
              // 季度有效数据捕集率
              {
                name: 'quartDataCaptureRate',
                path: '/Intelligentanalysis/quartDataCaptureRate',
                component: './dataAnalyze/QuartDataCaptureRate',
              },
              {
                name: 'emissionsStatistics',
                path: '/Intelligentanalysis/emissionsStatistics',
                // component: './Intelligentanalysis/emissions',
                routes: [
                  {
                    path: '/Intelligentanalysis/emissionsStatistics',
                    redirect: '/IntelligentAnalysis/emissionStatistical/gas',
                  },
                  {
                    name: 'emissionsStatisticsindex',
                    path: '/Intelligentanalysis/emissionsStatistics/index',
                    component: './IntelligentAnalysis/emissionStatistical/EmissionStatistical',
                  },
                  {
                    // 排放量对比统计
                    name: 'gasContrast',
                    path: '/Intelligentanalysis/emissionsStatistics/contrast',
                    component: './IntelligentAnalysis/emissionStatistical/Contrast',
                  },
                  {
                    // 排放量同比
                    name: 'gasContrast',
                    path: '/Intelligentanalysis/emissionsStatistics/year',
                    component: './IntelligentAnalysis/emissionStatistical/Year',
                  },
                  {
                    // 排放量环比
                    name: 'gasContrast',
                    path: '/Intelligentanalysis/emissionsStatistics/chain',
                    component: './IntelligentAnalysis/emissionStatistical/Chain',
                  },
                  {
                    // 废气排放量统计
                    name: 'gas',
                    path: '/Intelligentanalysis/emissionsStatistics/gas',
                    component: './IntelligentAnalysis/emissionStatistical/Gas',
                  },
                  {
                    // 废水排放量统计
                    name: 'water',
                    path: '/Intelligentanalysis/emissionsStatistics/waterEmissions',
                    component: './IntelligentAnalysis/emissionStatistical/Water',
                  },
                  {
                    // 废气排放量对比统计
                    name: 'gasContrast',
                    path: '/Intelligentanalysis/emissionsStatistics/gasContrast',
                    component: './IntelligentAnalysis/emissionStatistical/GasContrast',
                  },
                  {
                    // 废水排放量对比统计
                    name: 'water',
                    path: '/Intelligentanalysis/emissionsStatistics/waterContrast',
                    component: './IntelligentAnalysis/emissionStatistical/WaterContrast',
                  },
                  {
                    //排放量变化统计
                    path: '/Intelligentanalysis/emissionsStatistics/emissionsChange',
                    component: './IntelligentAnalysis/emissionsStatistics/emissionsChange',
                  },
                ],
              },
              {
                //空气质量状况统计
                name: 'airQualityStatistics',
                path: '/Intelligentanalysis/airQualityStatistics',
                component: './IntelligentAnalysis/airQualityStatistics/air',
              },
              {
                //运维区域账户访问率统计 大区
                name: 'AccessStatistics',
                path: '/Intelligentanalysis/accessStatistics',
                component: './Intelligentanalysis/accessStatistics',
              },
              {
                //运维区域账户访问率统计 服务区
                name: 'AccessStatistics',
                path: '/Intelligentanalysis/accessStatistics/missDataSecond',
                component: './Intelligentanalysis/accessStatistics/missDataSecond',
              },
              {
                //运维到期点位统计
                name: 'operationExpirePoint',
                path: '/Intelligentanalysis/operationExpirePoint',
                component: './Intelligentanalysis/operationExpirePoint',
              },
              // 二氧化碳物料衡算法
              {
                name: 'CO2Material',
                path: '/Intelligentanalysis/CO2Material',
                routes: [
                  {
                    path: '/Intelligentanalysis/CO2Material/desensitization',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/desensitization',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/electricity',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/electricity',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/supplementData',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/supplementData',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/supplementData/addOrEditPage',
                    component:
                      './IntelligentAnalysis/CO2Emissions/electricity/supplementData/AddOrEditPage',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/fossilFuel',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/fossilFuel',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/fossilFuel/imp',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/fossilFuel/Imp',
                  },
                  // {
                  //   path: '/Intelligentanalysis/CO2Material/fossilFuel/imp',
                  //   component: './IntelligentAnalysis/CO2Material/fossilFuel/Imp',
                  // },
                  {
                    path: '/Intelligentanalysis/CO2Material/cO2DischargeSum',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/cO2DischargeSum',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/GHG',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/GHG',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/GHGLinearAnalysis',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/GHGLinearAnalysis',
                  },
                  {
                    path: '/Intelligentanalysis/CO2Material/monthDischarge',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/monthDischarge',
                  },
                  // 核算报告
                  {
                    path: '/Intelligentanalysis/CO2Material/accountingReport',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/accountingReport',
                  },
                  // 不确定性分析
                  {
                    path: '/Intelligentanalysis/CO2Material/nondeterminacy',
                    component: './IntelligentAnalysis/CO2Emissions/electricity/nondeterminacy',
                  },
                  // 监测数据对比分析
                  {
                    path: '/Intelligentanalysis/CO2Material/monitorComparaAnalysis',
                    component: './IntelligentAnalysis/CO2Emissions/monitorComparaAnalysis',
                  },
                  //监测数据曲线对比分析
                  {
                    path: '/Intelligentanalysis/CO2Material/monitorCurveAnalysis',
                    component: './IntelligentAnalysis/CO2Emissions/monitorCurveAnalysis',
                  },
                  // 测数据线性回归分析
                  {
                    path: '/Intelligentanalysis/CO2Material/monitorLineAnalysis',
                    component: './IntelligentAnalysis/CO2Emissions/monitorLineAnalysis',
                  },
                ],
              },
              // 水泥行业
              {
                name: 'cement',
                path: '/Intelligentanalysis/cement',
                routes: [
                  {
                    path: '/Intelligentanalysis/cement/fossilFuel',
                    component: './IntelligentAnalysis/CO2Emissions/cement/fossilFuel',
                  },
                  {
                    path: '/Intelligentanalysis/cement/fossilFuel/imp',
                    component: './IntelligentAnalysis/CO2Emissions/cement/fossilFuel/Imp',
                  },
                  {
                    path: '/Intelligentanalysis/cement/supplementData',
                    component: './IntelligentAnalysis/CO2Emissions/cement/supplementData',
                  },
                  {
                    path: '/Intelligentanalysis/cement/supplementData/addOrEditPage',
                    component:
                      './IntelligentAnalysis/CO2Emissions/cement/supplementData/AddOrEditPage',
                  },
                  // 净购入电力
                  {
                    path: '/Intelligentanalysis/cement/electricity',
                    component: './IntelligentAnalysis/CO2Emissions/cement/electricity',
                  },
                  // 净购入热力
                  {
                    path: '/Intelligentanalysis/cement/thermal',
                    component: './IntelligentAnalysis/CO2Emissions/cement/thermal',
                  },
                  // 替代燃料非生物质碳的燃烧
                  {
                    path: '/Intelligentanalysis/cement/abioticCarbonRS',
                    component: './IntelligentAnalysis/CO2Emissions/cement/abioticCarbonRS',
                  },
                  // 生料中非燃料碳煅烧
                  {
                    path: '/Intelligentanalysis/cement/SLAbioticCarbonDS',
                    component: './IntelligentAnalysis/CO2Emissions/cement/SLAbioticCarbonDS',
                  },
                  // 生料中非燃料碳煅烧
                  {
                    path: '/Intelligentanalysis/cement/YLTSY',
                    component: './IntelligentAnalysis/CO2Emissions/cement/YLTSY',
                  },
                  // 排放量汇总
                  {
                    path: '/Intelligentanalysis/cement/CO2DischargeSum',
                    component: './IntelligentAnalysis/CO2Emissions/cement/CO2DischargeSum',
                  },
                  // 工业生产过程排放
                  {
                    path: '/Intelligentanalysis/cement/industrialProcess',
                    component: './IntelligentAnalysis/CO2Emissions/cement/industrialProcess',
                  },
                  // 协同处置废弃物排放
                  {
                    path: '/Intelligentanalysis/cement/XTCZFQW',
                    component: './IntelligentAnalysis/CO2Emissions/cement/XTCZFQW',
                  },
                ],
              },
              // 钢铁行业
              {
                name: 'cement',
                path: '/Intelligentanalysis/steel',
                routes: [
                  {
                    path: '/Intelligentanalysis/steel/fossilFuel',
                    component: './IntelligentAnalysis/CO2Emissions/steel/fossilFuel',
                  },
                  {
                    // 工业生产过程排放
                    path: '/Intelligentanalysis/steel/industrialProcess',
                    component: './IntelligentAnalysis/CO2Emissions/steel/industrialProcess',
                  },
                  {
                    // 固碳产品隐含的排放量
                    path: '/Intelligentanalysis/steel/carbon',
                    component: './IntelligentAnalysis/CO2Emissions/steel/carbon',
                  },
                  {
                    // 净购入电力
                    path: '/Intelligentanalysis/steel/electricity',
                    component: './IntelligentAnalysis/CO2Emissions/steel/electricity',
                  },
                  {
                    // 净购入热力
                    path: '/Intelligentanalysis/steel/thermal',
                    component: './IntelligentAnalysis/CO2Emissions/steel/thermal',
                  },
                  // 排放量汇总
                  {
                    path: '/Intelligentanalysis/steel/CO2DischargeSum',
                    component: './IntelligentAnalysis/CO2Emissions/steel/CO2DischargeSum',
                  },
                ],
              },
            ],
          },
          {
            path: '/dataquery',
            name: 'dataquery',
            routes: [
              {
                path: '/dataquery',
                redirect: '/monitoring/dataquery',
              },
              {
                name: 'alarmrecord',
                path: '/monitoring/alarmrecord',
                component: './monitoring/alarmrecord/index',
              },
              // {
              //   name: 'originaldata',
              //   path: '/monitoring/originaldata',
              //   component: './monitoring/originaldata',
              // },
              {
                name: 'alarmverifyrecord',
                path: '/monitoring/alarmverifyrecord',
                component: './monitoring/alarmverifyrecord/index',
              },
            ],
          },
          // 数据查询
          {
            path: '/dataSearch',
            name: 'dataSearch',
            routes: [
              {
                path: '/dataSearch',
                redirect: '/dataSearch/monitor',
              },
              {
                // 不可信数据查询
                name: 'dataTrust',
                path: '/dataSearch/dataTrust',
                component: './dataSearch/DataTrust',
              },
              {
                name: 'defectData',
                //数据缺失
                path: '/dataSearch/defectData',
                routes: [
                  {
                    name: 'defectDatEnt',
                    //数据缺失 - 企业
                    path: '/dataSearch/defectData/ent',
                    component: './dataSearch/defectData/ent',
                  },
                  {
                    name: 'defectDatAir',
                    //数据缺失 - 空气站
                    path: '/dataSearch/defectData/air',
                    component: './dataSearch/defectData/air',
                  },
                ],
              },
              {
                name: 'exceedData',
                //超标数据查询
                path: '/dataSearch/exceedData',
                component: './dataSearch/exceedData',
              },
              //停运记录
              {
                name: 'stopRecord',
                path: '/dataSearch/stopRecord',
                component: './monitoring/StopRecord/stopRecord',
              },
              // 企业异常记录
              {
                name: 'entAbnormalRecord',
                path: '/dataSearch/entAbnormalRecord',
                component: './monitoring/entAbnormalRecord',
              },
              {
                name: 'dischargeStandard',
                //排放标准
                path: '/dataSearch/dischargeStandard',
                component: './dataSearch/dischargeStandard',
              },
              {
                //排污单位管理
                name: 'dischargeUnits',
                path: '/dataSearch/dischargeUnits',
                component: './dataSearch/dischargeUnits',
              },
              {
                name: 'abnormalStandard', //异常标准
                path: '/dataSearch/abnormalStandard',
                component: './dataSearch/abnormalStandard',
              },
              {
                // 质控查询
                path: '/dataSearch/qca',
                name: 'qca',
                routes: [
                  {
                    path: '/dataSearch/qca',
                    redirect: '/dataSearch/qca/zeroCheck',
                  },
                  {
                    // 零点核查
                    name: 'working',
                    path: '/dataSearch/qca/zeroCheck',
                    component: './dataSearch/qca/zeroCheck',
                  },
                  {
                    // 量程核查
                    name: 'range',
                    path: '/dataSearch/qca/rangeCheck',
                    component: './dataSearch/qca/rangeCheck',
                  },
                  {
                    // 盲样核查
                    name: 'blind',
                    path: '/dataSearch/qca/blindCheck',
                    component: './dataSearch/qca/blindCheck',
                  },
                  {
                    // 线性核查
                    name: 'linear',
                    path: '/dataSearch/qca/linearCheck',
                    component: './dataSearch/qca/linearCheck',
                  },
                  {
                    // 响应时间核查
                    name: 'resTimeCheck',
                    path: '/dataSearch/qca/resTimeCheck',
                    component: './dataSearch/qca/resTimeCheck',
                  },
                  {
                    // 示值误差核查
                    name: 'errorValueCheck',
                    path: '/dataSearch/qca/errorValueCheck',
                    component: './dataSearch/qca/errorValueCheck',
                  },
                ],
              },
              // {
              //   // 碳排放查询
              //   name: 'CO2Emissions',
              //   path: '/dataSearch/CO2Emissions',
              //   component: './dataSearch/CO2Emissions',
              // },
              {
                // 站点数据查询
                path: '/dataSearch/siteData',
                name: 'siteData',
                routes: [
                  {
                    // 站点信息
                    name: 'siteInfo',
                    path: '/dataSearch/siteData/siteInfo',
                    component: './dataSearch/siteData/siteInfoPage',
                  },
                  {
                    // 运行日志
                    name: 'QCARecordManager',
                    path: '/dataSearch/siteData/QCARecordManager',
                    component: './dataSearch/siteData/QCARecordManager',
                  },
                ],
              },
              {
                // 监测数据
                path: '/dataSearch/monitor',
                name: 'monitor',
                routes: [
                  {
                    path: '/dataSearch/monitor',
                    redirect: '/dataSearch/monitor/datavisualization',
                  },
                  {
                    // 工况模拟
                    name: 'working',
                    path: '/dataSearch/monitor/datavisualization',
                    component: './dataSearch/monitor/working/index',
                  },
                  {
                    // 报警信息
                    name: 'alarmInfo',
                    path: '/dataSearch/monitor/alarm',
                    component: './dataSearch/monitor/alarmInfo',
                  },
                  {
                    name: 'historyparame', //报警信息跳转详情页 历史管控参数
                    path: '/dataSearch/monitor/historyparameDetail',
                    component: './dynamicControl/controlData/historyparame',
                  },
                  {
                    //超标数据
                    name: 'alarmOverrecord',
                    path: '/dataSearch/monitor/alarm/overrecord',
                    component: './dataSearch/monitor/alarmInfo/overRecord',
                  },
                  {
                    //异常数据
                    name: 'alarmExceptionRecord',
                    path: '/dataSearch/monitor/alarm/exceptionRecord',
                    component: './dataSearch/monitor/alarmInfo/exceptionRecord',
                  },
                ],
              },
              {
                name: 'dischargeStandard',
                //设备参数查询
                path: '/dataSearch/deviceParam',
                component: './dataSearch/deviceParam',
              },
              //污染源信息
              {
                name: 'PollutantInfo',
                path: '/dataSearch/pollutantInfo/:nav',
                component: './dataSearch/pollutantInfo',
              },
              //项目信息
              {
                name: 'ProjectInfo',
                path: '/dataSearch/projectInfo',
                component: './dataSearch/projectInfo',
              },
              {
                name: 'enterpriseMonitoringInquiry',
                //企业监测点查询
                path: '/dataSearch/enterpriseMonitoringInquiry',
                component: './dataSearch/enterpriseMonitoringInquiry',
              },
              {
                name: 'enterpriseMonitoringInquiry',
                //企业监测点查询 二级页面
                path: '/dataSearch/enterpriseInquiryDetail/:RegionCode',
                component: './dataSearch/enterpriseInquiryDetail',
              },
              {
                name: 'abnormalData',
                //异常数据
                path: '/dataSearch/abnormalData',
                component: './dataSearch/abnormalData',
              },
              {
                name: 'abnormalDetailsData',
                //异常数据 - 二级
                path: '/dataSearch/abnormalData/details',
                component: './dataSearch/abnormalData/DetailsPage',
              },
            ],
          },
          //质控核查
          {
            path: '/qualityCheck',
            name: 'qualityCheck',
            routes: [
              {
                path: '/qualityCheck',
                redirect: '/qualityCheck/qualityManualCheck/manualQuality',
              },
              {
                // 质控管理
                path: '/qualityCheck/qualityMange',
                name: 'qualityMange',
                routes: [
                  {
                    path: '/qualityCheck/qualityMange',
                    redirect: '/qualityCheck/qualityMange/standardAtmosMange',
                  },
                  {
                    // 质控运维人管理
                    name: 'user',
                    path: '/qualityCheck/qualityMange/qualityUser',
                    component: './qualityCheck/qualityMange/qualityUser',
                  },
                  {
                    // 质控方案管理
                    name: 'qualityProgram',
                    path: '/qualityCheck/qualityMange/qualityProgram',
                    component: './qualityCheck/qualityMange/qualityProgram',
                  },
                  {
                    // 标准气管理
                    name: 'standardAtmosMange',
                    path: '/qualityCheck/qualityMange/standardAtmosMange',
                    component: './qualityCheck/qualityMange/standardAtmosMange',
                  },
                ],
              },
              {
                // 质控核查设置
                path: '/qualityCheck/qualitySetting',
                name: 'qualitySetting',
                routes: [
                  {
                    path: '/qualityCheck/qualitySetting',
                    redirect: '/qualityCheck/qualitySetting/zeroPointSet',
                  },
                  {
                    name: 'zeroPointSet', //零点核查设置
                    path: '/qualityCheck/qualitySetting/zeroPointSet',
                    component: './qualityCheck/qualitySetting/zeroPointSet',
                  },
                  {
                    name: 'rangeSet', //量程核查设置
                    path: '/qualityCheck/qualitySetting/rangeSet',
                    component: './qualityCheck/qualitySetting/rangeSet',
                  },
                  {
                    name: 'linearSet', //线性核查设置
                    path: '/qualityCheck/qualitySetting/linearSet',
                    component: './qualityCheck/qualitySetting/linearSet',
                  },
                  {
                    name: 'blindSet', //盲样核查设置
                    path: '/qualityCheck/qualitySetting/blindSet',
                    component: './qualityCheck/qualitySetting/blindSet',
                  },
                  {
                    name: 'resTimeSet', //响应时间设置
                    path: '/qualityCheck/qualitySetting/resTimeSet',
                    component: './qualityCheck/qualitySetting/resTimeSet',
                  },
                ],
              },
              {
                // 手动质控核查
                path: '/qualityCheck/qualityManualCheck',
                name: 'qualityManualCheck',
                routes: [
                  {
                    path: '/qualityCheck/qualityManualCheck',
                    redirect: '/qualityCheck/qualityManualCheck/manualQuality',
                  },
                  {
                    name: 'manualQuality', // 手动质控
                    path: '/qualityCheck/qualityManualCheck/manualQuality',
                    component: './qualityCheck/qualityManualCheck/manualQuality',
                  },
                  {
                    name: 'dataExtract', // 数据提取
                    path: '/qualityCheck/qualityManualCheck/dataExtract',
                    component: './qualityCheck/qualityManualCheck/dataExtract',
                  },
                ],
              },
            ],
          },
          // 质控 - 知识库
          {
            path: '/knowledge',
            name: 'knowledge',
            component: './KBS/Knowledge',
          },
          // 质控 - 基础配置
          {
            path: '/basicsManage',
            name: 'basicsManage',
            routes: [
              {
                name: 'wry', // 污染源管理
                path: '/basicsManage/wry',
                routes: [
                  // {
                  //   name: 'index',  // 企业管理
                  //   path: '/basicsManage/wry/entManage',
                  //   component: './basicsManage/wry/entManage',
                  // },
                  // {
                  //   name: 'index',  // 企业管理 - 排口管理
                  //   path: '/basicsManage/wry/entManage/point/:entCode/:entName/:coordinateSet',
                  //   component: './basicsManage/wry/entManage/Point',
                  // },
                  {
                    name: 'KBS', // 知识库管理
                    path: '/basicsManage/wry/KBS',
                    component: './KBS/KBSManage',
                  },
                ],
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            routes: [
              {
                name: 'base',
                path: '/account/settings',
                component: './account/settings',
              },
              {
                name: 'base',
                path: '/account/ChangePwdView',
                component: '../components/GlobalHeader/ChangePwdView',
              },
            ],
          },
          // 智能质控
          {
            path: '/qualityControl',
            name: 'qualityControl',
            routes: [
              {
                path: '/qualityControl',
                redirect: '/qualityControl/remoteControl',
              },
              // 质控管理
              {
                name: 'qcaManager',
                path: '/qualityControl/qcaManager',
                routes: [
                  {
                    path: '/qualityControl/qcaManager',
                    redirect: '/qualityControl/qcaManager/maintainRecord',
                  },
                  // 运维人管理
                  {
                    name: 'QCAnalyzeOperator',
                    path: '/qualityControl/qcaManager/QCAnalyzeOperator',
                    component: './qualityControl/QCAnalyzeOperator',
                  },
                  // 质控仪维护记录
                  {
                    name: 'maintainRecord',
                    path: '/qualityControl/qcaManager/maintainRecord',
                    component: './qualityControl/maintainRecord',
                  },
                  // 质控仪管理
                  {
                    name: 'instrumentManage',
                    path: '/qualityControl/qcaManager/instrumentManage',
                    component: './qualityControl/instrumentManage',
                  },
                  // 质控标准要求管理
                  {
                    name: 'qcaStandardRequest',
                    path: '/qualityControl/qcaManager/qcaStandardRequest',
                    component: './qualityControl/qcaStandardRequest',
                  },
                  // 质控仪 - 添加
                  {
                    name: 'instrumentAdd',
                    path: '/qualityControl/qcaManager/instrumentManage/add',
                    component: './qualityControl/instrumentManage/AddInstrument',
                  },
                  // 质控仪 - 编辑
                  {
                    name: 'instrumentEdit',
                    path: '/qualityControl/qcaManager/instrumentManage/edit/:id/:QCAMN',
                    component: './qualityControl/instrumentManage/AddInstrument',
                  },
                  // 质控仪 - 详情
                  {
                    name: 'instrumentView',
                    path: '/qualityControl/qcaManager/instrumentManage/view/:id',
                    component: './qualityControl/instrumentManage/ViewInstrument',
                  },
                  // 气瓶标气管理
                  {
                    name: 'instrumentView',
                    path: '/qualityControl/qcaManager/gasJoin',
                    component: './qualityControl/gasJoin',
                  },
                  // 气瓶标气管理 - 添加标气方案
                  {
                    name: 'instrumentView',
                    path: '/qualityControl/qcaManager/gasJoin/addGas',
                    component: './qualityControl/gasJoin/AddGas',
                  },
                  // 气瓶标气管理 - 编辑标气方案
                  {
                    name: 'instrumentView',
                    path: '/qualityControl/qcaManager/gasJoin/editGas/:id',
                    component: './qualityControl/gasJoin/AddGas',
                  },
                  // 工作模式 - 列表
                  {
                    name: 'workPatternAdd',
                    path: '/qualityControl/qcaManager/workPattern',
                    component: './qualityControl/workPattern/index',
                  },
                  // 工作模式 - 添加
                  {
                    name: 'workPatternAdd',
                    path: '/qualityControl/qcaManager/workPattern/add',
                    component: './qualityControl/workPattern/Add',
                  },
                  // 工作模式 - 编辑
                  {
                    name: 'workPatternAdd',
                    path: '/qualityControl/qcaManager/workPattern/edit/:modelName',
                    component: './qualityControl/workPattern/Add',
                  },
                ],
              },
              // 质控记录
              {
                name: 'qcaRecord',
                path: '/qualityControl/qcaRecord',
                routes: [
                  {
                    path: '/qualityControl/qcaRecord',
                    redirect: '/qualityControl/qcaRecord/operationRecords',
                  },
                  // 质控纪要
                  {
                    name: 'playback',
                    path: '/qualityControl/qcaRecord/playback',
                    component: './qualityControl/playback',
                  },
                  // 质控仪操作记录
                  {
                    name: 'operationRecords',
                    path: '/qualityControl/qcaRecord/operationRecords',
                    component: './qualityControl/operationRecords',
                  },
                  // 质控仪参数记录
                  {
                    name: 'paramsRecord',
                    path: '/qualityControl/qcaRecord/paramsRecord',
                    component: './qualityControl/paramsRecord',
                  },
                  //质控仪状态记录
                  {
                    name: 'statusRecord',
                    path: '/qualityControl/qcaRecord/statusRecord',
                    component: './qualityControl/statusRecord',
                  },
                  // 质控报警记录
                  {
                    name: 'alarmMessage',
                    path: '/qualityControl/qcaRecord/alarmMessage',
                    component: './qualityControl/alarmMessage',
                  },
                ],
              },
              //质控仪视频
              {
                name: 'qcavideopreview',
                path: '/qualityControl/qcavideopreview',
                component: './qualityControl/qcavideopreview',
              },
              // 远程质控
              {
                name: 'remoteControl',
                path: '/qualityControl/remoteControl',
                component: './qualityControl/remoteControl',
              },
              // 质控结果统计
              {
                name: 'resultStatistics',
                path: '/qualityControl/resultStatistics',
                component: './qualityControl/resultStatistics',
              },
              // 质控结果比对
              {
                name: 'resultContrast',
                path: '/qualityControl/resultContrast',
                component: './qualityControl/resultContrast',
              },
              // 质控结果实时比对
              {
                name: 'realTimeContrast',
                path: '/qualityControl/realTimeContrast',
                component: './qualityControl/realTimeContrast',
              },
            ],
          },

          //动态管控
          {
            path: '/dynamicControl',
            name: 'dynamicControl',
            routes: [
              {
                name: 'reportManage', // 报备管理
                path: '/dynamicControl/reportManage',
                routes: [
                  {
                    name: 'paramFiling', //管控参数备案
                    path: '/dynamicControl/reportManage/paramFiling',
                    component: './dynamicControl/reportManage/paramFiling',
                  },
                ],
              },
              {
                name: 'dynamicDataManage', // 管控数据
                path: '/dynamicControl/dynamicDataManage',
                routes: [
                  {
                    name: 'realtimedynamicData', //实时管控参数
                    path: '/dynamicControl/dynamicDataManage/realtimedynamicData',
                    component: './dataSearch/monitor/working/realtimeParam',
                  },
                  {
                    name: 'historyparame', //历史管控参数
                    path: '/dynamicControl/dynamicDataManage/controlData/historyparame',
                    component: './dynamicControl/controlData/historyparame',
                  },
                ],
              },
            ],
          },
          /* 任务详情 */
          {
            path: '/taskdetail/emergencydetailinfolayout/:TaskID/:DGIMN',
            component: './EmergencyTodoList/EmergencyDetailInfoLayout',
          },
          {
            name: 'OneEntsOneArchives', // 一企一档
            path: '/oneEntsOneArchives',
            routes: [
              {
                path: '/oneEntsOneArchives',
                redirect: '/oneEntsOneArchives/entList',
              },

              {
                name: 'EssentialInfo', // 基本信息
                path: '/oneEntsOneArchives/essentialInfo',
                routes: [
                  {
                    path: '/oneEntsOneArchives/essentialInfo',
                    redirect: '/oneEntsOneArchives/essentialInfo/entInfoDetail',
                  },
                  {
                    name: 'EntInfoDetail', //企业列表详情
                    path: '/oneEntsOneArchives/essentialInfo/entInfoDetail',
                    component: './oneEntsOneArchives/essentialInfo/entInfoDetail',
                  },
                  {
                    name: 'EntInfoEdit', //企业列表详情 编辑
                    path: '/oneEntsOneArchives/essentialInfo/entInfoDetail/EntInfoEdit',
                    component: './oneEntsOneArchives/essentialInfo/entInfoDetail/EntInfoEdit',
                  },
                  {
                    name: 'OutfallInfo', //排污口信息管理
                    path: '/oneEntsOneArchives/essentialInfo/outfallInfo',
                    component: './oneEntsOneArchives/essentialInfo/outfallInfo',
                  },
                  {
                    name: 'WasteWaterGovern', //废水治理设施
                    path: '/oneEntsOneArchives/essentialInfo/wasteWaterGovern/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'OperationInfo', //运维信息管理
                    path: '/oneEntsOneArchives/essentialInfo/operationInfo/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'EquipmentManufacturer', //设备生产厂商信息管理
                    path: '/oneEntsOneArchives/essentialInfo/equipmentManufacturer/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'OutfallInfo', //废气治理设施
                    path: '/oneEntsOneArchives/essentialInfo/wasteGasGovern/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'StatisticalAnalysis', //一企一档进入 统计分析
                    path: '/oneEntsOneArchives/essentialInfo/statisticalAnalysis',
                    component: './oneEntsOneArchives/essentialInfo/statisticalAnalysis',
                  },
                ],
              },

              {
                name: 'DischargeStandard', //排污许可管理
                path: '/oneEntsOneArchives/sewageDisposal',
                routes: [
                  {
                    path: '/oneEntsOneArchives/sewageDisposal',
                    redirect: '/oneEntsOneArchives/sewageDisposal/dischargeStandLimit',
                  },
                  {
                    name: 'dischargeStandLimit', //排污许可管理 - 排放标准限值
                    path: '/oneEntsOneArchives/sewageDisposal/dischargeStandLimit',
                    component: './platformManager/monitoringstandard',
                  },
                  {
                    name: 'dischargeNumLimit', //排污许可管理 - 排放量限值
                    path: '/oneEntsOneArchives/sewageDisposal/dischargeNumLimit/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
              {
                name: 'MonitoringData', //监控数据
                path: '/oneEntsOneArchives/monitoringData',

                routes: [
                  {
                    path: '/oneEntsOneArchives/monitoringData',
                    redirect: '/oneEntsOneArchives/monitoringData/monitorExhibition',
                  },
                  {
                    name: 'MonitorExhibition',
                    path: '/oneEntsOneArchives/monitoringData/monitorExhibition',
                    component: './monitoring/dataquery',
                  },
                ],
              },
              {
                name: 'EnvironEmergency', //环境应急预案
                path: '/oneEntsOneArchives/environEmergency',
                routes: [
                  {
                    path: '/oneEntsOneArchives/environEmergency',
                    redirect:
                      '/oneEntsOneArchives/environEmergency/factorSitua/Bas_EnvironmentalEmergencyPlan',
                  },
                  {
                    name: 'FactorSitua',
                    path: '/oneEntsOneArchives/environEmergency/factorSitua/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
              {
                name: 'CharacteristicFactor', //特征因子
                path: '/oneEntsOneArchives/characteristicFactor',
                routes: [
                  {
                    path: '/oneEntsOneArchives/characteristicFactor',
                    redirect:
                      '/oneEntsOneArchives/characteristicFactor/wasterWater/Bas_WaterEigenfactor',
                  },
                  {
                    name: 'Voc',
                    path: '/oneEntsOneArchives/characteristicFactor/voc/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'wasterWater',
                    path: '/oneEntsOneArchives/characteristicFactor/wasterWater/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'wasterAir',
                    path: '/oneEntsOneArchives/characteristicFactor/wasterAir/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
              {
                name: 'LawInfo', //执法信息管理
                path: '/oneEntsOneArchives/lawInfo',
                routes: [
                  {
                    path: '/oneEntsOneArchives/lawInfo',
                    redirect:
                      '/oneEntsOneArchives/lawInfo/administration/Bas_AdministrationTasksRecord',
                  },
                  {
                    name: 'Administration', //执法信息管理-行政任务记录
                    path: '/oneEntsOneArchives/lawInfo/administration/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'LawEnforcement', //执法信息管理-执法任务记录
                    path: '/oneEntsOneArchives/lawInfo/lawEnforcement/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
              {
                name: 'HazardousWaste', //危废管理
                path: '/oneEntsOneArchives/hazardousWaste',
                routes: [
                  {
                    path: '/oneEntsOneArchives/hazardousWaste',
                    redirect:
                      '/oneEntsOneArchives/hazardousWaste/hazardousWasteInfo/Bas_HazardousWasteManagement',
                  },
                  {
                    name: 'HazardousWasteInfo', //危废管理-危废管理
                    path: '/oneEntsOneArchives/hazardousWaste/hazardousWasteInfo/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'PlatformAccount', //危废管理-危废台账
                    path: '/oneEntsOneArchives/hazardousWaste/platformAccount/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
              {
                name: 'EiaInfo', //环评信息管理
                path: '/oneEntsOneArchives/eiaInfo',
                routes: [
                  {
                    path: '/oneEntsOneArchives/eiaInfo',
                    redirect: '/oneEntsOneArchives/eiaInfo/approval/Bas_ProjectApproval',
                  },
                  {
                    name: 'Approval', //环评信息管理  建设环评审批
                    path: '/oneEntsOneArchives/eiaInfo/approval/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'AcceptanceCheck', //环评信息管理  建设项目验收
                    path: '/oneEntsOneArchives/eiaInfo/acceptanceCheck/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
              {
                name: 'PetitionComplaints', //信访投诉
                path: '/oneEntsOneArchives/petitionComplaints',
                routes: [
                  {
                    path: '/oneEntsOneArchives/petitionComplaints',
                    redirect: '/oneEntsOneArchives/petitionComplaints/situa/:configId',
                  },
                  {
                    name: 'petitionComplaints', //信访投诉情况
                    path: '/oneEntsOneArchives/petitionComplaints/situa/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ],
              },
            ],
          },
          // 数据分析预警模型 1.0
          {
            path: '/DataAnalyticalWarningModel',
            name: 'DataAnalyticalWarningModel',
            routes: [
              // 智能预警
              {
                name: 'Warning',
                path: '/DataAnalyticalWarningModel/Warning',
                routes: [
                  {
                    // 预警记录
                    name: 'expertManagement',
                    path: '/DataAnalyticalWarningModel/Warning',
                    component: './DataAnalyticalWarningModel/Warning',
                  },
                  {
                    // 根据编号查看预警记录
                    name: 'expertManagement',
                    path: '/DataAnalyticalWarningModel/Warning/ModelType/:modelNumber',
                    // component: './DataAnalyticalWarningModel/Warning/ModelType',
                    component: './DataAnalyticalWarningModel/Warning',
                  },
                  {
                    // 监测数据阈值异常研判
                    name: 'AbnormalJudgmentPage',
                    path: '/DataAnalyticalWarningModel/Warning/AbnormalJudgmentPage',
                    component: './DataAnalyticalWarningModel/Warning/AbnormalJudgmentPage',
                  },
                  {
                    // 预警核实
                    name: 'WarningVerify',
                    path: '/DataAnalyticalWarningModel/Warning/WarningVerify/:id',
                    component: './DataAnalyticalWarningModel/Warning/WarningVerify',
                  },
                  {
                    // 预警核实2
                    name: 'WarningVerify2',
                    path:
                      '/DataAnalyticalWarningModel/Warning/ModelType/:modelNumber/WarningVerify/:id',
                    component: './DataAnalyticalWarningModel/Warning/WarningVerify',
                  },
                  {
                    // 排口参数配置
                    name: 'PointParams',
                    path: '/DataAnalyticalWarningModel/Warning/PointParams',
                    component: './DataAnalyticalWarningModel/Warning/PointParams',
                  },
                ],
              },
              // 模型管理
              {
                name: 'ModelManagement',
                path: '/DataAnalyticalWarningModel/Model',
                routes: [
                  {
                    // 模型管理 - 列表
                    name: 'Model',
                    path: '/DataAnalyticalWarningModel/Model',
                    component: './DataAnalyticalWarningModel/ModelManagement',
                  },
                  {
                    // 模型编辑
                    name: 'setting',
                    path: '/DataAnalyticalWarningModel/Model/setting/:ID',
                    component: './DataAnalyticalWarningModel/ModelManagement/Setting',
                  },
                ],
              },
              {
                // 模型精度
                name: 'Accuracy',
                path: '/DataAnalyticalWarningModel/Accuracy',
                component: './DataAnalyticalWarningModel/AccuracyPage/index.js',
              },
              // 模型分析
              {
                name: 'Statistics',
                path: '/DataAnalyticalWarningModel/Statistics',
                routes: [
                  {
                    // 场景模型分析
                    name: 'WarningModelAnalysis',
                    path: '/DataAnalyticalWarningModel/Statistics/WarningModelAnalysis',
                    component: './DataAnalyticalWarningModel/Statistics/WarningModelAnalysis',
                  },
                  {
                    // 场景模型分析报告
                    name: 'AnalysisReport',
                    path: '/DataAnalyticalWarningModel/Statistics/AnalysisReport',
                    component: './DataAnalyticalWarningModel/Statistics/AnalysisReport',
                  },
                  {
                    // 全企业波动范围
                    name: 'FluctuateRange',
                    path: '/DataAnalyticalWarningModel/Statistics/FluctuateRange',
                    component: './DataAnalyticalWarningModel/Statistics/FluctuateRange',
                  },
                ],
              },
              // 异常精准识别核实整改率
              {
                name: 'abnormalVerificaRectificaRate',
                path: '/DataAnalyticalWarningModel/abnormalVerificaRectificaRate',
                routes: [
                  {
                    path: '/DataAnalyticalWarningModel/abnormalVerificaRectificaRate',
                    redirect:
                      '/DataAnalyticalWarningModel/abnormalVerificaRectificaRate/verificaRate',
                  },
                  {
                    // 核实率
                    name: 'verificaRate',
                    path: '/DataAnalyticalWarningModel/abnormalVerificaRectificaRate/verificaRate',
                    component:
                      './DataAnalyticalWarningModel/abnormalVerificaRectificaRate/verificaRate',
                  },
                  {
                    // 整改率
                    name: 'rectificaRate',
                    path: '/DataAnalyticalWarningModel/abnormalVerificaRectificaRate/rectificaRate',
                    component:
                      './DataAnalyticalWarningModel/abnormalVerificaRectificaRate/rectificaRate',
                  },
                ],
              },
              // 线索复核
              {
                name: 'reCheck',
                path: '/DataAnalyticalWarningModel/reCheck',
                routes: [
                  {
                    // 我的待办
                    name: 'todo',
                    path: '/DataAnalyticalWarningModel/ReCheck/Todo',
                    component: './DataAnalyticalWarningModel/ReCheck/Todo',
                  },
                  {
                    // 我的已办
                    name: 'done',
                    path: '/DataAnalyticalWarningModel/ReCheck/Done',
                    component: './DataAnalyticalWarningModel/ReCheck/Done',
                  },
                  {
                    // 复核详情
                    name: 'todo',
                    path: '/DataAnalyticalWarningModel/ReCheck/Details/:id',
                    component: './DataAnalyticalWarningModel/ReCheck/Details',
                  },
                  // {
                  //   // 场景模型分析报告
                  //   name: 'AnalysisReport',
                  //   path: '/DataAnalyticalWarningModel/Statistics/AnalysisReport',
                  //   component: './DataAnalyticalWarningModel/Statistics/AnalysisReport',
                  // },
                  // {
                  //   // 全企业波动范围
                  //   name: 'FluctuateRange',
                  //   path: '/DataAnalyticalWarningModel/Statistics/FluctuateRange',
                  //   component: './DataAnalyticalWarningModel/Statistics/FluctuateRange',
                  // },
                ],
              },
            ],
          },
          // 异常数据识别模型 2.0
          {
            path: '/AbnormalIdentifyModel',
            name: 'AbnormalIdentifyModel',
            routes: [
              {
                // 异常线索清单
                name: 'AbnormalCluesList',
                path: '/AbnormalIdentifyModel/CluesList',
                routes: [
                  // {
                  //   path: '/AbnormalIdentifyModel/CluesList',
                  //   redirect: '/AbnormalIdentifyModel/CluesList/all',
                  // },
                  {
                    // 异常线索清单
                    name: 'CluesList',
                    path: '/AbnormalIdentifyModel/CluesList/:modelNumber',
                    component: './AbnormalIdentifyModel/CluesList',
                  },
                  {
                    // 异常线索清单
                    name: 'CluesList',
                    path: '/AbnormalIdentifyModel/CluesList/CluesDetails/:id',
                    component: './AbnormalIdentifyModel/CluesList/CluesDetails',
                  },

                  {
                    // 线索分析
                    name: 'ClueDetails',
                    path: '/AbnormalIdentifyModel/CluesList/ClueAnalysis',
                    routes: [
                      // {
                      //   path: '/AbnormalIdentifyModel/CluesList/ClueAnalysis',
                      //   redirect: '/AbnormalIdentifyModel/CluesList/ClueAnalysis/WorkTower',
                      // },
                      {
                        // 工作台
                        name: 'WorkTower',
                        path: '/AbnormalIdentifyModel/CluesList/ClueAnalysis/WorkTower',
                        component: './AbnormalIdentifyModel/ClueAnalysis/WorkTower',
                      },
                      {
                        // 生成核查任务
                        name: 'GenerateVerificationTake',
                        path:
                          '/AbnormalIdentifyModel/CluesList/ClueAnalysis/GenerateVerificationTake',
                        component: './AbnormalIdentifyModel/ClueAnalysis/GenerateVerificationTake',
                      },
                    ],
                  },
                ],
              },
              {
                // 核查任务管理
                name: 'VerificationTaskManagement',
                path: '/AbnormalIdentifyModel/VerificationTaskManagement',
                routes: [
                  {
                    path: '/AbnormalIdentifyModel/VerificationTaskManagement',
                    redirect: '/AbnormalIdentifyModel/VerificationTaskManagement/TobeVerifiedTask',
                  },
                  {
                    // 待核查任务
                    name: 'TobeVerifiedTask',
                    path: '/AbnormalIdentifyModel/VerificationTaskManagement/TobeVerifiedTask',
                    component:
                      './AbnormalIdentifyModel/VerificationTaskManagement/VerificationTask',
                  },
                  {
                    // 已核查任务
                    name: 'AlreadyVerifiedTask',
                    path: '/AbnormalIdentifyModel/VerificationTaskManagement/AlreadyVerifiedTask',
                    component:
                      './AbnormalIdentifyModel/VerificationTaskManagement/VerificationTask',
                  },
                  {
                    // 核查结果跟踪
                    name: 'verifiedTaskTracking',
                    path: '/AbnormalIdentifyModel/VerificationTaskManagement/VerifiedTaskTracking',
                    component:
                      './AbnormalIdentifyModel/VerificationTaskManagement/VerificationTask',
                  },
                  {
                    // 核查详情
                    name: 'AlreadyVerifiedTask',
                    path: '/AbnormalIdentifyModel/VerificationTaskManagement/VerifiedTaskDetail',
                    component:
                      './AbnormalIdentifyModel/VerificationTaskManagement/VerificationTask/Detail',
                  },
                ],
              },
              {
                // 暂停线索时段
                name: 'PauseModelWarning',
                path: '/AbnormalIdentifyModel/PauseModelWarning',
                component: './AbnormalIdentifyModel/PauseModelWarning',
              },
              {
                // 整改复核列表
                name: 'RectificationTask',
                path: '/AbnormalIdentifyModel/RectificationTask',
                component: './AbnormalIdentifyModel/RectificationTask',
              },
              {
                // 整改率
                name: 'rectificaRate',
                path: '/AbnormalIdentifyModel/rectificaRate',
                component: './AbnormalIdentifyModel/RectificationTask/rectificaRate',
              },
              {
                // 热电行业数据波动范围
                name: 'FluctuateRange',
                path: '/AbnormalIdentifyModel/FluctuateRange',
                component: './AbnormalIdentifyModel/FluctuateRange',
              },
              {
                // 通用库
                name: 'general',
                path: '/AbnormalIdentifyModel/modelBase/general',
                component: './AbnormalIdentifyModel/ModelBase/General',
              },
              {
                // 通用库 - 设置
                name: 'setting',
                path: '/AbnormalIdentifyModel/modelBase/general/setting/:ID',
                component: './AbnormalIdentifyModel/ModelBase/Setting',
              },
              {
                // 模型选配
                name: 'modelMatch',
                path: '/AbnormalIdentifyModel/modelMatch',
                component: './AbnormalIdentifyModel/ModelMatch',
              },
              {
                // 异常数据分析报告
                name: 'modelMatch',
                path: '/AbnormalIdentifyModel/AnalysisReport',
                component: './AbnormalIdentifyModel/AnalysisReport',
              },
              {
                // 历史数据综合评价
                name: 'HistoryDataAnalysis',
                path: '/AbnormalIdentifyModel/HistoryDataAnalysis',
                routes: [
                  {
                    // 排放源历史监测数据分析
                    name: 'AssistDataAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/AssistDataAnalysis',
                    component: './AbnormalIdentifyModel/AssistDataAnalysis',
                  },
                  {
                    // 排污缺口
                    name: 'PollutantDischargeGap',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/PollutantDischargeGap',
                    component: './AbnormalIdentifyModel/HistoryDataAnalysis/PollutantDischargeGap',
                  },
                  {
                    // 统计分析
                    name: 'PointStatisticalAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/PointStatisticalAnalysis',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/PointStatisticalAnalysis/index.js',
                  },
                  {
                    // 排放源数据缺失分析
                    name: 'missingDataAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/MissingDataAnalysis',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/MissingDataAnalysis/index.js',
                  },
                  {
                    // 排放源工况分析
                    name: 'missingDataAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/WorkingAnalysis',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/WorkingAnalysis/index.js',
                  },
                  {
                    // 异常数据分级分析 - 分级
                    name: 'AbnormalDataAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/level',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/index.js',
                  },
                  {
                    // 异常数据分级分析 - 分类
                    name: 'AbnormalDataAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/type',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/index.js',
                  },
                  {
                    // 异常数据分级分析 - 行为
                    name: 'AbnormalDataAnalysis',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/action',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/AbnormalDataAnalysis/index.js',
                  },
                  {
                    // 异常率诊断分析
                    name: 'AnomalyDetect',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/AnomalyRateDetect',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/AnomalyRateDetect/index.js',
                  },
                  //
                  {
                    // 超标时长分析
                    name: 'AnalysisExceedTimeLimit',
                    path: '/AbnormalIdentifyModel/HistoryDataAnalysis/AnalysisExceedTimeLimit',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/AnalysisExceedTimeLimit',
                  },
                  {
                    // 排放源综合分析：行业、区域、重点企业
                    name: 'IndustryRegionEntStatistics',
                    path:
                      '/AbnormalIdentifyModel/HistoryDataAnalysis/IndustryRegionEntStatistics/:dataType',
                    component:
                      './AbnormalIdentifyModel/HistoryDataAnalysis/IndustryRegionEntStatistics',
                  },
                ],
              },
              {
                // 模型库管理
                name: 'AbnormalCluesList',
                path: '/AbnormalIdentifyModel/ModelBaseManage',
                routes: [
                  // 模型训练
                  {
                    // 数据接入
                    name: 'DataAccess',
                    path: '/AbnormalIdentifyModel/ModelBaseManage/DataAccess',
                    component: './AbnormalIdentifyModel/ModelBaseManage/DataAccess',
                  },
                  {
                    // 数据清洗
                    name: 'CluesList',
                    path: '/AbnormalIdentifyModel/ModelBaseManage/DataCleaning',
                    component: './AbnormalIdentifyModel/ModelBaseManage/DataCleaning',
                  },
                  {
                    // 模型执行管理
                    name: 'ModelExecutive',
                    path: '/AbnormalIdentifyModel/ModelBaseManage/ModelExecutive',
                    component: './AbnormalIdentifyModel/ModelBaseManage/ModelExecutive',
                  },
                  {
                    // 排放特征学习
                    name: 'CharacteristicLearning',
                    path: '/AbnormalIdentifyModel/ModelBaseManage/CharacteristicLearning',
                    component: './AbnormalIdentifyModel/ModelBaseManage/CharacteristicLearning',
                  },
                  // 模型选配
                  {
                    name: 'ModelSelection',
                    path: '/AbnormalIdentifyModel/ModelBaseManage/ModelSelection',
                    component: './AbnormalIdentifyModel/ModelBaseManage/ModelSelection',
                  },
                  // 点位训练
                  {
                    name: 'PointTraining',
                    path: '/AbnormalIdentifyModel/ModelBaseManage/PointTraining',
                    component: './AbnormalIdentifyModel/ModelBaseManage/PointTraining',
                  },
                ],
              },
            ],
          },

          /*********** 运维*************** */
          // 日常工作监管
          {
            path: '/workSupervision',
            name: 'workSupervision',
            routes: [
              {
                // 工作台
                name: 'Standby',
                path: '/workSupervision/workbench',
                component: './workSupervision/workbench',
              },
              // 通用管理
              {
                name: 'management',
                path: '/workSupervision/management',
                routes: [
                  {
                    // 备机管理
                    name: 'Standby',
                    path: '/workSupervision/management/Standby',
                    component: './workSupervision/management/standby/Standby',
                  },
                  {
                    // 备机借用
                    name: 'StandbyBorrow',
                    path: '/workSupervision/management/StandbyBorrow',
                    component: './workSupervision/management/standby/StandbyBorrow',
                  },
                  {
                    // 便携设备管理
                    name: 'Portable',
                    path: '/workSupervision/management/Portable',
                    component: './workSupervision/management/Portable',
                  },
                  {
                    // 便携设备借用
                    name: 'PortableBorrow',
                    path: '/workSupervision/management/PortableBorrow',
                    component: './workSupervision/management/Portable/PortableBorrow',
                  },
                  {
                    // 办事处管理
                    name: 'Office',
                    path: '/workSupervision/management/Office',
                    component: './workSupervision/management/office',
                  },
                ],
              },
              // 任务单提交记录查询
              {
                name: 'taskRecordQuery',
                path: '/workSupervision/taskRecordQuery/:type',
                component: './workSupervision/taskRecordQuery',
              },
              // 日常监管统计
              {
                name: 'statistics',
                path: '/workSupervision/statistics',
                component: './workSupervision/statistics',
              },
              {
                // 经理日常管理
                path: '/workSupervision/dailyManagement',
                name: 'dailyManagement',
                routes: [
                  {
                    // 办事处管理
                    name: 'officeCheck',
                    path: '/workSupervision/dailyManagement/officeCheck',
                    component: './workSupervision/dailyManagement/officeCheck',
                  },
                  {
                    // 客户现场回访
                    name: 'customerReturnVisit',
                    path: '/workSupervision/dailyManagement/customerReturnVisit/:systemType',
                    component: './workSupervision/dailyManagement/customerReturnVisit',
                  },
                  {
                    // 部门内其他工作
                    name: 'innerOtherWork',
                    path: '/workSupervision/dailyManagement/innerOtherWork/:WorkType/:CTOperation',
                    component: './workSupervision/dailyManagement/work',
                  },
                  {
                    // 现场工作
                    name: 'fieldWork',
                    path: '/workSupervision/dailyManagement/fieldWork/:WorkType/:CTOperation',
                    component: './workSupervision/dailyManagement/work',
                  },
                  {
                    // 支持其他部门工作
                    name: 'otherDepartmentWork',
                    path:
                      '/workSupervision/dailyManagement/otherDepartmentWork/:WorkType/:CTOperation',
                    component: './workSupervision/dailyManagement/work',
                  },
                  {
                    // 人员培训
                    name: 'training',
                    path: '/workSupervision/dailyManagement/training/:type',
                    component: './workSupervision/dailyManagement/training',
                  },
                  {
                    // 现场检查
                    name: 'fieldCheck',
                    path: '/workSupervision/dailyManagement/fieldCheck',
                    component: './workSupervision/dailyManagement/fieldCheck',
                  },
                  {
                    // 账款催收
                    name: 'fieldCheck',
                    path: '/workSupervision/dailyManagement/collections',
                    component: './workSupervision/dailyManagement/collections',
                  },
                  {
                    // 纪律检查
                    name: 'disciplineCheck',
                    path: '/workSupervision/dailyManagement/disciplineCheck/:systemType',
                    component: './workSupervision/dailyManagement/disciplineCheck',
                  },
                  {
                    // 现场质量检查
                    name: 'siteInspecTempSet',
                    path: '/workSupervision/dailyManagement/siteQualityInspection',
                    component: './workSupervision/dailyManagement/siteQualityInspection',
                  },
                  {
                    // 现场检查模板配置
                    name: 'siteInspecTempSet',
                    path: '/workSupervision/dailyManagement/siteInspecTempSet',
                    component: './workSupervision/dailyManagement/siteInspecTempSet',
                  },
                ],
              },
            ],
          },
          // 运维评价报告
          {
            name: 'OperationReport',
            path: '/OperationReport',
            component: './OperationReport',
          },
          // 成套服务管理系统
          {
            path: '/completeSetManage',
            name: 'completeSetManage',
            routes: [
              // 专家系统
              {
                name: 'expert',
                path: '/completeSetManage/expert',
                routes: [
                  {
                    // 专家管理
                    name: 'expertManagement',
                    path: '/completeSetManage/expert/management',
                    component: './completeSetManage/expert/Management',
                  },
                  {
                    // 专家库
                    name: 'View',
                    path: '/completeSetManage/expert/view',
                    component: './completeSetManage/expert/View',
                  },
                ],
              },
            ],
          },
          /********  设备调试及售后服务管理平台 成套   ********/
          {
            path: '/ctManage',
            name: 'CtManage',
            routes: [
              // 报告及视图
              {
                path: '/ctManage/reportsViews',
                name: 'ReportsViews',
                routes: [
                  {
                    path: '/ctManage/reportsViews',
                    redirect: '/ctManage/reportsViews/ctServiceReport',
                  },
                  {
                    path: '/ctManage/reportsViews/ctServiceReport', //成套服务报告
                    name: 'ctServiceReport',
                    component: './ctDebuggAfterSaleServiceManage/reportsViews/ctServiceReport',
                  },
                  {
                    // 一次性解决率
                    name: 'returnVisit',
                    path: '/ctManage/reportsViews/oneResolutRate',
                    component: './ctDebuggAfterSaleServiceManage/reportsViews/oneResolutRate',
                  },
                  {
                    // 安装调试达标率
                    name: 'install',
                    path: '/ctManage/reportsViews/InstStdAndCompReso/install',
                    component:
                      './ctDebuggAfterSaleServiceManage/reportsViews/InstStdAndCompReso/install/index',
                  },
                  {
                    // 投诉解决率
                    name: 'returnVisit',
                    path: '/ctManage/reportsViews/InstStdAndCompReso/comp',
                    component:
                      './ctDebuggAfterSaleServiceManage/reportsViews/InstStdAndCompReso/comp/index',
                  },
                  {
                    // 服务响应及时率
                    name: 'returnVisit',
                    path: '/ctManage/reportsViews/InstStdAndCompReso/timelyRate',
                    component: './ctDebuggAfterSaleServiceManage/reportsViews/timelyRate',
                  },
                  {
                    // 报告及时合格率
                    name: 'returnVisit',
                    path: '/ctManage/reportsViews/timelinessQualityReport',
                    component:
                      './ctDebuggAfterSaleServiceManage/reportsViews/timelinessQualityReport',
                  },
                ],
              },
              // 工作台
              {
                // path: '/ctManage/workbench',
                // name: 'Workbench',
                // routes: [
                // {
                //   path: '/ctManage/workbench',
                //   redirect: '/ctManage/workbench',
                // },
                // {
                name: 'CtWorkbench',
                path: '/ctManage/workbench',
                component: './workSupervision/workbench',
                // },

                // ],
              },
              /**项目执行进度 */
              {
                path: '/ctManage/projectExecuProgress',
                name: 'ProjectExecuProgress',

                routes: [
                  {
                    path: '/ctManage/projectExecuProgress',
                    redirect: '/ctManage/projectExecuProgress/projectExecution/dispatchQuery',
                  },
                  // 项目执行
                  {
                    name: 'ProjectExecution',
                    path: '/ctManage/projectExecuProgress/projectExecution',
                    routes: [
                      {
                        path: '/ctManage/projectExecuProgress/projectExecution',
                        redirect: '/ctManage/projectExecuProgress/projectExecution/dispatchQuery',
                      },
                      {
                        // 派单查询
                        name: 'DispatchQuery',
                        path: '/ctManage/projectExecuProgress/projectExecution/dispatchQuery',
                        component:
                          './ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery',
                      },
                      {
                        // 派单查询 60主线
                        name: 'DispatchQuery',
                        path: '/ctManage/projectExecuProgress/projectExecution/dispatchQuery/:id',
                        component:
                          './ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchQuery',
                      },
                      {
                        // 派单完成率
                        name: 'DispatchCompletionRate',
                        path:
                          '/ctManage/projectExecuProgress/projectExecution/dispatchCompletionRate',
                        component:
                          './ctDebuggAfterSaleServiceManage/projectExecuProgress/projectExecution/dispatchCompletionRate',
                      },
                    ],
                  },
                  {
                    // 现场工作时长
                    name: 'SiteAttendanceStatistics',
                    path: '/ctManage/projectExecuProgress/siteAttendanceStatistics',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/siteAttendanceStatistics',
                  },
                  {
                    // 签到考勤查询 成套
                    name: 'CtCheckAttendanceQuery',
                    path: '/ctManage/projectExecuProgress/ctCheckAttendanceQuery',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/cTcheckAttendanceQuery',
                  },
                  {
                    // 遗留问题
                    name: 'emainProblems',
                    path: '/ctManage/projectExecuProgress/remainProblems',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/remainProblems',
                  },
                  {
                    // 部件更换查询
                    name: 'componentReplaceQuery',
                    path: '/ctManage/projectExecuProgress/componentReplace',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/componentReplace',
                  },
                  {
                    // 服务不及时
                    name: 'serviceIsNotTimely',
                    path: '/ctManage/projectExecuProgress/serviceIsNotTimely',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/serviceIsNotTimely',
                  },
                  {
                    // 服务报告查询
                    name: 'reportQuery',
                    path: '/ctManage/projectExecuProgress/reportQuery',
                    component: './ctDebuggAfterSaleServiceManage/projectExecuProgress/reportQuery',
                  },
                  {
                    // 服务报告审核
                    name: 'reportAudit',
                    path: '/ctManage/projectExecuProgress/reportAudit',
                    component: './ctDebuggAfterSaleServiceManage/projectExecuProgress/reportAudit',
                  },
                  {
                    // 服务报告抽查
                    name: 'reportSpotCheck',
                    path: '/ctManage/projectExecuProgress/reportSpotCheck',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/reportSpotCheck',
                  },
                  {
                    // 超时服务
                    name: 'TimeoutServices',
                    path: '/ctManage/projectExecuProgress/TimeoutServices',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/TimeoutServices',
                  },
                  {
                    // 重复服务
                    name: 'RepeatServices',
                    path: '/ctManage/projectExecuProgress/RepeatServices',
                    component:
                      './ctDebuggAfterSaleServiceManage/projectExecuProgress/RepeatServices',
                  },
                ],
              },
              {
                // 服务不及时
                name: 'serviceIsNotTimely',
                path: '/ctManage/projectExecuProgress/serviceIsNotTimely',
                component:
                  './ctDebuggAfterSaleServiceManage/projectExecuProgress/serviceIsNotTimely',
              },
              {
                // 服务报告抽查
                name: 'reportSpotCheck',
                path: '/ctManage/projectExecuProgress/reportSpotCheck',
                component: './ctDebuggAfterSaleServiceManage/projectExecuProgress/reportSpotCheck',
              },
              {
                // 超时服务
                name: 'TimeoutServices',
                path: '/ctManage/projectExecuProgress/TimeoutServices',
                component: './ctDebuggAfterSaleServiceManage/projectExecuProgress/TimeoutServices',
              },
              {
                // 重复服务
                name: 'RepeatServices',
                path: '/ctManage/projectExecuProgress/RepeatServices',
                component: './ctDebuggAfterSaleServiceManage/projectExecuProgress/RepeatServices',
              },
              // 客户满意度
              {
                path: '/ctManage/customerSatisfaction',
                name: 'customerSatisfaction',
                routes: [
                  {
                    path: '/ctManage/customerSatisfaction',
                    redirect: '/ctManage/customerSatisfaction/customerReturnVisit',
                  },

                  {
                    // 服务热线电话
                    name: 'hotPhone',
                    path: '/ctManage/customerSatisfaction/hotPhone',
                    component: './ctDebuggAfterSaleServiceManage/customerSatisfaction/hotPhone',
                  },
                  {
                    // 客户投诉解决
                    name: 'hotPhone',
                    path: '/ctManage/customerSatisfaction/handleComplaints',
                    component:
                      './ctDebuggAfterSaleServiceManage/customerSatisfaction/handleComplaints',
                  },
                  {
                    // 客户满意度调查
                    name: 'hotPhone',
                    path: '/ctManage/customerSatisfaction/customerSatisfacQuery',
                    component:
                      './ctDebuggAfterSaleServiceManage/customerSatisfaction/customerSatisfacQuery',
                  },
                  {
                    // 客户满意度调查 全部数据
                    name: 'hotPhone',
                    path: '/ctManage/customerSatisfaction/customerSatisfacQueryAll',
                    component:
                      './ctDebuggAfterSaleServiceManage/customerSatisfaction/customerSatisfacQuery',
                  },
                ],
              },
              /**售后服务管理  */
              {
                path: '/ctManage/afterSalesServiceManage',
                name: 'AfterSalesServiceManagement',
                routes: [
                  {
                    path: '/ctManage/afterSalesServiceManage',
                    name: 'AfterSalesServiceManagement',
                    routes: [
                      {
                        path: '/ctManage/afterSalesServiceManage',
                        redirect: '/ctManage/afterSalesServiceManage/nodeServices',
                      },
                      {
                        name: 'ChargeService', // 收费服务
                        path: '/ctManage/afterSalesServiceManage/chargeService',
                        component:
                          './ctDebuggAfterSaleServiceManage/afterSalesServiceManage/cooperateWithServices',
                      },
                      {
                        name: 'NodeServices', // 成套节点服务
                        path: '/ctManage/afterSalesServiceManage/nodeServices',
                        component:
                          './ctDebuggAfterSaleServiceManage/afterSalesServiceManage/cooperateWithServices',
                      },
                      {
                        name: 'GiveServer', // 赠送服务
                        path: '/ctManage/afterSalesServiceManage/giveServer',
                        component:
                          './ctDebuggAfterSaleServiceManage/afterSalesServiceManage/cooperateWithServices',
                      },
                      {
                        name: 'CooperateInspection', // 配合检查
                        path: '/ctManage/afterSalesServiceManage/cooperateInspection',
                        component:
                          './ctDebuggAfterSaleServiceManage/afterSalesServiceManage/cooperateWithServices',
                      },
                      {
                        name: 'CooperateOtherWork', // 配合其它工作
                        path: '/ctManage/afterSalesServiceManage/cooperateOtherWork',
                        component:
                          './ctDebuggAfterSaleServiceManage/afterSalesServiceManage/cooperateWithServices',
                      },
                      {
                        // 质保内服务
                        name: 'UnderWarrantyServices',
                        path: '/ctManage/afterSalesServiceManage/underWarrantyServices',
                        component:
                          './ctDebuggAfterSaleServiceManage/afterSalesServiceManage/underWarrantyServices',
                      },
                    ],
                  },
                ],
              },
              /**资产管理 */
              {
                path: '/ctManage/assetManagement',
                name: 'AssetManagement',
                routes: [
                  {
                    path: '/ctManage/assetManagement',
                    redirect: '/ctManage/assetManagement/equipmentAccount/projectQuery',
                  },
                  // 设备台账
                  {
                    name: 'EquipmentAccount',
                    path: '/ctManage/assetManagement/equipmentAccount',
                    routes: [
                      {
                        path: '/ctManage/assetManagement/equipmentAccount',
                        redirect: '/ctManage/assetManagement/equipmentAccount/projectQuery',
                      },
                      {
                        // 项目查询
                        name: 'CtProjectQuery',
                        path: '/ctManage/assetManagement/equipmentAccount/projectQuery',
                        component:
                          './ctDebuggAfterSaleServiceManage/assetManagement/equipmentAccount/projectQuery',
                      },
                      {
                        // 污染源管理
                        name: 'CtPollutantManagement',
                        path:
                          '/ctManage/assetManagement/equipmentAccount/pollutantManagement/:configId',
                        component:
                          './ctDebuggAfterSaleServiceManage/assetManagement/equipmentAccount/pollutantManagement',
                      },
                      {
                        name: 'CtPoint', // 污染源管理 监测点
                        path:
                          '/ctManage/assetManagement/equipmentAccount/pollutantManagement/CTEnterprise/point',
                        component:
                          './ctDebuggAfterSaleServiceManage/assetManagement/equipmentAccount/pollutantManagement/point',
                      },
                      {
                        // 标气有效期
                        name: 'standardGasValidity',
                        path: '/ctManage/assetManagement/equipmentAccount/standardGasValidity',
                        component:
                          './ctDebuggAfterSaleServiceManage/assetManagement/equipmentAccount/standardGasValidity',
                      },
                    ],
                  },
                ],
              },
              /**监督检查 */
              {
                path: '/ctManage/supervisionInspection',
                name: 'SupervisionInspection',
                routes: [
                  {
                    path: '/ctManage/supervisionInspection',
                    redirect: '/ctManage/supervisionInspection/installEquipment',
                  },
                  {
                    // 设备安装审核
                    name: 'InstallEquipmentReview',
                    path: '/ctManage/supervisionInspection/installEquipmentReview',
                    component:
                      './ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment',
                  },
                  {
                    // 设备安装规范性
                    name: 'InstallEquipmentSpecific',
                    path: '/ctManage/supervisionInspection/installEquipmentSpecific',
                    component:
                      './ctDebuggAfterSaleServiceManage/supervisionInspection/installEquipment',
                  },
                ],
              },

              /**通用管理 */
              {
                path: '/ctManage/generalManager',
                name: 'generalManager',
                routes: [
                  {
                    path: '/ctManage/generalManager',
                    redirect: '/ctManage/generalManager/resourceOverview',
                  },
                  {
                    path: '/ctManage/generalManager/resourceOverview', //资源一览
                    name: 'ResourceOverview',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/resourceOverview',
                  },
                  {
                    // 车辆管理
                    name: 'VehicleManager',
                    path: '/ctManage/generalManager/vehicleManager',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/vehicleManager',
                  },
                  {
                    // 人员档案
                    name: 'PersonnelFiles',
                    path: '/ctManage/generalManager/personnelFiles',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/personnelFiles',
                  },
                  {
                    // 大区档案
                    name: 'RegionalArchives',
                    path: '/ctManage/generalManager/regionalArchives',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/regionalArchives',
                  },
                  {
                    // 资源检索中心
                    name: 'RsourceRetrievalCenter',
                    path: '/ctManage/generalManager/resourceRetrievalCenter',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/resourceRetrievalCenter',
                  },
                  {
                    // 专家信息
                    name: 'ExpertInfo',
                    path: '/ctManage/generalManager/resourceRetrievalCenter/expertInfo',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/resourceRetrievalCenter/expertInfo',
                  },
                  {
                    // 资源信息
                    name: 'ResourceInfo',
                    path: '/ctManage/generalManager/resourceRetrievalCenter/resourceInfo',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/resourceRetrievalCenter/resourceInfoProblemsSolutions',
                  },
                  {
                    // 问题及解决方案
                    name: 'ProblemsSolutions',
                    path: '/ctManage/generalManager/resourceRetrievalCenter/problemsSolutions',
                    component: './ctDebuggAfterSaleServiceManage/generalManager/resourceRetrievalCenter/resourceInfoProblemsSolutions',
                  },
                
                ],
              },

              /**技术专家系统 */
              {
                path: '/ctManage/techExpertSystem',
                name: 'TechExpertSystem',
                routes: [
                  {
                    path: '/ctManage/techExpertSystem',
                    redirect: '/ctManage/techExpertSystem/problemBase',
                  },
                  {
                    // 问题库
                    name: 'VehicleManager',
                    path: '/ctManage/techExpertSystem/problemBase',
                    component: './ctDebuggAfterSaleServiceManage/techExpertSystem/problemBase',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];

export default routes;
