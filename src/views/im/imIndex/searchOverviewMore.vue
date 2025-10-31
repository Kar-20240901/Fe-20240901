<script setup lang="ts">
import { ref } from "vue";
import Avatar from "@/assets/user.png";
import {
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { IImSearchOverviewMoreProps } from "@/views/im/imIndex/types";

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

function doSearch() {}

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
          <div class="truncate text-sm ml-2">{{ item.friendShowName }}</div>
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
          <div class="truncate text-sm ml-2">{{ item.groupShowName }}</div>
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
