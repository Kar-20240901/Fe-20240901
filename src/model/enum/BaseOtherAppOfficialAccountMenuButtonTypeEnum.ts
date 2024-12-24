import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseOtherAppOfficialAccountMenuButtonTypeEnum {
  CLICK: IEnum<number>;

  VIEW: IEnum<number>;

  MINIPROGRAM: IEnum<number>;
}

// 第三方应用，公众号按钮类型，枚举类
export const BaseOtherAppOfficialAccountMenuButtonTypeEnum: IBaseOtherAppOfficialAccountMenuButtonTypeEnum =
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

export const BaseOtherAppOfficialAccountMenuButtonTypeOptions: Array<OptionsType> =
  [];

export const BaseOtherAppOfficialAccountMenuButtonTypeMap = new Map<
  number,
  string
>();

Object.keys(BaseOtherAppOfficialAccountMenuButtonTypeEnum).forEach(key => {
  const item = BaseOtherAppOfficialAccountMenuButtonTypeEnum[
    key
  ] as IEnum<number>;

  BaseOtherAppOfficialAccountMenuButtonTypeOptions.push({
    label: item.name,
    value: item.code
  });

  BaseOtherAppOfficialAccountMenuButtonTypeMap.set(item.code, item.name);
});
