import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface BaseUserWalletWithdrawLogPageDTO {
  bankCardNo?: string; // 卡号
  pageSize?: string; // 每页显示条数，format：int64
  endWithdrawMoney?: number; // 提现金额：结束值
  withdrawStatus?: string; // 提现状态
  userId?: string; // 用户主键 id，format：int64
  openBankName?: string; // 开户行
  payeeName?: string; // 收款人姓名
  current?: string; // 第几页，format：int64
  rejectReason?: string; // 拒绝理由
  branchBankName?: string; // 支行
  id?: string; // 提现编号，format：int64
  ctEndTime?: string; // 结束时间：创建时间，format：date-time
  ctBeginTime?: string; // 起始时间：创建时间，format：date-time
  beginWithdrawMoney?: number; // 提现金额：开始值
  order?: MyOrderDTO; // 排序字段
}

export interface BaseUserWalletWithdrawLogDO {
  bankCardNo?: string; // 冗余字段：卡号
  updateTime?: string; // 修改时间，format：date-time
  remark?: string; // 备注
  userId?: string; // 用户主键 id，format：int64
  withdrawMoney?: number; // 提现金额
  withdrawStatus?: string; // 提现状态
  openBankName?: string; // 冗余字段：开户行
  updateId?: string; // 修改人id，format：int64
  payeeName?: string; // 冗余字段：收款人姓名
  rejectReason?: string; // 拒绝理由
  createTime?: string; // 创建时间，format：date-time
  createId?: string; // 创建人id，format：int64
  branchBankName?: string; // 冗余字段：支行
  id?: string; // 主键 id，format：int64
  enableFlag?: boolean; // 是否启用
}

// 分页排序查询
export function baseUserWalletWithdrawLogPage(
  form: BaseUserWalletWithdrawLogPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserWalletWithdrawLogDO>>(
    "post",
    baseApi("/base/userWalletWithdrawLog/page"),
    form,
    config
  );
}

export interface NotNullId {
  id?: string; // 主键 id，required：true，format：int64
}

// 取消-用户
export function baseUserWalletWithdrawLogCancelUserSelf(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/cancel/userSelf"),
    form,
    config
  );
}

// 成功-用户的提现记录
export function baseUserWalletWithdrawLogSuccess(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/success"),
    form,
    config
  );
}

export interface BaseUserWalletWithdrawLogInsertOrUpdateDTO {
  withdrawMoney?: number; // 提现金额，required：true
  userId?: string; // 用户主键 id，format：int64
}

// 新增/修改
export function baseUserWalletWithdrawLogInsertOrUpdate(
  form: BaseUserWalletWithdrawLogInsertOrUpdateDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/insertOrUpdate"),
    form,
    config
  );
}

export interface BaseUserWalletWithdrawLogInsertOrUpdateUserSelfDTO {
  withdrawMoney?: number; // 提现金额，required：true
}

// 新增/修改-用户
export function baseUserWalletWithdrawLogInsertOrUpdateUserSelf(
  form: BaseUserWalletWithdrawLogInsertOrUpdateUserSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/insertOrUpdate/userSelf"),
    form,
    config
  );
}

// 通过主键id，查看详情
export function baseUserWalletWithdrawLogInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseUserWalletWithdrawLogDO>(
    "post",
    baseApi("/base/userWalletWithdrawLog/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，required：true，format：int64
}

// 受理-用户的提现记录
export function baseUserWalletWithdrawLogAccept(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/accept"),
    form,
    config
  );
}

export interface NotNullIdAndStringValue {
  id?: string; // 主键 id，required：true，format：int64
  value?: string; // 值，required：true
}

// 拒绝-用户的提现记录
export function baseUserWalletWithdrawLogReject(
  form: NotNullIdAndStringValue,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/reject"),
    form,
    config
  );
}

export interface DictIntegerVO {
  name?: string; // 显示用
  id?: number; // 传值用，format：int32
}

// 下拉列表-提现状态
export function baseUserWalletWithdrawLogDictListWithdrawStatus(
  config?: PureHttpRequestConfig
) {
  return http.request<Page<DictIntegerVO>>(
    "post",
    baseApi("/base/userWalletWithdrawLog/dictList/withdrawStatus"),
    undefined,
    config
  );
}

export interface BaseUserWalletWithdrawLogPageUserSelfDTO {
  bankCardNo?: string; // 卡号
  pageSize?: string; // 每页显示条数，format：int64
  endWithdrawMoney?: number; // 提现金额：结束值
  withdrawStatus?: string; // 提现状态
  openBankName?: string; // 开户行
  payeeName?: string; // 收款人姓名
  current?: string; // 第几页，format：int64
  rejectReason?: string; // 拒绝理由
  branchBankName?: string; // 支行
  id?: string; // 提现编号，format：int64
  ctEndTime?: string; // 结束时间：创建时间，format：date-time
  ctBeginTime?: string; // 起始时间：创建时间，format：date-time
  beginWithdrawMoney?: number; // 提现金额：开始值
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询-用户
export function baseUserWalletWithdrawLogPageUserSelf(
  form: BaseUserWalletWithdrawLogPageUserSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserWalletWithdrawLogDO>>(
    "post",
    baseApi("/base/userWalletWithdrawLog/page/userSelf"),
    form,
    config
  );
}

// 取消
export function baseUserWalletWithdrawLogCancel(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWalletWithdrawLog/cancel"),
    form,
    config
  );
}
