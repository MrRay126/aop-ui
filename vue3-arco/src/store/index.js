import { createStore } from 'vuex';
import getters from './getters';

const modules = {};
const modulesFiles = import.meta.glob('./modules/*.js', { eager: true });
Object.keys(modulesFiles).forEach((path) => {
  const moduleName = path.replace(/^\.\/modules\/(.*)\.js$/, '$1');
  modules[moduleName] = modulesFiles[path].default;
});

const store = createStore({
  modules,
  getters,
});

export default store;
