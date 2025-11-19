import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImContactSegmentedEnum {
  FRIEND: IEnum<string>;

  GROUP: IEnum<string>;
}

// 聊天联系人页面类型，枚举类
export const BaseImContactSegmentedEnum: IBaseImContactSegmentedEnum = {
  FRIEND: {
    code: "friend",
    name: "好友"
  },

  GROUP: {
    code: "group",
    name: "群组"
  }
};

export const BaseImContactSegmentedEnumOptions: Array<OptionsType> = [];

export const BaseImContactSegmentedEnumMap = new Map<number, string>();

Object.keys(BaseImContactSegmentedEnum).forEach(key => {
  const item = BaseImContactSegmentedEnum[key] as IEnum<number>;

  BaseImContactSegmentedEnumOptions.push({
    label: item.name,
    value: item.code
  });

  BaseImContactSegmentedEnumMap.set(item.code, item.name);
});
