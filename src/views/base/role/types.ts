import type { IDialogFormProps } from "@/model/types/IDialogFormProps";
import type { BaseMenuDO } from "@/api/http/base/BaseMenuController";
import type { DictVO } from "@/api/http/base/BaseAuthController";

export interface IRoleDialogFormProps extends IDialogFormProps {
  userDictList: DictVO[];
  authDictList: DictVO[];
  menuDictList: BaseMenuDO[];
}
