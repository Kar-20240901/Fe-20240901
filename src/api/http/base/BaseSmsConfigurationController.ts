import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseSmsConfigurationPageDTO {
  current?: string; // 第几页，格式：int64
  defaultFlag?: boolean; // 是否是默认短信发送，备注：只会有一个默认短信发送
  name?: string; // 短信名
  pageSize?: string; // 每页显示条数，格式：int64
  remark?: string; // 备注
  type?: number; // 短信类型：101 阿里 201 腾讯，格式：int32
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseSmsConfigurationDO {
  sendCommon?: string; // 发送：通用短信
  sendSignDelete?: string; // 发送：账号注销
  secretId?: string; // 钥匙
  sendSetUserName?: string; // 发送：设置用户名
  remark?: string; // 备注
  type?: number; // 短信类型：101 阿里 201 腾讯，格式：int32
  updateId?: string; // 修改人id，格式：int64
  sendSetEmail?: string; // 发送：设置邮箱
  sendUpdatePhone?: string; // 发送：修改手机
  id?: string; // 主键 id，格式：int64
  sendSetWx?: string; // 发送：设置微信
  enableFlag?: boolean; // 是否启用
  sendSignIn?: string; // 发送：登录短信
  defaultFlag?: boolean; // 是否是默认短信发送，备注：只会有一个默认短信发送
  signName?: string; // 签名内容
  secretKey?: string; // 秘钥
  sendUpdateEmail?: string; // 发送：修改邮箱
  sendSetPhone?: string; // 发送：设置手机
  sendSignUp?: string; // 发送：注册短信
  sendUpdateUserName?: string; // 发送：修改用户名
  updateTime?: string; // 修改时间，格式：date-time
  sendUpdatePassword?: string; // 发送：修改密码
  sendUpdateWx?: string; // 发送：修改微信
  sendForgetPassword?: string; // 发送：忘记密码
  createTime?: string; // 创建时间，格式：date-time
  createId?: string; // 创建人id，格式：int64
  sdkAppId?: string; // 短信应用 id
  name?: string; // 短信名
  sendSetPassword?: string; // 发送：设置密码
}

// 分页排序查询
export function baseSmsConfigurationPage(
  form: BaseSmsConfigurationPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseSmsConfigurationDO>>(
    "post",
    baseApi("/base/smsConfiguration/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 通过主键id，查看详情
export function baseSmsConfigurationInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseSmsConfigurationDO>(
    "post",
    baseApi("/base/smsConfiguration/infoById"),
    form,
    config
  );
}

export interface BaseSmsConfigurationInsertOrUpdateDTO {
  sendCommon?: string; // 发送：通用短信
  sendSignDelete?: string; // 发送：账号注销
  secretId?: string; // 钥匙
  sendSetUserName?: string; // 发送：设置用户名
  remark?: string; // 备注
  type?: number; // 短信类型：101 阿里 201 腾讯，是否必传：true，格式：int32
  sendSetEmail?: string; // 发送：设置邮箱
  sendUpdatePhone?: string; // 发送：修改手机
  id?: string; // 主键 id，格式：int64
  sendSetWx?: string; // 发送：设置微信
  enableFlag?: boolean; // 是否启用
  sendSignIn?: string; // 发送：登录短信
  defaultFlag?: boolean; // 是否是默认短信发送，备注：只会有一个默认短信发送
  signName?: string; // 签名内容
  secretKey?: string; // 秘钥
  sendUpdateEmail?: string; // 发送：修改邮箱
  sendSetPhone?: string; // 发送：设置手机
  sendSignUp?: string; // 发送：注册短信
  sendUpdateUserName?: string; // 发送：修改用户名
  sendUpdatePassword?: string; // 发送：修改密码
  sendUpdateWx?: string; // 发送：修改微信
  sendForgetPassword?: string; // 发送：忘记密码
  sdkAppId?: string; // 短信应用 id
  name?: string; // 短信名，是否必传：true
  sendSetPassword?: string; // 发送：设置密码
}

// 新增/修改
export function baseSmsConfigurationInsertOrUpdate(
  form: BaseSmsConfigurationInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/smsConfiguration/insertOrUpdate"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseSmsConfigurationDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/smsConfiguration/deleteByIdSet"),
    form,
    config
  );
}
