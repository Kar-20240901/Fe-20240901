import type { FormRules } from "element-plus";
import { Validate } from "@/utils/ValidatorUtil";

export const formRules: FormRules = {
  number: [
    {
      required: true,
      message: "累加值为必填项",
      trigger: "blur",
      asyncValidator: Validate.integer.validator
    }
  ]
};
