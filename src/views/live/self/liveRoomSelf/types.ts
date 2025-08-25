import type { IDialogFormProps } from "@/model/types/IDialogFormProps";

export type ILiveRoomSelfDialogFormProps = IDialogFormProps;

export interface BaseLiveRoomUserAddUserDTO {
  id?: string;
  code?: string;
}

export interface BaseLiveRoomDataAddDataDTO {
  roomId?: string;
  createTs?: number;
  mediaType?: string;
  data: Blob;
  userId?: string; // 后端赋值
  socketRefUserId?: string; // 后端赋值
}
