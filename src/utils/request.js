/****   request.js   ****/
//引入baseUrl 
import { baseUrl, } from "../../config/env";

// 导入axios
import axios from 'axios'
// 使用element-ui Message做消息提醒
import Message from '@/utils/message.js';
import notify from '@/utils/notify.js'
//1. 创建新的axios实例，
const service = axios.create({
  // 公共接口--这里注意后面会讲
  baseURL: baseUrl,
  // 超时时间 单位是ms，这里设置了30s的超时时间
  timeout: 30 * 1000
})
// 2.请求拦截器
service.interceptors.request.use(config => {
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等
  var token = localStorage.getItem('Token'); //注意使用的时候需要引入cookie方法，推荐js - cookie
  if (token) {
    config.headers['Token'] = token
  }
  // config.headers['Access-Control-Allow-Origin'] = '*'
  //config.headers['Token'] = '679FCC86D919AC355942370DC82B3B02F240931798569101E2FDC07CD4374CB7'
  return config
}, error => {
  Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  //接收到响应数据并成功后的一些共有的处理，关闭loading等
  const data = response.data;
  let message = data.message
  if (!data.success && Boolean(message)) {
    if (message.indexOf("DONT_TIP") == -1) {
      Message.error(data.message);
    }

    return
  }
  return response
}, error => {
  Message.error("网络异常");
  return Promise.resolve(error)
})
//4.导入文件
export default service