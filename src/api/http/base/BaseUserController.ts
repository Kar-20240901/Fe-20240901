import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量：冻结
export function baseUserFreeze(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/user/freeze"),
    form,
    config
  );
}

// 当前用户：重置头像
export function baseUserSelfResetAvatar(config?: PureHttpRequestConfig) {
  return http.request<string>(
    "post",
    baseApi("/base/user/self/resetAvatar"),
    undefined,
    config
  );
}

export interface BaseUserInsertOrUpdateDTO {
  postIdSet?: string[]; // 岗位 idSet，format：int64
  wxOpenId?: string; // 微信 openId
  wxAppId?: string; // 微信 appId
  bio?: string; // 个人简介
  authIdSet?: string[]; // 权限 idSet，format：int64
  originPassword?: string; // 前端加密之后的原始密码
  password?: string; // 前端加密之后的密码
  deptIdSet?: string[]; // 部门 idSet，format：int64
  phone?: string; // 手机号码
  wxUnionId?: string; // 微信 unionId
  nickname?: string; // 昵称，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{1,20}$
  roleIdSet?: string[]; // 角色 idSet，format：int64
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 正常/冻结
  email?: string; // 邮箱
  manageSignInFlag?: boolean; // 是否允许登录：后台管理系统
  username?: string; // 用户名
}

// 新增/修改
export function baseUserInsertOrUpdate(
  form: BaseUserInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/user/insertOrUpdate"),
    form,
    config
  );
}

// 批量：重置头像
export function baseUserResetAvatar(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/user/resetAvatar"),
    form,
    config
  );
}

// 批量：注销用户
export function baseUserDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/user/deleteByIdSet"),
    form,
    config
  );
}

export interface BaseUserPageDTO {
  passwordFlag?: boolean; // 是否有密码
  wxOpenId?: string; // 微信 openId
  signUpType?: string; // 请求类别
  ip?: string; // ip
  wxAppId?: string; // 微信 appId
  pageSize?: string; // 每页显示条数，format：int64
  endCreateTime?: string; // 创建结束时间，format：date-time
  current?: string; // 第几页，format：int64
  beginCreateTime?: string; // 创建开始时间，format：date-time
  phone?: string; // 手机号码
  nickname?: string; // 昵称
  id?: string; // 主键 id，format：int64
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  enableFlag?: boolean; // 是否正常
  endLastActiveTime?: string; // 最近活跃结束时间，format：date-time
  email?: string; // 邮箱
  order?: MyOrderDTO; // 排序字段
  username?: string; // 用户名
  beginLastActiveTime?: string; // 最近活跃开始时间，format：date-time
}

export interface BaseUserPageVO {
  passwordFlag?: boolean; // 是否有密码
  lastActiveTime?: string; // 最近活跃时间，format：date-time
  avatarFileId?: string; // 头像 fileId（文件主键 id），备注：没有时则为 -1，format：int64
  wxOpenId?: string; // 微信 openId
  signUpType?: string; // 请求类别
  ip?: string; // ip
  wxAppId?: string; // 微信 appId
  phone?: string; // 手机号码，会脱敏
  createTime?: string; // 创建时间，format：date-time
  nickname?: string; // 昵称
  id?: string; // 主键 id，format：int64
  region?: string; // Ip2RegionUtil.getRegion() 获取到的 ip所处区域
  enableFlag?: boolean; // 正常/冻结
  email?: string; // 邮箱，备注：会脱敏
  manageSignInFlag?: boolean; // 后台登录
  username?: string; // 用户名，会脱敏
}

// 分页排序查询
export function baseUserPage(
  form: BaseUserPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserPageVO>>(
    "post",
    baseApi("/base/user/page"),
    form,
    config
  );
}

export interface BaseUserUpdatePasswordDTO {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
  newPassword?: string; // 前端加密之后的，新密码
  newOriginPassword?: string; // 前端加密之后的原始密码，新密码
}

// 批量：修改密码
export function baseUserUpdatePassword(
  form: BaseUserUpdatePasswordDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/user/updatePassword"),
    form,
    config
  );
}

// 批量：解冻
export function baseUserThaw(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>("post", baseApi("/base/user/thaw"), form, config);
}

export interface BaseUserSelfUpdateInfoDTO {
  nickname?: string; // 昵称，正则表达式：^[\u4E00-\u9FA5A-Za-z0-9_-]{1,20}$
  bio?: string; // 个人简介
}

// 当前用户：基本信息：修改
export function baseUserSelfUpdateInfo(
  form: BaseUserSelfUpdateInfoDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/user/self/updateInfo"),
    form,
    config
  );
}

// 是否允许后台登录
export function baseUserManageSignInFlag(config?: PureHttpRequestConfig) {
  return http.request<boolean>(
    "post",
    baseApi("/base/user/manageSignInFlag"),
    undefined,
    config
  );
}

export interface BaseUserSelfInfoVO {
  passwordFlag?: boolean; // 是否有密码，用于前端显示，修改密码/设置密码
  phone?: string; // 手机号码，会脱敏
  createTime?: string; // 账号注册时间，format：date-time
  wxOpenId?: string; // 微信 openId，会脱敏
  avatarFileId?: string; // 头像 fileId（文件主键 id），format：int64
  nickname?: string; // 昵称
  wxAppId?: string; // 微信 appId，会脱敏
  bio?: string; // 个人简介
  id?: string; // 用户主键 id，format：int64
  email?: string; // 邮箱，会脱敏
  username?: string; // 用户名，会脱敏
}

// 获取：当前用户，基本信息
export function baseUserSelfInfo(config?: PureHttpRequestConfig) {
  return http.request<BaseUserSelfInfoVO>(
    "post",
    baseApi("/base/user/self/info"),
    undefined,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

export interface TempUserInfoByIdVO {
  postIdSet?: string[]; // 岗位 idSet，format：int64
  wxOpenId?: string; // 微信 openId，可以为空，wxAppId + wxOpenId 唯一
  avatarFileId?: string; // 头像 fileId（文件主键 id），format：int64
  wxAppId?: string; // 微信 appId，可以为空，wxAppId + wxOpenId 唯一，备注：因为微信对不同的公众号或者小程序，会提供相同的 wxAppId，所以需要加上 wxOpenId，进行唯一性检查
  bio?: string; // 个人简介
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  authIdSet?: string[]; // 权限 idSet，format：int64
  updateId?: string; // 修改人id，format：int64
  password?: string; // 密码，可为空，如果为空，则登录时需要提示【进行忘记密码操作】
  deptIdSet?: string[]; // 部门 idSet，format：int64
  createTime?: string; // 创建时间，format：date-time
  phone?: string; // 手机号，可以为空
  createId?: string; // 创建人id，format：int64
  wxUnionId?: string; // 微信 unionId，可以为空，wxUnionId 唯一
  nickname?: string; // 昵称
  roleIdSet?: string[]; // 角色 idSet，format：int64
  areaIdSet?: string[]; // 区域 idSet，format：int64
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 正常/冻结
  email?: string; // 邮箱，可以为空
  manageSignInFlag?: boolean; // 是否允许登录：后台管理系统
  username?: string; // 用户名，可以为空
}

// 通过主键id，查看详情
export function baseUserInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<TempUserInfoByIdVO>(
    "post",
    baseApi("/base/user/infoById"),
    form,
    config
  );
}

export interface DictVO {
  name?: string; // 显示用
  id?: string; // 传值用，format：int64
}

// 下拉列表
export function baseUserDictList(config?: PureHttpRequestConfig) {
  return http.request<Page<DictVO>>(
    "post",
    baseApi("/base/user/dictList"),
    undefined,
    config
  );
}
