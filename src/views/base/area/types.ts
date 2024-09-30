import type { IDialogTreeFormProps } from "@/model/types/IDialogFormProps";
import type { BaseAreaDO } from "@/api/http/base/BaseAreaController";
import type { DictVO } from "@/api/http/base/BaseAuthController";

export interface IAreaDialogTreeFormProps
  extends IDialogTreeFormProps<BaseAreaDO> {
  userDictList: DictVO[];
}
