//配置路由的地方
import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes';
import store from '@/store'
//使用插件
Vue.use(VueRouter);

//先把VueRouter原型对象的push,先保存一份
let originPush = VueRouter.prototype.push;

//重写push|replace
//第一个参数：告诉原来push方法，你往哪里跳转(传递哪些参数)
VueRouter.prototype.push = function(location,resolve,reject){
    if(resolve && reject){
        //call||apply区别:
        //相同点，都可以调用函数一次，都可以篡改函数的上下文一次
        //不同点:call与apply传递参数:call传递参数用逗号隔开，apply方法执行，传递数组
        originPush.call(this,location,resolve,reject);
    }else{
        originPush.call(this,location,() => {},() => {})
    }
}
//配置路由
let router = new VueRouter({
    //配置路由
    routes,
    //滚动行为
    scrollBehavior(to, from, savedPosition) {
        // 返回的y=0,代表始终滚动到顶部
        return { y: 0 }
      },
});

//全局守卫，前置守卫(在路由跳转之间进行判断)
router.beforeEach(async(to,from,next)=>{
    let token = store.state.user.token;
    let name = store.state.user.userInfo.name;
    if(token){
        if(to.path=='/login'||to.path=='/register'){
            next('/home');
            console.log(111);
        }else{
            //已登录，去的不是login【home|search|detail|shopcart】
            //如果用户名已有
            if(name){
                next();
                console.log(222);
            }else{
                //没有用户信息，派发action
                try {
                    //获取用户信息成功
                    await store.dispatch('getUserInfo');
                    //放行
                    next();
                    console.log(333)
                } catch (error) {
                    //token失效了获取不到用户信息，重新登陆
                    //清除token
                    await store.dispatch('userLogout');
                    next('/login');
                }
            }
        }
    }else{
        //未登录 不能去交易相关，支付相关，不能去个人中心
        let toPath = to.path;
        if(toPath.indexOf('/trade')!==-1 || toPath.indexOf('/pay')!==-1 || toPath.indexOf('/center')!==-1){
            next('/login?redirect=' +toPath);
            //next('/login')
        }else{
            next();
        }
    }
})

export default router;