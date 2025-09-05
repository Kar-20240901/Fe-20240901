import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImLeftSegmentedEnum {
  SESSION: IEnum<string>;

  CONTACT: IEnum<string>;
}

// 聊天左侧页面类型，枚举类
export const BaseImLeftSegmentedEnum: IBaseImLeftSegmentedEnum = {
  SESSION: {
    code: "session",
    name: "消息"
  },

  CONTACT: {
    code: "session",
    name: "联系人"
  }
};

export const BaseImLeftSegmentedEnumOptions: Array<OptionsType> = [];

export const BaseImLeftSegmentedEnumMap = new Map<number, string>();

Object.keys(BaseImLeftSegmentedEnum).forEach(key => {
  const item = BaseImLeftSegmentedEnum[key] as IEnum<number>;

  BaseImLeftSegmentedEnumOptions.push({ label: item.name, value: item.code });

  BaseImLeftSegmentedEnumMap.set(item.code, item.name);
});
