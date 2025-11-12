import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseImSessionContentTypeEnum {
  TEXT: IEnum<number>;

  IMAGE: IEnum<number>;

  FILE: IEnum<number>;
}

// 会话内容类型，枚举类
export const BaseImSessionContentTypeEnum: IBaseImSessionContentTypeEnum = {
  TEXT: {
    code: 101,
    name: "文字"
  },

  IMAGE: {
    code: 201,
    name: "图片"
  },

  FILE: {
    code: 301,
    name: "文件"
  }
};

export const BaseImSessionContentTypeEnumOptions: Array<OptionsType> = [];

export const BaseImSessionContentTypeEnumMap = new Map<number, string>();

Object.keys(BaseImSessionContentTypeEnum).forEach(key => {
  const item = BaseImSessionContentTypeEnum[key] as IEnum<number>;

  BaseImSessionContentTypeEnumOptions.push({
    label: item.name,
    value: item.code
  });

  BaseImSessionContentTypeEnumMap.set(item.code, item.name);
});
