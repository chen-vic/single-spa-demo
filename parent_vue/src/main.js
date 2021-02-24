import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {registerApplication, start} from 'single-spa';

Vue.config.productionTip = false

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;

    document.head.appendChild(script);
  })
}

//single-spa缺点
// 1. 不够灵活，需手动加载子应用的js脚本，容易写错写漏掉
// 2. 样式不隔离，受影响
// 3. 挂载到了window对象下，没有js沙箱的机制

// 注册vue应用
registerApplication('myVueChildApp', 
  async () => {
    console.log('load myVueChildApp=====>');
    // systemJS 加载js脚本
    // 这里我自己实现loadScript
    await loadScript('http://localhost:3000/js/chunk-vendors.js');
    await loadScript('http://localhost:3000/js/app.js');

    return window.singleVue; // 即 bootstrap mount unmount
  }, 
  location => location.pathname.startsWith('/vue'), // 用户切换到 /vue 路径下，加载刚才定义的子应用
  {a: 1, b: 2}
);

// 注册react应用
registerApplication(
  "myReactChildApp",
  async () => {
    console.log("load myReactChildApp=====>");

    await loadScript("http://localhost:4000/static/js/bundle.js");
    await loadScript("http://localhost:4000/static/js/vendors~main.chunk.js");
    await loadScript("http://localhost:4000/static/js/main.chunk.js");

    return window.singleReact; // 即 bootstrap mount unmount
  },
  (location) => location.pathname.startsWith("/react"), 
  { a: 100, b: 200 }
);

start();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
