<script setup lang="ts">
import { BaseImContactSegmentedEnum } from "@/model/enum/im/BaseImContactSegmentedEnum";
import { ref } from "vue";
import ContactFriend from "@/views/im/imIndex/contactFriend.vue";
import ContactGroup from "@/views/im/imIndex/contactGroup.vue";
import { BaseImFriendPageVO } from "@/api/http/base/BaseImFriendController";
import {
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { BaseImGroupPageVO } from "@/api/http/base/BaseImGroupController";

const SegmentedOptionArr = [
  {
    label: BaseImContactSegmentedEnum.FRIEND.name,
    value: BaseImContactSegmentedEnum.FRIEND.code
  },
  {
    label: BaseImContactSegmentedEnum.GROUP.name,
    value: BaseImContactSegmentedEnum.GROUP.code
  }
];

const menuIndex = ref<string>(SegmentedOptionArr[0].value);

function menuSelect(index: string) {
  menuIndex.value = index;
}

const emit = defineEmits<{
  (e: "contactFriendClick", item: BaseImSearchBaseFriendVO): void;
  (e: "contactGroupClick", item: BaseImSearchBaseGroupVO): void;
}>();

function contactFriendClick(item: BaseImFriendPageVO) {
  emit("contactFriendClick", item);
}

function contactGroupClick(item: BaseImGroupPageVO) {
  emit("contactGroupClick", item);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-2 shrink-0">
      <div class="bg-neutral-100 rounded-lg px-2 py-1 flex">
        <template v-for="item in SegmentedOptionArr" :key="item.value">
          <div
            :class="
              'cursor-pointer flex justify-center flex-1 py-2 px-3 transition-all text-sm ' +
              (menuIndex === item.value
                ? 'bg-white shadow-sm text-neutral-700 font-medium rounded-md'
                : 'text-neutral-500 hover:text-neutral-700')
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
    </div>

    <div class="flex-1">
      <contact-friend
        v-show="menuIndex === BaseImContactSegmentedEnum.FRIEND.code"
        @contactFriendClick="contactFriendClick"
      />

      <contact-group
        v-show="menuIndex === BaseImContactSegmentedEnum.GROUP.code"
        @contactGroupClick="contactGroupClick"
      />
    </div>
  </div>
</template>
