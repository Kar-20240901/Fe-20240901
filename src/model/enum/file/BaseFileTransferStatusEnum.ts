import type { IEnum } from "@/model/enum/base/CommonEnum";
import type { OptionsType } from "@/components/ReSegmented";

export interface IBaseFileTransferStatusEnum {
  TRANSFER_IN: IEnum<number>;

  TRANSFER_STOP: IEnum<number>;

  TRANSFER_COMPLETE: IEnum<number>;

  TRANSFER_CANCEL: IEnum<number>;

  COMPOSE_IN: IEnum<number>;

  COMPOSE_COMPLETE: IEnum<number>;
}

// 文件传输状态类型，枚举类
export const BaseFileTransferStatusEnum: IBaseFileTransferStatusEnum = {
  TRANSFER_IN: {
    code: 101,
    name: "传输中"
  },

  TRANSFER_STOP: {
    code: 201,
    name: "传输暂停"
  },

  TRANSFER_COMPLETE: {
    code: 301,
    name: "传输完成"
  },

  TRANSFER_CANCEL: {
    code: 401,
    name: "传输取消"
  },

  COMPOSE_IN: {
    code: 501,
    name: "合并中"
  },

  COMPOSE_COMPLETE: {
    code: 601,
    name: "完成"
  }
};

export const BaseFileTransferStatusOptions: Array<OptionsType> = [];

export const BaseFileTransferStatusMap = new Map<number, string>();

Object.keys(BaseFileTransferStatusEnum).forEach(key => {
  const item = BaseFileTransferStatusEnum[key] as IEnum<number>;

  BaseFileTransferStatusOptions.push({ label: item.name, value: item.code });

  BaseFileTransferStatusMap.set(item.code, item.name);
});
