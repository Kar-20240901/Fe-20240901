import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 解散群组
export function baseImGroupDeleteById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/deleteById"),
    form,
    config
  );
}

export interface ScrollListDTO {
  backwardFlag?: boolean; // 是否向后查询，默认：false 根据 id，往前查询 true 根据 id，往后查询
  pageSize?: string; // 本次查询的长度，默认：20，格式：int64
  id?: string; // 主键 id，如果为 null，则根据 backwardFlag，来查询最大 id或者最小 id，注意：不会查询该 id的数据，格式：int64
  searchKey?: string; // 搜索内容
  refId?: string; // 关联其他主键 id，格式：int64
  containsCurrentIdFlag?: boolean; // 是否包含当前主键 id，默认：false
  queryMoreFlag?: boolean; // 是否多查询一些数据，backwardFlag 为 true时，往前多查询几条数据，为 false时，往后多查询几条数据，如果不足 pageSize，会补齐并且会额外多查询几条数据
}

export interface BaseImGroupPageVO {
  groupShowId?: string; // 群组显示的 id
  groupShowName?: string; // 显示的名称
  avatarUrl?: string; // 头像地址
  groupId?: string; // 群组主键 id
  sessionId?: string; // 会话主键 id，格式：int64
}

// 滚动加载
export function baseImGroupScroll(
  form: ScrollListDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImGroupPageVO[]>(
    "post",
    baseApi("/base/imGroup/scroll"),
    form,
    config
  );
}

export interface BaseImGroupInsertOrUpdateDTO {
  name?: string; // 群组名称，是否必传：true
  id?: string; // 主键 id，格式：int64
}

// 新增/修改
export function baseImGroupInsertOrUpdate(
  form: BaseImGroupInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseImGroupRemoveUserDTO {
  userIdSet?: string[]; // 用户主键 id集合，是否必传：true，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 踢出群员
export function baseImGroupRemoveUser(
  form: BaseImGroupRemoveUserDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/removeUser"),
    form,
    config
  );
}

export interface BaseImGroupChangeBelongIdDTO {
  newBelongId?: string; // 新的群主用户主键 id，是否必传：true，格式：int64
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
}

// 修改群主
export function baseImGroupChangeBelongId(
  form: BaseImGroupChangeBelongIdDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imGroup/changeBelongId"),
    form,
    config
  );
}

export interface BaseImGroupPageDTO {
  current?: string; // 第几页，格式：int64
  groupId?: string; // 群组主键 id，格式：int64
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseImGroupPage(
  form: BaseImGroupPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImGroupPageVO>>(
    "post",
    baseApi("/base/imGroup/page"),
    form,
    config
  );
}
