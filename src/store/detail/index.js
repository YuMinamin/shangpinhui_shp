import { reqAddOrUpdateShopCart, reqGoodsInfo } from "@/api";
//封装游客身份模块uuid--->生成一个随机字符串(不能再变了)
import {getUUID} from '@/utils/uuid_token'
const state = {
  goodInfo:{},
  //游客临时身份,getUUID函数无论执行多少次 UUID只有一个
  uuid_token:getUUID()
}
const mutations ={
  GETGOODINFO(state,goodInfo){
    state.goodInfo = goodInfo;
  }
}
const actions = {
  //获取产品信息的action
  async getGoodInfo({commit},skuId){
    let result = await reqGoodsInfo(skuId)
    if(result.code == 200){
      commit('GETGOODINFO',result.data)
    }
  },
  //将产品添加到购物车中||修改加入的产品的个数
  async addOrUpdateShopCart({commit},{skuId,skuNum}){
    //加入购物车返回的结构
    //加入购物车以后(发请求)，前台将数据带给服务器
    //服务器写入数据成功，并没有返回其他的数据，只返回code=200,代表这次操作成功
    //因为服务器没有返回其余数据，因此不需要三连环存储数据
    //发请求:前端带一些参数给服务器【需要存储这些数据】，存储成功了，没有返回数组
    let result = await reqAddOrUpdateShopCart(skuId,skuNum)
    //代表服务器加入购物车成功
    if(result.code == 200){
      return 'ok'
    }else{
      //代表加入购物车失败
      return Promise.reject(new Error('fail'))
    }
  }
}
const getters = { 
  //路径导航简化的数据
  categoryView(state){
    //比如:state.goodInfo初始状态空对象，空对象的categoryView的属性值为undefined
    //当前计算出的categoryView属性值至少是一个空对象，假的报错不会有了
    return state.goodInfo.categoryView||{};
  },
  //简化产品信息的数据
  skuInfo(state){
    return state.goodInfo.skuInfo||{};
  },
  //产品售卖属性的简化 
  spuSaleAttrList(state){
    return state.goodInfo.spuSaleAttrList||[];
  },
  filterSpuSaleAttrListColor(state){
    return state.goodInfo.spuSaleAttrList[0].spuSaleAttrValueList.filter(item => item.isChecked==1)||[];
  },
  filterSpuSaleAttrListVersion(state){
    return state.goodInfo.spuSaleAttrList[1].spuSaleAttrValueList.filter(item => item.isChecked==1)||[];
  }
}
export default{
  state,
  actions,
  mutations,
  getters
}
