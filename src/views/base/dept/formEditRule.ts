import type { FormRules } from "element-plus";

export const formEditRule: FormRules = {
  name: [{ required: true, message: "部门名称为必填项", trigger: "blur" }]
};
