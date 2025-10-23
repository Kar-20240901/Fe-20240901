import type { BaseImSearchBaseContentVO } from "@/api/http/base/BaseImSearchController";

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
}

export interface IImContentProps {
  session?: IImContentSession;
  sessionUserMap?: Record<string, IImShowInfoMap>;
}

export interface IImSearchOverviewProps {
  searchKey?: string;
}

export interface IImManageProps {
  searchBaseContentVO?: BaseImSearchBaseContentVO;
}

export interface IImSearchOverviewPreProps {
  searchBaseContentVO?: BaseImSearchBaseContentVO;
}

export interface IImSearchOverviewMoreProps {
  showSearchOverviewMoreFriendFlag?: boolean;
  showSearchOverviewMoreGroupFlag?: boolean;
  showSearchOverviewMoreContentFlag?: boolean;
}

export interface IImSearchOverviewMoreContentInfoProps {
  searchBaseContentVO?: BaseImSearchBaseContentVO;
  sessionUserMap?: Record<string, IImShowInfoMap>;
  searchKey?: string;
}
