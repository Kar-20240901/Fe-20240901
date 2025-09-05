import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseFileTypeEnum {
  FILE: IEnum<number>;

  FOLDER: IEnum<number>;
}

// 文件类型，枚举类
export const BaseFileTypeEnum: IBaseFileTypeEnum = {
  FILE: {
    code: 101,
    name: "文件"
  },

  FOLDER: {
    code: 201,
    name: "文件夹"
  }
};

export const BaseFileTypeOptions: Array<OptionsType> = [];

export const BaseFileTypeMap = new Map<number, string>();

Object.keys(BaseFileTypeEnum).forEach(key => {
  const item = BaseFileTypeEnum[key] as IEnum<number>;

  BaseFileTypeOptions.push({ label: item.name, value: item.code });

  BaseFileTypeMap.set(item.code, item.name);
});
