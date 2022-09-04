import { reqGetSearchInfo } from "@/api";
//search模块的小仓库
const state = {
    //仓库初始的对象
    searchList:{}
};
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList
    }
};
const actions = {
    //获取search模块数据
    async getSearchList({commit},params={}){
        //params形参:是当用户派发action的时候，第二个参数传递过来的，至少是一个空对象
        let result = await reqGetSearchInfo(params);
        if(result.code == 200){
            commit('GETSEARCHLIST',result.data);
        }
    }
};
//计算属性，在项目中，为了简化仓库中的数据而生
const getters = {
    //当前形参state是当前仓库中的state,并非大仓库中的state 
    goodsList(state){
        //假如网络不给力，没有网state.search.goodsList应该返回的是一个undefined
        //计算新的属性的属性值至少给人家一个数组
        return state.searchList.goodsList||[];
    },
    trademarkList(state){
        return state.searchList.trademarkList;
    },
    attrsList(state){
        return state.searchList.attrsList;
    }
};
export default {
    state,
    mutations,
    actions,
    getters
}