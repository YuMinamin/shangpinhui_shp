<template>
    <div class="type-nav">
        <div class="container">
            <!-- 事件委托|事件委派 -->
            <div @mouseenter="enterShow" @mouseleave="leaveShow">
                <h2 class="all">全部商品分类</h2>
                <transition name="sort">
                    <div class="sort" v-show="show">
                    <div class="all-sort-list2" @click="goSearch">
                        <div class="item" 
                        v-for="(c1,index) in categoryList" 
                        :key="c1.categoryId" 
                        :class="{cur:currentIndex==index}"
                        >
                        <h3 @mouseenter="changeIndex(index)">
                        <a :data-categoryName="c1.categoryName" 
                        :data-category1Id = "c1.categoryId" >
                        {{c1.categoryName}}</a>
                        </h3>
                            <div class="item-list clearfix" 
                            :style="{display:currentIndex==index?'block':'none'}">
                                <div class="subitem" 
                                v-for="c2 in c1.categoryChild" 
                                :key="c2.categoryId">
                                    <dl class="fore">
                                        <dt>
                                            <a 
                                            :data-categoryName="c2.categoryName" 
                                            :data-category2Id = "c2.categoryId">
                                            {{c2.categoryName}}
                                            </a>
                                        </dt>
                                        <dd>
                                            <em 
                                            v-for="c3 in c2.categoryChild" 
                                            :key="c3.categoryId">
                                                  <a 
                                                  :data-categoryName="c3.categoryName" 
                                                  :data-category3Id = "c3.categoryId">
                                                  {{c3.categoryName}}
                                                  </a>
                                            </em>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </transition> 
            </div>
            <nav class="nav">
                    <a href="###">服装城</a>
                    <a href="###">美妆馆</a>
                    <a href="###">尚品汇超市</a>
                    <a href="###">全球购</a>
                    <a href="###">闪购</a>
                    <a href="###">团购</a>
                    <a href="###">有趣</a>
                    <a href="###">秒杀</a>
            </nav>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex';
//最好的引入方式:按需加载
import throttle from 'lodash/throttle'
export default {
    name:'TypeNav',
    data() {
        return {
            //存储用户鼠标移上哪一个一级分类
            currentIndex:-1,
            show:true,
        }
    },
    //组件挂载完毕:可以向服务器发请求
    mounted(){
        //通知Vuex发请求，获取数据，存储于仓库中
        if(this.$route.path != '/home'){
            this.show = false;
        }
        // 
    },
    computed:{
        ...mapState({
            //右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
            //注入一个参数state,其实即为大仓库中的数据
            categoryList:(state)=>{
                return state.home.categoryList;
            }
        })
    },
    methods: {
        changeIndex: throttle(function(index){
            this.currentIndex = index;
        },50),
        //当
        enterShow(){
            this.show = true
        },
        leaveShow(){
            if(this.$route.path != '/home'){
                this.currentIndex = -1;
                this.show = false;
            }
        },
        goSearch(event){
            /* 最好的解决方案:编程式导航+事件委派*/
           let element = event.target;
           //console.log(element)
           //节点有一个属性dataset属性，可以获取自定义属性与属性值
           let {categoryname,category1id,category2id,category3id} = element.dataset;
           // console.log(element.dataset)
           //如果标签身上拥有categoryname一定是a标签
           if(categoryname){
            //整理路由跳转的参数对象
            let location = {name:'search'};
            let query = {categoryName:categoryname};
             //一级，二级，三级分类的a标签
             if(category1id){
                query.category1id = category1id;
             }else if(category2id){
                query.category2id= category2id;
             }else{
                query.category3id= category3id;
             }
                location.params = this.$route.params
                //动态给location配置对象添加到query属性
                location.query = query;
                //路由跳转
                this.$router.push(location)
             
            }
        }
    }
}
</script>

<style lang="less" scoped>
.type-nav {
        border-bottom: 2px solid #e1251b;

        .container {
            width: 1200px;
            margin: 0 auto;
            display: flex;
            position: relative;

            .all {
                width: 210px;
                height: 45px;
                background-color: #e1251b;
                line-height: 45px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                font-weight: bold;
            }

            .nav {
                a {
                    height: 45px;
                    margin: 0 22px;
                    line-height: 45px;
                    font-size: 16px;
                    color: #333;
                }
            }

            .sort {
                position: absolute;
                left: 0;
                top: 45px;
                width: 210px;
                height: 461px;
                position: absolute;
                background: #fafafa;
                z-index: 999;

                .all-sort-list2 {
                    .item {
                        h3 {
                            line-height: 28px;
                            font-size: 14px;
                            font-weight: 400;
                            overflow: hidden;
                            padding: 0 20px;
                            margin: 0;

                            a {
                                color: #333;
                            }
                        }

                        .item-list {
                            display: none;
                            position: absolute;
                            width: 734px;
                            min-height: 460px;
                            background: #f7f7f7;
                            left: 210px;
                            border: 1px solid #ddd;
                            top: 0;
                            z-index: 9999 !important;

                            .subitem {
                                float: left;
                                width: 650px;
                                padding: 0 4px 0 8px;

                                dl {
                                    border-top: 1px solid #eee;
                                    padding: 6px 0;
                                    overflow: hidden;
                                    zoom: 1;

                                    &.fore {
                                        border-top: 0;
                                    }

                                    dt {
                                        float: left;
                                        width: 54px;
                                        line-height: 22px;
                                        text-align: right;
                                        padding: 3px 6px 0 0;
                                        font-weight: 700;
                                    }

                                    dd {
                                        float: left;
                                        width: 415px;
                                        padding: 3px 0 0;
                                        overflow: hidden;

                                        em {
                                            float: left;
                                            height: 14px;
                                            line-height: 14px;
                                            padding: 0 8px;
                                            margin-top: 5px;
                                            border-left: 1px solid #ccc;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    .cur {
                        background-color: rgba(0, 170, 255, 0.219);
                    }
                }
            }
            .sort-enter{
                height: 0px;
            }
            .sort-enter-to{
                height: 461px;
            }
            .sort-enter-active{
                transition: all .5s linear;
            }
        }
    }
</style>