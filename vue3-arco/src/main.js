import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './router/permission';
import '@/styles/index.scss';
import '@arco-design/web-vue/dist/arco.css';
import { installArcoBridge } from './plugins/arco';

const app = createApp(App);
installArcoBridge(app);
app.use(store);
app.use(router);
app.mount('#app');
