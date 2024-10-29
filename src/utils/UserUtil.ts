import { baseFileGetPublicUrl } from "@/api/http/base/BaseFileController";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal } from "@pureadmin/utils";
import { type DataInfo, getToken, userKey } from "@/utils/auth";

// 处理：头像文件 id
export function handleAvatarFileId(
  avatarFileId: string,
  callBack: (url: string) => void
) {
  if (avatarFileId === "-1") {
    setUserKey({ avatar: "" });
    callBack("");
    return;
  }
  baseFileGetPublicUrl({ idSet: [avatarFileId!] }).then(res => {
    const avatar = res.data.map![avatarFileId] || "";
    setUserKey({ avatar });
    callBack(avatar);
  });
}

export function setUserKey(dataInfo: DataInfo) {
  const dataTemp = getToken();
  const data = { ...dataTemp, ...dataInfo };
  useUserStoreHook().SET_AVATAR(data.avatar);
  useUserStoreHook().SET_USERNAME(data.username);
  useUserStoreHook().SET_NICKNAME(data.nickname);
  useUserStoreHook().SET_ROLES(data.roles);
  useUserStoreHook().SET_PERMS(data.permissions);
  storageLocal().setItem(userKey, data);
}
