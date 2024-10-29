import { baseFileGetPublicUrl } from "@/api/http/base/BaseFileController";

// 处理：头像文件 id
export function handleAvatarFileId(
  avatarFileId: string,
  callBack: (url: string) => void
) {
  if (avatarFileId === "-1") {
    callBack("");
    return;
  }
  baseFileGetPublicUrl({ idSet: [avatarFileId!] }).then(res => {
    callBack(res.data.map![avatarFileId] || "");
  });
}
