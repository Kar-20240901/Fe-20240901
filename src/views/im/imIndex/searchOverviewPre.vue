<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { debounce } from "@pureadmin/utils";
import {
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO,
  baseImSearchHistoryDelete,
  baseImSearchHistoryDeleteAll,
  baseImSearchHistoryPage,
  BaseImSearchHistoryVO
} from "@/api/http/base/BaseImSearchController";
import { ToastSuccess } from "@/utils/ToastUtil";
import SearchOverview from "@/views/im/imIndex/searchOverview.vue";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import {
  IImSearchOverviewPreProps,
  IImShowInfoMap
} from "@/views/im/imIndex/types";
import { BaseImSessionContentRefUserPageVO } from "@/api/http/base/BaseImSessionContentRefUserController";
import FaSearch from "~icons/fa/search";
import SearchOverviewMore from "@/views/im/imIndex/searchOverviewMore.vue";
import SearchOverviewMoreContentInfo from "@/views/im/imIndex/searchOverviewMoreContentInfo.vue";

const props = defineProps<IImSearchOverviewPreProps>();

const searchKey = ref<string>("");

function onSearchKeyClear() {
  searchHistory();
}

function onSearchKeyKeydown() {
  onSearchKeyChangeDebounce();
}

function onSearchKeyChange(val: string) {
  searchKey.value = val;
  onSearchKeyChangeDebounce();
}

const onSearchKeyChangeDebounce: () => void = debounce(
  onSearchKeyChangeDebounceFun
);

function onSearchKeyChangeDebounceFun() {
  searchOverviewRef.value?.doBaseImSearchBase();
}

const searchHistoryCloseFlag = ref<boolean>(false);

function searchHistoryDeleteAllClick() {
  baseImSearchHistoryDeleteAll().then(res => {
    searchHistory();
    ToastSuccess(res.msg);
    searchHistoryCloseFlag.value = false;
  });
}

const pageSize = "20";

const searchHistoryList = ref<BaseImSearchHistoryVO[]>([]);

function searchHistory() {
  baseImSearchHistoryPage({
    pageSize
  }).then(res => {
    searchHistoryList.value = res.data.records;
  });
}

function searchHistoryDeleteClick(id?: string) {
  baseImSearchHistoryDelete({ id }).then(res => {
    searchHistory();
    ToastSuccess(res.msg);
  });
}

onMounted(() => {
  searchHistory();
});

const searchOverviewRef = ref();

const emit = defineEmits<{
  (e: "searchFriendClick", item: BaseImSearchBaseFriendVO): void;
  (e: "searchGroupClick", item: BaseImSearchBaseGroupVO): void;
  (e: "searchContentClick", item: BaseImSearchBaseContentVO): void;
  (e: "searchContentInfoClick", item: BaseImSessionContentRefUserPageVO): void;

  (e: "updateSessionUserMap", item: IImShowInfoMap): void;

  (e: "doBaseImGroupRefUserPage", groupId: string): void;

  (e: "searchOverviewPreBackClick"): void;
}>();

const showSearchOverviewMoreFriendFlag = ref<boolean>(false);
const showSearchOverviewMoreGroupFlag = ref<boolean>(false);
const showSearchOverviewMoreContentFlag = ref<boolean>(false);
const showSearchOverviewMoreContentInfoFlag = ref<boolean>(false);

const searchOverviewMoreRef = ref();
const searchOverviewMoreContentInfoRef = ref();

function searchContentClick(item: BaseImSearchBaseContentVO) {
  emit("searchContentClick", item);

  if (item.targetType === BaseImTypeEnum.FRIEND.code) {
    const sessionUserMapItem: IImShowInfoMap = {};
    sessionUserMapItem.targetId = item.targetId;
    sessionUserMapItem.avatarUrl = item.avatarUrl;
    sessionUserMapItem.showName = item.showName;

    emit("updateSessionUserMap", sessionUserMapItem);
  } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
    emit("doBaseImGroupRefUserPage", item.targetId);
  }

  showSearchOverviewMoreFriendFlag.value = false;
  showSearchOverviewMoreGroupFlag.value = false;
  showSearchOverviewMoreContentFlag.value = false;
  showSearchOverviewMoreContentInfoFlag.value = true;

  nextTick(() => {
    searchOverviewMoreContentInfoRef.value?.doSearch();
  });
}

function searchFriendClick(item: BaseImSearchBaseFriendVO) {
  emit("searchFriendClick", item);
}

function searchGroupClick(item: BaseImSearchBaseGroupVO) {
  emit("searchGroupClick", item);
}

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  emit("searchContentInfoClick", item);
}

function searchOverviewPreBackClick() {
  emit("searchOverviewPreBackClick");
}

const searchInputRef = ref();

onMounted(() => {
  searchInputRef.value?.focus();
});

function searchMoreFriendClick() {
  showSearchOverviewMoreFriendFlag.value = true;
  showSearchOverviewMoreGroupFlag.value = false;
  showSearchOverviewMoreContentFlag.value = false;
  showSearchOverviewMoreContentInfoFlag.value = false;
}

function searchMoreGroupClick() {
  showSearchOverviewMoreFriendFlag.value = false;
  showSearchOverviewMoreGroupFlag.value = true;
  showSearchOverviewMoreContentFlag.value = false;
  showSearchOverviewMoreContentInfoFlag.value = false;
}

function searchMoreContentClick() {
  showSearchOverviewMoreFriendFlag.value = false;
  showSearchOverviewMoreGroupFlag.value = false;
  showSearchOverviewMoreContentFlag.value = true;
  showSearchOverviewMoreContentInfoFlag.value = false;
}

function getShowSearchOverviewMoreFlag() {
  return (
    showSearchOverviewMoreFriendFlag.value ||
    showSearchOverviewMoreGroupFlag.value ||
    showSearchOverviewMoreContentFlag.value
  );
}
</script>

<template>
  <div class="flex flex-col p-4 cursor-default">
    <div class="flex justify-between items-center mt-1">
      <el-input
        ref="searchInputRef"
        v-model="searchKey"
        placeholder="请输入搜索内容"
        clearable
        class="w-full"
        autofocus
        resize="none"
        :prefix-icon="FaSearch"
        @input="onSearchKeyChange"
        @clear="onSearchKeyClear"
        @keydown.enter="onSearchKeyKeydown"
      />

      <div
        class="ml-2 text-sm shrink-0 text-gray-400 shrink-0 cursor-pointer hover:text-gray-800"
        @click="searchOverviewPreBackClick()"
      >
        取消
      </div>
    </div>

    <search-overview-more
      v-if="
        getShowSearchOverviewMoreFlag() &&
        !showSearchOverviewMoreContentInfoFlag
      "
      ref="searchOverviewMoreRef"
      :search-key="searchKey"
      @searchFriendClick="searchFriendClick"
      @searchGroupClick="searchGroupClick"
      @searchContentClick="searchContentClick"
    />

    <search-overview-more-content-info
      v-if="
        !getShowSearchOverviewMoreFlag() &&
        showSearchOverviewMoreContentInfoFlag
      "
      ref="searchOverviewMoreContentInfoRef"
      :search-key="searchKey"
      :searchBaseContentVO="props.searchBaseContentVO"
      @searchContentInfoClick="searchContentInfoClick"
    />

    <search-overview
      v-show="
        !getShowSearchOverviewMoreFlag() &&
        !showSearchOverviewMoreContentInfoFlag &&
        searchKey
      "
      ref="searchOverviewRef"
      :search-key="searchKey"
      @searchMoreFriendClick="searchMoreFriendClick"
      @searchMoreGroupClick="searchMoreGroupClick"
      @searchMoreContentClick="searchMoreContentClick"
      @searchFriendClick="searchFriendClick"
      @searchGroupClick="searchGroupClick"
      @searchContentClick="searchContentClick"
    />

    <div
      v-show="
        !getShowSearchOverviewMoreFlag() &&
        !showSearchOverviewMoreContentInfoFlag &&
        !searchKey
      "
      class="flex justify-between text-sm mt-4 mb-4"
    >
      <div class="text-gray-400">最近搜索</div>
      <div>
        <div
          v-if="!searchHistoryCloseFlag"
          class="cursor-pointer text-gray-400 hover:text-gray-800"
          @click="searchHistoryCloseFlag = true"
        >
          删除
        </div>
        <div v-else class="flex items-center space-x-2">
          <div
            class="cursor-pointer text-gray-400 hover:text-gray-800"
            @click="searchHistoryDeleteAllClick()"
          >
            清空
          </div>
          <div
            class="cursor-pointer text-gray-400 hover:text-gray-800"
            @click="searchHistoryCloseFlag = false"
          >
            完成
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <template v-for="item in searchHistoryList" :key="item.id">
        <el-tag
          :disable-transitions="true"
          :closable="searchHistoryCloseFlag"
          effect="plain"
          type="info"
          @close="searchHistoryDeleteClick(item.id)"
          @click="
            () => {
              onSearchKeyChange(item.searchHistory);
            }
          "
        >
          <div class="flex justify-center w-20 truncate cursor-pointer">
            {{ item.searchHistory }}
          </div>
        </el-tag>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  border-width: 0;
}
</style>
