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
import SearchContentInfo from "@/views/im/imIndex/searchContentInfo.vue";
import searchContentInfo from "@/views/im/imIndex/searchContentInfo.vue";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import {
  IImSearchOverviewPreProps,
  IImShowInfoMap
} from "@/views/im/imIndex/types";
import { BaseImSessionContentRefUserPageVO } from "@/api/http/base/BaseImSessionContentRefUserController";

const props = defineProps<IImSearchOverviewPreProps>();

const searchKey = ref<string>("");

function onSearchKeyClear() {
  searchHistory();
}

function onSearchKeyChange(val: string) {
  searchKey.value = val;
  onSearchKeyChangeDebounce();
}

const onSearchKeyChangeDebounce: () => void = debounce(
  onSearchKeyChangeDebounceFun,
  1000,
  true
);

function onSearchKeyChangeDebounceFun() {
  searchOverviewRef.value.doBaseImSearchBase();
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

const showSearchContentInfoFlag = ref<boolean>(false);

const searchContentInfoRef = ref();

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

  showSearchContentInfoFlag.value = true;

  nextTick(() => {
    searchContentInfoRef.value.doSearch();
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
</script>

<template>
  <div class="flex flex-col p-4 cursor-default">
    <search-content-info
      v-if="showSearchContentInfoFlag"
      ref="searchContentInfoRef"
      :search-key="searchKey"
      :searchBaseContentVO="props.searchBaseContentVO"
      @searchContentInfoClick="searchContentInfoClick"
    />

    <div
      v-if="!showSearchContentInfoFlag"
      class="flex justify-between items-center mt-1"
    >
      <el-input
        v-model="searchKey"
        :autosize="{ minRows: 1, maxRows: 2 }"
        placeholder="请输入搜索内容"
        clearable
        class="w-full"
        autofocus
        type="textarea"
        resize="none"
        @change="onSearchKeyChange"
        @clear="onSearchKeyClear"
      />

      <div
        class="ml-2 text-sm shrink-0 text-gray-400 shrink-0 cursor-pointer hover:text-gray-800"
        @click="searchOverviewPreBackClick()"
      >
        取消
      </div>
    </div>

    <search-overview
      v-if="!showSearchContentInfoFlag && searchKey"
      ref="searchOverviewRef"
      :search-key="searchKey"
      @searchFriendClick="searchFriendClick"
      @searchGroupClick="searchGroupClick"
      @searchContentClick="searchContentClick"
    />

    <template v-if="!showSearchContentInfoFlag && !searchKey">
      <div class="flex justify-between text-sm mt-4 mb-4">
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
            @close="searchHistoryDeleteClick(item.id)"
            @click="
              () => {
                onSearchKeyChange(item.searchHistory);
              }
            "
          >
            <div class="flex justify-center w-20 truncate">
              {{ item.searchHistory }}
            </div>
          </el-tag>
        </template>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tag) {
  border-width: 0;
}
</style>
