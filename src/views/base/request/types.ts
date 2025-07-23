import type { IDialogFormProps } from "@/model/types/IDialogFormProps";
import type { BaseRequestInfoDO } from "@/api/http/base/BaseRequestInfoController";
import type { BaseRequestDO } from "@/api/http/base/BaseRequestController";

export type IRequestDialogFormProps = IDialogFormProps;

export interface IBaseRequestFullInfoDO
  extends BaseRequestInfoDO,
    BaseRequestDO {
  categoryName?: string; // 终端名称
  createName?: string; // 请求用户
}
