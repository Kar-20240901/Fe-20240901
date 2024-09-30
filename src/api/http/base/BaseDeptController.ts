import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface BaseDeptDO {
  updateId?: string; // 修改人id，format：int64
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  createTime?: string; // 创建时间，format：date-time
  children?: BaseDeptDO[]; // 子节点
  createId?: string; // 创建人id，format：int64
  name?: string; // 部门名
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），format：int64
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
  uuid?: string; // 该部门的 uuid，备注：不能重复
}

export interface BaseDeptInfoByIdVO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  userIdSet?: string[]; // 用户主键idSet，format：int64
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），format：int64
  uuid?: string; // 该部门的 uuid，备注：不能重复
  updateId?: string; // 修改人id，format：int64
  createTime?: string; // 创建时间，format：date-time
  children?: BaseDeptDO[]; // 子节点
  createId?: string; // 创建人id，format：int64
  name?: string; // 部门名
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 通过主键id，查看详情
export function baseDeptInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseDeptInfoByIdVO>(
    "post",
    baseApi("/base/dept/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseDeptDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dept/deleteByIdSet"),
    form,
    config
  );
}

export interface ChangeNumberDTO {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
  number?: string; // 需要改变的数值，required：true，format：int64
}

// 通过主键 idSet，加减排序号
export function baseDeptAddOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dept/addOrderNo"),
    form,
    config
  );
}

// 下拉树形列表
export function baseDeptDictTreeList(config?: PureHttpRequestConfig) {
  return http.request<BaseDeptDO[]>(
    "post",
    baseApi("/base/dept/dictTreeList"),
    undefined,
    config
  );
}

// 通过主键 idSet，修改排序号
export function baseDeptUpdateOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dept/updateOrderNo"),
    form,
    config
  );
}

export interface BaseDeptPageDTO {
  current?: string; // 第几页，format：int64
  name?: string; // 部门名
  pageSize?: string; // 每页显示条数，format：int64
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

// 查询：树结构
export function baseDeptTree(
  form: BaseDeptPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseDeptDO[]>(
    "post",
    baseApi("/base/dept/tree"),
    form,
    config
  );
}

// 分页排序查询
export function baseDeptPage(
  form: BaseDeptPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseDeptDO>>(
    "post",
    baseApi("/base/dept/page"),
    form,
    config
  );
}

export interface BaseDeptInsertOrUpdateDTO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  userIdSet?: string[]; // 用户idSet，format：int64
  name?: string; // 部门名，required：true
  pid?: string; // 父节点id（顶级则为0），format：int64
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  uuid?: string; // 该部门的 uuid，备注：不能重复
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function baseDeptInsertOrUpdate(
  form: BaseDeptInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dept/insertOrUpdate"),
    form,
    config
  );
}
