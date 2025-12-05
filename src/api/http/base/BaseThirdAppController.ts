import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseThirdAppPageDTO {
  textReplyContent?: string; // 用户发送文字之后，回复的内容
  openId?: string; // 第三方应用的 openId/微信号，例如：接收微信公众号消息时的 ToUserName
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  remark?: string; // 备注
  type?: number; // 第三方应用类型，格式：int32
  current?: string; // 第几页，格式：int64
  imageReplyContent?: string; // 用户发送图片之后，回复的内容
  qrCode?: string; // 二维码，备注：不是二维码图片的地址，而是二维码解码之后的值
  subscribeReplyContent?: string; // 用户点击关注之后，回复的内容，备注：如果取关然后再关注，也会回复该内容
  appId?: string; // 第三方应用的 appId，备注：同一个类型下，所有租户不能重复，原因：比如接收公众号消息时，就无法找到具体是哪一个租户
  name?: string; // 第三方应用名
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

export interface BaseThirdAppDO {
  textReplyContent?: string; // 用户发送文字之后，回复的内容
  openId?: string; // 三方应用的 openId/微信号/企业ID，例如：接收微信公众号消息时的 ToUserName，不能重复
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  secret?: string; // 三方应用的 secret
  type?: number; // 三方应用类型，格式：int32
  updateId?: string; // 修改人id，格式：int64
  imageReplyContent?: string; // 用户发送图片之后，回复的内容
  qrCode?: string; // 二维码，备注：不是二维码图片的地址，而是二维码解码之后的值
  createTime?: string; // 创建时间，格式：date-time
  subscribeReplyContent?: string; // 用户点击关注之后，回复的内容，备注：如果取关然后再关注，也会回复该内容
  createId?: string; // 创建人id，格式：int64
  appId?: string; // 三方应用的 appId，备注：同一个类型下，所有租户不能重复，原因：比如接收公众号消息时，就无法找到具体是哪一个租户
  name?: string; // 三方应用名
  id?: string; // 主键 id，格式：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseThirdAppPage(
  form: BaseThirdAppPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseThirdAppDO>>(
    "post",
    baseApi("/base/thirdApp/page"),
    form,
    config
  );
}

export interface BaseThirdAppInsertOrUpdateDTO {
  textReplyContent?: string; // 用户发送文字之后，回复的内容
  imageReplyContent?: string; // 用户发送图片之后，回复的内容
  qrCode?: string; // 二维码，备注：不是二维码图片的地址，而是二维码解码之后的值
  subscribeReplyContent?: string; // 用户点击关注之后，回复的内容，备注：如果取关然后再关注，也会回复该内容
  openId?: string; // 第三方应用的 openId/微信号，例如：接收微信公众号消息时的 ToUserName
  appId?: string; // 第三方应用的 appId，备注：同一个类型下，所有租户不能重复，原因：比如接收公众号消息时，就无法找到具体是哪一个租户，是否必传：true
  name?: string; // 第三方应用名，是否必传：true
  remark?: string; // 备注
  id?: string; // 主键 id，格式：int64
  secret?: string; // 第三方应用的 secret，是否必传：true
  type?: number; // 第三方应用类型，是否必传：true，格式：int32
  enableFlag?: boolean; // 是否启用
}

// 新增/修改
export function baseThirdAppInsertOrUpdate(
  form: BaseThirdAppInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/thirdApp/insertOrUpdate"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量删除
export function baseThirdAppDeleteByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/thirdApp/deleteByIdSet"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 通过主键id，查看详情
export function baseThirdAppInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseThirdAppDO>(
    "post",
    baseApi("/base/thirdApp/infoById"),
    form,
    config
  );
}

// 通过主键id，获取第三方应用名
export function baseThirdAppGetNameById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/thirdApp/getNameById"),
    form,
    config
  );
}
