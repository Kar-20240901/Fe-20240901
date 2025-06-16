import { GetMyWebSocket } from "@/utils/webSocket/WebSocketUtil";
import { WebSocketSend } from "@/utils/webSocket/WebSocketHelper";
import { JsonAddByteArr } from "@/utils/BlobUtil";
import type {
  BaseLiveRoomDataAddDataDTO,
  BaseLiveRoomUserAddUserDTO
} from "@/views/live/self/liveRoomSelf/types";

// 心跳检测
export const NETTY_WEB_SOCKET_HEART_BEAT = "/netty/webSocket/heartBeat";

// 关闭前端支付弹窗
export const BASE_PAY_CLOSE_MODAL = "/base/pay/closeModal";

// 即时通讯收到消息
export const BASE_IM_SESSION_CONTENT_SEND = "/base/im/session/content/send";

// 即时通讯，加入新用户
export const BASE_IM_SESSION_REF_USER_JOIN_USER_ID_SET =
  "/base/im/session/refUser/join/userIdSet";

// 开关控制台
export const BASE_SOCKET_REF_USER_CHANGE_CONSOLE_FLAG_BY_ID_SET =
  "/base/socketRefUser/changeConsoleFlagByIdSet";

// 退出登录
export const BASE_SIGN_OUT = "/base/sign/out";

// 实时房间，用户加入房间
export const BASE_LIVE_ROOM_USER_ADD_USER = "/base/liveRoomUser/addUser";

// 实时房间，新增数据
export const BASE_LIVE_ROOM_DATA_ADD_DATA = "/base/liveRoomData/addData";

// 实时房间有新的数据
export const BASE_LIVE_ROOM_NEW_DATA = "/base/live/room/newData";

// 实时房间-您已经在其他设备上加入此房间
export const BASE_LIVE_ROOM_JOIN_ON_OTHER_DEVICE =
  "/base/live/room/joinOnOtherDevice";

// 实时房间-有新的用户加入房间
export const BASE_LIVE_ROOM_NEW_USER = "/base/live/room/newUser";

// 实时房间-有用户退出房间
export const BASE_LIVE_ROOM_REMOVE_USER = "/base/live/room/removeUser";

/**
 * 心跳检测，请求
 */
export function HeartBeatRequest(
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  return WebSocketSend(webSocket, { uri: NETTY_WEB_SOCKET_HEART_BEAT });
}

/**
 * 实时房间，用户加入房间，请求
 */
export function BaseLiveRoomUserAddUserRequest(
  dto: BaseLiveRoomUserAddUserDTO,
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  return WebSocketSend(webSocket, {
    uri: BASE_LIVE_ROOM_USER_ADD_USER,
    data: { ...dto }
  });
}

/**
 * 实时房间，新增数据，请求
 */
export function BaseLiveRoomDataAddDataRequest(
  dto: BaseLiveRoomDataAddDataDTO,
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  const json = {
    uri: BASE_LIVE_ROOM_DATA_ADD_DATA,
    data: {
      roomId: dto.roomId,
      createTs: dto.createTs,
      mediaType: dto.mediaType,
      firstBlobFlag: dto.firstBlobFlag
    }
  };

  const blob = JsonAddByteArr(json, dto.data);

  WebSocketSend(webSocket, blob, true);
}
