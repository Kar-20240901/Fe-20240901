import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseRequestPageDTO {
  beginCostMs?: string; // 耗时开始（毫秒），格式：int64
  ip?: string; // ip
  pageSize?: string; // 每页显示条数，格式：int64
  type?: string; // 请求类型
  uri?: string; // 请求的uri
  successFlag?: boolean; // 请求是否成功
  current?: string; // 第几页，格式：int64
  createId?: string; // 创建人id，格式：int64
  name?: string; // 接口名（备用）
  endCostMs?: string; // 耗时结束（毫秒），格式：int64
  ctEndTime?: string; // 结束时间：创建时间，格式：date-time
  category?: string; // 请求类别，枚举值：101;102;103;104;105;106;201;202;203;301;302;303;401;402;403;501;502;601;701
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  ctBeginTime?: string; // 起始时间：创建时间，格式：date-time
  order?: MyOrderDTO; // 排序字段
}

export interface BaseRequestDO {
  method?: string; // 请求方式，枚举值：GET;POST;PUT;DELETE;HEAD;OPTIONS;TRACE;CONNECT;PATCH;WEB_SOCKET
  ip?: string; // ip
  count?: string; // 总数量，格式：int64
  type?: string; // 请求类型
  uri?: string; // 请求的 uri
  successFlag?: boolean; // 请求是否成功
  costMs?: string; // 耗时（毫秒），格式：int64
  createTime?: string; // 创建时间，格式：date-time
  createId?: string; // 创建人id，格式：int64
  avgMs?: number; // 平均耗时（毫秒），格式：int32
  name?: string; // 接口名（备用）
  id?: string; // 主键id，格式：int64
  category?: string; // 请求类别，枚举值：101;102;103;104;105;106;201;202;203;301;302;303;401;402;403;501;502;601;701
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
  current?: string; // 第几页，格式：int64
  ip?: string; // ip
  pageSize?: string; // 每页显示条数，格式：int64
  category?: string; // 请求类别，枚举值：101;102;103;104;105;106;201;202;203;301;302;303;401;402;403;501;502;601;701
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

export interface BaseRequestAllAvgVO {
  avgMs?: number; // 请求的平均耗时（毫秒），格式：int32
  count?: string; // 请求的总数，格式：int64
}

// 所有请求的平均耗时-增强：增加筛选项
export function baseRequestAllAvgPro(
  form: BaseRequestPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseRequestAllAvgVO>(
    "post",
    baseApi("/base/request/allAvgPro"),
    form,
    config
  );
}
