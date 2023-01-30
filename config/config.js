import defaultSettings from './defaultSettings'; // https://umijs.org/config/
// import slash from 'slash2';
import webpackPlugin from './plugin.config';
import routes from './router.config.js'
import path from 'path'


// 新框架
const API_HOST = 'http://172.16.12.60:6001/';  // 测试 - 志鹏
// const API_HOST = 'http://61.50.135.114:6001/';  // 测试 - 志鹏
// const API_HOST = 'http://172.16.12.39:9090/';  // 唐银钢铁 - 开发
const CONSOLE_HOST = 'http://172.16.12.39:33622/';  // 
// const API_HOST = 'http://172.16.12.209:33688/';  // 霍达
// const API_HOST = 'http://172.16.9.3:33688/';  // 志鹏


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
  base: '/',
  publicPath: '/',
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: routes,
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
        context.resourcePath.includes('global.less') ||
        context.resourcePath.includes('ant.design.pro.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        // const arr = slash(antdProPath)
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  alias: {
    '@config': path.resolve(__dirname, '../config'),
    '@public': path.resolve(__dirname, '../public')
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/rest': {
      target: API_HOST,
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
    '/wwwroot': {
      target: API_HOST, // 接口的域名
      changeOrigin: true, //   
      // pathRewrite: { '^/wwwroot': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
    // 乐橙云
    '/openapi': {
      target: 'https://openapi.lechange.cn/', // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      // pathRewrite: { '^/wwwroot': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
    // 视频私有云服务器
    '/api': {
      target: 'http://172.16.12.135:18080/', // 接口的域名
      // target: API_HOST, // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      // pathRewrite: { '^/wwwroot': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
    // 采集
    '/DataCollect': {
      target: 'http://172.16.12.39:33622/', // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      pathRewrite: { '^/DataCollect': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
    // 定时任务
    '/DataStatis': {
      target: 'http://172.16.12.39:33623/', // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      pathRewrite: { '^/DataStatis': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
    // 转发
    '/DataTransmit': {
      target: 'http://172.16.12.39:33624/', // 接口的域名
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      pathRewrite: { '^/DataTransmit': '' }, // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
    },
  },
};
