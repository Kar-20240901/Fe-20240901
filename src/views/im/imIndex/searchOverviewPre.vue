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

function onSearchKeyChange(val: string) {
  searchKey.value = val;
  onSearchKeyChangeDebounce();
}

const onSearchKeyChangeDebounce: any = debounce(
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
  });
}

const pageSize = "20";

const searchHistoryList = ref<BaseImSearchHistoryVO[]>([]);

function searchHistory() {
  searchHistoryList.value = [];

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
</script>

<template>
  <div class="flex flex-col">
    <search-content-info
      v-if="showSearchContentInfoFlag"
      ref="searchContentInfoRef"
      :search-key="searchKey"
      :searchBaseContentVO="props.searchBaseContentVO"
      @searchContentInfoClick="searchContentInfoClick"
    />

    <search-overview
      v-if="!showSearchContentInfoFlag && searchKey"
      ref="searchOverviewRef"
      :search-key="searchKey"
      @searchFriendClick="searchFriendClick"
      @searchGroupClick="searchGroupClick"
      @searchContentClick="searchContentClick"
    />

    <div v-if="!showSearchContentInfoFlag && !searchKey">
      <el-input
        v-model="searchKey"
        placeholder="请输入搜索内容"
        clearable
        class="w-full"
        @change="onSearchKeyChange"
      />
    </div>
    <div class="flex justify-between">
      <div>最近搜索</div>
      <div>
        <div
          v-if="!searchHistoryCloseFlag"
          @click="searchHistoryCloseFlag = true"
        >
          删除
        </div>
        <div v-else>
          <div @click="searchHistoryDeleteAllClick()">清空</div>
          <div @click="searchHistoryCloseFlag = false">完成</div>
        </div>
      </div>
    </div>
    <div>
      <template v-for="item in searchHistoryList" :key="item.id">
        <el-tag
          class="w-[50%]"
          :closable="searchHistoryCloseFlag"
          @close="searchHistoryDeleteClick(item.id)"
          @click="
            () => {
              onSearchKeyChange(item.searchHistory);
            }
          "
          >{{ item.searchHistory }}
        </el-tag>
      </template>
    </div>
  </div>
</template>
