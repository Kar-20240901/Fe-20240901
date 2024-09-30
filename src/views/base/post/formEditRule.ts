import type { FormRules } from "element-plus";

export const formEditRule: FormRules = {
  name: [{ required: true, message: "岗位名称为必填项", trigger: "blur" }]
};
