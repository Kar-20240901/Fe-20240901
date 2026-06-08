import { BaseImSessionContentTypeEnum } from "@/model/enum/im/BaseImSessionContentTypeEnum";

const TEXT_FRIEND_APPLY_FINISH_TXT =
  "我通过了您的好友验证请求，现在我们可以开始聊天了";

const TEXT_GROUP_CREATE_FINISH = "您已创建群聊";

const TEXT_GROUP_APPLY_FINISH = "我通过了群聊申请，现在我们可以开始聊天了";

export function DoGetImSessionContent(type: number, content: string): string {
  if (type === BaseImSessionContentTypeEnum.TEXT.code) {
    return content || "";
  } else if (type === BaseImSessionContentTypeEnum.NONE.code) {
    return "";
  } else if (
    type === BaseImSessionContentTypeEnum.TEXT_FRIEND_APPLY_FINISH.code
  ) {
    return TEXT_FRIEND_APPLY_FINISH_TXT;
  } else if (
    type === BaseImSessionContentTypeEnum.TEXT_GROUP_CREATE_FINISH.code
  ) {
    return TEXT_GROUP_CREATE_FINISH;
  } else if (
    type === BaseImSessionContentTypeEnum.TEXT_GROUP_APPLY_FINISH.code
  ) {
    return TEXT_GROUP_APPLY_FINISH;
  }
}
