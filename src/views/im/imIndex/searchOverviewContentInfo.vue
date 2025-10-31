<script setup lang="ts">
import { ref } from "vue";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { IImSearchOverviewMoreContentInfoProps } from "@/views/im/imIndex/types";
import Avatar from "@/assets/user.png";
import { processText } from "@/utils/StrUtil";

const searchContentInfoList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const searchContentInfoLoading = ref<boolean>(false);

const props = defineProps<IImSearchOverviewMoreContentInfoProps>();

const emit = defineEmits<{
  (e: "searchContentInfoClick", item: BaseImSessionContentRefUserPageVO): void;
}>();

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  emit("searchContentInfoClick", item);
}

function doSearch() {
  baseImSessionContentRefUserScroll({
    refId: props.searchBaseContentVO.sessionId,
    searchKey: props.searchKey,
    pageSize: "20",
    id: searchContentInfoList.value.length
      ? searchContentInfoList.value[searchContentInfoList.value.length - 1]
          .contentId
      : undefined
  })
    .then(res => {
      searchContentInfoList.value = res.data;
    })
    .finally(() => {
      searchContentInfoLoading.value = false;
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
    <div class="flex flex-col bg-white pt-3">
      <div class="text-sm text-gray-400 mb-1">聊天记录</div>
      <template v-for="item in searchContentInfoList" :key="item.contentId">
        <div
          class="flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50"
          @click="searchContentInfoClick(item)"
        >
          <el-image
            :src="props.sessionUserMap[item.createId]?.avatarUrl"
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
            <div class="truncate">
              {{ props.sessionUserMap[item.createId]?.showName }}
            </div>
            <div class="flex">
              <div
                v-for="(part, index) in processText(
                  item.content,
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
  </div>
</template>
