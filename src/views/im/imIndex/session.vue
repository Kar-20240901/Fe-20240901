<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserScroll
} from "@/api/http/base/BaseImSessionRefUserController";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { IImSessionProps, IImShowInfoMap } from "@/views/im/imIndex/types";
import { FormatTsForCurrentDay } from "@/utils/DateUtil";
import Avatar from "@/assets/user.png";
import { DevFlag } from "@/utils/SysUtil";
import { throttle, useResizeObserver } from "@pureadmin/utils";

const loading = ref<boolean>(false);
const dataList = ref<BaseImSessionRefUserPageVO[]>([]);

const emit = defineEmits<{
  (e: "sessionClick", item: BaseImSessionRefUserPageVO): void;

  (e: "updateSessionUserMap", item: IImShowInfoMap): void;

  (e: "doUpdateAvatarAndNickname", sessionIdArr: string[]): void;
}>();

function sessionClick(item: BaseImSessionRefUserPageVO) {
  emit("sessionClick", item);

  updateLastContent(item.sessionId, undefined, undefined, 0, true, false);
}

const pageSize = 20;

function reset() {
  dataList.value = [];

  hasMore = true;

  dataListSessionIdSet.clear();
}

const dataListSessionIdSet: Set<string> = new Set();

function handleDataList(tempDataList?: BaseImSessionRefUserPageVO[]) {
  if (!tempDataList || !tempDataList.length) {
    return;
  }

  let addFlag = false;

  tempDataList.forEach(item => {
    const sessionId = item.sessionId;

    if (!sessionId) {
      return;
    }

    if (dataListSessionIdSet.has(sessionId)) {
      return;
    }

    dataListSessionIdSet.add(sessionId);
    dataList.value.push(item);

    addFlag = true;
  });

  if (!addFlag) {
    return;
  }

  // 排序
  dataList.value.sort((a, b) => {
    const lastReceiveTsOne = Number(a.lastReceiveTs);

    const lastReceiveTsTwo = Number(b.lastReceiveTs);

    if (lastReceiveTsOne === lastReceiveTsTwo) {
      return a.sessionId < b.sessionId ? 1 : -1;
    } else {
      return lastReceiveTsOne < lastReceiveTsTwo ? 1 : -1;
    }
  });
}

function onSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    loading.value = true;
  }

  let sessionId = undefined;
  let lastReceiveTs = undefined;
  let refIdSet = undefined;

  if (scrollFlag) {
    if (dataList.value.length) {
      const lastItem = dataList.value[dataList.value.length - 1];

      sessionId = lastItem.sessionId;
      lastReceiveTs = lastItem.lastReceiveTs;
    }
  } else {
    refIdSet = [...dataListSessionIdSet];
  }

  baseImSessionRefUserScroll({
    id: sessionId,
    pageSize: String(pageSize),
    refId: lastReceiveTs,
    refIdSet
  })
    .then(res => {
      if (scrollFlag) {
        handleDataList(res.data);
      } else {
        reset();
        handleDataList(res.data);
      }

      hasMore = res.data.length >= pageSize;

      if (!res.data.length) {
        return;
      }

      const sessionIdArr = [];

      res.data.forEach(item => {
        sessionIdArr.push(item.sessionId);

        const sessionUserMapItem: IImShowInfoMap = {};
        sessionUserMapItem.targetId = item.targetId;
        sessionUserMapItem.avatarUrl = item.avatarUrl;
        sessionUserMapItem.showName = item.sessionName;

        if (item.targetType === BaseImTypeEnum.FRIEND.code) {
          emit("updateSessionUserMap", sessionUserMapItem);
        } else if (item.targetType === BaseImTypeEnum.GROUP.code) {
        }
      });

      emit("doUpdateAvatarAndNickname", sessionIdArr);
    })
    .finally(() => {
      loading.value = false;
    });
}

let timer: number | null = null;

onMounted(() => {
  onSearch(true, false);

  if (!DevFlag()) {
    timer = window.setInterval(() => {
      onSearch(false, false);
    }, 10000);
  }
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const scrollbarClass = ref<string>("");

const sessionRecycleScrollerRef = ref();

const syncHeight = () => {
  if (!scrollbarParentDiv.value) {
    return;
  }

  scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;

  if (scrollbarHeight.value) {
    scrollbarParentDivResizeObserver.stop();

    nextTick(() => {
      if (
        sessionRecycleScrollerRef.value.offsetHeight >
        sessionRecycleScrollerRef.value.clientHeight
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

let hasMore: boolean = true;

const doSearchThrottle = throttle(
  (loadingFlag?: boolean, scrollFlag?: boolean) => {
    onSearch(loadingFlag, scrollFlag);
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

defineExpose({ onSearch, updateLastContent, reset });

const props = defineProps<IImSessionProps>();

function updateLastContent(
  sessionId?: string,
  lastContent?: string,
  lastContentCreateTs?: string,
  unReadCountAddNumber?: number,
  unReadCountAddNumberUpdateFlag?: boolean,
  topFlag?: boolean
) {
  const findIndex = dataList.value.findIndex(
    item => item.sessionId === sessionId
  );

  if (findIndex === -1) {
    onSearch(false, false);

    return;
  }

  const item = dataList.value[findIndex];

  if (lastContent) {
    item.lastContent = lastContent;
  }

  if (lastContentCreateTs) {
    item.lastContentCreateTs = lastContentCreateTs;
  }

  if (unReadCountAddNumber !== undefined) {
    if (unReadCountAddNumberUpdateFlag) {
      item.unReadCount = unReadCountAddNumber;
    } else {
      item.unReadCount = item.unReadCount + unReadCountAddNumber;
    }
  }

  if (topFlag) {
    dataList.value.splice(findIndex, 1);
    dataList.value.unshift(item);
  }
}
</script>

<template>
  <div
    ref="scrollbarParentDiv"
    v-loading="loading"
    class="flex flex-col h-full"
  >
    <DynamicScroller
      v-show="dataList.length"
      ref="sessionRecycleScrollerRef"
      :items="dataList"
      :min-item-size="80"
      key-field="sessionId"
      :style="`height: ${scrollbarHeight}px`"
      :class="`${scrollbarClass}`"
      @scroll="handleScroll"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :index="index">
          <div
            :class="`h-[80px] flex items-center p-2 border-b border-l-4 ${props.session.sessionId === item.sessionId ? 'bg-secondary border-b-secondary  border-l-primary hover:bg-secondary/70 hover:border-b-secondary/70' : 'hover:bg-gray-50 hover:border-l-gray-50 border-l-white border-b-gray-100'} cursor-pointer transition-colors`"
            @click="sessionClick(item)"
          >
            <div>
              <el-badge
                :value="
                  props.session.sessionId === item.sessionId
                    ? 0
                    : item.unReadCount || 0
                "
                :max="999"
                :show-zero="false"
                badge-class="mt-1 mr-1"
                :is-dot="item.notDisturbFlag"
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
              </el-badge>
            </div>
            <div class="ml-2 flex-1 truncate">
              <div class="flex justify-between items-center">
                <div class="text-sm truncate pr-1" :title="item.sessionName">
                  {{ item.sessionName }}
                </div>
                <div class="text-xs text-gray-400 shrink-0">
                  {{ FormatTsForCurrentDay(item.lastContentCreateTs, true) }}
                </div>
              </div>

              <div
                class="text-xs text-gray-400 truncate mt-1"
                :title="item.lastContent"
              >
                {{ item.lastContent }}
              </div>
            </div>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>

    <div
      v-if="!dataList.length && !loading"
      class="text-[15px] flex w-full h-full justify-center items-center text-gray-400"
    >
      暂无会话。
    </div>
  </div>
</template>
