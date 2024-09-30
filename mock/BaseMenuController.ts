// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import CommonConstant from "@/model/constant/CommonConstant";

export default defineFakeRoute([
  {
    url: "/base/menu/userSelfMenuList",
    method: "post",
    response: () => {
      return {
        code: CommonConstant.API_OK_CODE,
        receive: true,
        data: []
      };
    }
  }
]);
