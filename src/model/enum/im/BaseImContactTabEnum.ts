import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImContactTabEnum {
  FRIEND: IEnum<string>;

  GROUP: IEnum<string>;
}

// 联系人页面类型，枚举类
export const BaseImContactTabEnum: IBaseImContactTabEnum = {
  FRIEND: {
    code: "friend",
    name: "好友"
  },

  GROUP: {
    code: "group",
    name: "群聊"
  }
};

export const BaseImContactTabEnumOptions: Array<OptionsType> = [];

export const BaseImContactTabEnumMap = new Map<number, string>();

Object.keys(BaseImContactTabEnum).forEach(key => {
  const item = BaseImContactTabEnum[key] as IEnum<number>;

  BaseImContactTabEnumOptions.push({ label: item.name, value: item.code });

  BaseImContactTabEnumMap.set(item.code, item.name);
});
