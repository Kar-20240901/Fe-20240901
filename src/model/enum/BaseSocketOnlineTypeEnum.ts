import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseSocketOnlineTypeEnum {
  ONLINE: IEnum<number>;

  HIDDEN: IEnum<number>;

  PING_TEST: IEnum<number>;
}

// socket 在线状态，枚举类
export const BaseSocketOnlineTypeEnum: IBaseSocketOnlineTypeEnum = {
  ONLINE: {
    code: 101,
    name: "在线"
  },

  HIDDEN: {
    code: 201,
    name: "隐身"
  },

  PING_TEST: {
    code: 100001,
    name: "ping测试"
  }
};

export const BaseSocketOnlineTypeOptions: Array<OptionsType> = [];

export const BaseSocketOnlineTypeMap = new Map<number, string>();

Object.keys(BaseSocketOnlineTypeEnum).forEach(key => {
  const item = BaseSocketOnlineTypeEnum[key] as IEnum<number>;

  BaseSocketOnlineTypeOptions.push({ label: item.name, value: item.code });

  BaseSocketOnlineTypeMap.set(item.code, item.name);
});
