import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseImSessionRefUserDeleteNotDisturbDTO {
  friendUserIdSet?: string[]; // 好友用户主键 id集合，格式：int64
  sessionIdSet?: string[]; // 会话主键 id集合，格式：int64
  groupIdSet?: string[]; // 群组主键 id集合，格式：int64
}

// 删除免打扰
export function baseImSessionRefUserDeleteNotDisturb(
  form: BaseImSessionRefUserDeleteNotDisturbDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imSessionRefUser/deleteNotDisturb"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

export interface BaseImSessionRefUserUpdateAvatarAndNicknameVO {
  showName?: string; // 显示的会话名，一定有值
  targetId?: string; // 目标 id，可以查询到好友用户主键 id，或者群组主键 id，一定有值，格式：int64
  avatarUrl?: string; // 冗余字段：头像 url，一定有值
  targetType?: number; // 目标类型：101 好友 201 群组，一定有值，格式：int32
  sessionId?: string; // 会话主键 id，一定有值，格式：int64
}

// 更新头像和昵称
export function baseImSessionRefUserUpdateAvatarAndNickname(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImSessionRefUserUpdateAvatarAndNicknameVO[]>(
    "post",
    baseApi("/base/imSessionRefUser/updateAvatarAndNickname"),
    form,
    config
  );
}

export interface BaseImSessionRefUserAddNotDisturbDTO {
  friendUserIdSet?: string[]; // 好友用户主键 id集合，格式：int64
  sessionIdSet?: string[]; // 会话主键 id集合，格式：int64
  groupIdSet?: string[]; // 群组主键 id集合，格式：int64
}

// 新增免打扰
export function baseImSessionRefUserAddNotDisturb(
  form: BaseImSessionRefUserAddNotDisturbDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imSessionRefUser/addNotDisturb"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 隐藏
export function baseImSessionRefUserHidden(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/imSessionRefUser/hidden"),
    form,
    config
  );
}

// 查询最新消息和未读消息数量
export function baseImSessionRefUserQueryLastContentMap(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<object>(
    "post",
    baseApi("/base/imSessionRefUser/queryLastContentMap"),
    form,
    config
  );
}

export interface ScrollListDTO {
  backwardFlag?: boolean; // 是否向后查询，默认：false 根据 id，往前查询 true 根据 id，往后查询
  pageSize?: string; // 本次查询的长度，默认：20，格式：int64
  refIdSet?: string[]; // 关联的 id集合，格式：int64
  id?: string; // 主键 id，如果为 null，则根据 backwardFlag，来查询最大 id或者最小 id，注意：不会查询该 id的数据，格式：int64
  searchKey?: string; // 搜索内容
  refId?: string; // 关联其他主键 id，格式：int64
  containsCurrentIdFlag?: boolean; // 是否包含当前主键 id，默认：false
  queryMoreFlag?: boolean; // 是否多查询一些数据，backwardFlag 为 true时，往前多查询几条数据，为 false时，往后多查询几条数据，如果不足 pageSize，会补齐并且会额外多查询几条数据
}

export interface BaseImSessionRefUserPageVO {
  lastContentType?: number; // 最新消息类型，格式：int32
  notDisturbFlag?: boolean; // 是否是免打扰：true 是 false 否
  lastReceiveTs?: string; // 最后一次接受到消息时的时间戳，默认为：-1，备注：该字段用于：排序，格式：int64
  targetId?: string; // 目标 id，可以查询到好友用户主键 id，或者群组主键 id，一定有值，格式：int64
  avatarUrl?: string; // 冗余字段：头像 url，一定有值
  lastContent?: string; // 最新消息，备注：会截断或者处理
  lastContentCreateTs?: string; // 最新消息创建时间戳，格式：int64
  sessionName?: string; // 显示的会话名，一定有值
  targetType?: number; // 目标类型：101 好友 201 群组，一定有值，格式：int32
  sessionId?: string; // 会话主键 id，一定有值，格式：int64
  unReadCount?: number; // 未读数量，格式：int32
}

// 滚动加载
export function baseImSessionRefUserScroll(
  form: ScrollListDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseImSessionRefUserPageVO[]>(
    "post",
    baseApi("/base/imSessionRefUser/scroll"),
    form,
    config
  );
}

export interface BaseImSessionRefUserPageDTO {
  queryContentFlag?: boolean; // 是否查询：未读消息数量，最新一条消息，默认：false
  current?: string; // 第几页，格式：int64
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  sessionIdSet?: string[]; // 会话主键 id集合，格式：int64
  sessionId?: string; // 会话主键 id，格式：int64
  searchKey?: string; // 搜索内容：会话名
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseImSessionRefUserPage(
  form: BaseImSessionRefUserPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseImSessionRefUserPageVO>>(
    "post",
    baseApi("/base/imSessionRefUser/page"),
    form,
    config
  );
}
