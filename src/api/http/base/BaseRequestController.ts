import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseRequestPageDTO {
  beginCostMs?: string; // 耗时开始（毫秒），format：int64
  ip?: string; // ip
  pageSize?: string; // 每页显示条数，format：int64
  type?: string; // 请求类型
  uri?: string; // 请求的uri
  successFlag?: boolean; // 请求是否成功
  current?: string; // 第几页，format：int64
  createId?: string; // 创建人id，format：int64
  name?: string; // 接口名（备用）
  endCostMs?: string; // 耗时结束（毫秒），format：int64
  ctEndTime?: string; // 结束时间：创建时间，format：date-time
  category?: string; // 请求类别
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  ctBeginTime?: string; // 起始时间：创建时间，format：date-time
  order?: MyOrderDTO; // 排序字段
}

export interface BaseRequestDO {
  ip?: string; // ip
  count?: string; // 总数量，format：int64
  type?: string; // 请求类型
  uri?: string; // 请求的 uri
  successFlag?: boolean; // 请求是否成功
  costMs?: string; // 耗时（毫秒），format：int64
  createTime?: string; // 创建时间，format：date-time
  createId?: string; // 创建人id，format：int64
  avgMs?: number; // 平均耗时（毫秒），format：int32
  name?: string; // 接口名（备用）
  id?: string; // 主键id，format：int64
  category?: string; // 请求类别
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
}

// 分页排序查询
export function baseRequestPage(
  form: BaseRequestPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseRequestDO>>(
    "post",
    baseApi("/base/request/page"),
    form,
    config
  );
}

export interface BaseRequestSelfLoginRecordPageDTO {
  current?: string; // 第几页，format：int64
  ip?: string; // ip
  pageSize?: string; // 每页显示条数，format：int64
  category?: string; // 请求类别
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  order?: MyOrderDTO; // 排序字段
}

// 当前用户：登录记录
export function baseRequestSelfLoginRecord(
  form: BaseRequestSelfLoginRecordPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseRequestDO>>(
    "post",
    baseApi("/base/request/self/loginRecord"),
    form,
    config
  );
}

export interface SysRequestAllAvgVO {
  avgMs?: number; // 请求的平均耗时（毫秒），format：int32
  count?: string; // 请求的总数，format：int64
}

// 所有请求的平均耗时-增强：增加筛选项
export function baseRequestAllAvgPro(
  form: BaseRequestPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<SysRequestAllAvgVO>(
    "post",
    baseApi("/base/request/allAvgPro"),
    form,
    config
  );
}
