import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseThirdAppOfficialMenuButtonTypeEnum {
  CLICK: IEnum<number>;

  VIEW: IEnum<number>;

  MINIPROGRAM: IEnum<number>;
}

// 第三方应用，公众号按钮类型，枚举类
export const BaseThirdAppOfficialMenuButtonTypeEnum: IBaseThirdAppOfficialMenuButtonTypeEnum =
  {
    CLICK: {
      code: 101,
      name: "按钮"
    },

    VIEW: {
      code: 201,
      name: "链接"
    },

    MINIPROGRAM: {
      code: 301,
      name: "小程序"
    }
  };

export const BaseThirdAppOfficialMenuButtonTypeOptions: Array<OptionsType> = [];

export const BaseThirdAppOfficialMenuButtonTypeMap = new Map<number, string>();

Object.keys(BaseThirdAppOfficialMenuButtonTypeEnum).forEach(key => {
  const item = BaseThirdAppOfficialMenuButtonTypeEnum[key] as IEnum<number>;

  BaseThirdAppOfficialMenuButtonTypeOptions.push({
    label: item.name,
    value: item.code
  });

  BaseThirdAppOfficialMenuButtonTypeMap.set(item.code, item.name);
});
