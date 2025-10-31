<script setup lang="ts">
import { ref } from "vue";
import Avatar from "@/assets/user.png";
import {
  baseImSearchBase,
  BaseImSearchBaseContentVO,
  BaseImSearchBaseDTO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { IImSearchOverviewMoreProps } from "@/views/im/imIndex/types";
import { processText } from "@/utils/StrUtil";

const searchFriendList = ref<BaseImSearchBaseFriendVO[]>([]);

const searchGroupList = ref<BaseImSearchBaseGroupVO[]>([]);

const searchContentList = ref<BaseImSearchBaseContentVO[]>([]);

const searchContentInfoLoading = ref<boolean>(false);

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

function doSearch() {
  searchFriendList.value = [];
  searchGroupList.value = [];
  searchContentList.value = [];

  const reqBody: BaseImSearchBaseDTO = { searchKey: props.searchKey };

  if (props.showSearchOverviewMoreFriendFlag) {
    reqBody.searchFriendFlag = true;
    reqBody.searchGroupFlag = false;
    reqBody.searchContentFlag = false;
  } else if (props.showSearchOverviewMoreGroupFlag) {
    reqBody.searchFriendFlag = false;
    reqBody.searchGroupFlag = true;
    reqBody.searchContentFlag = false;
  } else if (props.showSearchOverviewMoreContentFlag) {
    reqBody.searchFriendFlag = false;
    reqBody.searchGroupFlag = false;
    reqBody.searchContentFlag = true;
  }

  baseImSearchBase(reqBody).then(res => {
    searchFriendList.value = res.data.friendList || [];
    searchGroupList.value = res.data.groupList || [];
    searchContentList.value = res.data.contentList || [];
  });
}

defineExpose({
  doSearch
});
</script>

<template>
  <div
    v-loading="searchContentInfoLoading"
    class="flex flex-col cursor-default bg-gray-100 space-y-1"
  >
    <div
      v-if="props.showSearchOverviewMoreFriendFlag"
      class="flex flex-col bg-white pt-3"
    >
      <div class="text-sm text-gray-400 mb-1">联系人</div>
      <template v-for="item in searchFriendList" :key="item.sessionId">
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchFriendClick(item)"
        >
          <el-image
            :src="item.avatarUrl"
            fit="cover"
            class="w-12 h-12 rounded-full"
          >
            <template #error>
              <el-image
                :src="Avatar"
                fit="cover"
                class="w-12 h-12 rounded-full"
              />
            </template>
          </el-image>
          <div class="text-sm ml-2 shrink-0 flex">
            <div
              v-for="(part, index) in processText(
                item.friendShowName,
                props.searchKey
              )"
              :key="index"
              :class="part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'"
            >
              {{ part.text }}
            </div>
          </div>
          <div class="truncate text-sm text-gray-400 flex">
            （
            <div
              v-for="(part, index) in processText(
                item.friendShowId,
                props.searchKey
              )"
              :key="index"
              :class="part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'"
            >
              {{ part.text }}
            </div>
            ）
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="props.showSearchOverviewMoreGroupFlag"
      class="flex flex-col bg-white pt-3"
    >
      <div class="text-sm text-gray-400 mb-1">群聊</div>
      <template v-for="item in searchGroupList" :key="item.sessionId">
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchGroupClick(item)"
        >
          <el-image
            :src="item.avatarUrl"
            fit="cover"
            class="w-12 h-12 rounded-full"
          >
            <template #error>
              <el-image
                :src="Avatar"
                fit="cover"
                class="w-12 h-12 rounded-full"
              />
            </template>
          </el-image>
          <div class="text-sm ml-2 shrink-0 flex">
            <div
              v-for="(part, index) in processText(
                item.groupShowName,
                props.searchKey
              )"
              :key="index"
              :class="part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'"
            >
              {{ part.text }}
            </div>
          </div>
          <div class="truncate text-sm text-gray-400 flex">
            （
            <div
              v-for="(part, index) in processText(
                item.groupShowId,
                props.searchKey
              )"
              :key="index"
              :class="part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'"
            >
              {{ part.text }}
            </div>
            ）
          </div>
        </div>
      </template>
    </div>
    <div
      v-if="props.showSearchOverviewMoreContentFlag"
      class="flex flex-col bg-white pt-3"
    >
      <div class="text-sm text-gray-400 mb-1">聊天记录</div>
      <template v-for="item in searchContentList" :key="item.sessionId">
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchContentClick(item)"
        >
          <el-image
            :src="item.avatarUrl"
            fit="cover"
            class="w-12 h-12 rounded-full"
          >
            <template #error>
              <el-image
                :src="Avatar"
                fit="cover"
                class="w-12 h-12 rounded-full"
              />
            </template>
          </el-image>
          <div class="flex flex-col text-sm ml-2">
            <div class="truncate">{{ item.showName }}</div>
            <div class="flex text-gray-400">
              <div>{{ item.searchCount }}</div>
              <div>条相关聊天记录</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
