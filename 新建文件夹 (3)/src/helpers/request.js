import axios from "axios";
import qs from "qs";
import { DefaultBaseUrl } from "@/constants";
import { ElMessage } from 'element-plus';

// 创建实例时配置默认值
const instance = axios.create({
  baseURL: DefaultBaseUrl,
  timeout: 1200 * 1000, // 设置超时
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize: (params) =>
      qs.stringify(
        Object.fromEntries(
          Object.entries(params)
            .filter(
              ([, v]) =>
                !['', 'undefined', 'null', undefined, null].includes((v)?.toString() ?? v),
            )
            .map(([k, v]) => [k, v]),
        ),
      ),
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    //let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imhva2luIiwicGFzc3dvcmQiOiJob2tpbiIsImV4cCI6MTcwMTMwNjkwMn0.toExQlD00re8M4-BsDAKd_lKDj3k3nm-paDvhkV75xg';
    let token = window.sessionStorage.getItem("token");
    if (token) {
      config.headers['token'] = token
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // console.log("response", response.data);
    let { code, message } = response.data;
    if (code !== 200) {
      ElMessage.error(message)
      return Promise.reject(response.data);
    } else {
      // 对响应数据做点什么
      return response.data;
    }
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default instance;
