<template>
  <div id="app">
<!--    <keep-alive>-->
<!--      <router-view v-if="$route.meta.keepAlive"></router-view>-->
<!--    </keep-alive>-->
<!--    <router-view v-if="!$route.meta.keepAlive"></router-view>-->
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted(){
    localStorage.setItem('version','防火单位1.0.1')
  }
}
</script>

<style lang="scss">
@import "./style/app.scss";
</style>
