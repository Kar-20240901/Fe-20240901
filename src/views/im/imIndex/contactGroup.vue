<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { throttle, useResizeObserver } from "@pureadmin/utils";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { DevFlag } from "@/utils/SysUtil";
import Avatar from "@/assets/user.png";
import {
  BaseImGroupPageVO,
  baseImGroupScroll
} from "@/api/http/base/BaseImGroupController";

const loading = ref<boolean>(false);

const pageSize = 20;

let hasMore: boolean = true;

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const scrollbarClass = ref<string>("");

const contactGroupRecycleScrollerRef = ref();

const syncHeight = () => {
  if (!scrollbarParentDiv.value) {
    return;
  }

  scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

  if (scrollbarHeight.value) {
    scrollbarParentDivResizeObserver.stop();

    nextTick(() => {
      if (
        contactGroupRecycleScrollerRef.value.offsetHeight >
        contactGroupRecycleScrollerRef.value.clientHeight
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

const groupList = ref<BaseImGroupPageVO[]>([]);

const emit = defineEmits<{
  (e: "contactGroupClick", item: BaseImGroupPageVO): void;
}>();

function contactGroupClick(item: BaseImGroupPageVO) {
  emit("contactGroupClick", item);
}

let timer: number | null = null;

onMounted(() => {
  doSearch(true, false);

  if (!DevFlag()) {
    timer = window.setInterval(() => {
      doSearch(false, false);
    }, 10000);
  }
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});

function doSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    loading.value = true;
  }

  let groupId = undefined;

  if (scrollFlag) {
    groupId = groupList.value.length
      ? groupList.value[groupList.value.length - 1].groupId
      : undefined;
  }

  baseImGroupScroll({
    pageSize: String(pageSize),
    id: groupId,
    backwardFlag: true,
    containsCurrentIdFlag: false
  })
    .then(res => {
      if (scrollFlag) {
        groupList.value = groupList.value.concat(res.data);
      } else {
        groupList.value = res.data;
      }

      hasMore = res.data.length >= pageSize;
    })
    .finally(() => {
      loading.value = false;
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

  if (distanceToBottom <= 20 && !loading.value && hasMore) {
    doSearchThrottle(false, true);
  }
}
</script>

<template>
  <div v-loading="loading" class="flex flex-col h-full px-3 py-1">
    <div ref="scrollbarParentDiv" class="flex-1 h-full">
      <DynamicScroller
        v-show="groupList.length"
        ref="contactGroupRecycleScrollerRef"
        :items="groupList"
        :min-item-size="56"
        key-field="groupId"
        :style="`height: ${scrollbarHeight}px`"
        :class="`${scrollbarClass}`"
        @scroll="handleScroll"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem :item="item" :active="active" :index="index">
            <div
              :class="`flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50`"
              @click="contactGroupClick(item)"
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

              <div class="ml-4 flex-1 text-sm truncate pr-1">
                {{ item.groupShowName }}
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div
        v-if="!groupList.length && !loading"
        class="flex text-[15px] flex w-full h-full justify-center items-center text-gray-400"
      >
        暂无群组。
      </div>
    </div>
  </div>
</template>
