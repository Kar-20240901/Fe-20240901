<script setup lang="ts">
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { throttle, useResizeObserver } from "@pureadmin/utils";
import { ref } from "vue";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { IImContactFriendProps } from "@/views/im/imIndex/types";

const searchLoading = ref<boolean>(false);

const pageSize = 20;

let hasMore: boolean = true;

function reset() {
  searchContentInfoList.value = [];

  hasMore = true;
}

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

const friendList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const props = defineProps<IImContactFriendProps>();

const emit = defineEmits<{
  (e: "searchContentInfoClick", item: BaseImSessionContentRefUserPageVO): void;
}>();

function searchContentInfoClick(item: BaseImSessionContentRefUserPageVO) {
  emit("searchContentInfoClick", item);
}

function doSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    searchLoading.value = true;
  }

  let contentId = undefined;

  if (scrollFlag) {
    contentId = friendList.value.length
      ? friendList.value[friendList.value.length - 1].contentId
      : undefined;
  }

  baseImSessionContentRefUserScroll({
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

      hasMore = res.data.length >= pageSize;
    })
    .finally(() => {
      searchLoading.value = false;
    });
}

const doSearchThrottle = throttle(
  (loadingFlag?: boolean, scrollFlag?: boolean) => {
    doSearch(loadingFlag, scrollFlag);
  },
  300
) as (loadingFlag?: boolean, scrollFlag?: boolean) => void;

function handleScroll(event: Event) {
  const scrollerEl = event.target as HTMLElement;

  if (!scrollerEl) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollerEl;

  const distanceToBottom = scrollHeight - clientHeight - scrollTop;

  if (distanceToBottom <= 20 && !searchLoading.value && hasMore) {
    doSearchThrottle(false, true);
  }
}
</script>

<template>
  <div
    ref="scrollbarParentDiv"
    v-loading="searchLoading"
    class="flex flex-col h-full"
  />
</template>
