import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseDictDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dict/deleteByIdSet"),
    form,
    config
  );
}

export interface ChangeNumberDTO {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
  number?: string; // 需要改变的数值，required：true，format：int64
}

// 通过主键 idSet，加减排序号
export function baseDictAddOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dict/addOrderNo"),
    form,
    config
  );
}

export interface BaseDictInsertOrUpdateDTO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  name?: string; // 字典/字典项 名，required：true
  remark?: string; // 备注
  id?: string; // 主键 id，format：int64
  type?: string; // 字典类型，required：true
  dictKey?: string; // 字典 key（不能重复），备注：字典项要冗余这个 key，目的：方便操作，required：true
  value?: number; // 字典项 value（数字 123...）备注：字典为 -1，format：int32
  enableFlag?: boolean; // 是否启用
  uuid?: string; // 该字典的 uuid，备注：不能重复
}

// 新增/修改
export function baseDictInsertOrUpdate(
  form: BaseDictInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dict/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseDictPageDTO {
  current?: string; // 第几页，format：int64
  name?: string; // 字典/字典项 名
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  type?: string; // 字典类型
  dictKey?: string; // 字典 key（不能重复），备注：字典项要冗余这个 key，目的：方便操作
  enableFlag?: boolean; // 是否启用
  value?: number; // 字典项 value（数字 123...）备注：字典为 -1，format：int32
  order?: MyOrderDTO; // 排序字段
}

export interface TempDictDO {
  orderNo?: number; // 排序号（值越大越前面，默认为 0），format：int32
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  type?: string; // 字典类型
  dictKey?: string; // 字典 key（不能重复），备注：字典项要冗余这个 key，目的：方便操作
  uuid?: string; // 该字典的 uuid
  updateId?: string; // 修改人id，format：int64
  createTime?: string; // 创建时间，format：date-time
  children?: TempDictDO[]; // 字典的子节点
  createId?: string; // 创建人id，format：int64
  name?: string; // 字典/字典项 名
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
  value?: number; // 字典项 value（数字 123...）备注：字典为 -1，format：int32
}

// 分页排序查询
export function baseDictPage(
  form: BaseDictPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<TempDictDO>>(
    "post",
    baseApi("/base/dict/page"),
    form,
    config
  );
}

export interface BaseDictListByDictKeyDTO {
  dictKey?: string; // 字典 key，required：true
}

export interface DictIntegerVO {
  name?: string; // 显示用
  id?: number; // 传值用，format：int32
}

// 通过：dictKey获取字典项集合，备注：会进行缓存
export function baseDictListByDictKey(
  form: BaseDictListByDictKeyDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<DictIntegerVO[]>(
    "post",
    baseApi("/base/dict/listByDictKey"),
    form,
    config
  );
}

// 通过主键 idSet，修改排序号
export function baseDictUpdateOrderNo(
  form: ChangeNumberDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/dict/updateOrderNo"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看详情
export function baseDictInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<TempDictDO>(
    "post",
    baseApi("/base/dict/infoById"),
    form,
    config
  );
}

// 查询：树结构
export function baseDictTree(
  form: BaseDictPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<TempDictDO[]>(
    "post",
    baseApi("/base/dict/tree"),
    form,
    config
  );
}
