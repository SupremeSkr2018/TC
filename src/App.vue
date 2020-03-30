<template>
  <div id="app" v-cloak>
    <keep-alive include="Staff">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
@import "../style/rest.css";
</style>
