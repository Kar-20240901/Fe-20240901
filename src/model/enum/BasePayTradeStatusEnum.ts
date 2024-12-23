import type { IEnum } from "@/model/enum/CommonEnum";

export interface IBasePayTradeStatusEnum {
  NOT_EXIST: IEnum<number>;

  WAIT_BUYER_PAY: IEnum<number>;

  WAIT_BUYER_CONSUME: IEnum<number>;

  TRADE_CLOSED: IEnum<number>;

  TRADE_SUCCESS: IEnum<number>;

  TRADE_FINISHED: IEnum<number>;
}

// 交易状态枚举类
export const BasePayTradeStatusEnum: IBasePayTradeStatusEnum = {
  NOT_EXIST: {
    code: -1,
    name: "订单不存在"
  },

  WAIT_BUYER_PAY: {
    code: 101,
    name: "等待付款",
    status: "processing"
  },

  WAIT_BUYER_CONSUME: {
    code: 201,
    name: "等待核销" // 支付完成，等待核销，例如：谷歌支付
  },

  TRADE_CLOSED: {
    code: 301,
    name: "交易关闭" // 未付款交易超时关闭，或支付完成后全额退款
  },

  TRADE_SUCCESS: {
    code: 401,
    name: "支付成功", //
    status: "success"
  },

  TRADE_FINISHED: {
    code: 501,
    name: "交易结束" // 交易结束，不可退款
  }
};

export const BasePayTradeStatusMap = new Map<number, string>();

export const BasePayTradeStatusStatusMap = new Map<number, string>();

Object.keys(BasePayTradeStatusEnum).forEach(key => {
  const item = BasePayTradeStatusEnum[key] as IEnum<number>;

  BasePayTradeStatusMap.set(item.code, item.name);

  BasePayTradeStatusStatusMap.set(item.code, item.status);
});
