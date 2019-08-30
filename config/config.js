import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
import config from '@/config';

const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

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
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
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
            { path: '/', redirect: './monitoring/datalist' },
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
              path: '/platformconfig',
              name: 'platformconfig',
              routes: [
                {
                  path: '/platformconfig',
                  redirect: '/platformconfig/monitortarget/AEnterpriseTest',
                },
                {
                  name: 'monitortarget',
                  path: '/platformconfig/monitortarget/:configId/:targetType',
                  component: './platformManager/monitortarget',
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
                  component: './platformManager/hkvideo/HkShowVideo',
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
                  name: 'vehiclemanage',
                  path: '/platformconfig/vehiclemanage/:configId',
                  component: './OperationSysManager/VehicleManage/',
                },
                {
                  name: 'equipmentinfomanage',
                  path: '/platformconfig/equipmentinfomanage/:configId',
                  component: './OperationSysManager/EquipmentInfoManage/',
                },
                {
                  name: 'certificatemanage',
                  path: '/platformconfig/certificatemanage/:configId',
                  component: './OperationSysManager/CertificateManage/',
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
                  path: "/operations/vehicleApplication",
                  name: "vehicleApplication",
                  component: "./operations/VehicleApplication"
                },
                {
                  path: "/operations/vehicleApprove",
                  name: "vehicleApprove",
                  component: "./operations/VehicleApprove"
                },
                {
                  path: '/operations/operationRecord',
                  name: "operationRecord",
                  component: "./operations/operationRecord"
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
              path: '/monitoring',
              name: 'monitoring',
              routes: [
                {
                  name: 'realtimedata',
                  path: '/monitoring/realtimedata',
                  component: './monitoring/realtimedata',

                },
                {
                  name: 'datalist',
                  path: '/monitoring/datalist',
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
                  component: `${config.VideoServer === 0 ? './platformManager/hkvideo/HkCameraIndex' : './monitoring/videopreview/ysyvideo/index'}`,
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

              ],
            },
            {
              path: '/dataquery',
              name: 'dataquery',
              routes: [
                {
                  path: '/dataquery',
                  redirect: '/dataquery/dataquery',
                },
                {
                  name: 'dataquery',
                  path: '/dataquery/dataquery',
                  component: './monitoring/dataquery/index',
                },
                {
                  name: 'exceptionrecord',
                  path: '/dataquery/exceptionrecord',
                  component: './monitoring/exceptionrecord',
                },
                {
                  name: 'overrecord',
                  path: '/dataquery/overrecord',
                  component: './monitoring/overRecord',
                },
                {
                  name: 'alarmrecord',
                  path: '/dataquery/alarmrecord',
                  component: './monitoring/alarmrecord/index',
                },
                {
                  name: 'originaldata',
                  path: '/dataquery/originaldata',
                  component: './monitoring/originaldata',
                },
                {
                  name: 'alarmverifyrecord',
                  path: '/dataquery/alarmverifyrecord',
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
