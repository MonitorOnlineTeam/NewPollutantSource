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

  config.optimization // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      // chunks: 'async',
      chunks: 'all',// initial、async和all
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
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
        },
        echartsVenodr: { // 异步加载echarts包  Venodr里面的东西  同步加载
          test: /(echarts)/,
          priority: 100, // 高于async-commons优先级
          name: 'echartsVenodr',
          chunks: 'async'
         },
        //  thirdBigUmi: { // 同步加载大的第三方  umi里面的东西  同步加载
        //   test: /(jquery)/,
        //   priority: 80,
        //   name: 'thirdBigUmi',
        //   chunks: 'all'
        //  },         
        //  commonUmi: { // 同步加载基础框架  umi里面的东西  同步加载
        //   test: /(react|react-dom|react-dom-router|babel-polyfill|mobx|antd)/,
        //   priority: 80,
        //   name: 'commonUmi',
        //   chunks: 'all'
        //  },
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