import { reqCartList,reqDeleteCartById,reqUpDateCheckedById} from "@/api";
const state = {
  cartList:[],
};
const mutations = {
  GETCARTLIST(state,cartList){
    state.cartList = cartList
  }
};
const actions = {
  //获取购物车列表的数据
  async getCartList({commit}){
    let result = await reqCartList()
    //console.log(result)
    if(result.code == 200){
      commit('GETCARTLIST',result.data)
    }
  },
  //删除购物车的某个产品
  async deleteCartSkuId({commit},skuId){
    let result = await reqDeleteCartById(skuId);
    if(result.code==200){
      return 'ok';
    }else{
      return Promise.reject(new Error('fail'));
    }
  },
  //修改购物车某个产品的勾选状态
  async updateCheckedById({commit},{ skuId,isChecked }){
    let result = await reqUpDateCheckedById(skuId,isChecked);
    if(result.code==200){
      return 'ok';
    }else{
      return Promise.reject(new Error('fail'));
    }
  },
  //删除全部勾选的产品
  deleteAllCheckedCart({dispatch,getters}){
    //context:小仓库，commit【提交mutations修改state】 getters【计算属性】 dispatch【派发actions】 state【当前仓库】
    //获取购物车的全部属性
    let promiseAll = [];
    getters.cartList.cartInfoList.forEach(item => {
      let promise = item.isChecked==1?dispatch('deleteCartSkuId',item.skuId):'';
      //将每一次返回的Promise添加到数组中
      promiseAll.push(promise);
    });
    //只要全部p1|p2...都成功，发挥结果即为成功
    //有一个失败 返回失败
    return Promise.all(promiseAll)
  },
  updateAllCartIsChecked({dispatch,state},isAllChecked){
    //数组
    let promiseAll = [];
    state.cartList[0].cartInfoList.forEach((item) => {
      let promise = dispatch('updateCheckedById',{skuId:item.skuId,isChecked:isAllChecked});
      promiseAll.push(promise);
    });
    return Promise.all(promiseAll)
  }
};
const getters = {
  cartList(state){
    return state.cartList[0]||[]
  }
};
export default{
  state,
  actions,
  mutations,
  getters
}