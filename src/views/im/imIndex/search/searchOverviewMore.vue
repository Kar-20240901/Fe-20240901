<script setup lang="ts">
import { ref } from "vue";
import {
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { IImSearchOverviewMoreProps } from "@/views/im/imIndex/types";
import ContactFriend from "@/views/im/imIndex/contactFriend/contactFriend.vue";
import ContactGroup from "@/views/im/imIndex/contactGroup/contactGroup.vue";
import SearchOverviewMoreContent from "@/views/im/imIndex/search/searchOverviewMoreContent.vue";

const props = defineProps<IImSearchOverviewMoreProps>();

const emit = defineEmits<{
  (e: "searchFriendClick", item: BaseImSearchBaseFriendVO): void;
  (e: "searchGroupClick", item: BaseImSearchBaseGroupVO): void;
  (e: "searchContentClick", item: BaseImSearchBaseContentVO): void;
}>();

function searchContentClick(item: BaseImSearchBaseContentVO) {
  emit("searchContentClick", item);
}

function searchFriendClick(item: BaseImSearchBaseFriendVO) {
  emit("searchFriendClick", item);
}

function searchGroupClick(item: BaseImSearchBaseGroupVO) {
  emit("searchGroupClick", item);
}

const contactFriendRef = ref();
const contactGroupRef = ref();
const baseContentRef = ref();

function doSearch() {
  if (props.showSearchOverviewMoreFriendFlag) {
    contactFriendRef.value?.doSearch(true, false);
  } else if (props.showSearchOverviewMoreGroupFlag) {
    contactGroupRef.value?.doSearch(true, false);
  } else if (props.showSearchOverviewMoreContentFlag) {
    baseContentRef.value?.doSearch(true, false);
  }
}

defineExpose({
  doSearch
});
</script>

<template>
  <div class="flex flex-col cursor-default h-full w-full">
    <contact-friend
      v-if="props.showSearchOverviewMoreFriendFlag"
      ref="contactFriendRef"
      :searchKey="props.searchKey"
      item-class="px-4"
      :safe-highlight-flag="true"
      :show-title-flag="true"
      @contactFriendClick="searchFriendClick"
    />

    <contact-group
      v-else-if="props.showSearchOverviewMoreGroupFlag"
      ref="contactGroupRef"
      :searchKey="props.searchKey"
      item-class="px-4"
      :safe-highlight-flag="true"
      :show-title-flag="true"
      @contactGroupClick="searchGroupClick"
    />

    <search-overview-more-content
      v-show="props.showSearchOverviewMoreContentFlag"
      ref="baseContentRef"
      :searchKey="props.searchKey"
      @searchContentClick="searchContentClick"
    />
  </div>
</template>
