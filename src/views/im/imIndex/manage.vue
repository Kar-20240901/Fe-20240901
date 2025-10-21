<script setup lang="ts">
import { BaseImLeftSegmentedEnum } from "@/model/enum/im/BaseImLeftSegmentedEnum";
import { ref } from "vue";
import Session from "@/views/im/imIndex/session.vue";
import Contact from "@/views/im/imIndex/contact.vue";
import { BaseImSessionRefUserPageVO } from "@/api/http/base/BaseImSessionRefUserController";
import SearchOverviewPre from "@/views/im/imIndex/searchOverviewPre.vue";
import {
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { IImManageProps, IImShowInfoMap } from "@/views/im/imIndex/types";
import { BaseImSessionContentRefUserPageVO } from "@/api/http/base/BaseImSessionContentRefUserController";

const SegmentedOptionArr = [
  {
    label: BaseImLeftSegmentedEnum.SESSION.name,
    value: BaseImLeftSegmentedEnum.SESSION.code
  },
  {
    label: BaseImLeftSegmentedEnum.CONTACT.name,
    value: BaseImLeftSegmentedEnum.CONTACT.code
  }
];

const props = defineProps<IImManageProps>();

const emit = defineEmits<{
  (e: "sessionClick", item: BaseImSessionRefUserPageVO): void;

  (e: "searchFriendClick", item: BaseImSearchBaseFriendVO): void;
  (e: "searchGroupClick", item: BaseImSearchBaseGroupVO): void;
  (e: "searchContentClick", item: BaseImSearchBaseContentVO): void;
  (e: "searchContentInfoClick", item: BaseImSessionContentRefUserPageVO): void;

  (e: "updateSessionUserMap", item: IImShowInfoMap): void;

  (e: "doUpdateAvatarAndNickname", idSet: string[]): void;
  (e: "doBaseImGroupRefUserPage", groupId: string): void;
}>();

const showSessionSearch = ref<boolean>(false);

function searchClick() {
  showSessionSearch.value = true;
}

function sessionClick(item: BaseImSessionRefUserPageVO) {
  emit("sessionClick", item);
}

function searchFriendClick(item: BaseImSearchBaseFriendVO) {
  emit("searchFriendClick", item);
}

function searchGroupClick(item: BaseImSearchBaseGroupVO) {
  emit("searchGroupClick", item);
}

function searchContentClick(item: BaseImSearchBaseContentVO) {
  emit("searchContentClick", item);
}

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  emit("searchContentInfoClick", item);
}

function updateSessionUserMap(item: IImShowInfoMap) {
  emit("updateSessionUserMap", item);
}

function doBaseImGroupRefUserPage(groupId: string) {
  emit("doBaseImGroupRefUserPage", groupId);
}

function doUpdateAvatarAndNickname(idSet?: string[]) {
  emit("doUpdateAvatarAndNickname", idSet);
}

const menuIndex = ref<string>(SegmentedOptionArr[0].value);

function menuSelect(index: string) {
  menuIndex.value = index;
}
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex justify-center w-full">
      <el-menu
        :default-active="menuIndex"
        mode="horizontal"
        :ellipsis="false"
        @select="menuSelect"
      >
        <el-menu-item
          v-for="item in SegmentedOptionArr"
          :key="item.value"
          :index="item.value"
        >
          <div>{{ item.label }}</div>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="flex-1 pt-1">
      <session
        v-if="
          !showSessionSearch &&
          menuIndex === BaseImLeftSegmentedEnum.SESSION.code
        "
        @searchClick="searchClick"
        @sessionClick="sessionClick"
        @updateSessionUserMap="updateSessionUserMap"
        @doUpdateAvatarAndNickname="doUpdateAvatarAndNickname"
      />

      <search-overview-pre
        v-if="
          showSessionSearch &&
          menuIndex === BaseImLeftSegmentedEnum.SESSION.code
        "
        :searchBaseContentVO="props.searchBaseContentVO"
        @searchFriendClick="searchFriendClick"
        @searchGroupClick="searchGroupClick"
        @searchContentClick="searchContentClick"
        @searchContentInfoClick="searchContentInfoClick"
        @updateSessionUserMap="updateSessionUserMap"
        @doBaseImGroupRefUserPage="doBaseImGroupRefUserPage"
      />

      <contact v-if="menuIndex === BaseImLeftSegmentedEnum.CONTACT.code" />
    </div>
  </div>
</template>
