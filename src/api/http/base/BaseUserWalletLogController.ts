import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseUserWalletLogPageDTO {
  current?: string; // 第几页，格式：int64
  name?: string; // 记录名
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  ctEndTime?: string; // 结束时间：创建时间，格式：date-time
  type?: number; // 记录类型：1开头 增加 2开头 减少，格式：int32
  ctBeginTime?: string; // 起始时间：创建时间，格式：date-time
  userId?: string; // 用户主键 id，格式：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseUserWalletLogDO {
  refData?: string; // 关联的数据
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  type?: number; // 记录类型：1开头 增加 2开头 减少，格式：int32
  userId?: string; // 用户主键 id，格式：int64
  updateId?: string; // 修改人id，格式：int64
  createTime?: string; // 创建时间，格式：date-time
  withdrawableMoneySuf?: number; // 可提现的钱，后
  createId?: string; // 创建人id，格式：int64
  withdrawableMoneyChange?: number; // 可提现的钱，变
  name?: string; // 记录名
  withdrawableMoneyPre?: number; // 可提现的钱，前
  id?: string; // 主键 id，格式：int64
  refId?: string; // 关联的 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseUserWalletLogPage(
  form: BaseUserWalletLogPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserWalletLogDO>>(
    "post",
    baseApi("/base/userWalletLog/page"),
    form,
    config
  );
}

export interface BaseUserWalletLogUserSelfPageDTO {
  current?: string; // 第几页，格式：int64
  name?: string; // 记录名
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  ctEndTime?: string; // 结束时间：创建时间，格式：date-time
  type?: number; // 记录类型：1开头 增加 2开头 减少，格式：int32
  ctBeginTime?: string; // 起始时间：创建时间，格式：date-time
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询-用户自我
export function baseUserWalletLogPageUserSelf(
  form: BaseUserWalletLogUserSelfPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserWalletLogDO>>(
    "post",
    baseApi("/base/userWalletLog/page/userSelf"),
    form,
    config
  );
}
