/*
 * @Author: shawnxiao 597035529@qq.com
 * @Date: 2022-11-26 22:59:57
 * @LastEditors: shawnxiao 597035529@qq.com
 * @LastEditTime: 2022-11-27 14:56:45
 * @FilePath: \react\react18-vite3-ts-antd4\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'
import vitePluginImp from 'vite-plugin-imp'
import { wrapperEnv } from './src/utils/getEnv'
import { visualizer } from 'rollup-plugin-visualizer'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'
import eslintPlugin from 'vite-plugin-eslint'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv): UserConfig => {
  const env = loadEnv(mode.mode, process.cwd())
  const viteEnv = wrapperEnv(env)

  return {
    plugins: [
      react(),
      // antd 按需加载
      vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style(name) {
              return `antd/es/${name}/style/index.less`
            }
          }
        ]
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: viteEnv.VITE_GLOB_APP_TITLE
          }
        }
      }),
      // * 使用 svg 图标
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      // * EsLint 报错信息显示在浏览器界面上
      eslintPlugin(),
      // * 是否生成包预览
      viteEnv.VITE_REPORT && visualizer(),
      // * gzip compress
      viteEnv.VITE_BUILD_GZIP &&
        viteCompression({
          verbose: true,
          disable: false,
          threshold: 10240,
          algorithm: 'gzip',
          ext: '.gz'
        }),
      viteMockServe({
        mockPath: './src/mock', // 解析mock文件的位置
        localEnabled: true // 是否开启开发环境
      }) // add mock support
    ],
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    // build configure
    build: {
      target: 'es2015',
      outDir: 'dist',
      // esbuild 打包更快，但是不能去除 console.log，去除 console 使用 terser 模式
      minify: 'esbuild',
      // minify: "terser",
      // terserOptions: {
      // 	compress: {
      // 		drop_console: viteEnv.VITE_DROP_CONSOLE,
      // 		drop_debugger: true
      // 	}
      // },
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: 'assets/js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'assets/js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'), // 根路径
        '@': path.resolve(__dirname, 'src') // src 路径
      }
    },
    server: {
      host: '0.0.0.0', // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // https: true,
      // 代理跨域（mock 不需要配置，这里只是个事列）
      proxy: {
        '^/proxy/.*': {
          target: 'http://127.0.0.1:9527', // easymock
          changeOrigin: true,
          rewrite: path => path.replace(/^\/proxy/, '')
        },
        '/uploads': {
          target: 'http://localhost:3001',
          changeOrigin: true
        }
      }
    },
    css: {
      // global css
      preprocessorOptions: {
        less: {
          javascriptEnabled: true, // 支持内联 JavaScript
          // 方式1
          // modifyVars: {
          //   'primary-color': '#ff3636',
          // },
          // 方式2
          // modifyVars: {
          //   hack: `true; @import "${path.resolve(__dirname, 'src/styles/var.less')}"`,
          // },
          additionalData: '@import "@/styles/var.less";'
        }
      },
      modules: {
        localsConvention: 'camelCase'
      }
    }
    // optimizeDeps: {
    //   include: ['react', 'react-dom', 'axios']
    // }
  }
})
