import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImTypeEnum {
  FRIEND: IEnum<number>;

  GROUP: IEnum<number>;
}

// 聊天类型，枚举类
export const BaseImTypeEnum: IBaseImTypeEnum = {
  FRIEND: {
    code: 101,
    name: "好友"
  },

  GROUP: {
    code: 201,
    name: "群组"
  }
};

export const BaseImTypeEnumOptions: Array<OptionsType> = [];

export const BaseImTypeEnumMap = new Map<number, string>();

Object.keys(BaseImTypeEnum).forEach(key => {
  const item = BaseImTypeEnum[key] as IEnum<number>;

  BaseImTypeEnumOptions.push({ label: item.name, value: item.code });

  BaseImTypeEnumMap.set(item.code, item.name);
});
