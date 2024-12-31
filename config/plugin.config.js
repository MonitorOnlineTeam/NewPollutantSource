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

  // if (process.env.NODE_ENV === 'production') {
  //   const prodGzipList = ['js', 'css'];
  //   // 生产模式开启
  //   config.plugin('compression-webpack-plugin').use(
  //     new CompressionWebpackPlugin({
  //       // filename: 文件名称，这里我们不设置，让它保持和未压缩的文件同一个名称
  //       // algorithm: 'gzip', // 指定生成gzip格式
  //       // test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'), // 匹配哪些格式文件需要压缩
  //       // filename: '[path].gz[query]', //  使得多个.gz文件合并成一个文件，这种方式压缩后的文件少，建议使用
  //       algorithm: 'gzip', // 官方默认压缩算法也是gzip
  //       test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, // 使用正则给匹配到的文件做压缩，这里是给html、css、js以及字体（.ttf和.woff和.eot）做压缩
  //       threshold: 10240, //对超过10k的数据进行压缩
  //       minRatio: 0.8, // 压缩比例，值为0 ~ 1
  //       deleteOriginalAssets: false, //是否删除源文件
  //     }),
  //   );
  // }

  config
    .plugin('replace')
    .use(require('webpack').ContextReplacementPlugin)
    .tap(() => {
      return [/moment[/\\]locale$/, /zh-cn/];
    });

    config.optimization // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'all',
      minSize: 30000,
      minChunks: 3,
      automaticNameDelimiter: '.',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'all',
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
