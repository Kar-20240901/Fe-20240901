import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseSmsTypeEnum {
  ALI_YUN: IEnum<number>;

  TENCENT_YUN: IEnum<number>;
}

// 短信类型，枚举类
export const BaseSmsTypeEnum: IBaseSmsTypeEnum = {
  ALI_YUN: {
    code: 101,
    name: "阿里云"
  },

  TENCENT_YUN: {
    code: 201,
    name: "腾讯云"
  }
};

export const BaseSmsTypeOptions: Array<OptionsType> = [];

export const BaseSmsTypeMap = new Map<number, string>();

Object.keys(BaseSmsTypeEnum).forEach(key => {
  const item = BaseSmsTypeEnum[key] as IEnum<number>;

  BaseSmsTypeOptions.push({ label: item.name, value: item.code });

  BaseSmsTypeMap.set(item.code, item.name);
});
