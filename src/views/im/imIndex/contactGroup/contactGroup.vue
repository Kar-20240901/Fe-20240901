<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { debounce, useResizeObserver } from "@pureadmin/utils";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { DevFlag } from "@/utils/SysUtil";
import Avatar from "@/assets/user.png";
import {
  BaseImGroupPageVO,
  baseImGroupScroll
} from "@/api/http/base/BaseImGroupController";
import { IImContactGroupProps } from "@/views/im/imIndex/types";
import { safeHighlight } from "@/utils/StrUtil";

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

defineExpose({
  doSearch
});

function doSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    loading.value = true;
  }

  let groupId = undefined;

  if (scrollFlag) {
    if (groupList.value.length) {
      const lastItem = groupList.value[groupList.value.length - 1];

      groupId = lastItem.groupId;
    }
  }

  baseImGroupScroll({
    pageSize: String(pageSize),
    id: groupId,
    backwardFlag: false,
    containsCurrentIdFlag: false,
    searchKey: props.searchKey
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

const props = defineProps<IImContactGroupProps>();
</script>

<template>
  <div v-loading="loading" class="flex flex-col h-full">
    <div
      v-if="props.showTitleFlag"
      class="shrink-0 text-sm text-gray-400 mb-1 px-4"
    >
      群聊
    </div>

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
              :class="`flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50 ${props.itemClass}`"
              @click="contactGroupClick(item)"
            >
              <div class="shrink-0 flex items-center">
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

              <div
                v-if="props.safeHighlightFlag"
                class="ml-2 flex flex-col truncate"
              >
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
                    :title="item.groupShowName"
                  >
                    {{ part.text }}
                  </div>
                </div>

                <div class="truncate text-sm text-gray-400 flex">
                  <div
                    v-for="(part, index) in safeHighlight(
                      item.groupUuid,
                      props.searchKey
                    )"
                    :key="index"
                    :class="
                      part.highlightedFlag ? 'text-blue-800' : 'text-gray-400'
                    "
                    :title="item.groupUuid"
                  >
                    {{ part.text }}
                  </div>
                </div>
              </div>

              <div v-else class="ml-4 flex-1 text-sm truncate">
                {{ item.groupShowName }}
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div
        v-if="!groupList.length && !loading"
        class="flex text-[15px] w-full h-full justify-center items-center text-gray-400"
      >
        暂无群聊。
      </div>
    </div>
  </div>
</template>
