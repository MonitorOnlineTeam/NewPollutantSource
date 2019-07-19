import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
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
            { path: '/', redirect: './rolesmanager/user/userinfoindex/UserInfo' },
            {
              name: 'test',
              path: '/test',
              component: './Test/Test',
            },
            {
              path: '/autoformmanager',
              name: 'AutoFormManager',
              routes: [
                {
                  name: 'index',
                  path: '/autoformmanager/:configId',
                  component: './AutoFormManager',
                },
                {
                  name: 'add',
                  path: '/autoformmanager/autoformadd/:configId',
                  component: './AutoFormManager/AutoFormAdd',
                },
                {
                  name: 'edit',
                  path: '/autoformmanager/autoformedit/:configId/:keysParams/:uid',
                  component: './AutoFormManager/AutoFormEdit',
                },
                {
                  name: 'view',
                  path: '/autoformmanager/autoformview/:configId/:keysParams',
                  component: './AutoFormManager/AutoFormView',
                },
              ],
            },
            {
              path: '/platformconfig',
              name: 'platformconfig',
              routes: [
                {
                  name: 'monitortarget',
                  path: '/platformconfig/monitortarget/:configId',
                  component: './platformManager/enterprise',
                },
                {
                  name: 'monitorpoint',
                  path:
                    '/platformconfig/monitortarget/monitorpoint/:configId/:targetId/:targetName',
                  component: './platformManager/point',
                },
                {
                  name: 'usestandardlibrary',
                  path:
                    '/platformconfig/usestandardlibrary/:DGIMN/:PointName/:configId/:targetId/:targetName/:pollutantType',
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
                  component: './platformManager/ysyvideo/YsyShowVideo',
                },
              ],
            },
            {
              path: '/report',
              name: 'report',
              routes: [
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
              path: '/rolesmanager',
              name: 'rolesmanager',
              // redirect: './rolesmanager/user/userinfoindex/UserInfo',
              // component: './authorized/user',
              // authority: ['admin', 'user'],
              routes: [
                {
                  name: 'user',
                  path: '/rolesmanager/user',
                  routes: [
                    {
                      path: '/rolesmanager/user',
                      redirect: '/rolesmanager/user/userinfoindex/UserInfo'
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
            {
              path: '/overview',
              name: 'overview',
              // redirect: '/AutoFormManager',
              // component: './authorized/user',
              // authority: ['admin', 'user'],
              routes: [
                // {
                //   name: 'datalist',
                //   path: '/overview/datalist',
                //   routes:[
                {
                  name: 'index',
                  path: '/overview/datalist',
                  component: './overView',
                },
                //   ]
                // },
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
              ],
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
      target: 'http://172.16.9.52:8096/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    '/upload': {
      target: 'http://172.16.9.52:8096/', // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      pathRewrite: { '^/upload/upload': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
  },
};
