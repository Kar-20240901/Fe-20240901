import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullLong {
  value?: string; // 值，是否必传：true，格式：int64
}

export interface BaseUserWalletDO {
  updateId?: string; // 修改人id，格式：int64
  createTime?: string; // 创建时间，格式：date-time
  createId?: string; // 创建人id，格式：int64
  totalMoney?: number; // 总金额
  updateTime?: string; // 修改时间，格式：date-time
  remark?: string; // 备注
  id?: string; // 用户主键 id，格式：int64
  withdrawableRealMoney?: number; // 实际可提现的钱
  withdrawablePreUseMoney?: number; // 可提现的钱：预使用，例如用于：用户提现时，需要扣除租户的可提现的钱时
  enableFlag?: boolean; // 是否启用
  withdrawableMoney?: number; // 可提现的钱
}

// 通过主键id，查看详情
export function baseUserWalletInfoById(
  form: NotNullLong,
  config?: PureHttpRequestConfig
) {
  return http.request<BaseUserWalletDO>(
    "post",
    baseApi("/base/userWallet/infoById"),
    form,
    config
  );
}

export interface NotEmptyIdSet {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
}

// 批量解冻
export function baseUserWalletThawByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWallet/thawByIdSet"),
    form,
    config
  );
}

export interface ChangeBigDecimalNumberIdSetDTO {
  idSet?: string[]; // 主键 idSet，是否必传：true，格式：int64
  number?: number; // 需要改变的数值，是否必传：true
}

// 通过主键 idSet，加减可提现的钱
export function baseUserWalletAddWithdrawableMoneyBackground(
  form: ChangeBigDecimalNumberIdSetDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWallet/addWithdrawableMoney/background"),
    form,
    config
  );
}

export interface BaseUserWalletPageDTO {
  current?: string; // 第几页，格式：int64
  utEndTime?: string; // 结束时间：更新时间，格式：date-time
  endWithdrawableMoney?: number; // 提现金额：结束值
  pageSize?: string; // 每页显示条数，格式：int64
  id?: string; // 用户主键 id，格式：int64
  utBeginTime?: string; // 起始时间：更新时间，格式：date-time
  beginWithdrawableMoney?: number; // 提现金额：开始值
  enableFlag?: boolean; // 是否启用
  order?: MyOrderDTO; // 排序字段
}

// 分页排序查询
export function baseUserWalletPage(
  form: BaseUserWalletPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BaseUserWalletDO>>(
    "post",
    baseApi("/base/userWallet/page"),
    form,
    config
  );
}

// 通过主键id，查看详情-用户
export function baseUserWalletInfoByIdUserSelf(config?: PureHttpRequestConfig) {
  return http.request<BaseUserWalletDO>(
    "post",
    baseApi("/base/userWallet/infoById/userSelf"),
    undefined,
    config
  );
}

export interface BaseUserWalletRechargeUserSelfDTO {
  payType?: number; // 支付方式，备注：如果为 null，则表示用默认支付方式，格式：int32
  value?: number; // 值，是否必传：true
}

export interface BuyVO {
  payType?: number; // 实际的支付方式，格式：int32
  outTradeNo?: string; // 本系统的支付订单号
  payReturnValue?: string; // 支付返回的参数
  basePayConfigurationId?: string; // 支付配置主键 id，格式：int64
}

// 充值-用户自我
export function baseUserWalletRechargeUserSelf(
  form: BaseUserWalletRechargeUserSelfDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<BuyVO>(
    "post",
    baseApi("/base/userWallet/recharge/userSelf"),
    form,
    config
  );
}

// 批量冻结
export function baseUserWalletFrozenByIdSet(
  form: NotEmptyIdSet,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/userWallet/frozenByIdSet"),
    form,
    config
  );
}
