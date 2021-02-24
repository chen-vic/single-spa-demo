## single-spa-demo

### 1. child_vue 子应用改造
1. 基于vue-cli快速创建一个vue项目
```shell
vue create child_vue
```
2. 安装single-spa-vue

```shell
yarn add single-spa-vue
```

3. 修改child_vue 子应用main.js入口文件
```diff
+ import singleSpaVue from 'single-spa-vue';

+ const appOptions = {
+   el: '#vueDOM', // 挂载到父应用id为vueDOM的标签中
+   router,
+   render: h => h(App)
+ }

- new Vue({
-   router,
-   render: h => h(App)
- }).$mount('#app');

+ // 返回vue的3个生命周期（被single-spa-vue包装过的生命周期）
+ const vueLifeCycle = singleSpaVue({
+   Vue,
+   appOptions
+ });
+ 
+ // 协议介入 父应用调用这些方法
+ // 向父应用暴露的三个方法
+ export const bootstrap = vueLifeCycle.bootstrap;
+ export const mount = vueLifeCycle.mount;
+ export const unmount = vueLifeCycle.unmount;
+ 
+ // 父应用引用子应用时
+ // 设置webpack的publicPath
+ // 防止在访问子应用路径是访问到父应用上去
+ if(window.singleSpaNavigate) {
+   __webpack_public_path__ = 'http://localhost:3000/'
+ }
+ 
+ // 子应用独立启动
+ if (!window.singleSpaNavigate) {
+   delete appOptions.el;
+ 
+   new Vue(appOptions).$mount("#app");
+ }

```

4. 在child_vue根目录新建`vue.config.js`
```javascript
module.exports = {
  // https://juejin.cn/post/6862661545592111111#heading-5
  // 告诉子应用在这个地址加载静态资源，否则会去基座应用的域名下加载
  publicPath: "http://localhost:3000/",
  configureWebpack: {
    // https://webpack.docschina.org/configuration/output/#outputlibrary
    output: {
      library: 'singleVue', // 打包成一个类库
      libraryTarget: 'umd' // umd最终会把bootstrap/mount/unmount挂载到window上
    },
    devServer: {
      port: 3000 // 重新定义端口
    }
  }
}
```

5. 修改child_vue子应用的路由配置文件
```diff
const router = new VueRouter({
  mode: 'history',
-  base: process.env.BASE_URL,
+  base: '/vue',
  routes
})
```

### 2. child_react 子应用改造
#### 1. 基于create-react-app 快速创建一个react项目
```shell
npx create-react-app child_react
```

#### 2. 安装我们所需的依赖
##### 1. 使用`craco`修改项目配置
> 这里不通过`yarn run eject`暴露配置，直接使用[craco](https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration)添加配置文件修改webpack配置
+ 安装
```shell
yarn add @craco/craco -D
```
+ 在此项目根目录新建`craco.config.js`
```javascript
const path = require('path');

// https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration
module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, './src')
    },
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.output.publicPath = "http://localhost:4000/";
      webpackConfig.output.library = "singleReact";
      webpackConfig.output.libraryTarget = "umd";

      return webpackConfig;
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    devServerConfig.historyApiFallback = true;
    devServerConfig.headers = {
      "Access-Control-Allow-Oirgin": "*",
    };

    return devServerConfig;
  },
};
```

##### 2. 安装`react-router-dom`
+ 安装
```shell
yaen add react-router-dom
```
+ 使用
> 在**src**目录下新建**router**目录，创建`index.js`文件
```javascript
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import App from '@/App';

function RouterConfig() {
  return (
    <div>
      <BrowserRouter basename="/react">
        <div>
          <Link to="/">react home page</Link> | 
          <Link to="/about">react about page </Link>
        </div>

        <Switch>
          <Route exact path="/" component={App} />
          <Route
            exact
            path="/about"
            render={() => <h1>react about page</h1>}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default RouterConfig;
```

#### 3. 修改入口**src**目录下`index.js`入口文件
```diff
import React from "react";
import ReactDOM from "react-dom";
import RouterConfig from "./router";
+ import singleSpaReact from 'single-spa-react';
import "./index.css";

- ReactDOM.render(
-   <React.StrictMode>
-     <RouterConfig />
-   </React.StrictMode>,
-   document.getElementById("root")
- );

+ const rootComponent = () => {
+   return (
+     <React.StrictMode>
+       <RouterConfig />
+     </React.StrictMode>
+   );
+ }
+ 
+ // 子应用独立运行
+ if (!window.singleSpaNavigate) {
+   ReactDOM.render(rootComponent(), document.getElementById("root"));
+ }
+ 
+ // https://single-spa.js.org/docs/ecosystem-react/
+ const reactLifecycles = singleSpaReact({
+   el: document.getElementById("reactDOM"), // 基座的dom
+   React,
+   ReactDOM,
+   rootComponent,
+   errorBoundary(err, info, props) {
+     // https://reactjs.org/docs/error-boundaries.html
+     return <div>This renders when a catastrophic error occurs</div>;
+   },
+ });
+ 
+ export const bootstrap = async props => {
+   return reactLifecycles.bootstrap(props);
+ }
+ 
+ export const mount = async (props) => {
+   console.log("react===>", props);
+   return reactLifecycles.mount(props);
+ };
+ 
+ export const unmount = async (props) => {
+   return reactLifecycles.unmount(props);
+ };
```

### 3. parent_vue 父应用改造
1. 安装 single-spa
```shell
yarn add single-spa
```

2. 修改parent_vue 子应用main.js入口文件
```diff
+ import {registerApplication, start} from 'single-spa';

+ async function loadScript(url) {
+   return new Promise((resolve, reject) => {
+     const script = document.createElement('script');
+     script.src = url;
+     script.onload = resolve;
+     script.onerror = reject;
+ 
+     document.head.appendChild(script);
+   })
+ }
+ 
+ // single-spa缺点
+ // 1. 不够灵活，需手动加载子应用的js脚本，容易写错写漏掉
+ // 2. 样式不隔离，受影响
+ // 3. 挂载到了window对象下，没有js沙箱的机制
+ 
+ registerApplication('myVueChildApp', 
+   async () => {
+     console.log('load myVueChildApp=====>');
+     // systemJS 加载js脚本
+     // 这里自己实现loadScript
+     await loadScript('http://localhost:3000/js/chunk-vendors.js');
+     await loadScript('http://localhost:3000/js/app.js');
+ 
+     return window.singleVue; // 即 bootstrap mount unmount
+   }, 
+   location => location.pathname.startsWith('/vue'), // 用户切换到 /vue 路径下即激活，加载刚才定义的子应用
+   {a: 1, b: 2}
+ );

+ // 注册react应用
+ registerApplication(
+   "myReactChildApp",
+   async () => {
+     console.log("load myReactChildApp=====>");
+ 
+     await loadScript("http://localhost:4000/static/js/bundle.js");
+     await loadScript("http://localhost:4000/static/js/vendors~main.chunk.js");
+     await loadScript("http://localhost:4000/static/js/main.chunk.js");
+ 
+     return window.singleReact; // 即 bootstrap mount unmount
+   },
+   (location) => location.pathname.startsWith("/react"), 
+   { a: 100, b: 200 }
+ );
+ 
+ start();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

3. 修改parent_vue的App.vue文件
```javascript
<template>
  <div id="app">
    <router-link to="/vue">加载vue应用</router-link>
    <!-- 子应用加载的dom -->
    <div id="vueDOM"></div>
  </div>
</template>
```

### 4. css样式隔离问题
+ 子应用之间隔离：
  - Dynamic Stylesheet：动态样式表，当应用切换时移除老应用样式，添加新应用样式

+ 主应用和子应用之间的样式隔离：
  - BEM(Block Element Modifier) 约定项目前缀
  - CSS-Modules 打包时生成不冲突的选择器名，主流做法
  - Shadow Dom 真正意义上的隔离
  - css-in-js 缺点：修改不方便