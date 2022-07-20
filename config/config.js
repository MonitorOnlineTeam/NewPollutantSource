import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import Cookie from 'js-cookie';
import slash from 'slash2';
import webpackPlugin from './plugin.config';
import config from '@/config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const apiHost = 'http://172.16.12.234:61002/';
// const apiHost = 'http://172.16.12.135:50210/';
// const apiHost = 'http://172.16.12.57:61000/';
// const apiHost = 'http://172.16.12.57:61002/';
// const apiHost = 'http://172.16.12.134:8765/';
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';

const defaultNavigateUrl = Cookie.get('defaultNavigateUrl');
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
        immer: false,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  base: '/',
  publicPath: '/',
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
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
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          name: 'homepage',
          path: '/homepage',
          component: './home',
        }, // appoperation
        {
          path: '/appoperation',
          component: '../layouts/BlankLayout',
          routes: [
            /* 督查详情 移动端 */
            {
              path: '/appoperation/appRemoteSupervisionDetail/:id',
              component: './AppOperation/AppRemoteSupervisionDetail',
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
            {
              path: '/appoperation/appqrcodemain',
              component: './AppOperation/AppQRCodeMain',
            },
            /* 扫码查运维页面 */
            {
              path: '/appoperation/scanningCode/:DGIMN',
              component: './AppOperation/ScanningCode',
            },
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
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          // authority: ['admin', 'user'],
          routes: [
            {
              path: '/',
              redirect: defaultNavigateUrl,
            },
            {
              name: 'home',
              path: '/home',
              component: './newHome',
            },
            {
              name: 'homepage',
              path: '/newHomePage',
              component: './newHomePage',
            },
            {
              name: 'newestHome',
              path: '/newestHome',
              component: './newestHome',
            },
            {
              name: 'test',
              path: '/test',
              component: './Test',
            },
            {
              name: 'VideoSurveillance',
              path: '/videoSurveillance',
              component: './videoSurveillance',
            },
            {
              path: '/:parentcode/autoformmanager/:configId',
              name: 'AutoFormManager',
              routes: [
                // { path: '/:parentcode/autoformmanager/:configId', redirect: '/:parentcode/autoformmanager/:configId/AutoFormList' },
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
                  path:
                    '/:parentcode/:parentcode/autoformmanager/:configId/autoformview/:keysParams',
                  component: './AutoFormManager/AutoFormView',
                },
              ],
            }, //污水处理台
            {
              path: '/SewagePlant',
              name: 'SewagePlant',
              routes: [
                {
                  path: '/SewagePlant',
                  redirect: 'SewagePlant/DataReporting/DataReporting/1/1',
                },
                // 数据上报列表
                {
                    name: 'DataReporting',
                    path: '/SewagePlant/DataReporting/:configId/:monitortime/:entcode',
                    ///:monitortime/:entcode
                    component: './platformManager/dataReport/',
                },
                // 数据上报添加或修改
                {
                    name: 'DataReportingAdd',
                    path: '/SewagePlant/DataReportingAdd/:configId/:id/:monitortime/:entcode',
                    component: './platformManager/dataReport/components/addDataReport',
                },
                //统计报表
                {
                  name:'statisticsReportDataList',
                  path:'/SewagePlant/dataReportList/statisticsReportDataList',
                  component: './report/StatisticsReportDataList',
                }
              ]
            },
            {
              path: '/operaAchiev', //运维绩效
              name: 'operaAchiev',
              routes: [
                {
                  path: '/operaAchiev',
                  redirect: '/operaAchiev/personalAchiev', // 重定向 默认为 
                },
                { // 个人绩效
                  name:'personalAchiev',
                  path:'/operaAchiev/personalAchiev',
                  component: './operaAchiev/personalAchiev',
                },
                { // 绩效信息
                  name:'achievInfo',
                  path:'/operaAchiev/achievInfo',
                  component: './operaAchiev/achievInfo',
                },
                { // 点位系数清单
                  name:'pointCoefficientList',
                  path:'/operaAchiev/pointCoefficientList',
                  component: './operaAchiev/pointCoefficients',
                },
                { // 工单系数清单
                  name:'workCoefficientList',
                  path:'/operaAchiev/workCoefficientList',
                  component: './operaAchiev/workCoefficients',
                },
                { // 绩效定时器
                  name:'operaAchievTimer',
                  path:'/operaAchiev/operaAchievTimer',
                  component: './operaAchiev/operaAchievTimer',
                },
              ]
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
                  name:'equipmentAccount',
                  path: '/commissionTest/equipmentAccount', //调试检测 设备台账
                  routes: [
                    {
                      path: '/commissionTest/equipmentAccount',
                      redirect: '/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2', 
                    },
                    {
                      name:'pollutantManager', //调试检测 污染源管理
                      path: '/commissionTest/equipmentAccount/pollutantManager/:configId',
                      component: './commissionTest/equipmentAccount/pollutantManager', 
                    },  
                    {
                      name:'point', //调试检测 污染源管理 监测点
                      path: '/commissionTest/equipmentAccount/point',
                      component: './commissionTest/equipmentAccount/pollutantManager/point', 
                    },   
                    {
                      name:'pollutantManager', //调试检测 污染源查询
                      path: '/commissionTest/equipmentAccount/pollutantQuery',
                      component: './commissionTest/equipmentAccount/pollutantQuery', 
                      // component: './dataSearch/pollutantInfo',
                    },
                    {
                      name:'pollutantManager', //调试检测 设备厂家名录
                      path: '/commissionTest/equipmentAccount/equipmentManufacturList',
                      component: './platformManager/configurationInfo/equipmentFacturer', 
                    },
                    {
                      name:'cemsEquipmentList', //cems设备清单
                      path: '/commissionTest/equipmentAccount/cemsEquipmentList',
                      component: './commissionTest/equipmentAccount/cemsEquipmentList', 
                    }, 
                    {
                      name:'cemsModelList', //cems型号清单
                      path: '/commissionTest/equipmentAccount/cemsModelList',
                      component: './commissionTest/equipmentAccount/cemsModelList', 
                    }, 
                    {
                      name:'referenceInstruList', //参比仪器清单
                      path: '/commissionTest/equipmentAccount/referenceInstruList',
                      component: './commissionTest/equipmentAccount/referenceInstruList', 
                    },   
                  ]
                },
                {
                  name:'72HourCommissionTest',
                  path: '/commissionTest/72HourCommissionTest',
                },   
                {
                  name:'72HourCommissionTestQuery',
                  path: '/commissionTest/72HourCommissionTestQuery',
                },              
              ]
            },
            {
              path: '/assetManage/customOrder', //客户订单
              routes: [
                {
                  path: '/assetManage/customOrder',
                  redirect: '/assetManage/customOrder/custopmRenew', // 重定向 默认为 
                },
                { // 客户续费
                  name:'custopmRenew',
                  path:'/assetManage/customOrder/custopmRenew',
                  component: './platformManager/assetManage/custopmRenew',
                },
                { // 续费日志
                  name:'custopmRenew',
                  path:'/assetManage/customOrder/renewalLog',
                  component: './platformManager/assetManage/renewalLog',
                },
              ]
            },
            
             { //项目权限管理
                  name:'projectManageAuthor',
                  path:'/assetManagement/equipmentAccount/projectManageAuthor',
                  component: './platformManager/assetManage/equipmentAccount/projectManageAuthor',
             },
            
            {
              path: '/platformconfig',
              name: 'platformconfig',
              routes: [
                {
                  path: '/platformconfig',
                  redirect: '/platformconfig/monitortarget/AEnterpriseTest/1/1,2',
                },
                { //基础信息
                  name: 'basicInfo',
                  path: '/platformconfig/basicInfo',
                  routes: [
                    {
                      path: '/platformconfig/basicInfo',
                      redirect: '/platformconfig/basicInfo/projectManager',
                    },
                    {
                      // 项目管理
                      name: 'projectManager',
                      path: '/platformconfig/basicInfo/projectManager',
                      component: './platformManager/basicInfo/projectManager',
                    },
                    {
                      // 项目管理详情
                      name: 'projectManagerDetail',
                      path: '/platformconfig/basicInfo/projectManager/detail',
                      component: './platformManager/basicInfo/projectManager/detail',
                    },                
                    {  //污染源管理
                      name: 'monitortarget',
                      path: '/platformconfig/basicInfo/monitortarget/:configId/:targetType/:pollutantTypes',
                      component: './platformManager/monitortarget',
                    },
                    {
                      name: 'entOperationInfo', //企业下的运维信息
                      path: '/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2/operationInfo',
                      component: './platformManager/monitortarget/operationInfo',
                    },
                    {
                      name: 'entImport', //企业导入
                      // path: '/platformconfig/monitortarget/entImport',
                      path:'/platformconfig/basicInfo/monitortarget/AEnterpriseTest/1/1,2/entImport',
                      component: './platformManager/monitortarget/entImport',
                    },
                    {
                      name: 'dischargepermit',//排污许可证
                      path:
                        '/platformconfig/basicInfo/monitortarget/AEnterpriseTest/:targetType/dischargepermit/:configId/:EntCode/:EntName',
                      component: './platformManager/dischargepermit',
                    },
                    { //维护点信息
                      name: 'monitorpoint',
                      path:
                        '/platformconfig/basicInfo/monitortarget/:configId/:targetType/:pollutantTypes/monitorpoint/:targetId/:targetName',
                      component: './platformManager/point',
                    },
                    {  //仓库管理
                      name: 'warehouse',
                      path: '/platformconfig/basicInfo/monitortarget/warehouse/:configId',
                      component: './platformManager/basicInfo/storehouseManager/AutoFormManager',
                    },
                    {  //设备交接资料管理
                      name: 'equiptmentHandManager',
                      path: '/platformconfig/basicInfo/equiptmentHandManager',
                      component: './platformManager/basicInfo/equiptmentHandManager',
                    },
                  ]
                },
                { //配置信息
                  name: 'basicInfo',
                  path: '/platformconfig/configurationInfo',
                  routes: [
                    {
                      path: '/platformconfig/configurationInfo',
                      redirect: '/platformconfig/configurationInfo/OperationCycle',
                    },
                    {
                      name: 'operationCycle',//运维频次管理
                      path: '/platformconfig/configurationInfo/:configId',
                      component: './platformManager/configurationInfo/AutoFormManager',
                    },
                    {
                      name: 'timerManage',//定时器管理
                      path: '/platformconfig/configurationInfo/timer/timerManage',
                      component: './platformManager/configurationInfo/timerManage',
                    },
                    {
                      name: 'equipmentFacturer',//设备厂家名录
                      path: '/platformconfig/configurationInfo/deveice/equipmentFacturer',
                      component: './platformManager/configurationInfo/equipmentFacturer',
                    },
                    {
                      name: 'systemMarker',//系统型号
                      path: '/platformconfig/configurationInfo/deveice/systemMarker',
                      component: './platformManager/configurationInfo/systemMarker',
                    },
                    {  //故障单元管理
                      name: 'faultUnitManager',
                      path: '/platformconfig/configurationInfo/faultUnit/faultUnitManager',
                      component: './platformManager/configurationInfo/faultUnitManager',
                    },
                    {
                      name: 'checkInfo',//核查信息
                      path: '/platformconfig/configurationInfo/check/checkInfo',
                      component: './platformManager/configurationInfo/checkInfo',
                    },
                  ]
                },
                { //资产管理
                  name: 'assetManage',
                  path: '/platformconfig/assetManage',
                  routes: [
                    {
                      path: '/platformconfig/assetManage',
                      redirect: '/platformconfig/assetManage/deviceInfo',
                    },
                    {
                      name: 'deviceInfo',//设备管理
                      path: '/platformconfig/assetManage/deviceInfo',
                      component: './platformManager/assetManage/deviceInfo',
                    },
                    {
                      name: 'spareParts',//备品备件 
                      path: '/platformconfig/assetManage/spareParts/:configId',
                      component: './OperationSysManager/SparepartManage',
                    },
                    // {
                    //   name: 'referenceMaterial',//标准物质
                    //   path: '/platformconfig/assetManage/referenceMaterial/:configId',
                    //   component: './OperationSysManager/StandardGasManage',
                    // },
                    {
                      name: '标准物质',//标准物质
                      path: '/platformconfig/assetManage/referenceMaterial',
                      component: './platformManager/assetManage/referenceMaterial',
                    },
                    {
                      name: 'StandardLiquid',//试剂信息
                      path: '/platformconfig/assetManage/reagentInfo',
                      component: './platformManager/assetManage/referenceMaterial',
                    },
                  ],
    
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
                  name: 'maintainbase',
                  path: '/platformconfig/maintain/:configId/',
                  component: './platformManager/maintain',
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
                }, // 标准库管理
                {
                  name: 'StandardLibrary',
                  path: '/platformconfig/StandardLibrary',
                  component: './platformManager/standardLibrary',
                }, // 添加标准库
                {
                  name: 'addLibrary',
                  path: '/platformconfig/StandardLibrary/addLibrary',
                  component: './platformManager/standardLibrary/AddLibrary',
                }, // 编辑标准库
                {
                  name: 'editLibrary',
                  path: '/platformconfig/StandardLibrary/editLibrary/:id/:cuid',
                  component: './platformManager/standardLibrary/AddLibrary',
                }, // 编辑标准库
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
                }, //停产管理
                {
                  name: 'outputstopmanage',
                  path: '/platformconfig/outputstopmanage/:configId',
                  component: './platformManager/outputstopManager/',
                }, 
                //年度考核企业
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

              ],
            },
            {
              path: '/report',
              name: 'report',
              routes: [
                {
                  path: '/report',
                  redirect: '/report/wry',
                }, // {
                //   name: 'dateReportPage',
                //   path: '/report/:reportType',
                //   component: './report/DateReportPage',
                // },
                // {
                //   name: 'summaryReportPage',
                //   path: '/report/summary/:reportType',
                //   component: './report/summaryReportPage',
                // },
                // 综合指数报表
                {
                  name: 'report',
                  path: '/report/airReport/zhzs/:type',
                  component: './dataAnalyze/Report',
                },
                // 综合指数范围报表
                {
                  name: 'compositeIndexReport',
                  path: '/report/airReport/compositeIndex/:reportType',
                  component: './dataAnalyze/CompositeIndexReport',
                },
                // 综合指数对比
                {
                  name: 'compositeIndexRangeReport',
                  path: '/report/airReport/compositeIndexRange',
                  component: './dataAnalyze/CompositeRangeReport',
                },
                // 季度有效数据捕集率
                {
                  name: 'compositeIndexContrast',
                  path: '/report/airReport/compositeIndexContrast',
                  component: './dataAnalyze/CompositeIndexContrast',
                },
                {
                  name: 'wryReport',
                  path: '/report/wry',
                  // component: "./operations/CalendarPage",
                  routes: [
                    {
                      path: '/report/wry',
                      // redirect: '/report/wry/siteDaily',
                      redirect: '/report/wry/siteReport', //站点数据总览  重定向
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
                //小时平均值日报
                {
                  name: 'DailyReport',
                  path: '/report/wasteWater',
                  redirect: '/report/wasteWater/DailyReport',
                },                
                //小时平均值日报
                {
                  name: 'DailyReport',
                  path: '/report/wasteWater/DailyReport',
                  component: './report/DailyReport/DailyReport',
                },
                //日平均值月报
                {
                  name: 'MonthReport',
                  path: '/report/wasteWater/MonthReport',
                  component: './report/MonthReport/MonthReport',
                },
                //月平均值季报
                {
                  name: 'SeasonReport',
                  path: '/report/wasteWater/SeasonReport',
                  component: './report/SeasonReport/SeasonReport',
                },
                //月平均值年报
                {
                  name: 'YearReport',
                  path: '/report/wasteWater/YearReport',
                  component: './report/YearReport/YearReport',
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
                { //智慧运维 重定向
                  path: '/operations/wisdomOperations',
                  redirect: '/operations/calendar/index',
                },
                {
                  path: '/operations/calendar',
                  name: 'calendar',
                  // component: "./operations/CalendarPage",
                  routes: [
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
                  path: '/operations/log',
                  //运维日志
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
                      name: 'handhelddevicesmanage',
                      path: '/operations/materielmanager/handhelddevicesmanage/:configId',
                      component: './OperationSysManager/HandheldDevicesManage/',
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
                  ],
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
                      component: './OperationSysManager/CertificateManage/',//人员证书
                    },

                  ],
                },
                {//运维资料
                      name: 'maintenancedatabase',
                      path: '/operations/maintenancedatabase/:configId',
                      component: './OperationSysManager/MaintenanceDatabaseManage/',
               },                
                {
                  name: 'sparepartsstation',//服务站信息
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
                }, // {
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
                  path: '/operations/equipmentFeedback', //开发设备故障反馈
                  name: 'EquipmentFeedback',
                  component: './operations/equipmentFeedback',
                },
                {
                  path: '/operations/equipmentFeedback/detail', //开发设备故障反馈 详情
                  name: 'EquipmentFeedback',
                  component: './operations/equipmentFeedback/detail',
                },
               //企业运维管理
               {
                name: 'operationEntManage',
                path:'/operations/operationEntManage',
                routes: [
                  {
                    path: '/operations/operationEntManage',
                    redirect: '/operations/operationEntManage/operationUnit/OperationMaintenanceEnterprise',
                  },
                  {
                    name:'operationUnit', //运维单位管理
                    path: '/operations/operationEntManage/operationUnit/:configId',
                    component: './operations/operationEntManage/operationUnit',
                  },
                  {
                    name:'operationPerson', //运维人员管理
                    path: '/operations/operationEntManage/operationPerson/:configId',
                    component: './operations/operationEntManage/operationPerson',
                  },
                  {
                    name:'operationPerson', //运维人员管理  详情
                    path: '/operations/operationEntManage/operationPerson/detail/:configId/:personId',
                    component: './operations/operationEntManage/operationPerson/OperationPersonDetail',
                  },
              ]
              }, 
              {
                path: '/operations/CommandDispatchReport/details/:TaskID/:DGIMN',
                name: 'CommandDispatchReportDetails',
                component: './EmergencyTodoList/EmergencyDetailInfoLayout',
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
                      name: 'userAuthority',
                      path: '/rolesmanager/user/userAuthority',
                      component: './authorized/userAuthority',
                    },
                    {
                      name: 'newUserInfo',
                      path: '/rolesmanager/user/newUserInfo',
                      component: './authorized/newUser',
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
                  name: 'userRecovery', //用户恢复
                  path: '/rolesmanager/userRecovery',
                  component: './authorized/userRecovery',
                },
              ],
            }, // {
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
              name: 'dataquerymanager',
              path: '/dataquerymanager',
              routes: [
                {
                  path: '/dataquerymanager',
                  redirect: '/monitoring/dataquerymanager/exceptionrecord',
                },

                {
                  name: 'overrecord',
                  path: '/dataquerymanager/overrecord',
                  component: './monitoring/overRecord',
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
              ],
            },


            {//异常追忆 重定向
              path: '/abnormaRecall', 
              redirect: '/monitoring/outputstopmanage/OutputStopNew',
            },
            {
              path: '/abnormaRecall/abnormalDataManage', ///异常数据处置 重定向
              redirect: '/monitoring/outputstopmanage/OutputStopNew',
            },  
            {
              path: '/abnormaRecall/abnormalDataAnalysis', ///异常数据分析 重定向
              redirect: '/dataSearch/exceedData',
            },  
            {
              path: '/abnormaRecall/exceptionRule', ///异常规则 重定向
              redirect: '/platformconfig/monitoringstandard',
            }, 

           
            { //监督核查 重定向 
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
            
            { //资产管理 重定向 
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
                  redirect: '/monitoring/dataquery',
                },
                
                {
                  path: '/monitoring/nuclearEmission', //碳排放核酸 重定向
                  redirect: '/monitoring/dataquery',
                },
                {
                  name: 'monitoringDataquery',//监控数据
                  path: '/monitoring/dataquery',
                  component: './monitoring/dataquery/index',
                },
                

                {
                  name: 'outputstopmanage',
                  path: '/monitoring/outputstopmanage/:configId',
                  component: './platformManager/outputstopManager/',
                },
                {
                  name: 'exceptionrecord',
                  path: '/monitoring/missingData/exceptionrecord',
                  // component: './monitoring/exceptionrecord',
                  component: './monitoring/exceptionrecordNew',
                },
                {
                  name: 'exceptionrecordCityLevel', //异常数据报警 城市级页面
                  path: '/monitoring/missingData/exceptionrecord/cityLevel',
                  component: './monitoring/exceptionrecordNew/cityLevel',
                },
                
                {
                  name: 'exceptionrecordDetails',
                  path: '/monitoring/missingData/exceptionrecord/details',
                  component: './monitoring/exceptionrecordNew/RegionDetails',
                },
                {
                  name: 'alarmrecord',
                  path: '/monitoring/alarmrecord',
                  component: './monitoring/alarmrecord/index',
                },
                // 企业异常上报
                {
                  name: 'entExceptionReported',
                  path: '/monitoring/entExceptionReported',
                  component: './monitoring/entExceptionReported',
                },
                {
                  name: 'realtimedata',
                  path: '/monitoring/realtimedata',
                  component: './monitoring/realtimedata',
                }, // 数据一览 - 实时
                // 实时监控 - 企业
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
                {
                  name: 'realtimeDataView',
                  path: '/monitoring/mapview/realtimeDataView',
                  component: './monitoring/overView/realtime',
                },
                {
                  name: 'datalist',
                  path: '/monitoring/mapview/datalist',
                  component: './monitoring/overView',
                },
                {
                  name: 'mapview',
                  path: '/monitoring/mapview',
                  // component: './monitoring/mapview',
                  component: './newHome/ElectronicMap',
                },
                {
                  name: 'videopreview',
                  path: '/monitoring/videopreview',
                  component: `${
                    config.VideoServer === 0
                      ? './monitoring/videopreview/hkvideo/index'
                      : './monitoring/videopreview/ysyvideo/index'
                  }`,
                },
                {
                  name: 'realtimedata',
                  path: '/monitoring/realtimedata',
                  component: './monitoring/realtimedata',
                },

                {
                  path: '/monitoring/videoMonitor',
                  redirect: '/monitoring/videoMonitor/ent',
                },
                {
                  name: 'videoMonitor',
                  path: '/monitoring/videoMonitor/videopreview',
                  component: `${
                    config.VideoServer === 0
                      ? './monitoring/videoMonitor/videopreview/hkvideo'
                      : './monitoring/videoMonitor/videopreview/ysyvideo'
                  }`,
                },
                {
                  //视频监控 企业
                  path: '/monitoring/videoMonitor/ent',
                  component: './monitoring/videoMonitor/ent',
                },
                {
                  //视频监控 大气
                  path: '/monitoring/videoMonitor/air',
                  component: './monitoring/videoMonitor/air',
                },
                {
                  //缺失数据报警  企业
                  path: '/monitoring/missingData/ent',
                  component: './monitoring/missingData/ent',
                },
                {
                  //缺失数据报警 空气站
                  path: '/monitoring/missingData/air',
                  component: './monitoring/missingData/air',
                },
                {
                  //缺失数据报警  城市级别 企业
                  path: '/monitoring/missingData/cityLevel/ent',
                  component: './monitoring/missingData/cityLevel/index',
                },
                {
                  //缺失数据报警 城市级别 空气站
                  path: '/monitoring/missingData/cityLevel/air',
                  component: './monitoring/missingData/cityLevel/index',
                },
                {
                  //缺失数据报警 二级页面
                  path: '/monitoring/missingData/missDataSecond',
                  component: './monitoring/missingData/missDataSecond',
                },
                    {
                      name: 'alarmrecord',
                      path: '/alarmmanager/alarmrecord',
                      component: './monitoring/alarmrecord/AlarmRecordList',
                    },
                    {
                      name: 'alarmverifyrecord',
                      path: '/alarmmanager/alarmverifyrecord/ExceptionVerify',
                      component: './monitoring/alarmverifyrecord/index',
                    },
                    {
                      name: 'exceedDataAlarmRecord', //超标数据报警核实记录查询
                      path: '/monitoring/missingData/exceedDataAlarmRecord',
                      component: './dataSearch/exceedDataAlarmRecord/exceedDataAlarm',
                    },
                    {
                      name: 'exceedDataDispositionRecord', //超标数据报警处置记录查询
                      path: '/monitoring/missingData/exceedDataDispositionRecord',
                      component: './dataSearch/exceedDataDispositionRecord/exceedDataDispositionRecord',
                    },
                    {
                      name: 'originaldata',
                      path: '/monitoring/missingData/originaldata',
                      component: './monitoring/originaldata',
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
                {
                  name: 'manualuploadauto',
                  path: '/platformconfig/manualuploadauto/',
                  component: './platformManager/manualuploadauto',
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
                }, // 标准库管理
                {
                  name: 'StandardLibrary',
                  path: '/platformconfig/StandardLibrary',
                  component: './platformManager/standardLibrary',
                }, // 添加标准库
                {
                  name: 'addLibrary',
                  path: '/platformconfig/StandardLibrary/addLibrary',
                  component: './platformManager/standardLibrary/AddLibrary',
                }, // 编辑标准库
                {
                  name: 'editLibrary',
                  path: '/platformconfig/StandardLibrary/editLibrary/:id/:cuid',
                  component: './platformManager/standardLibrary/AddLibrary',
                }, // 编辑标准库
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
                }, //停产管理
                {
                  name: 'outputstopmanage',
                  path: '/platformconfig/outputstopmanage/:configId',
                  component: './platformManager/outputstopManager/',
                },
              ],
            },
            // {  //监控中心  视频监控
            //   path: '/monitorCenter',
            //   name: 'MonitorCenter',
            //   routes: [
            //     {
            //       path: '/monitorCenter/videoMonitor',
            //       redirect: '/monitorCenter/videoMonitor/ent',
            //     },
            //     {
            //       //视频监控 企业
            //       path: '/monitorCenter/videoMonitor/ent',
            //       component: './monitorCenter/videoMonitor/ent',
            //     },
            //     {
            //       //视频监控 大气
            //       path: '/monitorCenter/videoMonitor/air',
            //       component: './monitorCenter/videoMonitor/air',
            //     },
            //     {
            //       //缺失数据报警 企业
            //       path: '/monitorCenter/missingData/ent',
            //       component: './monitorCenter/missingData/ent',
            //     },
            //     {
            //       //缺失数据报警 空气站
            //       path: '/monitorCenter/missingData/air',
            //       component: './monitorCenter/missingData/air',
            //     },
            //     {
            //       //缺失数据报警 二级页面
            //       path: '/monitorCenter/missingData/missDataSecond',
            //       component: './monitorCenter/missingData/missDataSecond',
            //     },
            //   ],

            // },
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
                    }, // 数据上报列表
                    {
                      name: 'DataReporting',
                      path:
                        '/Intelligentanalysis/SewagePlant/DataReporting/:configId/:monitortime/:entcode',
                      ///:monitortime/:entcode
                      component: './platformManager/dataReport/',
                    }, // 数据上报添加或修改
                    {
                      name: 'DataReportingAdd',
                      path:
                        '/Intelligentanalysis/SewagePlant/DataReportingAdd/:configId/:id/:monitortime/:entcode',
                      component: './platformManager/dataReport/components/addDataReport',
                    }, //统计报表
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
                      ///:monitortime/:entcode
                      component: './platformManager/dataReport/components/dataReportView',
                    },
                  ],
                }, // {
                //   name: 'Intelligentanalysis',
                //   path: '/Intelligentanalysis/transmissionefficiency',
                //   component: './Intelligentanalysis/transmissionefficiency/entIndex',
                // },
                {
                  name: 'ChaoStatistic',
                  path: '/Intelligentanalysis/chaoStatistics',
                  component: './IntelligentAnalysis/chaoStatistics',
                },
                //质控数据总览 重定向
                {
                  name: 'Intelligentanalysis',
                  path: '/Intelligentanalysis/transmissionefficiency/cityLevel',
                  component: './Intelligentanalysis/newTransmissionefficiency/CityLevel',
                },
                //传输有效率 城市级别
                {
                  path: '/wholeProcessMonitoring/qualitycontrolData',
                  redirect: '/Intelligentanalysis/transmissionefficiency',
                },
                {
                  name: 'Intelligentanalysis',
                  path: '/Intelligentanalysis/transmissionefficiency',
                  component: './Intelligentanalysis/newTransmissionefficiency/entIndex',
                },
                {
                  name: 'Intelligentanalysis',
                  path: '/Intelligentanalysis/transmissionefficiency/qutDetail',
                  component: './Intelligentanalysis/newTransmissionefficiency/qutPage',
                },
                {
                  name: 'emissions',
                  path: '/Intelligentanalysis/emissions',
                  // component: './Intelligentanalysis/emissions',
                  routes: [
                    {
                      path: '/Intelligentanalysis/emissions',
                      redirect: '/Intelligentanalysis/emissions/gas',
                    },
                    {
                      // 废气排放量统计
                      name: 'gas',
                      path: '/Intelligentanalysis/emissions/gas',
                      component: './IntelligentAnalysis/emissions/Gas',
                    },
                    {
                      // 废水排放量统计
                      name: 'water',
                      path: '/Intelligentanalysis/emissions/waterEmissions',
                      component: './IntelligentAnalysis/emissions/Water',
                    },
                    {
                      // 废气排放量对比统计
                      name: 'gasContrast',
                      path: '/Intelligentanalysis/emissions/gasContrast',
                      component: './IntelligentAnalysis/emissions/GasContrast',
                    },
                    {
                      // 废水排放量对比统计
                      name: 'water',
                      path: '/Intelligentanalysis/emissions/waterContrast',
                      component: './IntelligentAnalysis/emissions/WaterContrast',
                    },
                  ],
                },
                {
                 name:'aqi',
                 path:'/Intelligentanalysis/aqi',
                },
                {
                  name: 'effluentFee',
                  path: '/Intelligentanalysis/aqi',
                  redirect: '/Intelligentanalysis/aqi/effluentFee',
                }, // 单站多参对比分析
                {
                  name: 'effluentFee',
                  path: '/Intelligentanalysis/aqi/effluentFee',
                  component: './Intelligentanalysis/effluentFee',
                }, // 单站多参对比分析
                {
                  name: 'siteParamsPage',
                  path: '/Intelligentanalysis/aqi/siteParamsPage/:type',
                  component: './dataAnalyze/SiteParamsPage',
                }, // 多站多参对比分析
                {
                  name: 'multiSiteParamsPage',
                  path: '/Intelligentanalysis/aqi/multiSiteParamsPage/:type',
                  component: './dataAnalyze/MultiSiteParamsPage',
                }, // 数据获取率
                {
                  name: 'dataGainRate',
                  path: '/Intelligentanalysis/dataGainRatePage',
                  component: './dataAnalyze/DataGainRatePage',
                }, // 数据获取率`

                {
                  name: 'quartDataCaptureRate',
                  path: '/Intelligentanalysis/quartDataCaptureRate',
                  component: './dataAnalyze/QuartDataCaptureRate',
                }, //污水处理分析
                {
                  path: '/Intelligentanalysis/sewageDisposal',
                  name: 'SewageDisposal',
                  routes: [
                    {
                      path: '/Intelligentanalysis/sewageDisposal',
                      redirect: '/Intelligentanalysis/sewageDisposal/removalRate',
                    },
                    {
                      //去除率分析
                      path: '/Intelligentanalysis/sewageDisposal/removalRate',
                      component: './Intelligentanalysis/sewageDisposal/removalRate',
                    },
                    {
                      //流量分析
                      path: '/Intelligentanalysis/sewageDisposal/flow',
                      component: './Intelligentanalysis/sewageDisposal/flow',
                    },
                  ],
                },
                {
                  //排放量分析
                  path: '/Intelligentanalysis/emissionsStatistics',
                  name: 'EmissionsStatistics',
                  routes: [
                    {
                      path: '/Intelligentanalysis/emissionsStatistics',
                      redirect: '/Intelligentanalysis/emissionsStatistics/emissionsChange',
                    },
                    {
                      //排放量变化统计
                      path: '/Intelligentanalysis/emissionsStatistics/emissionsChange',
                      component: './Intelligentanalysis/emissionsStatistics/emissionsChange',
                    },
                  ],
                },

                //数据报警统计
                {
                  path: '/Intelligentanalysis/dataAlarm',
                  name: 'dataAlarm',
                  routes: [
                    /* 缺失数据报警统计 */
                    {
                      path: '/Intelligentanalysis/dataAlarm',
                      redirect: '/Intelligentanalysis/dataAlarm/missingData/ent',
                    },

                    /* 缺失数据报警响应率 */

                    {
                      //缺失数据报警响应率 企业
                      path: '/Intelligentanalysis/dataAlarm/missingDataRate/ent',
                      component: './Intelligentanalysis/dataAlarm/missingDataRate/ent',
                    },
                    {
                      //缺失数据报警响应率 企业  城市级别
                      path: '/Intelligentanalysis/dataAlarm/missingDataRate/ent/citylevel',
                      component: './Intelligentanalysis/dataAlarm/missingDataRate/ent/Citylevel',
                    },
                    {
                      //缺失数据报警响应率 空气站
                      path: '/Intelligentanalysis/dataAlarm/missingDataRate/air',
                      component: './Intelligentanalysis/dataAlarm/missingDataRate/air',
                    },
                    {
                      //缺失数据报警响应率 空气站  城市级别
                      path: '/Intelligentanalysis/dataAlarm/missingDataRate/air/citylevel',
                      component: './Intelligentanalysis/dataAlarm/missingDataRate/air/Citylevel',
                    },
                    {
                      //缺失数据报警响应率 二级页面
                      path: '/Intelligentanalysis/dataAlarm/missingDataRate/missRateDataSecond',
                      component:
                        './Intelligentanalysis/dataAlarm/missingDataRate/missRateDataSecond',
                    },
                    {
                      //超标数据核实率
                      path: '/Intelligentanalysis/dataAlarm/overVerifyRate',
                      component: './Intelligentanalysis/dataAlarm/overVerifyRate',
                    },
                    {
                      //超标数据核实率  城市级别
                      path: '/Intelligentanalysis/dataAlarm/overVerifyRate/cityLevel',
                      component: './Intelligentanalysis/dataAlarm/overVerifyRate',
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
                      // 数据异常报警响应率
                      path: '/Intelligentanalysis/dataAlarm/abnormal/details',
                      component: './IntelligentAnalysis/dataAlarm/abnormalResRate/RegionDetails',
                    },
                    {
                      //超标数据核实率二级页面
                      path: '/Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                      component: './Intelligentanalysis/dataAlarm/overVerifyRate/pointVerifyRate',
                    },
                    {
                      //超标报警处置率
                      name: 'overAlarmDisposalRate',
                      path: '/Intelligentanalysis/dataAlarm/baojing/4',
                      component: './dataAnalyze/overAlarmDisposalRate',
                    },
                    {
                      //超标报警处置率-二级
                      name: 'RegionOverAlarmDisposalRate',
                      path:
                        '/Intelligentanalysis/dataAlarm/baojing/4/overAlarmDisposalRate/RegionOverAlarmDisposalRate',
                      component: './dataAnalyze/overAlarmDisposalRate/RegionOverAlarmDisposalRate',
                    },
                  ],
                },

                //统计-运维工单
                {
                  path: '/Intelligentanalysis/operationWorkStatis',
                  name: 'operationWorkStatis',
                  routes: [
                    {
                      // 运维工单统计（企业）
                      path: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics',
                      // component: './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics',
                      component: './Intelligentanalysis/planWorkOrderStatistics',
                    },
                    // {
                    //   // 运维工单统计（企业） 城市级别
                    //   path: '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/cityLevel',
                    //   component: './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics',
                    // },

                    // {
                    //   //行政区运维工单统计（企业）
                    //   path:
                    //     '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',
                    //   component:
                    //     './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/RegionStaticstics',
                    // },
                    // {
                    //   //企业运维工单统计（企业）
                    //   path:
                    //     '/Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/EntStaticstics',
                    //   component:
                    //     './Intelligentanalysis/operationWorkStatis/entWorkOrderStatistics/EntStaticstics',
                    // },
                    /* 缺失台账工单统计 空气站*/
                    // {
                    //   path: '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                    //   component: './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                    // },
                    /* 缺失台账工单统计 空气站 城市级别*/
                    // {
                    //   path: '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/citylevel',
                    //   component: './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics',
                    // },
                    /* 缺失台账工单详情 空气站 */
                    // {
                    //   path:
                    //     '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
                    //   component:
                    //     './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsDetails',
                    // },
                    /* 缺失台账照片统计 */
                    // {
                    //   path:
                    //     '/Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
                    //   component:
                    //     './Intelligentanalysis/operationWorkStatis/noAccountAirStatistics/noAccountAirStatisticsPhoto',
                    // },
                    {
                      name: 'noAccountStatisticsEnt', //无台账上传统计 企业
                      path: '/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent',
                      component:
                        './Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent',
                    },
                    {
                      name: 'noAccountStatisticsEnt', //无台账上传统计 企业  城市级别
                      path: '/Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent/cityLevel',
                      component:
                        './Intelligentanalysis/operationWorkStatis/noAccountStatistics/ent',
                    },
                    // {
                    //   /** 运维工单统计-空气站 */
                    //   name: 'AirWorkOrderStatistics',
                    //   path: '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation/cityLevel',
                    //   component:
                    //     './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics/CityLevel',
                    // },
                    // {
                    //   /** 运维工单统计-空气站  城市级别*/ 
                    //   name: 'AirWorkOrderStatistics',
                    //   path: '/Intelligentanalysis/operationWorkStatis/AirQualityMonitoringStation',
                    //   component:
                    //     './IntelligentAnalysis/operationalWorkOrder/airWorkOrderStatistics',
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
                    { //异常工单统计
                      name: 'abnormalWorkStatistics',
                      path: '/Intelligentanalysis/operationWorkStatis/abnormalWorkStatistics',
                      component: './Intelligentanalysis/abnormalWorkStatistics',
                    },
                    { //异常工单统计 市一级
                      name: 'abnormalWorkStatisticsDetail',
                      path: '/Intelligentanalysis/operationWorkStatis/abnormalWorkStatistics/regionDetail',
                      component: './Intelligentanalysis/abnormalWorkStatistics/regionDetail',
                    },
                  ],
                },


                {
                  //空气质量状况统计
                  name: 'airQualityStatistics',
                  path: '/Intelligentanalysis/airQualityStatistics',
                  component: './Intelligentanalysis/airQualityStatistics/air',
                },
                { //运维区域账户访问率统计 大区
                  name: 'AccessStatistics',
                  path: '/Intelligentanalysis/accessStatistics',
                  component: './Intelligentanalysis/accessStatistics',
                },
                { //运维区域账户访问率统计 服务区
                  name: 'AccessStatistics',
                  path: '/Intelligentanalysis/accessStatistics/missDataSecond',
                  component: './Intelligentanalysis/accessStatistics/missDataSecond',
                },
                { //运维到期点位统计
                  name: 'operationExpirePoint',
                  path: '/Intelligentanalysis/operationExpirePoint',
                  component: './Intelligentanalysis/operationExpirePoint',
                },


              ],

              
            },
            {
              path: '/dataSearch',
              name: 'dataSearch',
              routes: [
                {
                  name: 'airDataquery',
                  path: '/dataSearch/dataquery/air',
                  component: './monitoring/dataquery/air',
                },
                {
                  path: '/dataSearch',
                  redirect: '/dataquery/defectData',
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
                  name: 'abnormalStandard', //异常标准
                  path: '/dataSearch/abnormalStandard',
                  component: './dataSearch/abnormalStandard',
                },
                {
                  name: 'dischargeStandard',
                  //排放标准
                  path: '/dataSearch/dischargeStandard',
                  component: './dataSearch/dischargeStandard',
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
                {
                  name: 'enterpriseMonitoringInquiry',
                  //企业监测点查询
                  path: '/dataSearch/enterpriseMonitoringInquiry',
                  component: './dataSearch/enterpriseMonitoringInquiry',
                },
                {
                  name: 'enterpriseMonitoringInquiry',
                  //企业监测点查询
                  path: '/dataSearch/enterpriseInquiryDetail/:RegionCode',
                  component: './dataSearch/enterpriseInquiryDetail',
                },
                {
                  name: 'airStation',
                  //空气站查询
                  path: '/dataSearch/airStation',
                  component: './dataSearch/airStation',
                },
                {
                  name: 'exceedData',
                  //超标数据查询
                  path: '/dataSearch/exceedData',
                  component: './dataSearch/exceedData',
                },
                //停运记录
                {
                  name: 'StopRecord',
                  path: '/dataSearch/StopRecord', 
                  component: './report/StopRecord/stopRecord',
                },
                {
                  name: 'entAbnormalRecord', //企业异常记录
                  path: '/dataSearch/entAbnormalRecord',
                  component: './dataSearch/entAbnormalRecord',
                },
                {
                  name: 'components', //弹框
                  path: '/dataSearch/DataModal',
                  component: './dataSearch/DataModal',
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
                  path: '/dataSearch/pollutantInfo', 
                  component: './dataSearch/pollutantInfo',
                },
                //项目信息
                {
                  name: 'ProjectInfo',
                  path: '/dataSearch/projectInfo', 
                  component: './dataSearch/projectInfo',
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
            }, // 智能质控
            {
              path: '/qualityControl',
              name: 'qualityControl',
              routes: [
                {
                  path: '/qualityControl',
                  redirect: '/qualityControl/remoteControl',
                }, // 质控管理
                {
                  name: 'qcaManager',
                  path: '/qualityControl/qcaManager',
                  routes: [
                    {
                      path: '/qualityControl/qcaManager',
                      redirect: '/qualityControl/qcaManager/maintainRecord',
                    }, // 运维人管理
                    {
                      name: 'QCAnalyzeOperator',
                      path: '/qualityControl/qcaManager/QCAnalyzeOperator',
                      component: './qualityControl/QCAnalyzeOperator',
                    }, // 质控仪维护记录
                    {
                      name: 'maintainRecord',
                      path: '/qualityControl/qcaManager/maintainRecord',
                      component: './qualityControl/maintainRecord',
                    }, // 质控仪管理
                    {
                      name: 'instrumentManage',
                      path: '/qualityControl/qcaManager/instrumentManage',
                      component: './qualityControl/instrumentManage',
                    }, // 质控仪 - 添加
                    {
                      name: 'instrumentAdd',
                      path: '/qualityControl/qcaManager/instrumentManage/add',
                      component: './qualityControl/instrumentManage/AddInstrument',
                    }, // 质控仪 - 编辑
                    {
                      name: 'instrumentEdit',
                      path: '/qualityControl/qcaManager/instrumentManage/edit/:id/:QCAMN',
                      component: './qualityControl/instrumentManage/AddInstrument',
                    }, // 质控仪 - 详情
                    {
                      name: 'instrumentView',
                      path: '/qualityControl/qcaManager/instrumentManage/view/:id',
                      component: './qualityControl/instrumentManage/ViewInstrument',
                    }, // 工作模式 - 列表
                    {
                      name: 'workPatternAdd',
                      path: '/qualityControl/qcaManager/workPattern',
                      component: './qualityControl/workPattern/index',
                    }, // 工作模式 - 添加
                    {
                      name: 'workPatternAdd',
                      path: '/qualityControl/qcaManager/workPattern/add',
                      component: './qualityControl/workPattern/Add',
                    }, // 工作模式 - 编辑
                    {
                      name: 'workPatternAdd',
                      path: '/qualityControl/qcaManager/workPattern/edit/:modelName',
                      component: './qualityControl/workPattern/Add',
                    },
                  ],
                }, // 质控记录
                {
                  name: 'qcaRecord',
                  path: '/qualityControl/qcaRecord',
                  routes: [
                    {
                      path: '/qualityControl/qcaRecord',
                      redirect: '/qualityControl/qcaRecord/operationRecords',
                    }, // 质控纪要
                    {
                      name: 'playback',
                      path: '/qualityControl/qcaRecord/playback',
                      component: './qualityControl/playback',
                    }, // 质控仪操作记录
                    {
                      name: 'operationRecords',
                      path: '/qualityControl/qcaRecord/operationRecords',
                      component: './qualityControl/operationRecords',
                    }, // 质控仪参数记录
                    {
                      name: 'paramsRecord',
                      path: '/qualityControl/qcaRecord/paramsRecord',
                      component: './qualityControl/paramsRecord',
                    }, //质控仪状态记录
                    {
                      name: 'statusRecord',
                      path: '/qualityControl/qcaRecord/statusRecord',
                      component: './qualityControl/statusRecord',
                    }, // 质控报警记录
                    {
                      name: 'alarmMessage',
                      path: '/qualityControl/qcaRecord/alarmMessage',
                      component: './qualityControl/alarmMessage',
                    },
                  ],
                }, //质控仪视频
                {
                  name: 'qcavideopreview',
                  path: '/qualityControl/qcavideopreview',
                  component: './qualityControl/qcavideopreview',
                }, // 远程质控
                {
                  name: 'remoteControl',
                  path: '/qualityControl/remoteControl',
                  component: './qualityControl/remoteControl',
                }, // 质控结果统计
                {
                  name: 'resultStatistics',
                  path: '/qualityControl/resultStatistics',
                  component: './qualityControl/resultStatistics',
                }, // 质控结果比对
                {
                  name: 'resultContrast',
                  path: '/qualityControl/resultContrast',
                  component: './qualityControl/resultContrast',
                }, // 质控结果实时比对
                {
                  name: 'realTimeContrast',
                  path: '/qualityControl/realTimeContrast',
                  component: './qualityControl/realTimeContrast',
                },
              ],
            },
            /* 任务详情 */
            {
              path: '/taskdetail/emergencydetailinfolayout/:TaskID/:DGIMN',
              component: './EmergencyTodoList/EmergencyDetailInfoLayout',
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api': {
      target: apiHost,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
    '/upload': {
      target: config.uploadHost,
      // 接口的域名
      changeOrigin: true,
      // 如果接口跨域，需要进行这个参数配置
      pathRewrite: {
        '^/upload/upload': '',
      }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
    '/uploadplantform': {
      target: config.uploadHost,
      // 接口的域名
      changeOrigin: true,
      // 如果接口跨域，需要进行这个参数配置
      pathRewrite: {
        '^/upload/upload': '',
      }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
  },
};
