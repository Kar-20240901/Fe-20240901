import { GetMyWebSocket } from "@/utils/webSocket/WebSocketUtil";
import { WebSocketSend } from "@/utils/webSocket/WebSocketHelper";
import { IntToBlob } from "@/utils/BlobUtil";

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
export function BaseLiveRoomAddUserRequest(
  id: string,
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  return WebSocketSend(webSocket, {
    uri: BASE_LIVE_ROOM_USER_ADD_USER,
    data: { id }
  });
}

/**
 * 实时房间，新增数据，请求
 */
export function BaseLiveRoomDataAddDataRequest(
  roomId: string,
  createTs: number,
  data: Blob,
  mediaType: string,
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  if (data.size <= 0 || data.size > 10 * 10000) {
    return;
  }

  const json = {
    uri: BASE_LIVE_ROOM_DATA_ADD_DATA,
    data: { roomId, createTs, mediaType }
  };

  const jsonStr = JSON.stringify(json);

  const lengthBlob = IntToBlob(jsonStr.length);

  const jsonBlob = new Blob([jsonStr], { type: "text/plain" });

  const blob = new Blob([lengthBlob, jsonBlob, data]);

  // console.log("blob：", blob);

  WebSocketSend(webSocket, blob, true);
}
