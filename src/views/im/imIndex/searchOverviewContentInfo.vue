<script setup lang="ts">
import { ref } from "vue";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { IImSearchOverviewMoreContentInfoProps } from "@/views/im/imIndex/types";
import Avatar from "@/assets/user.png";
import { processText } from "@/utils/StrUtil";
import { FormatTsForCurrentDay } from "@/utils/DateUtil";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { throttle, useResizeObserver } from "@pureadmin/utils";

const searchContentInfoList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const searchContentInfoLoading = ref<boolean>(false);

const props = defineProps<IImSearchOverviewMoreContentInfoProps>();

const emit = defineEmits<{
  (e: "searchContentInfoClick", item: BaseImSessionContentRefUserPageVO): void;
}>();

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  emit("searchContentInfoClick", item);
}

const pageSize = 20;

function doSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    searchContentInfoLoading.value = true;
  }

  let contentId = undefined;

  if (scrollFlag) {
    contentId = searchContentInfoList.value.length
      ? searchContentInfoList.value[searchContentInfoList.value.length - 1]
          .contentId
      : undefined;
  }

  baseImSessionContentRefUserScroll({
    refId: props.searchBaseContentVO.sessionId,
    searchKey: props.searchKey,
    pageSize: String(pageSize),
    id: contentId,
    backwardFlag: true,
    containsCurrentIdFlag: false
  })
    .then(res => {
      if (scrollFlag) {
        searchContentInfoList.value = searchContentInfoList.value.concat(
          res.data
        );
      } else {
        searchContentInfoList.value = res.data;
      }

      hasMore = res.data.length === pageSize;
    })
    .finally(() => {
      searchContentInfoLoading.value = false;
    });
}

function reset() {
  searchContentInfoList.value = [];

  hasMore = true;
}

defineExpose({
  doSearch,
  reset
});

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const syncHeight = () => {
  if (scrollbarParentDiv.value) {
    scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

    if (scrollbarHeight.value) {
      scrollbarParentDivResizeObserver.stop();
    }
  }
};

const scrollbarParentDivResizeObserver = useResizeObserver(
  scrollbarParentDiv,
  () => {
    syncHeight();
  }
);

let hasMore: boolean = true;

const doSearchThrottle = throttle(
  (loadingFlag?: boolean, scrollFlag?: boolean) => {
    doSearch(loadingFlag, scrollFlag);
  },
  300
) as (loadingFlag?: boolean, scrollFlag?: boolean) => void;

function loadMore() {
  if (!searchContentInfoLoading.value && hasMore) {
    doSearchThrottle(false, true);
  }
}
</script>

<template>
  <div class="flex flex-col cursor-default bg-gray-100 space-y-1 h-full">
    <div class="flex flex-col bg-white pt-3 h-full">
      <div class="shrink-0 text-sm text-gray-400 mb-1">聊天记录</div>

      <div ref="scrollbarParentDiv" class="flex-1">
        <el-scrollbar
          v-loading="searchContentInfoLoading"
          :height="scrollbarHeight"
          @end-reached="loadMore"
        >
          <DynamicScroller
            v-show="searchContentInfoList.length"
            :items="searchContentInfoList"
            :min-item-size="56"
            key-field="contentId"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem :item="item" :active="active" :index="index">
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
                          part.highlightedFlag
                            ? 'text-blue-800'
                            : 'text-gray-400'
                        "
                      >
                        {{ part.text }}
                      </div>
                    </div>

                    <div class="text-xs text-gray-400">
                      {{ FormatTsForCurrentDay(item.createTs, true) }}
                    </div>
                  </div>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
