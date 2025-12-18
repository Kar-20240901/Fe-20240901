import type { Page } from "@/model/vo/Page";
import type MyOrderDTO from "@/model/dto/MyOrderDTO";
import { http } from "@/utils/http";
import { baseApi } from "@/api/http/utils";
import type { PureHttpRequestConfig } from "@/utils/http/types";

export interface NotNullId {
  id?: string; // 主键 id，是否必传：true，格式：int64
}

// 通过主键id，查看支付状态-本平台
export function basePayPayTradeStatusById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/pay/payTradeStatusById"),
    form,
    config
  );
}

export interface BasePayDO {
  refData?: string; // 关联的数据，建议：修改
  originalPrice?: number; // 支付原始的钱
  subject?: string; // 支付名称
  openId?: string; // 用户 openId
  refType?: number; // 关联的类型，建议：修改，格式：int32
  remark?: string; // 备注
  body?: string; // 商品描述
  updateId?: string; // 修改人id，格式：int64
  payType?: number; // 支付方式，格式：int32
  payPrice?: number; // 冗余字段：实际支付的钱
  payAppId?: string; // 支付平台，应用 id
  id?: string; // 主键 id，格式：int64
  refStatus?: number; // 关联的状态，建议：修改，格式：int32
  packageName?: string; // app包名，必须是创建登录 api项目时，创建 android客户端 id使用包名，例如：谷歌支付
  enableFlag?: boolean; // 是否启用
  tradeNo?: string; // 支付平台，支付号
  productId?: string; // 对应购买商品的商品 id，例如：谷歌支付
  payReturnValue?: string; // 支付返回的参数
  updateTime?: string; // 修改时间，格式：date-time
  userId?: string; // 用户主键 id，格式：int64
  basePayConfigurationId?: string; // 支付配置主键 id，格式：int64
  token?: string; // 购买成功后 Purchase对象的 getPurchaseToken()，例如：谷歌支付
  expireTime?: string; // 支付过期时间，格式：date-time
  createTime?: string; // 创建时间，格式：date-time
  createId?: string; // 创建人id，格式：int64
  payCurrency?: string; // 实际支付的钱的单位，例如：人民币 CNY
  refId?: string; // 关联的 id，建议：修改，格式：int64
  status?: string; // 支付状态，枚举值：-1;0;101;201;301;401;501
}

// 通过主键id，查看详情
export function basePayInfoById(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<BasePayDO>(
    "post",
    baseApi("/base/pay/infoById"),
    form,
    config
  );
}

export interface BasePayPageDTO {
  current?: string; // 第几页，格式：int64
  payType?: number; // 支付方式，格式：int32
  pageSize?: string; // 每页显示条数，不能小于 1，并且不能大于 100，格式：int64
  id?: string; // 主键 id，格式：int64
  refStatus?: number; // 关联的状态，建议：修改，格式：int32
  userId?: string; // 用户主键 id，格式：int64
  basePayConfigurationId?: string; // 支付配置主键 id，格式：int64
  order?: MyOrderDTO; // 排序字段
  status?: string; // 支付状态，枚举值：-1;0;101;201;301;401;501
}

// 分页排序查询
export function basePayPage(
  form: BasePayPageDTO,
  config?: PureHttpRequestConfig
) {
  return http.request<Page<BasePayDO>>(
    "post",
    baseApi("/base/pay/page"),
    form,
    config
  );
}

// 通过主键id，查看支付状态-第三方支付平台
export function basePayPayTradeStatusByIdThird(
  form: NotNullId,
  config?: PureHttpRequestConfig
) {
  return http.request<string>(
    "post",
    baseApi("/base/pay/payTradeStatusById/third"),
    form,
    config
  );
}
