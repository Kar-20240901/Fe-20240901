import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BasePayConfigurationPageDTO {
  current?: string; // 第几页，format：int64
  defaultFlag?: boolean; // 是否是默认支付方式，备注：只会有一个默认支付方式
  appId?: string; // 支付平台，应用 id
  name?: string; // 支付名（不可重复）
  pageSize?: string; // 每页显示条数，format：int64
  remark?: string; // 备注
  type?: string; // 支付类型：101 支付宝 201 微信 301 云闪付 401 谷歌
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BasePayConfigurationDO {
  defaultFlag?: boolean; // 是否是默认支付方式，备注：只会有一个默认支付方式
  apiV3Key?: string; // 支付平台，商户APIV3密钥
  platformPublicKey?: string; // 支付平台，公钥
  merchantSerialNumber?: string; // 支付平台，商户证书序列号
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  type?: number; // 支付类型：101 支付宝 201 微信 301 云闪付 401 谷歌，format：int32
  updateId?: string; // 修改人id，format：int64
  privateKey?: string; // 支付平台，私钥
  createTime?: string; // 创建时间，format：date-time
  merchantId?: string; // 支付平台，商户号
  createId?: string; // 创建人id，format：int64
  serverUrl?: string; // 支付平台，网关地址，例如：https://openapi.alipay.com/gateway.do
  appId?: string; // 支付平台，应用 id
  name?: string; // 支付名（不可重复）
  notifyUrl?: string; // 支付平台，异步接收地址
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function basePayConfigurationPage(
  form: BasePayConfigurationPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BasePayConfigurationDO>>(
    "post",
    baseApi("/base/payConfiguration/page"),
    form,
    config
  );
}

export interface DictVO {
  name?: string; // 显示用
  id?: string; // 传值用，format：int64
}

// 下拉列表
export function basePayConfigurationDictList(config?: PureHttpRequestConfig) {
  return http.request<Page<DictVO>>(
    "post",
    baseApi("/base/payConfiguration/dictList"),
    undefined,
    config
  );
}

export interface BasePayConfigurationInsertOrUpdateDTO {
  defaultFlag?: boolean; // 是否是默认支付方式，备注：只会有一个默认支付方式
  apiV3Key?: string; // 支付平台，商户APIV3密钥
  platformPublicKey?: string; // 支付平台，公钥
  merchantSerialNumber?: string; // 支付平台，商户证书序列号
  remark?: string; // 备注
  type?: string; // 支付类型：101 支付宝 201 微信 301 云闪付 401 谷歌，required：true
  privateKey?: string; // 支付平台，私钥
  merchantId?: string; // 支付平台，商户号
  serverUrl?: string; // 支付平台，网关地址，例如：https://openapi.alipay.com/gateway.do
  appId?: string; // 支付平台，应用 id
  name?: string; // 支付名，required：true
  notifyUrl?: string; // 支付平台，异步接收地址
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function basePayConfigurationInsertOrUpdate(
  form: BasePayConfigurationInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/payConfiguration/insertOrUpdate"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 通过主键id，查看详情
export function basePayConfigurationInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BasePayConfigurationDO>(
    "post",
    baseApi("/base/payConfiguration/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 批量删除
export function basePayConfigurationDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/payConfiguration/deleteByIdSet"),
    form,
    config
  );
}
