import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量：启用socket
export function baseSocketEnableByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/socket/enableByIdSet"),
    form,
    config
  );
}

export interface BaseSocketPageDTO {
  current?: string; // 第几页，格式：int64
  scheme?: string; // 协议
  port?: number; // 端口，格式：int32
  host?: string; // 主机
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  type?: string; // socket类型，枚举值：101;201
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseSocketDO {
  scheme?: string; // 协议：例如：ws://，wss:// 等
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  type?: string; // socket类型，枚举值：101;201
  updateId?: string; // 修改人id，格式：int64
  path?: string; // 路径，备注：以 / 开头
  macAddress?: string; // mac地址，用于：和 port一起判断是否是重复启动，如果是，则需要移除之前的 socket信息
  createTime?: string; // 创建时间，格式：date-time
  port?: number; // 端口，格式：int32
  createId?: string; // 创建人id，格式：int64
  host?: string; // 主机
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseSocketPage(
  form: BaseSocketPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseSocketDO>>(
    "post",
    baseApi("/base/socket/page"),
    form,
    config
  );
}

// 批量：禁用socket
export function baseSocketDisableByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/socket/disableByIdSet"),
    form,
    config
  );
}

// 批量：删除socket
export function baseSocketDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/socket/deleteByIdSet"),
    form,
    config
  );
}
