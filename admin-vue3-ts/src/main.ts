import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router';
import { directive } from '@/directive/index';
import { i18n } from '@/i18n/index';
import other from '@/utils/other';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';

// 创建vue实例
const app = createApp(App)

directive(app);
other.elSvg(app);

// 挂载pinia
app.use(store)
app.use(router);


// 挂载实例
app.use(ElementPlus, { i18n: i18n.global.t }).use(i18n).use(VueGridLayout).mount('#app');