import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseUserWalletLogTypeEnum {
  ADD_PAY: IEnum<number>;

  ADD_BACKGROUND: IEnum<number>;

  ADD_TIME_CHECK: IEnum<number>;

  REDUCE_WITHDRAW: IEnum<number>;

  REDUCE_BACKGROUND: IEnum<number>;
}

// 用户钱包操作日志类型，枚举类
export const BaseUserWalletLogTypeEnum: IBaseUserWalletLogTypeEnum = {
  ADD_PAY: {
    code: 101,
    name: "支付充值"
  },

  ADD_BACKGROUND: {
    code: 102,
    name: "后台充值"
  },

  ADD_TIME_CHECK: {
    code: 103,
    name: "超时返还"
  },

  REDUCE_WITHDRAW: {
    code: 201,
    name: "用户提现"
  },

  REDUCE_BACKGROUND: {
    code: 202,
    name: "后台扣除"
  }
};

export const BaseUserWalletLogTypeOptions: Array<OptionsType> = [];

export const BaseUserWalletLogTypeMap = new Map<number, string>();

Object.keys(BaseUserWalletLogTypeEnum).forEach(key => {
  const item = BaseUserWalletLogTypeEnum[key] as IEnum<number>;

  BaseUserWalletLogTypeOptions.push({ label: item.name, value: item.code });

  BaseUserWalletLogTypeMap.set(item.code, item.name);
});
