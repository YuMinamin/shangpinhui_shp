import Vue from 'vue'
import App from './App.vue'
//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav';
//第一个参数:全局组件的名字 第二个参数:哪一个组件
import router from '@/router';
//引入仓库
import store from '@/store';
//引入mockServe.js---mock数据
import '@/mock/mockServe'
import 'swiper/css/swiper.css'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import * as API from '@/api';
import { Button, MessageBox} from 'element-ui';

Vue.component(TypeNav.name,TypeNav);
Vue.component(Carousel.name,Carousel);
Vue.component(Pagination.name,Pagination);
//注册全局组件
Vue.component(Button.name, Button);
//element-ui注册组件的时候，还有一种写法，挂载在原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.config.productionTip = false;

//统一接口api文件夹里面全部请求函数
import Sasuke from '@/assets/R-C.gif';
import VueLazyload from 'vue-lazyload';
Vue.use(VueLazyload,{
  //懒加载默认的图片
  loading:Sasuke
})
//引入表单校验插件
import '@/plugins/validate';
new Vue({
  render: h => h(App),
  //全局事件总线$bus配置
  beforeCreate(){
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  //注册路由
  router,
  //注册仓库:组件实例的身上会多一个属性$store
  store
}).$mount('#app')
