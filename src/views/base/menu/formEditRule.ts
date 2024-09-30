import type { FormRules } from "element-plus";

export const formEditRule: FormRules = {
  name: [{ required: true, message: "菜单名称为必填项", trigger: "blur" }],
  path: [{ required: true, message: "菜单路径为必填项", trigger: "blur" }]
};
