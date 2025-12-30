<script setup lang="ts">
import { ref } from "vue";
import {
  baseImSearchBase,
  BaseImSearchBaseContentVO,
  BaseImSearchBaseFriendVO,
  BaseImSearchBaseGroupVO
} from "@/api/http/base/BaseImSearchController";
import { IImSearchOverviewProps } from "@/views/im/imIndex/types";
import Avatar from "@/assets/user.png";
import { safeHighlight } from "@/utils/StrUtil";

const searchFriendList = ref<BaseImSearchBaseFriendVO[]>([]);

const searchGroupList = ref<BaseImSearchBaseGroupVO[]>([]);

const searchContentList = ref<BaseImSearchBaseContentVO[]>([]);

const props = defineProps<IImSearchOverviewProps>();

function doBaseImSearchBase() {
  searchFriendList.value = [];
  searchGroupList.value = [];
  searchContentList.value = [];

  if (!props.searchKey || !props.searchKey.trim()) {
    return;
  }

  baseImSearchBase({ searchKey: props.searchKey }).then(res => {
    searchFriendList.value = res.data.friendList || [];
    searchGroupList.value = res.data.groupList || [];
    searchContentList.value = res.data.contentList || [];
  });
}

function reset() {
  searchFriendList.value = [];
  searchGroupList.value = [];
  searchContentList.value = [];
}

defineExpose({
  doBaseImSearchBase,
  reset
});

const emit = defineEmits<{
  (e: "searchFriendClick", item: BaseImSearchBaseFriendVO): void;
  (e: "searchGroupClick", item: BaseImSearchBaseGroupVO): void;
  (e: "searchContentClick", item: BaseImSearchBaseContentVO): void;

  (e: "searchMoreFriendClick"): void;
  (e: "searchMoreGroupClick"): void;
  (e: "searchMoreContentClick"): void;
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

function searchMoreFriendClick() {
  emit("searchMoreFriendClick");
}

function searchMoreGroupClick() {
  emit("searchMoreGroupClick");
}

function searchMoreContentClick() {
  emit("searchMoreContentClick");
}
</script>

<template>
  <div class="flex flex-col cursor-default bg-gray-100 space-y-1">
    <div v-show="searchFriendList.length" class="flex flex-col bg-white pt-3">
      <div class="flex justify-between items-center text-sm text-gray-400 mb-1">
        <div>联系人</div>
        <div
          v-if="searchFriendList.length > 1"
          class="text-gray-400 cursor-pointer hover:text-gray-800"
          @click="searchMoreFriendClick"
        >
          更多
        </div>
      </div>
      <template
        v-for="item in searchFriendList.slice(0, 3)"
        :key="item.sessionId"
      >
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchFriendClick(item)"
        >
          <div class="shrink-0">
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
          </div>

          <div class="ml-2 flex flex-col truncate">
            <div class="truncate text-sm text-gray-400 flex">
              <div
                v-for="(part, index) in safeHighlight(
                  item.friendShowId,
                  props.searchKey
                )"
                :key="index"
                :class="
                  part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'
                "
                :title="item.friendShowId"
              >
                {{ part.text }}
              </div>
            </div>

            <div class="text-sm shrink-0 flex truncate">
              <div
                v-for="(part, index) in safeHighlight(
                  item.friendShowName,
                  props.searchKey
                )"
                :key="index"
                :class="
                  part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'
                "
                :title="item.friendShowName"
              >
                {{ part.text }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-show="searchGroupList.length" class="flex flex-col bg-white pt-3">
      <div class="flex justify-between items-center text-sm text-gray-400 mb-1">
        <div>群聊</div>
        <div
          v-if="searchGroupList.length > 1"
          class="text-gray-400 cursor-pointer hover:text-gray-800"
          @click="searchMoreGroupClick"
        >
          更多
        </div>
      </div>
      <template
        v-for="item in searchGroupList.slice(0, 3)"
        :key="item.sessionId"
      >
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchGroupClick(item)"
        >
          <div class="shrink-0">
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
          </div>

          <div class="ml-2 flex flex-col truncate">
            <div class="text-sm shrink-0 flex truncate">
              <div
                v-for="(part, index) in safeHighlight(
                  item.groupShowName,
                  props.searchKey
                )"
                :key="index"
                :class="
                  part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'
                "
              >
                {{ part.text }}
              </div>
            </div>

            <div class="truncate text-sm text-gray-400 flex">
              <div
                v-for="(part, index) in safeHighlight(
                  item.groupShowId,
                  props.searchKey
                )"
                :key="index"
                :class="
                  part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'
                "
              >
                {{ part.text }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-show="searchContentList.length" class="flex flex-col bg-white pt-3">
      <div class="flex justify-between items-center text-sm text-gray-400 mb-1">
        <div>聊天记录</div>
        <div
          v-if="searchContentList.length > 1"
          class="text-gray-400 cursor-pointer hover:text-gray-800"
          @click="searchMoreContentClick"
        >
          更多
        </div>
      </div>
      <template
        v-for="item in searchContentList.slice(0, 3)"
        :key="item.sessionId"
      >
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchContentClick(item)"
        >
          <div class="shrink-0">
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
          </div>

          <div class="flex flex-col text-sm ml-2 truncate">
            <div class="truncate">{{ item.showName }}</div>
            <div class="flex text-gray-400 truncate">
              <div>{{ item.searchCount }}</div>
              <div>条相关聊天记录</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
