import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseApiTokenPageDTO {
  current?: string; // 第几页，format：int64
  name?: string; // 名称
  pageSize?: string; // 每页显示条数，format：int64
  order?: MyOrderDTO; // 排序字段
}

export interface BaseApiTokenDO {
  createTime?: string; // 创建时间，format：date-time
  name?: string; // apiToken名
  updateTime?: string; // 修改时间，format：date-time
  id?: string; // null，format：int64
  userId?: string; // 用户 id，format：int64
  token?: string; // 调用 api时，传递的 token，格式：uuid
}

// 分页排序查询
export function baseApiTokenPage(
  form: BaseApiTokenPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseApiTokenDO>>(
    "post",
    baseApi("/base/apiToken/page"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseApiTokenDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/apiToken/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseApiTokenInsertOrUpdateDTO {
  name?: string; // 名称，required：true
  id?: string; // 主键 id，format：int64
}

// 新增/修改
export function baseApiTokenInsertOrUpdate(
  form: BaseApiTokenInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/apiToken/insertOrUpdate"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看详情
export function baseApiTokenInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseApiTokenDO>(
    "post",
    baseApi("/base/apiToken/infoById"),
    form,
    config
  );
}
