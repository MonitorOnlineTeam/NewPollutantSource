
const routes = [
  {
    path: '/hrefLogin',
    component: '../layouts/BlankLayout',
    routes: [{ path: '/hrefLogin', component: './user/login/hrefLogin' }],
  },
  // {
  //   path: '/screen',
  //   component: '../layouts/ScreenLayout',
  //   routes: [
  //     {
  //       name: 'test',
  //       path: '/screen/test',
  //       component: './Test/Test',
  //     },
  //   ]
  // },
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        name: 'homepage',
        path: '/homepage',
        component: './home',
      },
      {
        name: 'sysTypeMiddlePage',
        path: '/sysTypeMiddlePage',
        component: './sysTypeMiddlePage',
      },
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
      // appoperation
      {
        path: '/appoperation',
        component: '../layouts/BlankLayout',
        routes: [
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
        name: 'oneEntsOneArchives',  //一企一档进入进入页面 企业列表
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
            name: 'realtimeLive',
            path: '/realtimeLive',
            component: './SC/realtimeLive/M3U8Video',
          },
          // {
          //   name: 'test',
          //   path: '/test',
          //   component: './AutoFormManager/Test.js',
          // },
          {
            name: 'home',
            path: '/home',
            component: './newHome',
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
            ]
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
            ]
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
            ]
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
                path:
                  '/:parentcode/autoformmanager/:configId/autoformedit/:keysParams/:uid',
                component: './AutoFormManager/AutoFormEdit',
              },
              {
                name: 'view',
                path:
                  '/:parentcode/autoformmanager/:configId/autoformview/:keysParams',
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
                path:
                  '/:parentcode/:parentcode/autoformmanager/:configId/autoformview/:keysParams',
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
          {
            path: '/console',
            routes: [
              /* 配置中心-AutoForm配置-AutoForm数据库配置 */
              {
                path: '/console',
                redirect: '/sessionMiddlePage?sysInfo={"ID":"559becbf-bf68-46c0-8eda-664457b355cf","Name":"Autoform配置","TipsName":"Autoform配置","CodeList":""}'
              },
              {
                path: '/console/database',
                component: './autoformConfig/DatabaseConfig'
              },
              /* 配置中心-系统配置-菜单管理 */
              {
                path: '/console/menuManagement',
                component: './autoformConfig/MenuManagement'
              },
              /* 配置中心-AutoForm配置-AutoForm数据源配置 */
              {
                path: '/console/datasource',
                component: './autoformConfig/AutoFormDataSource'
              }
            ]
          },
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
            path: '/platformconfig',
            name: 'platformconfig',
            routes: [
              {
                path: '/platformconfig',
                redirect: '/platformconfig/AEnterpriseTest',
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
              {
                //视频管理
                name: 'videomanager',
                path: '/platformconfig/videomanager',
                component: './platformManager/videomanager',
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
              {
                name: 'dischargeStandard',
                //排放标准
                path: '/platformconfig/dischargeStandard',
                component: './monitoring/dischargeStandard',
              },
              {
                name: 'abnormalStandard', //异常标准
                path: '/platformconfig/abnormalStandard',
                component: './monitoring/abnormalStandard',
              },
              //停运记录
              {
                name: 'stopRecord',
                path: '/platformconfig/stopRecord',
                component: './monitoring/StopRecord/stopRecord',
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
                ]
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
                path: '/operations/taskRecord',
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
                path: '/operations/operationEntManage/details/:TaskID/:DGIMN',
                name: 'CommandDispatchReportDetails',
                component: './EmergencyTodoList/EmergencyDetailInfoLayout',
              },
              {
                name: 'operationUnit', //运维单位管理
                path: '/operations/operationEntManage/operationUnit/:configId',
                component: './OperationSysManager/operationEntManage/operationUnit',
              },
              {
                name: 'operationPerson', //运维人员管理
                path: '/operations/operationEntManage/operationPerson/:configId',
                component: './OperationSysManager/operationEntManage/operationPerson',
              },
              {
                name: 'operationPerson', //运维人员管理  详情
                path: '/operations/operationEntManage/operationPerson/detail/:configId/:personId',
                component: './OperationSysManager/operationEntManage/operationPerson/OperationPersonDetail',
              },
              {
                name: 'QualityControlResTrend', //质控结果趋势
                path: '/operations/qualityControlResTrend',
                component: './operations/qualityControlResTrend',
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
                    redirect: '/rolesmanager/user/userinfoindex/UserInfo',
                  },
                  {
                    name: 'index',
                    path: '/rolesmanager/user/userinfoindex/:configId',
                    component: './authorized/user',
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
              }
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
                name: 'dataAudit',
                path: '/dataquerymanager/dataAudit/:type',
                component: './monitoring/dataquery/DataAuditPage',
              },
              {
                name: 'dataFlag',
                path: '/dataquerymanager/dataFlag',
                component: './monitoring/dataquery/DataTagPage',
              },
              {
                name: 'defectData',
                //数据缺失
                path: '/dataquerymanager/alarmInfo/defectData',
                component: './monitoring/defectData/ent',
              },
              {
                name: 'defectDataAir',
                //数据缺失(空气站)
                path: '/dataquerymanager/alarmInfo/defectDataAir',
                component: './monitoring/defectData/air',
              },
              {
                name: 'airStation',
                //空气站查询
                path: '/dataquerymanager/airStation',
                component: './monitoring/airStation',
              },
              {
                name: 'exceedData',
                //超标数据查询
                path: '/dataquerymanager/exceedData',
                component: './monitoring/exceedData',
              },
              {
                name: 'abnormalData',
                //异常数据
                path: '/dataquerymanager/abnormalData',
                component: './monitoring/abnormalData',
              },
              {
                name: 'abnormalDetailsData',
                //异常数据 - 二级
                path: '/dataquerymanager/abnormalData/details',
                component: './monitoring/abnormalData/DetailsPage',
              },
            ],
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
              // 数据一览 - 实时
              {
                name: 'realtimeDataView',
                path: '/monitoring/mapview/realtimeDataView',
                component: './monitoring/overView/realtime',
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
                component: './monitoring/videopreview',
              },
              {
                name: 'realtimedata',
                path: '/monitoring/realtimedata',
                component: './monitoring/realtimedata',
              },
              {
                name: 'dataquery',
                path: '/monitoring/dataquery',
                component: './monitoring/dataquery/index',
              },
              // 企业异常上报
              {
                name: 'entExceptionReported',
                path: '/monitoring/entExceptionReported',
                component: './monitoring/entExceptionReported',
              },
              {
                name: 'alarmInfo',
                path: '/monitoring/alarmInfo',
                routes: [

                  {
                    //缺失数据报警  企业
                    name: 'missingData',
                    path: '/monitoring/alarmInfo/missingData',
                    component: './monitoring/missingData/ent',
                  },
                  {
                    //缺失数据报警(空气站)
                    name: 'missingData',
                    path: '/monitoring/alarmInfo/missingDataAir',
                    component: './monitoring/missingData/air',
                  },
                  {
                    //缺失数据报警 二级页面
                    name: 'missDataSecond',
                    path: '/monitoring/alarmInfo/missDataSecond',
                    component: './monitoring/missingData/missDataSecond',
                  },

                  {
                    //缺失数据报警响应  企业
                    name: 'missingData',
                    path: '/monitoring/alarmInfo/missingDataRes',
                    component: './monitoring/missingData/entRes',
                  },
                  {
                    //缺失数据报警响应(空气站)
                    name: 'missingData',
                    path: '/monitoring/alarmInfo/missingDataAirRes',
                    component: './monitoring/missingData/airRes',
                  },
                  {
                    //缺失数据报警响应 二级页面
                    name: 'missDataSecond',
                    path: '/monitoring/alarmInfo/missDataResSecond',
                    component: './monitoring/missingData/missDataResSecond',
                  },
                  {
                    //超标数据报警核实记录查询
                    name: 'exceedDataAlarm',
                    path: '/monitoring/alarmInfo/exceedDataAlarmRecord',
                    component: './monitoring/alarmInfo/exceedDataAlarmRecord/exceedDataAlarm',
                  },
                  {
                    //超标数据报警记录查询
                    name: 'exceedDataAlarm',
                    path: '/monitoring/alarmInfo/exceedDataAlarmOnlyQuery',
                    component: './monitoring/alarmInfo/exceedDataAlarmRecord/exceedDataAlarm_onlyQuery',
                  },
                  {
                    //异常报警响应查询
                    name: 'exceptionrecord',
                    path: '/monitoring/alarmInfo/exceptionrecord',
                    component: './monitoring/alarmInfo/exceptionrecordNew',
                  },
                  {
                    //异常报警查询
                    name: 'exceptionrecordOnlyQuery',
                    path: '/monitoring/alarmInfo/exceptionrecordOnlyQuery',
                    component: './monitoring/alarmInfo/exceptionrecordNew/OnlyQuery',
                  },
                  {
                    name: 'exceptionrecordDetails',
                    path: '/monitoring/alarmInfo/exceptionrecord/details',
                    component: './monitoring/alarmInfo/exceptionrecordNew/RegionDetails',
                  },
                  {
                    //超标报警处置查询
                    name: 'exceedDataDispositionRecord',
                    path: '/monitoring/alarmInfo/exceedDataDispositionRecord',
                    component: './monitoring/alarmInfo/exceedDataDispositionRecord/exceedDataDispositionRecord',
                  },

                ],
              },
              // 企业异常记录
              {
                name: 'entAbnormalRecord',
                path: '/monitoring/entAbnormalRecord',
                component: './monitoring/entAbnormalRecord',
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
                //视频管理
                name: 'videomanager',
                path: '/platformconfig/videomanager',
                component: './platformManager/videomanager',
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
                component: './IntelligentAnalysis/newTransmissionefficiency/entIndex',
              },
              //季度有效数据捕集率 - 碳排放
              {
                name: 'Intelligentanalysis',
                path: '/Intelligentanalysis/carbonQuartDataCaptureRate',
                component: './IntelligentAnalysis/newTransmissionefficiency/CarbonQuartDataCaptureRate',
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
                    redirect: '/Intelligentanalysis/dataAlarm/missingDataRate/ent',
                  },
                  {
                    //缺失数据报警响应率 企业
                    name: 'missingDataRate',
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/ent',
                    component: './IntelligentAnalysis/dataAlarm/missingDataRate/ent',
                  },
                  {
                    //缺失数据报警响应率 空气站
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/air',
                    component: './Intelligentanalysis/dataAlarm/missingDataRate/air',
                  },
                  {
                    //缺失数据报警响应率 二级页面
                    name: 'missRateDataSecond',
                    path: '/Intelligentanalysis/dataAlarm/missingDataRate/missRateDataSecond',
                    component: './Intelligentanalysis/dataAlarm/missingDataRate/missRateDataSecond',
                  },
                  {
                    // 数据异常报警响应率
                    path: '/Intelligentanalysis/dataAlarm/abnormal',
                    component: './IntelligentAnalysis/dataAlarm/abnormalResRate',
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
                    //超标数据核实率二级页面
                    path: '/Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                    component: './Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
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
                    component: './Intelligentanalysis/dataAlarm/overAlarmDisposalRate/RegionOverAlarmDisposalRate',
                  },
                ]
              },
              // 统计-运维工单
              {
                path: '/Intelligentanalysis/operationWorkStatis',
                name: 'operationWorkStatis',
                routes: [
                  {
                    // 运维工单统计（企业）
                    name: 'entWorkOrderStatistics',
                    path: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics',
                    component: './IntelligentAnalysis/operationWorkStatis/entWorkOrderStatistics',
                  },
                  {
                    //行政区运维工单统计（企业）
                    name: 'regionStaticstics',
                    path: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',
                    component: './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',
                  },
                  {
                    //企业运维工单统计（企业）
                    name: 'entWorkOrderStatistics',
                    path: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/EntStaticstics',
                    component: './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/EntStaticstics',
                  },
                  /* 缺失台账工单统计 空气站 */
                  {
                    name: 'noAccountAirStatistics',
                    path: '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                    component: './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                  },
                  {
                    name: 'noAccountStatisticsEnt', //无台账上传统计 企业
                    path: '/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent',
                    component: './IntelligentAnalysis/operationWorkStatis/noAccountStatistics/ent',
                  },
                  /* 缺失台账照片统计 */
                  {
                    name: 'noAccountAirStatisticsPhoto',
                    path: '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
                    component: './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
                  },
                  /* 缺失台账工单详情 */
                  {
                    name: 'noAccountAirStatisticsDetails',
                    path: '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
                    component: './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
                  },
                  {
                    /** 运维工单统计-空气站 */
                    name: 'AirWorkOrderStatistics',
                    path: '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation',
                    component:
                      './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics',
                  },
                  {
                    /** 单区域 运维工单统计-空气站 排口 */
                    name: 'RegionAirQualityMonitoringStation',
                    path:
                      '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/RegionAirQualityMonitoringStation',
                    component:
                      './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/RegionAirQualityMonitoringStation',
                  },
                  {
                    /** 单站点 运维工单统计-空气站 排口 */
                    name: 'SingleStationAirQualityMonitoringStation',
                    path:
                      '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/SingleStationAirQualityMonitoringStation',
                    component:
                      './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/SingleStationAirQualityMonitoringStation',
                  },
                  {
                    /** 单区域 运维工单统计-空气站 */
                    name: 'AirWorkOrderStatistics',
                    path:
                      '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/StationAirQualityMonitoringStation',
                    component:
                      './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/StationAirQualityMonitoringStation',
                  },
                ],
              },

              {
                name: 'emissions',
                path: '/Intelligentanalysis/emissions',
                component: './Intelligentanalysis/emissions',
              },
              {
                name: 'effluentFee',
                path: '/Intelligentanalysis/effluentFee',
                component: './Intelligentanalysis/effluentFee',
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
              // 数据获取率`
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
                    component: './IntelligentAnalysis/CO2Emissions/electricity/supplementData/AddOrEditPage',
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

                ]
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
                    component: './IntelligentAnalysis/CO2Emissions/cement/supplementData/AddOrEditPage',
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
                ]
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
                ]
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
                name: 'dataquery',
                path: '/monitoring/dataquery',
                component: './monitoring/dataquery/index',
              },
              {
                name: 'alarmrecord',
                path: '/monitoring/alarmrecord',
                component: './monitoring/alarmrecord/index',
              },
              {
                name: 'originaldata',
                path: '/monitoring/originaldata',
                component: './monitoring/originaldata',
              },
              {
                name: 'alarmverifyrecord',
                path: '/monitoring/alarmverifyrecord',
                component: './monitoring/alarmverifyrecord/index',
              },
            ],
          },
          // 质控 - 数据查询
          {
            path: '/dataSearch',
            name: 'dataSearch',
            routes: [
              {
                path: '/dataSearch',
                redirect: "/dataSearch/monitor"
              },
              {
                // 质控查询
                path: '/dataSearch/qca',
                name: 'qca',
                routes: [
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
                ]
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
                ]
              },
              {
                // 监测数据
                path: '/dataSearch/monitor',
                name: 'monitor',
                routes: [
                  {
                    path: '/dataSearch/monitor',
                    redirect: "/dataSearch/monitor/datavisualization"
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
                    name: 'historyparame',  //报警信息跳转详情页 历史管控参数
                    path: '/dataSearch/monitor/historyparameDetail',
                    component: './dynamicControl/controlData/historyparame',

                  },
                  { //超标数据
                    name: 'alarmOverrecord',
                    path: '/dataSearch/monitor/alarm/overrecord',
                    component: './dataSearch/monitor/alarmInfo/overRecord',
                  },
                  { //异常数据
                    name: 'alarmExceptionRecord',
                    path: '/dataSearch/monitor/alarm/exceptionRecord',
                    component: './dataSearch/monitor/alarmInfo/exceptionRecord',
                  },
                ]
              },
              {
                name: 'dischargeStandard',
                //设备参数查询
                path: '/dataSearch/deviceParam',
                component: './dataSearch/deviceParam',
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
            ]
          },
          //质控核查
          {
            path: '/qualityCheck',
            name: 'qualityCheck',
            routes: [
              {
                // 质控管理
                path: '/qualityCheck/qualityMange',
                name: 'qualityMange',
                routes: [
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
                ]
              },
              {
                // 质控核查设置
                path: '/qualityCheck/qualitySetting',
                name: 'qualitySetting',
                routes: [
                  {
                    name: 'zeroPointSet',  //零点核查设置
                    path: '/qualityCheck/qualitySetting/zeroPointSet',
                    component: './qualityCheck/qualitySetting/zeroPointSet',
                  },
                  {
                    name: 'rangeSet',  //量程核查设置
                    path: '/qualityCheck/qualitySetting/rangeSet',
                    component: './qualityCheck/qualitySetting/rangeSet',
                  },
                  {
                    name: 'linearSet',  //线性核查设置
                    path: '/qualityCheck/qualitySetting/linearSet',
                    component: './qualityCheck/qualitySetting/linearSet',
                  },
                  {
                    name: 'blindSet',  //盲样核查设置
                    path: '/qualityCheck/qualitySetting/blindSet',
                    component: './qualityCheck/qualitySetting/blindSet',
                  },
                  {
                    name: 'resTimeSet',  //响应时间设置
                    path: '/qualityCheck/qualitySetting/resTimeSet',
                    component: './qualityCheck/qualitySetting/resTimeSet',
                  },
                ]
              },
              {
                // 手动质控核查
                path: '/qualityCheck/qualityManualCheck',
                name: 'qualityManualCheck',
                routes: [
                  {
                    name: 'manualQuality',  // 手动质控
                    path: '/qualityCheck/qualityManualCheck/manualQuality',
                    component: './qualityCheck/qualityManualCheck/manualQuality',
                  },
                  {
                    name: 'dataExtract',  // 数据提取
                    path: '/qualityCheck/qualityManualCheck/dataExtract',
                    component: './qualityCheck/qualityManualCheck/dataExtract',
                  }
                ]
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
                name: 'wry',  // 污染源管理
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
                    name: 'KBS',  // 知识库管理
                    path: '/basicsManage/wry/KBS',
                    component: './KBS/KBSManage',
                  },
                ]
              }
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
                  // 气瓶关联
                  {
                    name: 'instrumentView',
                    path: '/qualityControl/qcaManager/gasJoin',
                    component: './qualityControl/gasJoin',
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
                name: 'reportManage',  // 报备管理
                path: '/dynamicControl/reportManage',
                routes: [
                  {
                    name: 'paramFiling',  //管控参数备案
                    path: '/dynamicControl/reportManage/paramFiling',
                    component: './dynamicControl/reportManage/paramFiling',
                  },
                ]
              },
              {
                name: 'dynamicDataManage',  // 管控数据
                path: '/dynamicControl/dynamicDataManage',
                routes: [
                  {
                    name: 'realtimedynamicData',  //实时管控参数
                    path: '/dynamicControl/dynamicDataManage/realtimedynamicData',
                    component: './dataSearch/monitor/working/realtimeParam',

                  },
                  {
                    name: 'historyparame',  //历史管控参数
                    path: '/dynamicControl/dynamicDataManage/controlData/historyparame',
                    component: './dynamicControl/controlData/historyparame',
                  },
                ]
              }
            ]

          },
          /* 任务详情 */
          {
            path: '/taskdetail/emergencydetailinfolayout/:TaskID/:DGIMN',
            component: './EmergencyTodoList/EmergencyDetailInfoLayout',
          },
          {
            name: 'OneEntsOneArchives',  // 一企一档
            path: '/oneEntsOneArchives',
            routes: [
              {
                path: '/oneEntsOneArchives',
                redirect: '/oneEntsOneArchives/entList',

              },

              {
                name: 'EssentialInfo',  // 基本信息
                path: '/oneEntsOneArchives/essentialInfo',
                routes: [
                  {
                    path: '/oneEntsOneArchives/essentialInfo',
                    redirect: '/oneEntsOneArchives/essentialInfo/entInfoDetail',
                  },
                  {
                    name: 'EntInfoDetail',  //企业列表详情
                    path: '/oneEntsOneArchives/essentialInfo/entInfoDetail',
                    component: './oneEntsOneArchives/essentialInfo/entInfoDetail',
                  },
                  {
                    name: 'EntInfoEdit',  //企业列表详情 编辑
                    path: '/oneEntsOneArchives/essentialInfo/entInfoDetail/EntInfoEdit',
                    component: './oneEntsOneArchives/essentialInfo/entInfoDetail/EntInfoEdit',
                  },
                  {
                    name: 'OutfallInfo',  //排污口信息管理
                    path: '/oneEntsOneArchives/essentialInfo/outfallInfo',
                    component: './oneEntsOneArchives/essentialInfo/outfallInfo'
                  },
                  {
                    name: 'WasteWaterGovern',  //废水治理设施
                    path: '/oneEntsOneArchives/essentialInfo/wasteWaterGovern/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'OperationInfo',  //运维信息管理
                    path: '/oneEntsOneArchives/essentialInfo/operationInfo/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'EquipmentManufacturer',  //设备生产厂商信息管理
                    path: '/oneEntsOneArchives/essentialInfo/equipmentManufacturer/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'OutfallInfo',  //废气治理设施
                    path: '/oneEntsOneArchives/essentialInfo/wasteGasGovern/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate'
                  },
                  {
                    name: 'StatisticalAnalysis',  //一企一档进入 统计分析
                    path: '/oneEntsOneArchives/essentialInfo/statisticalAnalysis',
                    component: './oneEntsOneArchives/essentialInfo/statisticalAnalysis'
                  },
                ]
              },

              {
                name: 'DischargeStandard',  //排污许可管理
                path: '/oneEntsOneArchives/sewageDisposal',
                routes: [
                  {
                    path: '/oneEntsOneArchives/sewageDisposal',
                    redirect: '/oneEntsOneArchives/sewageDisposal/dischargeStandLimit',

                  },
                  {
                    name: 'dischargeStandLimit',//排污许可管理 - 排放标准限值
                    path: '/oneEntsOneArchives/sewageDisposal/dischargeStandLimit',
                    component: './platformManager/monitoringstandard',
                  },
                  {
                    name: 'dischargeNumLimit', //排污许可管理 - 排放量限值
                    path: '/oneEntsOneArchives/sewageDisposal/dischargeNumLimit/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  }

                ]
              },
              {
                name: 'MonitoringData',  //监控数据
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

                ]
              },
              {
                name: 'EnvironEmergency',  //环境应急预案
                path: '/oneEntsOneArchives/environEmergency',
                routes: [
                  {
                    path: '/oneEntsOneArchives/environEmergency',
                    redirect: '/oneEntsOneArchives/environEmergency/factorSitua/Bas_EnvironmentalEmergencyPlan',

                  },
                  {
                    name: 'FactorSitua',
                    path: '/oneEntsOneArchives/environEmergency/factorSitua/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },

                ]
              },
              {
                name: 'CharacteristicFactor',  //特征因子
                path: '/oneEntsOneArchives/characteristicFactor',
                routes: [
                  {
                    path: '/oneEntsOneArchives/characteristicFactor',
                    redirect: '/oneEntsOneArchives/characteristicFactor/wasterWater/Bas_WaterEigenfactor',

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
                ]
              },
              {
                name: 'LawInfo',  //执法信息管理
                path: '/oneEntsOneArchives/lawInfo',
                routes: [
                  {
                    path: '/oneEntsOneArchives/lawInfo',
                    redirect: '/oneEntsOneArchives/lawInfo/administration/Bas_AdministrationTasksRecord',

                  },
                  {
                    name: 'Administration', //执法信息管理-行政任务记录
                    path: '/oneEntsOneArchives/lawInfo/administration/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'LawEnforcement',//执法信息管理-执法任务记录
                    path: '/oneEntsOneArchives/lawInfo/lawEnforcement/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  }
                ]
              },
              {
                name: 'HazardousWaste',  //危废管理
                path: '/oneEntsOneArchives/hazardousWaste',
                routes: [
                  {
                    path: '/oneEntsOneArchives/hazardousWaste',
                    redirect: '/oneEntsOneArchives/hazardousWaste/hazardousWasteInfo/Bas_HazardousWasteManagement'
                  },
                  {
                    name: 'HazardousWasteInfo',  //危废管理-危废管理
                    path: '/oneEntsOneArchives/hazardousWaste/hazardousWasteInfo/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'PlatformAccount',//危废管理-危废台账
                    path: '/oneEntsOneArchives/hazardousWaste/platformAccount/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ]
              },
              {
                name: 'EiaInfo',  //环评信息管理
                path: '/oneEntsOneArchives/eiaInfo',
                routes: [
                  {
                    path: '/oneEntsOneArchives/eiaInfo',
                    redirect: '/oneEntsOneArchives/eiaInfo/approval/Bas_ProjectApproval'
                  },
                  {
                    name: 'Approval',   //环评信息管理  建设环评审批
                    path: '/oneEntsOneArchives/eiaInfo/approval/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                  {
                    name: 'AcceptanceCheck', //环评信息管理  建设项目验收
                    path: '/oneEntsOneArchives/eiaInfo/acceptanceCheck/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ]
              },
              {
                name: 'PetitionComplaints',  //信访投诉
                path: '/oneEntsOneArchives/petitionComplaints',
                routes: [
                  {
                    path: '/oneEntsOneArchives/petitionComplaints',
                    redirect: '/oneEntsOneArchives/petitionComplaints/situa/:configId'
                  },
                  {
                    name: 'petitionComplaints',   //信访投诉情况
                    path: '/oneEntsOneArchives/petitionComplaints/situa/:configId',
                    component: './oneEntsOneArchives/autoformSearchTemplate',
                  },
                ]
              },
            ]
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
