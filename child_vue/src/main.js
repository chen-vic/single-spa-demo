import Vue from 'vue'
import App from './App.vue'
import router from './router'
import singleSpaVue from 'single-spa-vue';

Vue.config.productionTip = false

const appOptions = {
  el: '#vueDOM', // 挂载到父应用id为vueDOM的标签中
  router,
  render: h => h(App)
}

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app');

// 返回vue的3个生命周期（被single-spa-vue包装过的生命周期）
const vueLifeCycle = singleSpaVue({
  Vue,
  appOptions
});

// 协议介入 父应用调用这些方法
// export const bootstrap = vueLifeCycle.bootstrap;
// export const mount = vueLifeCycle.mount;
// export const unmount = vueLifeCycle.unmount;

export function bootstrap (props) {
  console.log("app1 bootstrap", props);
  return vueLifeCycle.bootstrap(() => {})
}

export function mount (props) {
  console.log("app1 mount", props);
  return vueLifeCycle.mount(() => {})
}

export function unmount (props) {
  console.log('app1 unmount', props)
  return vueLifeCycle.unmount(() => {})
}

// 父应用引用子应用时
// 设置webpack的publicPath
// 防止在访问子应用路径是访问到父应用上去
// if(window.singleSpaNavigate) {
//   __webpack_public_path__ = 'http://localhost:3000/'
// }

// 子应用独立启动,不依赖基座，这里即parent_应用
if (!window.singleSpaNavigate) {
  delete appOptions.el;

  new Vue(appOptions).$mount("#app");
}

// bootstrap mount unmount
// single-spa-vue

// 需要父应用加载子应用，将子应用打包成一个lib给父应用使用
