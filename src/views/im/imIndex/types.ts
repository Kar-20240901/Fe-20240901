import type { BaseImSearchBaseContentVO } from "@/api/http/base/BaseImSearchController";
import type { BaseImSessionContentRefUserPageVO } from "@/api/http/base/BaseImSessionContentRefUserController";
import type { BaseImSessionContentInsertTxtDTO } from "@/api/http/base/BaseImSessionContentController";

export interface BaseImSessionRefUserQueryLastContentVO {
  sessionId?: string; // 会话主键 id，一定有值，格式：int64
  lastContent?: string; // 最新消息，备注：会截断或者处理
  lastContentCreateTs?: string; // 最新消息创建时间戳，格式：int64
  lastContentType?: number; // 最新消息类型，格式：int32
  unReadCount?: number; // 未读数量，最大值为 100，格式：int32
  notDisturbFlag?: boolean; // 是否是免打扰：true 是 false 否
}

export interface BaseImSessionContentInsertTxtForFeDTO
  extends BaseImSessionContentInsertTxtDTO {
  sendErrorFlag?: boolean;
}

export interface BaseImSessionContentInsertTxtVO
  extends BaseImSessionContentInsertTxtDTO {
  createId?: string; // 创建者用户主键 id，格式：int64
  notDisturbFlagUserIdSet?: string[]; // 开启了免打扰的用户主键 id集合，格式：int64
  contentId?: string; // 消息主键 id，格式：int64
}

export interface ISessionContentBO extends BaseImSessionContentRefUserPageVO {
  objId?: string; // 唯一标识：userId-createTs-orderNo，通过横杠连接
  sendErrorFlag?: boolean; // 是否发送失败，比如：被对方拉入黑名单，或者不是好友等
}

export interface IImShowInfoMap {
  targetId?: string; // 用户主键 id或者 群组主键 id
  avatarUrl?: string;
  showName?: string;
}

export interface IImSession {
  sessionId?: string;
  avatarUrl?: string;
  showName?: string;
}

export interface IImContentSession {
  sessionId?: string;
  showName?: string;
  targetType?: number;
}

export interface IImSessionProps {
  session?: IImContentSession;
}

export interface IImContentProps {
  session?: IImContentSession;
  sessionUserMap?: Record<string, IImShowInfoMap>;
}

export interface IImSearchOverviewProps {
  searchKey?: string;
}

export interface IImManageProps {
  session?: IImContentSession;
  searchBaseContentVO?: BaseImSearchBaseContentVO;
  sessionUserMap?: Record<string, IImShowInfoMap>;
}

export interface IImSearchOverviewPreProps {
  searchBaseContentVO?: BaseImSearchBaseContentVO;
  sessionUserMap?: Record<string, IImShowInfoMap>;
}

export interface IImSearchOverviewMoreProps {
  showSearchOverviewMoreFriendFlag?: boolean;
  showSearchOverviewMoreGroupFlag?: boolean;
  showSearchOverviewMoreContentFlag?: boolean;
  searchKey?: string;
}

export interface IImSearchOverviewMoreContentInfoProps {
  searchBaseContentVO?: BaseImSearchBaseContentVO;
  sessionUserMap?: Record<string, IImShowInfoMap>;
  searchKey?: string;
}
