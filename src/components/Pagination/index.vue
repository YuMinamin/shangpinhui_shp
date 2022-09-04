<template>
  <div class="pagination">
    <button :disabled="pageNo==1" @click="$emit('getPageNo',pageNo-1)">上一页</button>
    <button v-if="startNumberEndNumber.start > 1" @click="$emit('getPageNo',1)" :class="{active:pageNo==1}">1</button>
    <button v-if="startNumberEndNumber.start > 2 ">···</button>
    <!-- 中间部分 -->
    <button 
    v-for="(page,index) in startNumberEndNumber.end" 
    :key="index" v-show="page >= startNumberEndNumber.start"
    @click="$emit('getPageNo',page)"
    :class="{active:pageNo==page}"
    >
    {{page}}
    </button>

    <button v-if="startNumberEndNumber.end < (totalPage-1)">···</button>
    <button v-if="startNumberEndNumber.end < totalPage" @click="$emit('getPageNo',totalPage)" :class="{active:pageNo==totalPage}">{{totalPage}}</button>
    <button :disabled="pageNo==total" @click="$emit('getPageNo',pageNo+1)">下一页</button>

    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props:['pageNo','pageSize','total','continues'],
  computed: {
    totalPage(){
      //向上取整
      return Math.ceil(this.total/this.pageSize);
    },
    startNumberEndNumber(){
      const {continues,totalPage,pageNo} = this;
      let start = 0, end =0;
      //不正常现象
      if(continues>totalPage){
        start = 1;
        end = totalPage;
      }else{
        //正常现象
        start = pageNo - parseInt(continues/2);
        end = pageNo + parseInt(continues/2);
        //把出现不正常的现象【start数字出现0或者负数】纠正
        if(start <1){
          start = 1;
          end = continues;
        }
        //end数字大于totalPage的现象纠正
        if(end > totalPage){
          end = totalPage
          start = totalPage - continues + 1
        }
      }
      return{start, end}
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>