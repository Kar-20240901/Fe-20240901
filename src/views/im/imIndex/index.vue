<script setup lang="ts">
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import {
  IImContentSession,
  IImSession,
  IImShowInfoMap
} from "@/views/im/imIndex/types";
import { nextTick, onMounted, ref } from "vue";
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
import {
  BaseImSessionContentRefUserPageVO,
  ScrollListDTO
} from "@/api/http/base/BaseImSessionContentRefUserController";
import Manage from "@/views/im/imIndex/manage.vue";
import Content from "@/views/im/imIndex/content.vue";

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

const manageRef = ref();

function contentDoSearch(
  form?: ScrollListDTO,
  loadingFlag?: boolean,
  scrollToItemFlag?: boolean,
  scrollType?: "up" | "down"
) {
  contentRef.value?.doSearch(form, loadingFlag, scrollToItemFlag, scrollType);
}

function execContentSearch() {
  if (!session.value.sessionId) {
    return;
  }

  contentRef.value?.textareaInputRefFocus();
  contentRef.value?.setShouldAutoScroll(true);

  contentDoSearch(
    { refId: session.value.sessionId, backwardFlag: false },
    false,
    false,
    undefined
  );
}

function sessionClick(item: BaseImSessionRefUserPageVO) {
  doUpdateAvatarAndNickname([item.sessionId]);
  manageRef.value?.sessionRefDoSearch(false, false);

  if (item.targetType === BaseImTypeEnum.FRIEND.code) {
    const sessionUserMapItem: IImShowInfoMap = {};
    sessionUserMapItem.targetId = item.targetId;
    sessionUserMapItem.avatarUrl = item.avatarUrl;
    sessionUserMapItem.showName = item.sessionName;

    updateSessionUserMap(sessionUserMapItem);
  } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
    doBaseImGroupRefUserPage(item.targetId);
  }

  const sessionTemp: IImContentSession = {};

  sessionTemp.sessionId = item.sessionId;
  sessionTemp.showName = item.sessionName;
  sessionTemp.targetType = item.targetType;

  session.value = sessionTemp;

  nextTick(() => {
    contentRef.value?.textareaInputRefFocus();
    contentRef.value?.setShouldAutoScroll(true);

    contentDoSearch(
      { refId: sessionTemp.sessionId, backwardFlag: false },
      true,
      false,
      undefined
    );
  });
}

function searchFriendClick(item: BaseImSearchBaseFriendVO) {
  sessionClick({
    sessionId: item.sessionId,
    targetType: BaseImTypeEnum.FRIEND.code,
    targetId: item.friendUserId,
    sessionName: item.friendShowName
  });
}

function searchGroupClick(item: BaseImSearchBaseGroupVO) {
  sessionClick({
    sessionId: item.sessionId,
    targetType: BaseImTypeEnum.GROUP.code,
    targetId: item.groupId,
    sessionName: item.groupShowName
  });
}

function searchContentClick(item: BaseImSearchBaseContentVO) {
  searchBaseContentVO.value = item;
}

function contentOnlyReset() {
  contentRef.value?.onlyReset();
}

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  manageRef.value?.sessionRefDoSearch(false, false);

  const sessionTemp: IImContentSession = {};

  sessionTemp.sessionId = searchBaseContentVO.value.sessionId;
  sessionTemp.showName = searchBaseContentVO.value.showName;
  sessionTemp.targetType = searchBaseContentVO.value.targetType;

  session.value = sessionTemp;

  nextTick(() => {
    contentRef.value?.textareaInputRefFocus();
    contentOnlyReset();
    contentRef.value?.setShouldAutoScroll(false);

    contentDoSearch(
      {
        backwardFlag: true,
        containsCurrentIdFlag: true,
        id: item.contentId,
        refId: session.value.sessionId,
        queryMoreFlag: true
      },
      true,
      true,
      undefined
    );
  });
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
        updateSessionUserMap(sessionUserMapItem);
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

      updateSessionUserMap(sessionUserMapItem);
    });
  });
}

const parentHeight = ref<number>(0);

onMounted(() => {
  const growEle: HTMLElement = document.querySelector(".grow");

  const contentEle: HTMLElement = document.querySelector(".main-content");

  const contentComputedStyle = window.getComputedStyle(contentEle);

  const contentMargin = parseFloat(contentComputedStyle.margin) || 0;

  const footEle: HTMLElement = document.querySelector(".layout-footer");

  parentHeight.value =
    growEle.offsetHeight - footEle?.offsetHeight - contentMargin;
});

function sessionRefUpdateLastContent(
  sessionId?: string,
  lastContent?: string,
  lastContentCreateTs?: string,
  unReadCountAddNumber?: number,
  unReadCountAddNumberUpdateFlag?: boolean
) {
  manageRef.value?.sessionRefUpdateLastContent(
    sessionId,
    lastContent,
    lastContentCreateTs,
    unReadCountAddNumber,
    unReadCountAddNumberUpdateFlag
  );
}
</script>

<template>
  <div class="bg-bg_color" :style="`height: ${parentHeight}px`">
    <el-splitter layout="horizontal">
      <el-splitter-panel min="10%" size="30%">
        <manage
          ref="manageRef"
          :searchBaseContentVO="searchBaseContentVO"
          :sessionUserMap="sessionUserMap"
          :session="session"
          @updateSessionUserMap="updateSessionUserMap"
          @sessionClick="sessionClick"
          @searchFriendClick="searchFriendClick"
          @searchGroupClick="searchGroupClick"
          @searchContentClick="searchContentClick"
          @searchContentInfoClick="searchContentInfoClick"
          @doUpdateAvatarAndNickname="doUpdateAvatarAndNickname"
          @doBaseImGroupRefUserPage="doBaseImGroupRefUserPage"
          @contentOnlyReset="contentOnlyReset"
          @execContentSearch="execContentSearch"
        />
      </el-splitter-panel>

      <el-splitter-panel>
        <content
          ref="contentRef"
          :sessionUserMap="sessionUserMap"
          :session="session"
          @sessionRefUpdateLastContent="sessionRefUpdateLastContent"
        />
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>
