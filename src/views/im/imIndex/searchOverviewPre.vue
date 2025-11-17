<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
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
import SearchOverviewContentInfo from "@/views/im/imIndex/searchOverviewContentInfo.vue";
import EpBack from "~icons/ep/back";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

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

  if (val.trim()) {
    onSearchKeyChangeDebounce();
  } else {
    resetSearchOverview();
  }
}

const onSearchKeyChangeDebounce: () => void = debounce(
  onSearchKeyChangeDebounceFun
);

function onSearchKeyChangeDebounceFun() {
  searchOverviewRef.value?.doBaseImSearchBase();

  if (getShowContentInfoFlag.value) {
    searchOverviewMoreContentInfoRef.value?.reset();
    searchOverviewMoreContentInfoRef.value?.doSearch();
  } else if (getShowOverviewMoreFlag.value) {
    searchOverviewMoreRef.value?.doSearch();
  }
}

function resetSearchOverview() {
  searchOverviewRef.value?.reset();
}

const searchHistoryCloseFlag = ref<boolean>(false);

function searchHistoryDeleteAllClick() {
  baseImSearchHistoryDeleteAll().then(res => {
    searchHistory();
    ToastSuccess(res.msg);
    searchHistoryCloseFlag.value = false;
  });
}

const searchHistoryList = ref<BaseImSearchHistoryVO[]>([]);

function searchHistory() {
  baseImSearchHistoryPage({
    pageSize: "20"
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

const showSearchOverviewContentInfoFlag = ref<boolean>(false);

// true：从SearchOverviewMore跳转到聊天详情页 false：从SearchOverview跳转到聊天详情页
const contentInfoMoreClickFlag = ref<boolean>(false);

const searchOverviewMoreRef = ref();
const searchOverviewMoreContentInfoRef = ref();

function searchContentClick(
  item: BaseImSearchBaseContentVO,
  contentInfoMoreClickFlagTemp: boolean
) {
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
  showSearchOverviewContentInfoFlag.value = true;
  contentInfoMoreClickFlag.value = contentInfoMoreClickFlagTemp;

  nextTick(() => {
    setSearchInputFocus();
    searchOverviewMoreContentInfoRef.value?.reset();
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
  searchKey.value = "";
  resetShowFlag();
  resetSearchOverview();
}

const searchInputRef = ref();

function setSearchInputFocus() {
  searchInputRef.value?.focus();
}

defineExpose({ setSearchInputFocus, searchHistory });

function searchMoreFriendClick() {
  showSearchOverviewMoreFriendFlag.value = true;
  showSearchOverviewMoreGroupFlag.value = false;
  showSearchOverviewMoreContentFlag.value = false;
  showSearchOverviewContentInfoFlag.value = false;
  contentInfoMoreClickFlag.value = false;
  nextTick(() => {
    setSearchInputFocus();
    searchOverviewMoreRef.value?.doSearch();
  });
}

function searchMoreGroupClick() {
  showSearchOverviewMoreFriendFlag.value = false;
  showSearchOverviewMoreGroupFlag.value = true;
  showSearchOverviewMoreContentFlag.value = false;
  showSearchOverviewContentInfoFlag.value = false;
  contentInfoMoreClickFlag.value = false;
  nextTick(() => {
    setSearchInputFocus();
    searchOverviewMoreRef.value?.doSearch();
  });
}

function searchMoreContentClick() {
  showSearchOverviewMoreFriendFlag.value = false;
  showSearchOverviewMoreGroupFlag.value = false;
  showSearchOverviewMoreContentFlag.value = true;
  showSearchOverviewContentInfoFlag.value = false;
  contentInfoMoreClickFlag.value = false;
  nextTick(() => {
    setSearchInputFocus();
    searchOverviewMoreRef.value?.doSearch();
  });
}

const getShowSearchOverviewMoreFlag = computed(() => {
  return (
    showSearchOverviewMoreFriendFlag.value ||
    showSearchOverviewMoreGroupFlag.value ||
    showSearchOverviewMoreContentFlag.value
  );
});

function resetShowFlag() {
  showSearchOverviewMoreFriendFlag.value = false;
  showSearchOverviewMoreGroupFlag.value = false;
  showSearchOverviewMoreContentFlag.value = false;
  showSearchOverviewContentInfoFlag.value = false;
  contentInfoMoreClickFlag.value = false;
}

function backClick() {
  if (getShowSearchOverviewMoreFlag.value) {
    showSearchOverviewMoreFriendFlag.value = false;
    showSearchOverviewMoreGroupFlag.value = false;
    showSearchOverviewMoreContentFlag.value = false;
    showSearchOverviewContentInfoFlag.value = false;
    contentInfoMoreClickFlag.value = false;
  } else if (showSearchOverviewContentInfoFlag.value) {
    if (contentInfoMoreClickFlag.value) {
      showSearchOverviewMoreFriendFlag.value = false;
      showSearchOverviewMoreGroupFlag.value = false;
      showSearchOverviewMoreContentFlag.value = true;
      showSearchOverviewContentInfoFlag.value = false;
      contentInfoMoreClickFlag.value = false;
    } else {
      resetShowFlag();
    }
  }
  nextTick(() => {
    setSearchInputFocus();
  });
}

const getShowOverviewMoreFlag = computed(() => {
  return (
    getShowSearchOverviewMoreFlag.value &&
    !showSearchOverviewContentInfoFlag.value
  );
});

const getShowContentInfoFlag = computed(() => {
  return (
    !getShowSearchOverviewMoreFlag.value &&
    showSearchOverviewContentInfoFlag.value
  );
});
</script>

<template>
  <div class="flex flex-col p-4 cursor-default h-full">
    <div class="flex justify-between items-center mt-1">
      <div
        v-show="
          getShowSearchOverviewMoreFlag || showSearchOverviewContentInfoFlag
        "
        class="flex items-center shrink-0 mr-2 text-sm text-gray-400 cursor-pointer hover:text-gray-800"
        @click="backClick()"
      >
        <component
          :is="
            useRenderIcon(EpBack, {
              class: 'w-[14px] h-[14px] mr-[2px]'
            })
          "
        />
        返回
      </div>

      <el-input
        ref="searchInputRef"
        v-model="searchKey"
        placeholder="请输入搜索内容"
        clearable
        class="w-full"
        :prefix-icon="FaSearch"
        @input="onSearchKeyChange"
        @clear="onSearchKeyClear"
        @keydown.enter="onSearchKeyKeydown"
      />

      <div
        class="ml-2 text-sm shrink-0 text-gray-400 cursor-pointer hover:text-gray-800"
        @click="searchOverviewPreBackClick()"
      >
        取消
      </div>
    </div>

    <div class="flex-1">
      <search-overview-more
        v-show="getShowOverviewMoreFlag"
        ref="searchOverviewMoreRef"
        :search-key="searchKey"
        :showSearchOverviewMoreFriendFlag="showSearchOverviewMoreFriendFlag"
        :showSearchOverviewMoreGroupFlag="showSearchOverviewMoreGroupFlag"
        :showSearchOverviewMoreContentFlag="showSearchOverviewMoreContentFlag"
        @searchFriendClick="searchFriendClick"
        @searchGroupClick="searchGroupClick"
        @searchContentClick="
          (item: BaseImSearchBaseContentVO) => searchContentClick(item, true)
        "
      />

      <search-overview-content-info
        v-show="getShowContentInfoFlag"
        ref="searchOverviewMoreContentInfoRef"
        :search-key="searchKey"
        :searchBaseContentVO="props.searchBaseContentVO"
        :sessionUserMap="props.sessionUserMap"
        @searchContentInfoClick="searchContentInfoClick"
      />

      <search-overview
        v-show="
          !getShowSearchOverviewMoreFlag &&
          !showSearchOverviewContentInfoFlag &&
          searchKey.trim()
        "
        ref="searchOverviewRef"
        :search-key="searchKey"
        @searchMoreFriendClick="searchMoreFriendClick"
        @searchMoreGroupClick="searchMoreGroupClick"
        @searchMoreContentClick="searchMoreContentClick"
        @searchFriendClick="searchFriendClick"
        @searchGroupClick="searchGroupClick"
        @searchContentClick="
          (item: BaseImSearchBaseContentVO) => searchContentClick(item, false)
        "
      />

      <div
        v-show="
          !getShowSearchOverviewMoreFlag &&
          !showSearchOverviewContentInfoFlag &&
          !searchKey.trim()
        "
      >
        <div class="flex justify-between text-sm mt-4 mb-4">
          <div class="text-gray-400">最近搜索</div>
          <div>
            <div
              v-show="!searchHistoryCloseFlag"
              class="cursor-pointer text-gray-400 hover:text-gray-800"
              @click="searchHistoryCloseFlag = true"
            >
              删除
            </div>
            <div
              v-show="searchHistoryCloseFlag"
              class="flex items-center space-x-2"
            >
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
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  border-width: 0;
}
</style>
