import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseFileStorageTypeEnum {
  ALI_YUN: IEnum<number>;

  MINIO: IEnum<number>;
}

// 存放文件的服务器类型，枚举类
export const BaseFileStorageTypeEnum: IBaseFileStorageTypeEnum = {
  ALI_YUN: {
    code: 101,
    name: "aliyun"
  },

  MINIO: {
    code: 201,
    name: "minio"
  }
};

export const BaseFileStorageTypeOptions: Array<OptionsType> = [];

export const BaseFileStorageTypeMap = new Map<number, string>();

Object.keys(BaseFileStorageTypeEnum).forEach(key => {
  const item = BaseFileStorageTypeEnum[key] as IEnum<number>;

  BaseFileStorageTypeOptions.push({ label: item.name, value: item.code });

  BaseFileStorageTypeMap.set(item.code, item.name);
});
