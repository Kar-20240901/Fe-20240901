<script setup lang="ts">
import { BaseImLeftSegmentedEnum } from "@/model/enum/im/BaseImLeftSegmentedEnum";
import { nextTick, ref } from "vue";
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

const showSearchOverviewPre = ref<boolean>(false);

const searchOverviewPreRef = ref();

const sessionRef = ref();

defineExpose({ sessionRefDoSearch });

function sessionRefDoSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  sessionRef.value?.onSearch(loadingFlag, scrollFlag);
}

function searchClick() {
  showSearchOverviewPre.value = true;

  nextTick(() => {
    searchOverviewPreRef.value?.searchHistory();
    searchOverviewPreRef.value?.setSearchInputFocus();
  });
}

function searchOverviewPreBackClick() {
  showSearchOverviewPre.value = false;
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
    <div class="flex justify-center w-full shrink-0">
      <template v-for="item in SegmentedOptionArr" :key="item.value">
        <div
          :class="
            'flex-1 flex justify-center items-center h-13 border-b-2 cursor-pointer text-sm transition-all ' +
            (menuIndex === item.value
              ? 'text-primary border-primary'
              : 'border-gray-200 text-gray-400 hover:text-gray-800')
          "
          @click="
            () => {
              menuSelect(item.value);
            }
          "
        >
          {{ item.label }}
        </div>
      </template>
    </div>

    <div class="flex-1">
      <session
        v-show="
          !showSearchOverviewPre &&
          menuIndex === BaseImLeftSegmentedEnum.SESSION.code
        "
        ref="sessionRef"
        @searchClick="searchClick"
        @sessionClick="sessionClick"
        @updateSessionUserMap="updateSessionUserMap"
        @doUpdateAvatarAndNickname="doUpdateAvatarAndNickname"
      />

      <search-overview-pre
        v-show="
          showSearchOverviewPre &&
          menuIndex === BaseImLeftSegmentedEnum.SESSION.code
        "
        ref="searchOverviewPreRef"
        :searchBaseContentVO="props.searchBaseContentVO"
        :sessionUserMap="props.sessionUserMap"
        @searchFriendClick="searchFriendClick"
        @searchGroupClick="searchGroupClick"
        @searchContentClick="searchContentClick"
        @searchContentInfoClick="searchContentInfoClick"
        @updateSessionUserMap="updateSessionUserMap"
        @doBaseImGroupRefUserPage="doBaseImGroupRefUserPage"
        @searchOverviewPreBackClick="searchOverviewPreBackClick"
      />

      <contact v-show="menuIndex === BaseImLeftSegmentedEnum.CONTACT.code" />
    </div>
  </div>
</template>
