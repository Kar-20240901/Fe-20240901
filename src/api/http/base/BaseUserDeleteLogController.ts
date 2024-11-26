import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseUserDeleteLogPageDTO {
  current?: string; // 第几页，format：int64
  phone?: string; // 手机号，可以为空
  wxOpenId?: string; // 微信 openId，可以为空
  wxAppId?: string; // 微信 appId，可以为空
  nickname?: string; // 昵称
  pageSize?: string; // 每页显示条数，format：int64
  id?: string; // 用户主键 id，format：int64
  uuid?: string; // 该用户的 uuid，本系统使用 id，不使用此字段（uuid），备注：不允许修改
  email?: string; // 邮箱，可以为空
  order?: MyOrderDTO; // 排序字段
  username?: string; // 用户名，可以为空
}

export interface BaseUserDeleteLogDO {
  userCreateTime?: string; // 用户创建时间，format：date-time
  wxOpenId?: string; // 微信 openId，可以为空
  avatarFileId?: string; // 头像 fileId（文件主键 id），format：int64
  signUpType?: string; // 请求类别
  wxAppId?: string; // 微信 appId，可以为空
  bio?: string; // 个人简介
  updateTime?: string; // 修改时间，format：date-time
  uuid?: string; // 该用户的 uuid，本系统使用 id，不使用此字段（uuid），备注：不允许修改
  updateId?: string; // 修改人id，format：int64
  password?: string; // 密码，可为空，如果为空，则登录时需要提示【进行忘记密码操作】
  createTime?: string; // 创建时间，format：date-time
  phone?: string; // 手机号，可以为空
  createId?: string; // 创建人id，format：int64
  nickname?: string; // 昵称
  id?: string; // 用户主键 id，format：int64
  email?: string; // 邮箱，可以为空
  username?: string; // 用户名，可以为空
}

// 分页排序查询
export function baseUserDeleteLogPage(
  form: BaseUserDeleteLogPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserDeleteLogDO>>(
    "post",
    baseApi("/base/userDeleteLog/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看详情
export function baseUserDeleteLogInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseUserDeleteLogDO>(
    "post",
    baseApi("/base/userDeleteLog/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function baseUserDeleteLogDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userDeleteLog/deleteByIdSet"),
    form,
    config
  );
}
