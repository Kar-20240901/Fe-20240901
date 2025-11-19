<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { throttle, useResizeObserver } from "@pureadmin/utils";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  BaseImFriendPageVO,
  baseImFriendScroll
} from "@/api/http/base/BaseImFriendController";
import { DevFlag } from "@/utils/SysUtil";
import Avatar from "@/assets/user.png";

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

  let friendUserId = undefined;

  if (scrollFlag) {
    friendUserId = friendList.value.length
      ? friendList.value[friendList.value.length - 1].friendUserId
      : undefined;
  }

  baseImFriendScroll({
    pageSize: String(pageSize),
    id: friendUserId,
    backwardFlag: true,
    containsCurrentIdFlag: false
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
              :class="`flex items-center cursor-pointer py-1 px-1 hover:bg-gray-50`"
              @click="contactFriendClick(item)"
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
                {{ item.friendShowName }}
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>

      <div
        v-if="!friendList.length && !loading"
        class="flex text-[15px] flex w-full h-full justify-center items-center text-gray-400"
      >
        暂无好友。
      </div>
    </div>
  </div>
</template>
