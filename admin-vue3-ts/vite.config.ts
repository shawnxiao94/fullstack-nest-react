import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		resolve: {
			//设置别名
			alias: {
				'@': path.resolve(__dirname, 'src'),
				'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
			},
		},
		plugins: [vue(), vueSetupExtend()],
		root: process.cwd(),
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: [
				'element-plus/lib/locale/lang/zh-cn',
				'element-plus/lib/locale/lang/en',
				'element-plus/lib/locale/lang/zh-tw',
			],
		},
		server: {
			host: '0.0.0.0',
			port: env.VITE_PORT as unknown as number,
			open: env.VITE_OPEN,
			hmr: true,
			// 设置 https 代理
			proxy: {
				'/gitee': {
					target: 'https://gitee.com',
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/gitee/, ''),
				},
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
		},
	};
});
