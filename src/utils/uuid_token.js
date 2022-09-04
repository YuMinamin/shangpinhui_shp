import {v4 as uuidv4 } from 'uuid'
//要生成一个随机字符串，且每次执行不能发生变化
export const getUUID = () => {
  //先从本地存储获取uuid
  let uuid_token = localStorage.getItem('UUIDTOKEN');
  //如果没有就生成
  if(!uuid_token){
    //生成游客临时身份
    uuid_token = uuidv4();
    //本地存储存储一次
    localStorage.setItem('UUIDTOKEN',uuid_token)
  }
  //切记得有返回值 没有返回值是undefined
  return uuid_token;
}
