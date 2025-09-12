<script setup lang="ts">
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import {
  IImContentSession,
  IImSession,
  IImShowInfoMap
} from "@/views/im/imIndex/types";
import Manage from "@/views/im/imIndex/manage.vue";
import { ref } from "vue";
import Content from "@/views/im/imIndex/content.vue";
import {
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserUpdateAvatarAndNickname
} from "@/api/http/base/BaseImSessionRefUserController";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { baseImGroupRefUserPage } from "@/api/http/base/BaseImGroupRefUserController";
import {
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { BaseImSessionContentRefUserPageVO } from "@/api/http/base/BaseImSessionContentRefUserController";

defineOptions({
  name: "ImIndex"
});

// key：user主键 id
const sessionUserMap = ref<Record<string, IImShowInfoMap>>({});

function updateSessionUserMap(item: IImShowInfoMap) {
  sessionUserMap.value[item.targetId] = item;
}

const session = ref<IImSession>({});

const searchBaseContentVO = ref<BaseImSearchBaseContentVO>({});

const contentRef = ref();

function sessionClick(item: BaseImSessionRefUserPageVO) {
  doUpdateAvatarAndNickname([item.sessionId]);

  if (item.targetType === BaseImTypeEnum.FRIEND.code) {
    const sessionUserMapItem: IImShowInfoMap = {};
    sessionUserMapItem.targetId = item.targetId;
    sessionUserMapItem.avatarUrl = item.avatarUrl;
    sessionUserMapItem.showName = item.sessionName;

    sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
  } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
    doBaseImGroupRefUserPage(item.targetId);
  }

  const sessionTemp: IImContentSession = {};

  sessionTemp.sessionId = item.sessionId;
  sessionTemp.showName = item.sessionName;

  session.value = sessionTemp;

  contentRef.value.doSearch();
}

function searchFriendClick(item: BaseImSearchBaseFriendVO) {
  sessionClick({
    sessionId: item.sessionId,
    targetType: BaseImTypeEnum.FRIEND.code,
    targetId: item.friendId,
    sessionName: item.friendName
  });
}

function searchGroupClick(item: BaseImSearchBaseGroupVO) {
  sessionClick({
    sessionId: item.sessionId,
    targetType: BaseImTypeEnum.GROUP.code,
    targetId: item.groupId,
    sessionName: item.groupName
  });
}

function searchContentClick(item: BaseImSearchBaseContentVO) {
  searchBaseContentVO.value = item;
}

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  const sessionTemp: IImContentSession = {};

  sessionTemp.sessionId = searchBaseContentVO.value.sessionId;
  sessionTemp.showName = searchBaseContentVO.value.showName;

  session.value = sessionTemp;

  contentRef.value.doSearch({ id: item.contentId });
}

function doUpdateAvatarAndNickname(idSet?: string[]) {
  if (!idSet || !idSet.length) {
    return;
  }

  baseImSessionRefUserUpdateAvatarAndNickname({ idSet }).then(res => {
    res.data.forEach(item => {
      const sessionUserMapItem: IImShowInfoMap = {};
      sessionUserMapItem.targetId = item.targetId;
      sessionUserMapItem.avatarUrl = item.avatarUrl;
      sessionUserMapItem.showName = item.showName;

      if (item.targetType === BaseImTypeEnum.FRIEND.code) {
        sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
      } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
      }
    });
  });
}

function doBaseImGroupRefUserPage(groupId: string) {
  baseImGroupRefUserPage({ groupId, pageSize: "-1" }).then(res => {
    res.data.records.forEach(item => {
      const sessionUserMapItem: IImShowInfoMap = {};
      sessionUserMapItem.targetId = item.userId;
      sessionUserMapItem.avatarUrl = item.avatarUrl;
      sessionUserMapItem.showName = item.nickname;

      sessionUserMap.value[sessionUserMapItem.targetId] = sessionUserMapItem;
    });
  });
}
</script>

<template>
  <el-splitter>
    <el-splitter-panel :min="200">
      <manage
        :searchBaseContentVO="searchBaseContentVO"
        @updateSessionUserMap="updateSessionUserMap"
        @sessionClick="sessionClick"
        @searchFriendClick="searchFriendClick"
        @searchGroupClick="searchGroupClick"
        @searchContentClick="searchContentClick"
        @searchContentInfoClick="searchContentInfoClick"
        @doUpdateAvatarAndNickname="doUpdateAvatarAndNickname"
        @doBaseImGroupRefUserPage="doBaseImGroupRefUserPage"
      />
    </el-splitter-panel>

    <el-splitter-panel>
      <content
        ref="contentRef"
        :sessionUserMap="sessionUserMap"
        :session="session"
      />
    </el-splitter-panel>
  </el-splitter>
</template>
