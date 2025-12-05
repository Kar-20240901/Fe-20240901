import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

export interface BaseParamDO {
  updateId?: string; // 修改人id，格式：int64
  createTime?: string; // 创建时间，格式：date-time
  createId?: string; // 创建人id，格式：int64
  name?: string; // 配置名，备注：以 uuid为不变值进行使用，不要用此属性
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
  value?: string; // 值
  uuid?: string; // 该参数的 uuid，备注：系统内置参数的 uuid等于 id
}

// 通过主键id，查看详情
export function baseParamInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseParamDO>(
    "post",
    baseApi("/base/param/infoById"),
    form,
    config
  );
}

export interface BaseParamPageDTO {
  current?: string; // 第几页，格式：int64
  name?: string; // 参数名，备注：以 uuid为不变值进行使用，不要用此属性
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseParamPage(
  form: BaseParamPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseParamDO>>(
    "post",
    baseApi("/base/param/page"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseParamDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/param/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseParamInsertOrUpdateDTO {
  name?: string; // 参数名，备注：以 uuid为不变值进行使用，不要用此属性，是否必传：true
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  value?: string; // 值，是否必传：true
  enableFlag?: boolean; // 是否启用
  uuid?: string; // 该参数的 uuid，备注：不能重复
}

// 新增/修改
export function baseParamInsertOrUpdate(
  form: BaseParamInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/param/insertOrUpdate"),
    form,
    config
  );
}
