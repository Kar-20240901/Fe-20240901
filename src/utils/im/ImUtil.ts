import type { ISessionContentBO } from "@/views/im/imIndex/types";
import { BaseImSessionContentTypeEnum } from "@/model/enum/im/BaseImSessionContentTypeEnum";
import type { BaseImSessionRefUserPageVO } from "@/api/http/base/BaseImSessionRefUserController";

const TEXT_FRIEND_APPLY_FINISH_TXT =
  "我通过了您的好友验证请求，现在我们可以开始聊天了";

const TEXT_GROUP_CREATE_FINISH = "您已创建群聊";

const TEXT_GROUP_APPLY_FINISH = "我通过了群聊申请，现在我们可以开始聊天了";

export function getImSessionContent(item: ISessionContentBO) {
  return doGetImSessionContent(item, "type", "content");
}

export function doGetImSessionContent(
  item: Record<string, any>,
  typeName: string,
  contentName: string
): string {
  if (item[typeName] === BaseImSessionContentTypeEnum.TEXT.code) {
    return item[contentName];
  } else if (item[typeName] === BaseImSessionContentTypeEnum.NONE.code) {
    return "";
  } else if (
    item[typeName] ===
    BaseImSessionContentTypeEnum.TEXT_FRIEND_APPLY_FINISH.code
  ) {
    return TEXT_FRIEND_APPLY_FINISH_TXT;
  } else if (
    item[typeName] ===
    BaseImSessionContentTypeEnum.TEXT_GROUP_CREATE_FINISH.code
  ) {
    return TEXT_GROUP_CREATE_FINISH;
  } else if (
    item[typeName] === BaseImSessionContentTypeEnum.TEXT_GROUP_APPLY_FINISH.code
  ) {
    return TEXT_GROUP_APPLY_FINISH;
  }
}

export function getImSessionLastContent(item: BaseImSessionRefUserPageVO) {
  return doGetImSessionContent(item, "lastContentType", "lastContent");
}
