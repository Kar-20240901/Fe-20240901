import type { FormRules } from "element-plus";
import { Validate } from "@/utils/ValidatorUtil";

export const formEditRule: FormRules = {
  nickname: [
    {
      required: true,
      message: "用户昵称为必填项",
      trigger: "blur",
      asyncValidator: Validate.nickname.validator
    }
  ],
  username: [
    {
      trigger: "blur",
      asyncValidator: Validate.username.canNullValidator
    }
  ],
  email: [
    {
      trigger: "blur",
      asyncValidator: Validate.email.canNullValidator
    }
  ],
  phone: [
    {
      trigger: "blur",
      asyncValidator: Validate.phone.canNullValidator
    }
  ],
  password: [
    {
      trigger: "blur",
      asyncValidator: Validate.password.canNullValidator
    }
  ]
};
