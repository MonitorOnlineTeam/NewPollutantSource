import ThemeColorReplacer from 'webpack-theme-color-replacer';
import generate from '@ant-design/colors/lib/generate';
import path from 'path';

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName; // handle tree shaking

  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}

export default config => {
  // preview.pro.ant.design only do not use in your production;
  if (
    process.env.ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ||
    process.env.NODE_ENV !== 'production'
  ) {
    config.plugin('webpack-theme-color-replacer').use(ThemeColorReplacer, [
      {
        fileName: 'css/theme-colors-[contenthash:8].css',
        matchColors: getAntdSerials('#1890ff'),

        // 主色系列
        // 改变样式选择器，解决样式覆盖问题
        changeSelector(selector) {
          switch (selector) {
            case '.ant-calendar-today .ant-calendar-date':
              return ':not(.ant-calendar-selected-date)' + selector;

            case '.ant-btn:focus,.ant-btn:hover':
              return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)';

            case '.ant-btn.active,.ant-btn:active':
              return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)';

            default:
              return selector;
          }
        },
      },
    ]);
  } // optimize chunks
  // 　　maxAsyncRequests和maxInitialRequests有相似之处，它俩都是用来限制拆分数量的，
  //    maxInitialRequests是用来限制入口的拆分数量而maxAsyncRequests是用来限制异步模块内部的并行最大请求数的
  config.optimization // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      // chunks: 'async',
      chunks: 'all',// initial、async和all  'initial" | "all"(推荐) | "async" (默认就是async)
      name: 'vendors',
      // maxInitialRequests: Infinity,
      maxInitialRequests: 6, //表示允许入口并行加载的最大请求数 默认是5
      maxAsyncRequests: 11, // 按需引入的包中并行请求的最大数量 默认是3
      // minSize: 0,
      // minChunks: 2, // 引入两次及以上被打包
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module);
            if (packageName) {
              return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
            }

            return false;
          },

          name(module) {
            const packageName = getModulePackageName(module);

            if (packageName) {
              if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
            }

            return 'misc';
          },
          chunks: 'all'
          // priority: -20, // 优先级
        },        
         basicsUmi: { // 同步加载基础框架  umi里面的东西  同步加载
          test: /(react|react-dom|react-dom-router|babel-polyfill|mobx|lodash|draft-js|immutable)/,
          priority: 200,
          name: 'basicsUmi',
          chunks: 'all'
         },
         antdUmi: {
          // || /[\\/]node_modules[\\/]/.test(module.context)
          test:/(antd)/,
          name: 'antdUmi',
          priority: 100,
          chunks: 'all'
        },
        antdDesignUmi: {
          test:/(@ant-design)/,
          name: 'antdDesignUmi',
          priority: 50,
          chunks: 'all'
        },
         echartsVenodr: { // 异步按需加载echarts包  Venodr里面的东西  减少首次加载压力
          test: /(echarts)/,
          priority: 100, // 优先级
          name: 'echartsVenodr',
          chunks: 'async'
         },
         jqueryVenodr: { 
          test: /(jquery)/,
          priority: 80,
          name: 'jqueryVenodr',
          chunks: 'async'
         }, 
         zrenderVenodr: { 
          test: /(zrender)/,
          priority: 80,
          name: 'zrenderVenodr',
          chunks: 'async'
         }, 
         rcPickerVenodr: { 
          test: /(rc-picker)/,
          priority: 80,
          name: 'rcPickerVenodr',
          chunks: 'async'
         }, 
      },
    });
};

const getAntdSerials = color => {
  const lightNum = 9;
  const devide10 = 10; // 淡化（即less的tint）

  const lightens = new Array(lightNum).fill(undefined).map((_, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / devide10);
  });
  const colorPalettes = generate(color);
  return lightens.concat(colorPalettes);
};