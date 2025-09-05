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
  groupId?: string; // 群组主键 id，是否必传：true，格式：int64
  userId?: string; // 用户主键 id，是否必传：true，格式：int64
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
  pageSize?: string; // 每页显示条数，格式：int64
  searchKey?: string; // 搜索关键字
  order?: MyOrderDTO; // 排序字段
}

export interface BaseImGroupPageVO {
  groupName?: string; // 显示的名称
  avatarUrl?: string; // 头像地址
  groupId?: string; // 群组主键 id，格式：int64
  sessionId?: string; // 会话主键 id，格式：int64
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
