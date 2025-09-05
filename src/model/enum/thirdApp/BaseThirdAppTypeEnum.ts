import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseThirdAppTypeEnum {
  WX_MINI_PROGRAM: IEnum<number>;

  WX_OFFICIAL: IEnum<number>;

  WX_WORK: IEnum<number>;

  ALI_PAY_PROGRAM: IEnum<number>;

  BAI_DU: IEnum<number>;

  VOLC_ENGINE: IEnum<number>;
}

// 第三方应用类型，枚举类
export const BaseThirdAppTypeEnum: IBaseThirdAppTypeEnum = {
  WX_MINI_PROGRAM: {
    code: 101,
    name: "微信小程序"
  },

  WX_OFFICIAL: {
    code: 102,
    name: "微信公众号"
  },

  WX_WORK: {
    code: 103,
    name: "企业微信"
  },

  ALI_PAY_PROGRAM: {
    code: 201,
    name: "支付宝小程序"
  },

  BAI_DU: {
    code: 301,
    name: "百度"
  },

  VOLC_ENGINE: {
    code: 401,
    name: "火山引擎"
  }
};

export const BaseThirdAppTypeOptions: Array<OptionsType> = [];

export const BaseThirdAppTypeMap = new Map<number, string>();

Object.keys(BaseThirdAppTypeEnum).forEach(key => {
  const item = BaseThirdAppTypeEnum[key] as IEnum<number>;

  BaseThirdAppTypeOptions.push({ label: item.name, value: item.code });

  BaseThirdAppTypeMap.set(item.code, item.name);
});
