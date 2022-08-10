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
      chunks: 'async',
      minSize: 20000,
      minChunks: 1,
      maxSize: 0,
      name: true,
      maxAsyncRequests: 10,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      cacheGroups: {
        react: {
          name: "react",
          test: /[\\/]node_modules[\\/](react)[\\/]/,
          priority: -9,
          enforce: true,
        },
        reactDom: {
          name: "react-dom",
          test: /[\\/]node_modules[\\/](react-dom)[\\/]/,
          priority: -9,
          enforce: true,
        },
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          priority: -11,
          enforce: true,
        },
        antd: {
          name: "antd",
          test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
          priority: -10,
          enforce: true,
        },
        echarts: { // 1.27MB
          name: "echarts",
          test: /[\\/]node_modules[\\/](echarts|echarts-gl)[\\/]/,
          priority: 10,
          enforce: true,
        },
        lodash: {
          name: "lodash",
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          priority: -2,
        },
        bizcharts: { // 1.27MB
          name: "bizcharts",
          test: /[\\/]node_modules[\\/](BizCharts)[\\/]/,
          priority: 10,
          enforce: true,
        },
        antv: { // 1.27MB
          name: "antv",
          test: /[\\/]node_modules[\\/](bizcharts|@antv_data-set)[\\/]/,
          priority: 11,
          enforce: true,
        },
        antdesigns: { // 702KB
          name: "antdesigns",
          test: /[\\/]node_modules[\\/](@ant-design|antd|antd-mobile)[\\/]/,
          priority: 10,
          enforce: true,
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
