import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer
} from "axios";
import type {
  PureHttpError,
  PureHttpRequestConfig,
  PureHttpResponse,
  RequestMethods
} from "./types.d";
import { stringify } from "qs";
import NProgress from "../progress";
import { formatToken, getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { GetBrowserCategory } from "@/utils/BrowserCategoryUtil";
import type { R } from "@/model/vo/R";
import CommonConstant from "@/model/constant/CommonConstant";
import { router, signPath } from "@/router";
import { ToastError } from "@/utils/ToastUtil";

export const AUTHORIZATION = "Authorization";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 30 * 60 * 1000, // 默认 30分钟
  headers: {
    "Content-Type": "application/json"
  },
  responseType: "json",
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

export const ORIGIN_RESPONSE = "origin-response";

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** `token`过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新`token` */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise(resolve => {
      PureHttp.requests.push((token: string) => {
        config.headers[AUTHORIZATION] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题） */
        const whiteList = ["/jwtRefreshToken"];
        return whiteList.some(url => config.url.endsWith(url))
          ? config
          : new Promise(resolve => {
              const data = getToken();
              config.headers["category"] = GetBrowserCategory(); // 请求类别
              if (data) {
                const now = new Date().getTime();
                const expired = parseInt(data.jwtExpireTs) - now <= 0;
                if (expired) {
                  if (!PureHttp.isRefreshing) {
                    PureHttp.isRefreshing = true;
                    // token过期刷新
                    useUserStoreHook()
                      .handRefreshToken({
                        jwtRefreshToken: data.jwtRefreshToken
                      })
                      .then(res => {
                        const token = res.jwt;
                        config.headers[AUTHORIZATION] = formatToken(token);
                        PureHttp.requests.forEach(cb => cb(token));
                        PureHttp.requests = [];
                      })
                      .finally(() => {
                        PureHttp.isRefreshing = false;
                      });
                  }
                  resolve(PureHttp.retryOriginalRequest(config));
                } else {
                  config.headers[AUTHORIZATION] = formatToken(data.jwt);
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        if ($config.headers[ORIGIN_RESPONSE]) {
          return response;
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T, P = any>(
    method: RequestMethods,
    url: string,
    param?: P,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<R<T>> {
    const config = {
      ...axiosConfig,
      method,
      url,
      data: param
    };

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          const hiddenErrorMsgFlag = config.headers?.hiddenErrorMsg; // 是否隐藏错误提示
          const res = response as R<T>;
          if (res.code !== CommonConstant.API_OK_CODE || !res.receive) {
            if (res.code === 100111) {
              // 这个代码需要跳转到：登录页面
              if (!hiddenErrorMsgFlag) {
                const fullPath = router.currentRoute.value.fullPath;

                if (fullPath === signPath || getToken()?.jwt) {
                  ToastError(res.msg); // 存在 jwt才提示错误消息
                }
              }

              reject(new Error("登录过期"));
              useUserStoreHook().logOut(); // 退出登录
            } else {
              if (!hiddenErrorMsgFlag) {
                ToastError(res.msg || "请求失败：服务器未启动");
              }

              reject(new Error("请求错误：" + JSON.stringify(config)));
            }
          } else {
            resolve(res);
          }
        })
        .catch(error => {
          reject(this.responseInterceptorsError(error, config));
        });
    });
  }

  /** 响应拦截器-错误 */
  private responseInterceptorsError(
    err: PureHttpError,
    config: PureHttpRequestConfig
  ): PureHttpError {
    const hiddenErrorMsgFlag = config.headers?.hiddenErrorMsg; // 是否隐藏错误提示

    if (hiddenErrorMsgFlag) {
      return err; // 这里会触发 catch，备注：如果没有 catch，则会报错
    }

    // 所有的请求错误，例如 500 404 错误，超出 2xx 范围的状态码都会触发该函数。
    let msg: string = err.message;

    if (msg === "Network Error") {
      msg = "连接异常，请重试";
    } else if (msg.includes("timeout")) {
      msg = "请求超时，请重试";
    } else if (msg.includes("Request failed with status code")) {
      const substring = msg.substring(msg.length - 3);

      msg = "接口【" + substring + "】异常，请联系管理员";
    }

    ToastError(msg || "请求错误：" + err.message);

    return err; // 这里会触发 catch，备注：如果没有 catch，则会报错
  }

  /** 单独抽离的`post`工具函数 */
  public post<T, P = any>(
    url: string,
    params?: P,
    config?: PureHttpRequestConfig
  ): Promise<R<T>> {
    return this.request<T, P>("post", url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  public get<T, P = any>(
    url: string,
    params?: P,
    config?: PureHttpRequestConfig
  ): Promise<R<T>> {
    return this.request<T, P>("get", url, params, config);
  }

  /** 通用请求工具函数：原始 */
  public requestOriginal<T, P = any>(
    method: RequestMethods,
    url: string,
    param?: P,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      ...axiosConfig,
      method,
      url,
      data: param
    };

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response as T);
        })
        .catch(error => {
          reject(this.responseInterceptorsError(error, config));
        });
    });
  }
}

export const http = new PureHttp();
