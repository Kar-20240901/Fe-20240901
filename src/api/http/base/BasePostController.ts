import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface ChangeNumberDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  number?: string; // 需要改变的数值，是否必传：true，格式：int64
}

// 通过主键 idSet，修改排序号
export function basePostUpdateOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/post/updateOrderNo"),
    form,
    config
  );
}

export interface BasePostDO {
  updateId?: string; // 修改人id，格式：int64
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  createTime?: string; // 创建时间，格式：date-time
  children?: BasePostDO[]; // 子节点
  createId?: string; // 创建人id，格式：int64
  name?: string; // 岗位名
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），格式：int64
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
  uuid?: string; // 该岗位的 uuid，备注：不能重复
}

// 下拉树形列表
export function basePostDictTreeList(config?: PureHttpRequestConfig) {
  return http.request<BasePostDO[]>(
    "post",
    baseApi("/base/post/dictTreeList"),
    undefined,
    config
  );
}

export interface BasePostPageDTO {
  current?: string; // 第几页，格式：int64
  name?: string; // 岗位名
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

// 查询：树结构
export function basePostTree(
  form: BasePostPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BasePostDO[]>(
    "post",
    baseApi("/base/post/tree"),
    form,
    config
  );
}

// 通过主键 idSet，加减排序号
export function basePostAddOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/post/addOrderNo"),
    form,
    config
  );
}

// 分页排序查询
export function basePostPage(
  form: BasePostPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BasePostDO>>(
    "post",
    baseApi("/base/post/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

export interface BasePostInfoByIdVO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  userIdSet?: string[]; // 用户主键idSet，格式：int64
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  pid?: string; // 父节点id（顶级则为0），格式：int64
  uuid?: string; // 该岗位的 uuid，备注：不能重复
  updateId?: string; // 修改人id，格式：int64
  createTime?: string; // 创建时间，格式：date-time
  children?: BasePostDO[]; // 子节点
  createId?: string; // 创建人id，格式：int64
  name?: string; // 岗位名
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 通过主键id，查看详情
export function basePostInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BasePostInfoByIdVO>(
    "post",
    baseApi("/base/post/infoById"),
    form,
    config
  );
}

export interface BasePostInsertOrUpdateDTO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），格式：int32
  userIdSet?: string[]; // 用户idSet，格式：int64
  name?: string; // 岗位名，是否必传：true
  pid?: string; // 父节点id（顶级则为0），格式：int64
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  uuid?: string; // 该岗位的 uuid，备注：不能重复
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function basePostInsertOrUpdate(
  form: BasePostInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/post/insertOrUpdate"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function basePostDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/post/deleteByIdSet"),
    form,
    config
  );
}
