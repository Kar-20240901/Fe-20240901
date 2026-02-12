import type { BaseImGroupInsertOrUpdateDTO } from "@/api/http/base/BaseImGroupController";

export interface FeBaseImGroupInsertOrUpdateDTO
  extends BaseImGroupInsertOrUpdateDTO {
  avatarUrl?: string; // 前端用
  checkAvatarUrl?: string; // 前端用
}
