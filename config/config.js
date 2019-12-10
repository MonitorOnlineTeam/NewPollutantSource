import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import Cookie from 'js-cookie';
import slash from 'slash2';
import webpackPlugin from './plugin.config';
import config from '@/config';

const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const defaultNavigateUrl = Cookie.get("defaultNavigateUrl");
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
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
  base: "/",
  publicPath: "/",
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
        { path: '/hrefLogin', component: './user/login/hrefLogin' },
      ]
    },
    {


      path: '/',
      component: '../layouts/BlankLayout',
      routes: [

        {
          name: 'homepage',
          path: '/homepage',
          component: './home',
        },
        // appoperation
        {
          path: '/appoperation',
          component: '../layouts/BlankLayout',
          routes: [
            /* 维修记录 */
            { path: '/appoperation/apprepairrecord/:TaskID/:TypeID', component: './AppOperation/AppRepairRecord' },
            /* 停机记录 */
            { path: '/appoperation/appstopcemsrecord/:TaskID/:TypeID', component: './AppOperation/AppStopCemsRecord' },
            /* 易耗品更换记录 */
            { path: '/appoperation/appconsumablesreplacerecord/:TaskID/:TypeID', component: './AppOperation/AppConsumablesReplaceRecord' },
            /* 标气更换记录 */
            { path: '/appoperation/appstandardgasrepalcerecord/:TaskID/:TypeID', component: './AppOperation/AppStandardGasRepalceRecord' },
            /* 完全抽取法CEMS巡检记录表 */
            { path: '/appoperation/appcompleteextractionrecord/:TaskID/:TypeID', component: './AppOperation/AppCompleteExtractionRecord' },
            /* 稀释采样法CEMS巡检记录表 */
            { path: '/appoperation/appdilutionsamplingrecord/:TaskID/:TypeID', component: './AppOperation/AppDilutionSamplingRecord' },
            /* 直接测量法CEMS巡检记录表 */
            { path: '/appoperation/appdirectmeasurementrecord/:TaskID/:TypeID', component: './AppOperation/AppDirectMeasurementRecord' },
            /* CEMS零点量程漂移与校准记录表记录表 */
            { path: '/appoperation/appjzrecord/:TaskID/:TypeID', component: './AppOperation/AppJzRecord' },
            /* CEMS校验测试记录 */
            { path: '/appoperation/appbdtestrecord/:TaskID/:TypeID', component: './AppOperation/AppBdTestRecord' },
            /* CEMS设备异常记录表 */
            { path: '/appoperation/appdeviceexceptionrecord/:TaskID/:TypeID', component: './AppOperation/AppDeviceExceptionRecord' },
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
            { path: '/', redirect: defaultNavigateUrl },
            {
              name: 'test',
              path: '/test',
              component: './Test/Test',
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
                  path: '/:parentcode/:parentcode/autoformmanager/:configId/autoformedit/:keysParams/:uid',
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
              path: '/platformconfig',
              name: 'platformconfig',
              routes: [
                {
                  path: '/platformconfig',
                  redirect: '/platformconfig/monitortarget/AEnterpriseTest',
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
                  path: '/platformconfig/monitortarget/AEnterpriseTest/:targetType/dischargepermit/:configId/:EntCode/:EntName',
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
              ],
            },
            {
              path: '/report',
              name: 'report',
              routes: [
                {
                  path: '/report',
                  redirect: '/report/siteDaily',
                },
                {
                  name: 'dateReportPage',
                  path: '/report/:reportType',
                  component: './report/DateReportPage',
                },
                {
                  name: 'summaryReportPage',
                  path: '/report/summary/:reportType',
                  component: './report/summaryReportPage',
                },
              ],
            },
          
            {
              path: "/operations",
              name: "operations",
              routes: [
                {
                  path: '/operations',
                  redirect: '/operations/operationrecord',
                },
                {
                  path: '/operations/calendar',
                  name: "calendar",
                  // component: "./operations/CalendarPage",
                  routes: [
                    {
                      path: '/operations/calendar',
                      redirect: '/operations/calendar/index',
                    },
                    {
                      path: '/operations/calendar/index',
                      name: "index",
                      component: "./operations/CalendarPage",
                    },
                    {
                      path: '/operations/calendar/details/:TaskID/:DGIMN',
                      name: "calendar",
                      component: "./EmergencyTodoList/EmergencyDetailInfoLayout",
                    }
                  ]
                },
                
                {
                  path: '/operations/log',
                  name: "log",
                  component: "./operations/LogPage"
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
                  ]
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
                  ]
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
                      path: "/operations/carmanager/vehicleApplication",
                      name: "vehicleApplication",
                      component: "./operations/VehicleApplication",
                    },
                    {
                      path: "/operations/carmanager/:parentName/trajectory/:ApplicantID",
                      name: "trajectory",
                      component: "./operations/vehicleTrajectory"
                    },
                    {
                      path: "/operations/carmanager/vehicleApprove",
                      name: "vehicleApprove",
                      component: "./operations/VehicleApprove"
                    },
                    {
                      name: 'vehiclemanage',
                      path: '/operations/carmanager/vehiclemanage/:configId',
                      component: './OperationSysManager/VehicleManage/',
                    },
                  ]
                },

                {
                  path: '/operations/operationRecord',
                  name: "operationRecord",
                  component: "./operations/operationRecord"
                },
                {
                  path: '/operations/taskRecord',
                  name: "taskRecord",
                  component: "./operations/TaskRecord"
                },
                {
                  path: '/operations/:from/recordForm/:typeID/:taskID',
                  name: "recordForm",
                  component: "./operations/recordForm"
                },
                {
                  path: '/operations/recordForm/:typeID/:taskID',
                  name: "recordForm",
                  component: "./operations/recordForm"
                }
              ]
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
                  redirect: '/rolesmanager/user',
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
                  path: '/alarmmanager/alarmverifyrecord',
                  component: './monitoring/alarmverifyrecord/index',
                },
              ]
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
              ]
            },
            {
              path: '/monitoring',
              name: 'monitoring',
              routes: [
                {
                  path: '/monitoring',
                  redirect: '/monitoring/mapview',
                },
                {
                  name: 'realtimedata',
                  path: '/monitoring/realtimedata',
                  component: './monitoring/realtimedata',
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
                  component: `${config.VideoServer === 0 ? './monitoring/videopreview/hkvideo/index' : './monitoring/videopreview/ysyvideo/index'}`,
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
                {
                  name: 'exceptionrecord',
                  path: '/monitoring/exceptionrecord',
                  component: './monitoring/exceptionrecord',
                },
                {
                  name: 'overrecord',
                  path: '/monitoring/overrecord',
                  component: './monitoring/overRecord',
                },
                
               


              ],
            },
            {
              path: '/Intelligentanalysis',
              name: 'Intelligentanalysis',
              routes: [

                {
                  name: 'Intelligentanalysis',
                  path: '/Intelligentanalysis/transmissionefficiency',
                  component: './Intelligentanalysis/transmissionefficiency/entIndex',
                },
                {
                  name: 'Intelligentanalysis',
                  path: '/Intelligentanalysis/transmissionefficiency/point/:entcode/:entname',
                  component: './Intelligentanalysis/transmissionefficiency/pointIndex',
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
              ]
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
                // 质控仪管理
                {
                  name: 'instrumentManage',
                  path: '/qualityControl/instrumentManage',
                  component: './qualityControl/instrumentManage',
                },
                // 质控仪 - 添加
                {
                  name: 'instrumentAdd',
                  path: '/qualityControl/instrumentManage/add',
                  component: './qualityControl/instrumentManage/AddInstrument',
                },
                // 质控仪 - 编辑
                {
                  name: 'instrumentEdit',
                  path: '/qualityControl/instrumentManage/edit/:id',
                  component: './qualityControl/instrumentManage/AddInstrument',
                },
                // 质控仪 - 详情
                {
                  name: 'instrumentView',
                  path: '/qualityControl/instrumentManage/view/:id',
                  component: './qualityControl/instrumentManage/ViewInstrument',
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
                // 质控仪操作记录
                {
                  name: 'operationRecords',
                  path: '/qualityControl/operationRecords',
                  component: './qualityControl/operationRecords',
                },
                // 质控仪维护记录
                {
                  name: 'maintainRecord',
                  path: '/qualityControl/maintainRecord',
                  component: './qualityControl/maintainRecord',
                },
                // 质控仪参数记录s
                {
                  name: 'paramsRecord',
                  path: '/qualityControl/paramsRecord',
                  component: './qualityControl/paramsRecord',
                },
                //质控仪状态记录
                {
                  name: 'statusRecord',
                  path: '/qualityControl/statusRecord',
                  component: './qualityControl/statusRecord',
                },
                // 质控报警记录
                {
                  name: 'alarmMessage',
                  path: '/qualityControl/alarmMessage',
                  component: './qualityControl/alarmMessage',
                },
              ]
            },
            /* 任务详情 */
            { path: '/taskdetail/emergencydetailinfolayout/:TaskID/:DGIMN', component: './EmergencyTodoList/EmergencyDetailInfoLayout' },

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
      target: config.apiHost,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/upload': {
      target: config.uploadHost, // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      pathRewrite: { '^/upload/upload': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
  },
};
