<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { debounce, useResizeObserver } from "@pureadmin/utils";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  BaseImFriendPageVO,
  baseImFriendScroll
} from "@/api/http/base/BaseImFriendController";
import { DevFlag } from "@/utils/SysUtil";
import Avatar from "@/assets/user.png";
import { IImContactFriendProps } from "@/views/im/imIndex/types";
import { safeHighlight } from "@/utils/StrUtil";

const loading = ref<boolean>(false);

const pageSize = 20;

let hasMore: boolean = true;

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const scrollbarClass = ref<string>("");

const contactFriendRecycleScrollerRef = ref();

const syncHeight = () => {
  if (!scrollbarParentDiv.value) {
    return;
  }

  scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

  if (scrollbarHeight.value) {
    scrollbarParentDivResizeObserver.stop();

    nextTick(() => {
      if (
        contactFriendRecycleScrollerRef.value.offsetHeight >
        contactFriendRecycleScrollerRef.value.clientHeight
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

const friendList = ref<BaseImFriendPageVO[]>([]);

const emit = defineEmits<{
  (e: "contactFriendClick", item: BaseImFriendPageVO): void;
}>();

function contactFriendClick(item: BaseImFriendPageVO) {
  emit("contactFriendClick", item);
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

  let imFriendId = undefined;

  if (scrollFlag) {
    if (friendList.value.length) {
      const lastItem = friendList.value[friendList.value.length - 1];

      imFriendId = lastItem.imFriendId;
    }
  }

  baseImFriendScroll({
    pageSize: String(pageSize),
    id: imFriendId,
    backwardFlag: false,
    containsCurrentIdFlag: false,
    searchKey: props.searchKey
  })
    .then(res => {
      if (scrollFlag) {
        friendList.value = friendList.value.concat(res.data);
      } else {
        friendList.value = res.data;
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

const props = defineProps<IImContactFriendProps>();
</script>

<template>
  <div v-loading="loading" class="flex flex-col h-full">
    <div
      v-if="props.showTitleFlag"
      class="shrink-0 text-sm text-gray-400 mb-1 px-4"
    >
      联系人
    </div>

    <div ref="scrollbarParentDiv" class="flex-1 h-full">
      <DynamicScroller
        v-show="friendList.length"
        ref="contactFriendRecycleScrollerRef"
        :items="friendList"
        :min-item-size="56"
        key-field="friendUserId"
        :style="`height: ${scrollbarHeight}px`"
        :class="`${scrollbarClass}`"
        @scroll="handleScroll"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem :item="item" :active="active" :index="index">
            <div
              :class="`flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50 ${props.itemClass}`"
              @click="contactFriendClick(item)"
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
              </div>

              <div v-else class="ml-4 flex-1 text-sm truncate">
                {{ item.friendShowName }}
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div
        v-if="!friendList.length && !loading"
        class="flex text-[15px] w-full h-full justify-center items-center text-gray-400"
      >
        暂无好友。
      </div>
    </div>
  </div>
</template>
