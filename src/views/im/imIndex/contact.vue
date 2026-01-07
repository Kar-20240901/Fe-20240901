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
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import EpArrowRight from "~icons/ep/ArrowRight";
import ContactFriendApplyDialog from "@/views/im/imIndex/contactFriendApplyDialog.vue";

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

  onSearch(false, false);
}

function onSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (menuIndex.value === BaseImContactSegmentedEnum.FRIEND.code) {
    contactFriendRef.value?.doSearch(loadingFlag, scrollFlag);
  } else if (menuIndex.value === BaseImContactSegmentedEnum.GROUP.code) {
    contactGroupRef.value?.doSearch(loadingFlag, scrollFlag);
  }
}

defineExpose({ onSearch });

const contactFriendRef = ref();
const contactGroupRef = ref();

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

const ApplyOperateFriendValue = "applyFriend";

const ApplyOperateGroupValue = "applyGroup";

const BlockValue = "block";

const ApplyOperateArr = [
  {
    label: "好友管理",
    value: ApplyOperateFriendValue
  },
  {
    label: "群组管理",
    value: ApplyOperateGroupValue
  },
  {
    label: "黑名单",
    value: BlockValue
  }
];

const contactFriendApplyDialogRef = ref();

function applyOperateClick(value?: string) {
  if (value === ApplyOperateFriendValue) {
    contactFriendApplyDialogRef?.value.open();
  } else if (value === ApplyOperateGroupValue) {
  } else if (value === BlockValue) {
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="pt-2 px-4 flex shrink-0 flex-col">
      <template v-for="item in ApplyOperateArr" :key="item.value">
        <div
          class="py-1 cursor-pointer flex justify-between items-center transition-all text-sm text-neutral-700 hover:text-primary"
          @click="applyOperateClick(item.value)"
        >
          <div>{{ item.label }}</div>
          <div>
            <component
              :is="
                useRenderIcon(EpArrowRight, {
                  class: 'w-3 h-3'
                })
              "
            />
          </div>
        </div>
      </template>
    </div>

    <div class="shrink-0 custom-el-segmented px-2 py-1">
      <el-segmented
        v-model="menuIndex"
        block
        :options="SegmentedOptionArr"
        @change="menuSelect"
      />
    </div>

    <div class="flex-1">
      <contact-friend
        v-show="menuIndex === BaseImContactSegmentedEnum.FRIEND.code"
        ref="contactFriendRef"
        @contactFriendClick="contactFriendClick"
      />

      <contact-group
        v-show="menuIndex === BaseImContactSegmentedEnum.GROUP.code"
        ref="contactGroupRef"
        @contactGroupClick="contactGroupClick"
      />
    </div>

    <contact-friend-apply-dialog
      ref="contactFriendApplyDialogRef"
      @searchContactFriend="onSearch()"
    />
  </div>
</template>

<style lang="scss" scoped>
.custom-el-segmented .el-segmented {
  --el-segmented-item-selected-bg-color: #fff;

  padding: 0.25rem 0.5rem;
  background-color: #f5f5f5;
  border-radius: 0.5rem;
}

:deep(.el-segmented__item) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #737373;
  border-radius: 0.375rem;
}

:deep(.el-segmented__item.is-selected) {
  color: #404040;
}

:deep(.el-segmented__item-selected) {
  border-radius: 0.375rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 10%),
    0 2px 4px -2px rgb(0 0 0 / 10%);
}
</style>
