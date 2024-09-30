import type { FormRules } from "element-plus";

export const formEditRule: FormRules = {
  name: [{ required: true, message: "权限名称为必填项", trigger: "blur" }]
};
