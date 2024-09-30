import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseRolePageDTO {
  current?: string; // 第几页，format：int64
  defaultFlag?: boolean; // 是否是默认角色，备注：只会有一个默认角色
  name?: string; // 角色名（不能重复）
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseRoleDO {
  updateId?: string; // 修改人id，format：int64
  defaultFlag?: boolean; // 是否是默认角色，备注：只会有一个默认角色
  createTime?: string; // 创建时间，format：date-time
  createId?: string; // 创建人id，format：int64
  name?: string; // 角色名（不能重复）
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
  uuid?: string; // 唯一标识（不能重复）
}

// 分页排序查询
export function baseRolePage(
  form: BaseRolePageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseRoleDO>>(
    "post",
    baseApi("/base/role/page"),
    form,
    config
  );
}

export interface BaseRoleInsertOrUpdateDTO {
  userIdSet?: string[]; // 用户idSet，format：int64
  defaultFlag?: boolean; // 是否是默认角色，备注：只会有一个默认角色
  name?: string; // 角色名，不能重复，required：true
  menuIdSet?: string[]; // 菜单idSet，format：int64
  authIdSet?: string[]; // 权限idSet，format：int64
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  uuid?: string; // 唯一标识（不能重复）
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function baseRoleInsertOrUpdate(
  form: BaseRoleInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/role/insertOrUpdate"),
    form,
    config
  );
}

export interface DictVO {
  name?: string; // 显示用
  id?: string; // 传值用，format：int64
}

// 下拉列表
export function baseRoleDictList(config?: PureHttpRequestConfig) {
  return http.request<Page<DictVO>>(
    "post",
    baseApi("/base/role/dictList"),
    undefined,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseRoleDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/role/deleteByIdSet"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface BaseRoleInfoByIdVO {
  defaultFlag?: boolean; // 是否是默认角色，备注：只会有一个默认角色
  userIdSet?: string[]; // 用户idSet，format：int64
  menuIdSet?: string[]; // 菜单idSet，format：int64
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  authIdSet?: string[]; // 权限idSet，format：int64
  uuid?: string; // 唯一标识（不能重复）
  updateId?: string; // 修改人id，format：int64
  createTime?: string; // 创建时间，format：date-time
  createId?: string; // 创建人id，format：int64
  name?: string; // 角色名（不能重复）
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 通过主键id，查看详情
export function baseRoleInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseRoleInfoByIdVO>(
    "post",
    baseApi("/base/role/infoById"),
    form,
    config
  );
}
