import type { IDialogFormProps } from "@/model/types/IDialogFormProps";
import type { DictVO } from "@/api/http/base/BaseRoleController";

export interface IUserDialogFormProps extends IDialogFormProps {
  roleDictList: DictVO[];
}

export interface IFormUpdatePassword {
  newPassword?: string;
  newOriginPassword?: string;
}
