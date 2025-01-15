import type { IEnum } from "@/model/enum/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseFileUploadTypeEnum {
  AVATAR: IEnum<number>;

  EXCEL: IEnum<number>;

  TEXT: IEnum<number>;

  PDF: IEnum<number>;

  TEMP_IMAGE: IEnum<number>;

  BPMN: IEnum<number>;

  TEMP_FILE: IEnum<number>;

  FILE_SYSTEM: IEnum<number>;
}

// 文件上传类型，枚举类
export const BaseFileUploadTypeEnumEnum: IBaseFileUploadTypeEnum = {
  AVATAR: {
    code: 101,
    name: "头像"
  },

  EXCEL: {
    code: 201,
    name: "excel"
  },

  TEXT: {
    code: 301,
    name: "txt"
  },

  PDF: {
    code: 401,
    name: "pdf"
  },

  TEMP_IMAGE: {
    code: 501,
    name: "临时文件-图片"
  },

  BPMN: {
    code: 601,
    name: "bpmn"
  },

  TEMP_FILE: {
    code: 701,
    name: "临时文件"
  },

  FILE_SYSTEM: {
    code: 801,
    name: "文件系统"
  }
};

export const BaseFileUploadTypeEnumOptions: Array<OptionsType> = [];

export const BaseFileUploadTypeEnumMap = new Map<number, string>();

Object.keys(BaseFileUploadTypeEnumEnum).forEach(key => {
  const item = BaseFileUploadTypeEnumEnum[key] as IEnum<number>;

  BaseFileUploadTypeEnumOptions.push({ label: item.name, value: item.code });

  BaseFileUploadTypeEnumMap.set(item.code, item.name);
});
