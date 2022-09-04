<template>
  <div>
    <!-- 三级联动全局组件:三级联动组件已经注册全局组件，因此不需要再引入 -->
    <TypeNav/>
    <ListContainer/>
    <TodayRecommend/>
    <Rank/>
    <Like/>
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor" />
    <Brand/>
  </div>
</template>

<script>
import ListContainer from '@/pages/Home/ListContainer/index.vue';
import TodayRecommend from '@/pages/Home/TodayRecommend/index.vue';
import Rank from '@/pages/Home/Rank/index.vue'
import Like from '@/pages/Home/Like/index.vue'
import Floor from '@/pages/Home/Floor/index.vue';
import Brand from '@/pages/Home/Brand/index.vue';
import { mapState } from 'vuex';
export default {
  name:'',
  components:{ 
    ListContainer, 
    TodayRecommend, 
    Rank, 
    Like, 
    Floor, 
    Brand
  },
  mounted() {
        //派发action获取floor组件的数据
        this.$store.dispatch('getFloorList');
  },
  computed: {
        ...mapState({
            floorList:state=>state.home.floorList
        })
    },

}
</script>