import type { IDialogTreeFormProps } from "@/model/types/IDialogFormProps";
import type { DictVO } from "@/api/http/base/BaseAuthController";
import type { BaseDeptDO } from "@/api/http/base/BaseDeptController";

export interface IDeptDialogTreeFormProps
  extends IDialogTreeFormProps<BaseDeptDO> {
  userDictList: DictVO[];
}
