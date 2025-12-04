const path = require("path");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const CompressionPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  devServer: {
      host: '0.0.0.0',
      allowedHosts: [
          'all',              // 等价于允许全部主机
          'dev.aop.sdk.he',   // 允许特定域名
          '.sdk.he'           // 允许所有 sdk.he 子域名

      ],
    proxy: {
      "/*": {
        target: "http://10.160.34.43:8000",
        changeOrigin: true,

      },
    },
    // ['/api']: {
    //   target: `http://127.0.0.1:8080/mock`,
    //   changeOrigin: true,
    //   pathRewrite: {
    //     ['^/api']: ''
    //   }
    // },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity, // 默认为3，调整为允许无限入口资源
        minSize: 20000, // 20K以下的依赖不做拆分
        cacheGroups: {
          "app-chunk-vendors": {
            name: "app-chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            priority: 60,
            chunks: "initial",
          },
          "vxe-table": {
            name: "vxe-table",
            test: /[\\/]vxe-table[\\/]/,
            priority: 90,
            chunks: "all",
          },
          "xe-utils": {
            name: "xe-utils",
            test: /[\\/]xe-utils[\\/]/,
            priority: 90,
            chunks: "all",
          },
          "vue-grid-layout": {
            name: "vue-grid-layout",
            test: /[\\/]vue-grid-layout[\\/]/,
            priority: 90,
            chunks: "all",
          },
          echarts: {
            name: "echarts",
            test: /[\\/]echarts[\\/]/,
            priority: 90,
            chunks: "all",
          },
        },
      },
    },
    devtool: "cheap-module-source-map",
    plugins: [
      // new BundleAnalyzerPlugin(),
      // new SpeedMeasurePlugin(),

      new HardSourceWebpackPlugin({
        root: process.cwd(),
        directories: [],
        environmentHash: {
          root: process.cwd(),
          directories: [],
          files: ["package.json", "yarn.lock"],
        },
        cachePrune: {
          // Caches younger than `maxAge` are not considered for deletion. They must
          // be at least this (default: 2 days) old in milliseconds.
          maxAge: 2 * 24 * 60 * 60 * 1000,
          // All caches together must be larger than `sizeThreshold` before any
          // caches will be deleted. Together they must be at least this
          // (default: 50 MB) big in bytes.
          sizeThreshold: 50 * 1024 * 1024,
        },
        test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        configHash: function (webpackConfig) {
          return `${process.env.VUE_APP_BASE_API}_${require("node-object-hash")(
            { sort: false }
          ).hash(webpackConfig)}`;
        },
      }),

      // new CompressionPlugin(),
      // test: /\.js(\?.*)?$/i,
      // filename: "[path]", //输出文件路径，这里是直接替换原文件
      // minRatio: 2, // 最低压缩率，压缩率低于这个才压缩，之所以设置大于1的数值是要压缩所有的文件
    ],
  },
  chainWebpack: (config) => {
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("layout", resolve("src/layout"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("store", resolve("src/store"))
      .set("utils", resolve("src/store"))
      .set("vendor", resolve("src/vendor"))
      .set("views", resolve("src/views"));
    // config.externals({
    // vue: "Vue",
    // 'vue-router': 'VueRouter',
    // axios: "axios",
    // "element-ui": "ELEMENT",
    // echarts: "echarts",
    // vxe: "vxe-table",
    // xe: "xe-utils",
    // swiper: 'swiper'
    // });
  },
};
