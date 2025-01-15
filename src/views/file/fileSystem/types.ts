import type { BaseFileDO } from "@/api/http/base/BaseFileController";
import type { IDialogFormProps } from "@/model/types/IDialogFormProps";

export interface IDataList {
  id: number;
  l: BaseFileDO[];
}

export interface IFileTreeDialogFormProps extends IDialogFormProps {
  tree: BaseFileDO[];
}

export interface IUploadDialogFormProps extends IDialogFormProps {
  tableSearch?: () => void;
}
