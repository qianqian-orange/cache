<template>
  <div class="app">
    <p>
      <router-link to="/">首页</router-link>
    </p>
    <p>
      <router-link to="/a">第一类</router-link>
    </p>
    <p>
      <router-link to="/b">第二类</router-link>
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  
}
</script>