<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">{{searchParams.categoryName}}<i @click="removeCategoryName">×</i></li>
            <!-- 关键字面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{searchParams.keyword}}<i @click="removeKeyWord">×</i></li>
            <!-- 品牌信息展示 -->
            <li class="with-x" v-if="searchParams.trademark">{{searchParams.trademark.split(":")[1]}}<i @click="removeTradeMark">×</i></li>
            <!-- 平台售卖属性展示 -->
            <li class="with-x" v-for="(attrValue,index) in searchParams.props" :key="index">{{attrValue.split(":")[1]}}<i @click="removeAttr(index)">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @trademarkInfo="trademarkInfo" @attrInfo="attrInfo"/>

        <!--details 详情-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 价格排序的结构 -->
              <ul class="sui-nav">
                <li :class="{active:isOne}" @click="changeOrder('1')">
                  <a>综合<span v-show="isOne" class="fa" :class="{'fa-arrow-up':isAsc,'fa-arrow-down':isDesc}"></span></a>
                  <!-- <a>综合<span v-show="isOne" class="[isAsc?'fa fa-arrow-up':'fa fa-arrow-down']"></span></a> -->
                  <!-- <a>综合<span v-show="isOne"><span v-show="isAsc" class="fa fa-arrow-up"></span><span v-show="isDesc" class="fa fa-arrow-down"></span></span></a> -->
                </li>
                <li :class="{active:isTwo}" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo" class="fa" :class="{'fa-arrow-up':isAsc,'fa-arrow-down':isDesc}"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售商品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="good in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                      </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{good.price}}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">{{good.title}}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination 
          :pageNo="searchParams.pageNo" 
          :pageSize="searchParams.pageSize" 
          :total="total" 
          :continues="5"
          @getPageNo = "getPageNo"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import SearchSelector from './SearchSelector/index.vue'
import Pagination from '../../components/Pagination/index.vue'
export default {
  name: 'Search',
  components: {
    SearchSelector,
    Pagination
},
  data() {
    return {
      //带给服务器参数
      searchParams: {
        //一级分类的id
        category1id: "",
        //二级分类id
        category2id: "",
        //三级分类id
        category3id: "",
        //分类名字
        categoryName: "",
        //关键字
        keyword: "",
        //排序 初始值 初始状态应该是综合|降序
        order: "1:desc",
        //分页器用的，代表当前是第几页
        pageNo: 1,
        //代表每个展示数据的个数
        pageSize: 3,
        //平台售卖属性操作带的参数
        props: [],
        //品牌
        trademark: "",
      }
    }
  },
  //当组件挂载完毕之前执行一次，先于mounted
  beforeMount(){
    //复杂写法
    // this.searchParams.category1Id = this.$route.query.category1Id;
    // this.searchParams.category2Id = this.$route.query.category2Id;
    // this.searchParams.category3Id = this.$route.query.category3Id;
    // this.searchParams.categoryName = this.$route.query.categoryName;
    // this.searchParams.keyword = this.$route.params.keyword;
    //Object.assign ES6 合并对象
    Object.assign(this.searchParams,this.$route.query,this.$route.params);
  },

  //组件挂载完毕执行一次【仅执行一次】
  mounted() {
    //在发请求之前带给服务器参数【searchParams参数发生变化数值带给服务器】
    this.getData();
  },
  methods: {
    //向服务器发请求获取search模块数据(根据参数不同返回不同的数据进行展示)
    //把这次请求封装为一个函数：当需要调用的时候调用即可
    getData() {
      this.$store.dispatch('getSearchList', this.searchParams)
    },
    //删除分类的名字
    removeCategoryName(){
      //把带给服务器的参数置空了，还需要向服务器发请求
      //带给服务器参数说明可有可无：如果属性值为空的字符串还是会把相应的字段带给服务器
      //但是把相应的字段变为undefined,这个字段不会带给服务器
      this.searchParams.categoryName = undefined;
      this.searchParams.category1id = undefined;
      this.searchParams.category2id = undefined;
      this.searchParams.category3id = undefined;
      //再次发请求
      this.getData();
      //地址栏需要修改，进行路由跳转
      //严谨：本意是删除query,如果路径当中出现params不应该删除，路由跳转时候应该带着
      if(this.$route.params){
        this.$router.push({name:'search',params:this.$route.params})
      }
    },
    removeKeyWord(){
      //给服务器带的参数searchParams的keyword置空
      this.searchParams.keyword = undefined;
      this.getData();
      //通知兄弟组件Header清除关键字
      this.$bus.$emit("clear");
      if(this.$route.query){
        this.$router.push({name:'search',query:this.$route.query})
      }
    },
    //自定义事件回调
    trademarkInfo(trademark){
      //console.log("我是父组件",trademark)
      //整理参数
      //模板字符串
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      //再次发请求获取search模块列表数据进行展示
      this.getData();
    },
    removeTradeMark(){
      this.searchParams.trademark = undefined;
      this.getData();
    },
    //收集平台属性地方回调函数(自定义事件)
    attrInfo(attr,attrValue){
      //整理参数
      //["属性ID:属性值:属性名"]
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //数组去重
      if(this.searchParams.props.indexOf(props)==-1){
        this.searchParams.props.push(props);
      }
      this.getData()
    },
    //删除售卖属性
    removeAttr(index){
      //从数组中删除一个元素
      this.searchParams.props.splice(index,1);
      this.getData();
    },
    //排序的操作
    changeOrder(flag){
      //flag形参:一个标记，代表用户点击的是【综合1】还是【价格2】[用户点击是时候传递进来的]
      let originOrder = this.searchParams.order;
      //获取到最开始的状态
      let originFlag = this.searchParams.order.split(":")[0];
      let originSort = this.searchParams.order.split(":")[1];
      //console.log('###',originOrder,originFlag,originSort)
      //准备一个新的order属性值
      let newOrder = '';
      //点击的是综合
      if(flag==originFlag){
        newOrder = `${originFlag}:${originSort=='desc'?'asc':'desc'}`
        //console.log(newOrder)
      }else{
        //判断初始状态点击的是不是价格
        newOrder = `${flag}:${'desc'}`;
      }
      //将新的order赋予searchParams
      this.searchParams.order = newOrder;
      this.getData();
    },
    //自定义事件的回调函数---获取当前第几页
    getPageNo(pageNo){
      console.log('###',pageNo)
      //整理带给服务器的参数
      this.searchParams.pageNo = pageNo
      //再次发请求
      this.getData()
    }
  },
  computed: {
    //mapState里面的写法:传递的数组，因为getters计算是没有划分模块的【home,search】
    ...mapGetters(['goodsList']),
    isOne(){
      return this.searchParams.order.indexOf('1') != -1
    },
    isTwo(){
      return this.searchParams.order.indexOf('2') != -1
    },
    isAsc(){
      return this.searchParams.order.indexOf('asc') != -1
    },
    isDesc(){
      return this.searchParams.order.indexOf('desc') != -1
    },
    //获取Search模块展示产品一共多少数据
    ...mapState({
      total:state=>state.search.searchList.total
    })
  },
  watch: {
    //监听路由的信息是否发生变化，如果发生变化，再次发起请求
    $route(newValue,oldValue){
      //再次发起请求之前整理带给服务器参数
      Object.assign(this.searchParams,this.$route.query,this.$route.params);
      //console.log(this.searchParams);
      //再次发起请求
      this.getData();
      //每次请求完成，应该把相应的1，2，3级分类的id置空，让他接受下一次的相应1，2，3id
      this.searchParams.category1id = '';
      this.searchParams.category2id = '';
      this.searchParams.category3id = '';
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    margin: 10px 0;

    .py-container {
      width: 1200px;
      margin: 0 auto;

      .bread {
        margin-bottom: 5px;
        overflow: hidden;

        .sui-breadcrumb {
          padding: 3px 15px;
          margin: 0;
          font-weight: 400;
          border-radius: 3px;
          float: left;

          li {
            display: inline-block;
            line-height: 18px;

            a {
              color: #666;
              text-decoration: none;

              &:hover {
                color: #4cb9fc;
              }
            }
          }
        }

        .sui-tag {
          margin-top: -5px;
          list-style: none;
          font-size: 0;
          line-height: 0;
          padding: 5px 0 0;
          margin-bottom: 18px;
          float: left;

          .with-x {
            font-size: 12px;
            margin: 0 5px 5px 0;
            display: inline-block;
            overflow: hidden;
            color: #000;
            background: #f7f7f7;
            padding: 0 7px;
            height: 20px;
            line-height: 20px;
            border: 1px solid #dedede;
            white-space: nowrap;
            transition: color 400ms;
            cursor: pointer;

            i {
              margin-left: 10px;
              cursor: pointer;
              font: 400 14px tahoma;
              display: inline-block;
              height: 100%;
              vertical-align: middle;
            }

            &:hover {
              color: #28a3ef;
            }
          }
        }
      }

      .details {
        margin-bottom: 5px;

        .sui-navbar {
          overflow: visible;
          margin-bottom: 0;

          .filter {
            min-height: 40px;
            padding-right: 20px;
            background: #fbfbfb;
            border: 1px solid #e2e2e2;
            padding-left: 0;
            border-radius: 0;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

            .sui-nav {
              position: relative;
              left: 0;
              display: block;
              float: left;
              margin: 0 10px 0 0;

              li {
                float: left;
                line-height: 18px;

                a {
                  display: block;
                  cursor: pointer;
                  padding: 11px 15px;
                  color: #777;
                  text-decoration: none;
                  }
                &.active {
                  a {
                    background: #e1251b;
                    color: #fff;
                  }
                }
              }
            }
          }
        }

        .goods-list {
          margin: 20px 0;

          ul {
            display: flex;
            flex-wrap: wrap;

            li {
              height: 100%;
              width: 20%;
              margin-top: 10px;
              line-height: 28px;

              .list-wrap {
                .p-img {
                  padding-left: 15px;
                  width: 215px;
                  height: 255px;

                  a {
                    color: #666;

                    img {
                      max-width: 100%;
                      height: auto;
                      vertical-align: middle;
                    }
                  }
                }

                .price {
                  padding-left: 15px;
                  font-size: 18px;
                  color: #c81623;

                  strong {
                    font-weight: 700;

                    i {
                      margin-left: -5px;
                    }
                  }
                }

                .attr {
                  padding-left: 15px;
                  width: 85%;
                  overflow: hidden;
                  margin-bottom: 8px;
                  min-height: 38px;
                  cursor: pointer;
                  line-height: 1.8;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;

                  a {
                    color: #333;
                    text-decoration: none;
                  }
                }

                .commit {
                  padding-left: 15px;
                  height: 22px;
                  font-size: 13px;
                  color: #a7a7a7;

                  span {
                    font-weight: 700;
                    color: #646fb0;
                  }
                }

                .operate {
                  padding: 12px 15px;

                  .sui-btn {
                    display: inline-block;
                    padding: 2px 14px;
                    box-sizing: border-box;
                    margin-bottom: 0;
                    font-size: 12px;
                    line-height: 18px;
                    text-align: center;
                    vertical-align: middle;
                    cursor: pointer;
                    border-radius: 0;
                    background-color: transparent;
                    margin-right: 15px;
                  }

                  .btn-bordered {
                    min-width: 85px;
                    background-color: transparent;
                    border: 1px solid #8c8c8c;
                    color: #8c8c8c;

                    &:hover {
                      border: 1px solid #666;
                      color: #fff !important;
                      background-color: #666;
                      text-decoration: none;
                    }
                  }

                  .btn-danger {
                    border: 1px solid #e1251b;
                    color: #e1251b;

                    &:hover {
                      border: 1px solid #e1251b;
                      background-color: #e1251b;
                      color: white !important;
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
        }

        .page {
          width: 733px;
          height: 66px;
          overflow: hidden;
          float: right;

          .sui-pagination {
            margin: 18px 0;

            ul {
              margin-left: 0;
              margin-bottom: 0;
              vertical-align: middle;
              width: 490px;
              float: left;

              li {
                line-height: 18px;
                display: inline-block;

                a {
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  border: 1px solid #e0e9ee;
                  margin-left: -1px;
                  font-size: 14px;
                  padding: 9px 18px;
                  color: #333;
                }

                &.active {
                  a {
                    background-color: #fff;
                    color: #e1251b;
                    border-color: #fff;
                    cursor: default;
                  }
                }

                &.prev {
                  a {
                    background-color: #fafafa;
                  }
                }

                &.disabled {
                  a {
                    color: #999;
                    cursor: default;
                  }
                }

                &.dotted {
                  span {
                    margin-left: -1px;
                    position: relative;
                    float: left;
                    line-height: 18px;
                    text-decoration: none;
                    background-color: #fff;
                    font-size: 14px;
                    border: 0;
                    padding: 9px 18px;
                    color: #333;
                  }
                }

                &.next {
                  a {
                    background-color: #fafafa;
                  }
                }
              }
            }

            div {
              color: #333;
              font-size: 14px;
              float: right;
              width: 241px;
            }
          }
        }
      }
    }
  }
</style>