import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseAuthInsertOrUpdateDTO {
  auth?: string; // 权限，例子：base:menu:edit，required：true
  name?: string; // 权限名，不能重复，required：true
  roleIdSet?: string[]; // 角色idSet，format：int64
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function baseAuthInsertOrUpdate(
  form: BaseAuthInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/auth/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseAuthPageDTO {
  current?: string; // 第几页，format：int64
  auth?: string; // 权限，例子：base:menu:edit
  name?: string; // 权限名（不能重复）
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseAuthDO {
  updateId?: string; // 修改人id，format：int64
  createTime?: string; // 创建时间，format：date-time
  auth?: string; // 权限，例子：base:menu:edit
  createId?: string; // 创建人id，format：int64
  name?: string; // 角色名（不能重复）
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseAuthPage(
  form: BaseAuthPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseAuthDO>>(
    "post",
    baseApi("/base/auth/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface BaseAuthInfoByIdVO {
  updateId?: string; // 修改人id，format：int64
  createTime?: string; // 创建时间，format：date-time
  auth?: string; // 权限，例子：base:menu:edit
  createId?: string; // 创建人id，format：int64
  name?: string; // 角色名（不能重复）
  roleIdSet?: string[]; // 角色idSet，format：int64
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 通过主键id，查看详情
export function baseAuthInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseAuthInfoByIdVO>(
    "post",
    baseApi("/base/auth/infoById"),
    form,
    config
  );
}

export interface DictVO {
  name?: string; // 显示用
  id?: string; // 传值用，format：int64
}

// 下拉列表
export function baseAuthDictList(config?: PureHttpRequestConfig) {
  return http.request<Page<DictVO>>(
    "post",
    baseApi("/base/auth/dictList"),
    undefined,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseAuthDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/auth/deleteByIdSet"),
    form,
    config
  );
}
