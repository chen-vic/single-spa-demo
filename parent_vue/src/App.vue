<template>
  <div id="app">
    <!-- 基座自己的路由页面 -->
    <div id="nav">
      <p>基座自己的路由页面: </p>
      <router-link to="/">Home-base</router-link> |
      <router-link to="/about">About-base</router-link> | 
      <p>基座加载子应用</p>
      <router-link to="/vue">加载vue应用</router-link> | 
      <router-link to="/react">加载react应用</router-link>
    </div>
    <hr />
    <router-view/>
    <!-- 子应用加载的dom -->
    <div id="vueDOM"></div>
    <div id="reactDOM"></div>
  </div>
</template>

<style>

</style>
