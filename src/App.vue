<template>
  <div>
    <Header/>
    <router-view></router-view>
    <!-- 在Home,Search显示的，在Login，Register是隐藏的 -->
    <!-- <Footer v-show="$route.path == '/home'||$route.path == '/search'"/> -->
    <Footer v-show="$route.meta.show"/>
  </div>
</template>

<script>
import Header from '../src/components/Header/index.vue'
import Footer from '../src/components/Footer/index.vue'
export default {
  name:'app',
  components:{Header,Footer},
  mounted() {
    this.$store.dispatch('categoryList');
  },
}
</script>