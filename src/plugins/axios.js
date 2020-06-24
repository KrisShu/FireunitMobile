import axios from "axios";

const service = axios.create({
  baseURL: "http://fd.sctsjkj.com:5081",
  timeout: 60000
});
// todo 打包上线后统一加上后端地址
// axios.defaults.baseURL = "http://fd.sctsjkj.com:5080";
console.log("service.baseURL", service.baseURL);
// service.defaults.retry = 1; //重试次数
// service.defaults.retryDelay = 1000; //重试延时
// service.defaults.shouldRetry = function; //重试条件，默认只要是错误都需要重试
service.interceptors.request.use(
  function(config) {
    // let value = config.params;
    // if (value) {
    //   value.UserId = store.state.userInfo.userId; // 给所有请求加上用户id
    // }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  function(response) {
    return Promise.resolve(response.data);
  },
  function(error) {
    return Promise.reject(error);
  }
);

export default service;
