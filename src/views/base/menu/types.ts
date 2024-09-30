import type { IDialogTreeFormProps } from "@/model/types/IDialogFormProps";
import type { BaseMenuDO } from "@/api/http/base/BaseMenuController";
import type { DictVO } from "@/api/http/base/BaseRoleController";

export interface IMenuDialogTreeFormProps
  extends IDialogTreeFormProps<BaseMenuDO> {
  roleDictList: DictVO[];
}
