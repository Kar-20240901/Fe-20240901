import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import type { Page } from "@/model/vo/Page";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface DictStringVO {
  name?: string; // 显示用
  id?: string; // 传值用
}

// 下拉列表-开户行名称
export function baseUserBankCardDictListOpenBankName(
  config?: PureHttpRequestConfig
) {
  return http.request<Page<DictStringVO>>(
    "post",
    baseApi("/base/userBankCard/dictList/openBankName"),
    undefined,
    config
  );
}

export interface BaseUserBankCardDO {
  updateId?: string; // 修改人id，format：int64
  payeeName?: string; // 收款人姓名
  createTime?: string; // 创建时间，format：date-time
  bankCardNo?: string; // 卡号
  createId?: string; // 创建人id，format：int64
  branchBankName?: string; // 支行
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  id?: string; // 用户主键 id，format：int64
  enableFlag?: boolean; // 是否启用
  openBankName?: string; // 开户行
}

// 通过主键id，查看详情-用户
export function baseUserBankCardInfoByIdUserSelf(
  config?: PureHttpRequestConfig
) {
  return http.request<BaseUserBankCardDO>(
    "post",
    baseApi("/base/userBankCard/infoById/userSelf"),
    undefined,
    config
  );
}

export interface NotNullLong {
  value?: string; // 值，required：true，format：int64
}

// 通过主键id，查看详情
export function baseUserBankCardInfoById(
  form: NotNullLong,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseUserBankCardDO>(
    "post",
    baseApi("/base/userBankCard/infoById"),
    form,
    config
  );
}

export interface BaseUserBankCardPageDTO {
  payeeName?: string; // 收款人姓名
  current?: string; // 第几页，format：int64
  bankCardNo?: string; // 卡号
  pageSize?: string; // 每页显示条数，format：int64
  branchBankName?: string; // 支行
  id?: string; // 用户主键 id，format：int64
  order?: MyOrderDTO; // 排序字段
  openBankName?: string; // 开户行
}

// 分页排序查询
export function baseUserBankCardPage(
  form: BaseUserBankCardPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserBankCardDO>>(
    "post",
    baseApi("/base/userBankCard/page"),
    form,
    config
  );
}

export interface BaseUserBankCardInsertOrUpdateDTO {
  payeeName?: string; // 收款人姓名，required：true
  bankCardNo?: string; // 卡号，正则表达式：^(\d{16}|\d{19}|\d{17})$，required：true
  branchBankName?: string; // 支行，required：true
  id?: string; // 用户主键 id，format：int64
  openBankName?: string; // 开户行，required：true
}

// 新增/修改
export function baseUserBankCardInsertOrUpdate(
  form: BaseUserBankCardInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userBankCard/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseUserBankCardInsertOrUpdateUserSelfDTO {
  payeeName?: string; // 收款人姓名，required：true
  bankCardNo?: string; // 卡号，正则表达式：^(\d{16}|\d{19}|\d{17})$，required：true
  branchBankName?: string; // 支行，required：true
  openBankName?: string; // 开户行，required：true
}

// 新增/修改-用户
export function baseUserBankCardInsertOrUpdateUserSelf(
  form: BaseUserBankCardInsertOrUpdateUserSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userBankCard/insertOrUpdate/userSelf"),
    form,
    config
  );
}
