<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { debounce, useResizeObserver } from "@pureadmin/utils";
import { nextTick, ref } from "vue";
import Avatar from "@/assets/user.png";
import { IImBaseContentProps } from "@/views/im/imIndex/types";
import {
  baseImSearchBaseContentScroll,
  BaseImSearchBaseContentVO
} from "@/api/http/base/BaseImSearchController";

const loading = ref<boolean>(false);

const pageSize = 20;

let hasMore: boolean = true;

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const scrollbarClass = ref<string>("");

const baseContentRecycleScrollerRef = ref();

const syncHeight = () => {
  if (!scrollbarParentDiv.value) {
    return;
  }

  scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

  if (scrollbarHeight.value) {
    scrollbarParentDivResizeObserver.stop();

    nextTick(() => {
      if (
        baseContentRecycleScrollerRef.value.offsetHeight >
        baseContentRecycleScrollerRef.value.clientHeight
      ) {
        scrollbarClass.value = "scrollbar-hide";
      }
    });
  }
};

const scrollbarParentDivResizeObserver = useResizeObserver(
  scrollbarParentDiv,
  () => {
    syncHeight();
  }
);

const baseContentList = ref<BaseImSearchBaseContentVO[]>([]);

const emit = defineEmits<{
  (e: "searchContentClick", item: BaseImSearchBaseContentVO): void;
}>();

function searchContentClick(item: BaseImSearchBaseContentVO) {
  emit("searchContentClick", item);
}

defineExpose({
  doSearch
});

function doSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    loading.value = true;
  }

  let sessionId = undefined;
  let maxContentCreateTs = undefined;

  if (scrollFlag) {
    if (baseContentList.value.length) {
      const lastItem = baseContentList.value[baseContentList.value.length - 1];

      sessionId = lastItem.sessionId;
      maxContentCreateTs = lastItem.maxContentCreateTs;
    }
  }

  baseImSearchBaseContentScroll({
    pageSize: String(pageSize),
    backwardFlag: false,
    searchKey: props.searchKey,
    long1: maxContentCreateTs,
    id: sessionId
  })
    .then(res => {
      if (scrollFlag) {
        baseContentList.value = baseContentList.value.concat(res.data);
      } else {
        baseContentList.value = res.data;
      }

      hasMore = res.data.length >= pageSize;
    })
    .finally(() => {
      loading.value = false;
    });
}

const doSearchDebounce = debounce(
  (loadingFlag?: boolean, scrollFlag?: boolean) => {
    doSearch(loadingFlag, scrollFlag);
  },
  300,
  true
) as (loadingFlag?: boolean, scrollFlag?: boolean) => void;

function handleScroll(event: Event) {
  const scrollerEl = event.target as HTMLElement;

  if (!scrollerEl) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollerEl;

  const distanceToBottom = scrollHeight - clientHeight - scrollTop;

  if (distanceToBottom <= 20 && !loading.value && hasMore) {
    doSearchDebounce(false, true);
  }
}

const props = defineProps<IImBaseContentProps>();
</script>

<template>
  <div v-loading="loading" class="flex flex-col h-full">
    <div class="shrink-0 text-sm text-gray-400 mb-1 px-4">聊天记录</div>

    <div ref="scrollbarParentDiv" class="flex-1 h-full">
      <DynamicScroller
        v-show="baseContentList.length"
        ref="baseContentRecycleScrollerRef"
        :items="baseContentList"
        :min-item-size="56"
        key-field="sessionId"
        :style="`height: ${scrollbarHeight}px`"
        :class="`${scrollbarClass}`"
        @scroll="handleScroll"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem :item="item" :active="active" :index="index">
            <div
              :class="`flex items-center cursor-pointer py-1 px-4 hover:bg-gray-50`"
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

              <div class="flex flex-col text-sm ml-2 truncate">
                <div class="truncate" :title="item.showName">
                  {{ item.showName }}
                </div>
                <div class="flex text-gray-400">
                  <div>{{ item.searchCount }}</div>
                  <div>条相关聊天记录</div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div
        v-if="!baseContentList.length && !loading"
        class="flex text-[15px] w-full h-full justify-center items-center text-gray-400"
      >
        暂无聊天记录。
      </div>
    </div>
  </div>
</template>
