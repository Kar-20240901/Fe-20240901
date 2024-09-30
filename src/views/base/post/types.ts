import type { IDialogTreeFormProps } from "@/model/types/IDialogFormProps";
import type { DictVO } from "@/api/http/base/BaseAuthController";
import type { BasePostDO } from "@/api/http/base/BasePostController";

export interface IPostDialogTreeFormProps
  extends IDialogTreeFormProps<BasePostDO> {
  userDictList: DictVO[];
}
