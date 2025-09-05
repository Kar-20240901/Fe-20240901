export type TSearchPageType = 101 | 201 | 301; // 101 搜索历史页面 201 搜索结果-总览页面 301 搜索结果-聊天记录页面

export interface IShowInfoMap {
  targetId?: string; // 用户主键 id或者 群组主键 id
  avatarUrl?: string;
  showName?: string;
}

export interface ISession {
  sessionId?: string;
  avatarUrl?: string;
  showName?: string;
}
