import { GetMyWebSocket } from "@/utils/webSocket/WebSocketUtil";
import { WebSocketSend } from "@/utils/webSocket/WebSocketHelper";

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

/**
 * 心跳检测，请求
 */
export function HeartBeatRequest(
  webSocket: WebSocket | null = GetMyWebSocket()
) {
  return WebSocketSend(webSocket, { uri: NETTY_WEB_SOCKET_HEART_BEAT });
}
