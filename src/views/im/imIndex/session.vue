<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  baseImSessionRefUserHidden,
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserScroll
} from "@/api/http/base/BaseImSessionRefUserController";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import {
  IImSessionProps,
  IImShowInfoMap,
  IUpdateLastContentObj
} from "@/views/im/imIndex/types";
import { FormatTsForCurrentDay } from "@/utils/DateUtil";
import Avatar from "@/assets/user.png";
import { DevFlag } from "@/utils/SysUtil";
import { debounce, throttle, useResizeObserver } from "@pureadmin/utils";
import { throttleByKey } from "@/utils/CommonUtil";
import type { DropdownInstance } from "element-plus";
import { ToastSuccess } from "@/utils/ToastUtil";

function hiddenSession() {
  if (!dropdownItemRef.value.sessionId) {
    return;
  }

  baseImSessionRefUserHidden({ idSet: [dropdownItemRef.value.sessionId] }).then(
    res => {
      ToastSuccess(res.msg);
      onSearch(true, false, false);
    }
  );
}

const dropdownRef = ref<DropdownInstance>();

const position = ref<DOMRect>({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
} as DOMRect);

const triggerRef = ref({
  getBoundingClientRect: () => position.value
});

const handleClick = () => {
  dropdownRef.value?.handleClose();
};

const dropdownItemRef = ref<BaseImSessionRefUserPageVO>({});

const handleContextmenu = (
  event: MouseEvent,
  item: BaseImSessionRefUserPageVO
) => {
  dropdownItemRef.value = item;

  const { clientX, clientY } = event;
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY
  });
  event.preventDefault();
  dropdownRef.value?.handleOpen();
};

const loading = ref<boolean>(false);
const dataList = ref<BaseImSessionRefUserPageVO[]>([]);

const emit = defineEmits<{
  (e: "sessionClick", item: BaseImSessionRefUserPageVO): void;

  (e: "updateSessionUserMap", item: IImShowInfoMap): void;

  (e: "doUpdateAvatarAndNickname", sessionIdArr: string[]): void;
}>();

function sessionClick(item: BaseImSessionRefUserPageVO) {
  handleClick();

  emit("sessionClick", item);

  updateLastContent({
    sessionId: item.sessionId,
    lastContent: undefined,
    lastReceiveTs: undefined,
    unReadCountAddNumber: 0,
    unReadCountAddNumberUpdateFlag: true,
    unReadCountAddNumberUpdateMustFlag: true
  });
}

const pageSize = 20;

const dataListSessionIdSet: Set<string> = new Set();

const dataListRemoveSessionIdSet: Set<string> = new Set();

function handleDataList(
  tempDataList?: BaseImSessionRefUserPageVO[],
  refreshFlag?: boolean
) {
  if (!tempDataList || !tempDataList.length) {
    return;
  }

  let addFlag = false;

  if (refreshFlag && dataListSessionIdSet.size) {
    dataListRemoveSessionIdSet.clear();

    const existSessionIdSet: Set<string> = new Set();

    tempDataList.forEach(item => {
      existSessionIdSet.add(item.sessionId);
    });

    dataListSessionIdSet.forEach(sessionId => {
      if (!existSessionIdSet.has(sessionId)) {
        dataListRemoveSessionIdSet.add(sessionId);
      }
    });
  }

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

  if (!addFlag && !dataListRemoveSessionIdSet.size) {
    return;
  }

  doSortDataListThrottle();
}

// 排序
function sortDataList() {
  if (dataListRemoveSessionIdSet.size) {
    dataList.value = dataList.value.filter(item => {
      const removeFlag = dataListRemoveSessionIdSet.has(item.sessionId);

      if (removeFlag) {
        dataListSessionIdSet.delete(item.sessionId);
      }

      return !removeFlag;
    });
  }

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

const sortDataListThrottle = throttleByKey(
  () => {
    sortDataList();
  },
  1000,
  true,
  true
);

const doSortDataListThrottle = () => {
  sortDataListThrottle("sort");
};

const doSearchNewThrottle = throttle(() => {
  onSearch(false, false, true);
}, 1000) as () => void;

function onSearch(
  loadingFlag?: boolean,
  scrollFlag?: boolean,
  queryNewFlag?: boolean
) {
  if (loadingFlag) {
    loading.value = true;
  }

  let sessionId = undefined;
  let lastReceiveTs = undefined;
  let refIdSet: string[] = undefined;

  if (scrollFlag) {
    if (dataList.value.length) {
      const lastItem = dataList.value[dataList.value.length - 1];

      sessionId = lastItem.sessionId;
      lastReceiveTs = lastItem.lastReceiveTs;
    }
  } else if (queryNewFlag) {
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
      if (scrollFlag || queryNewFlag) {
        handleDataList(res.data, false);
      } else {
        handleDataList(res.data, true);

        doSearchNewThrottle();
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
  onSearch(true, false, false);

  if (!DevFlag()) {
    timer = window.setInterval(() => {
      onSearch(false, false, false);
    }, 20000);
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
  (loadingFlag?: boolean, scrollFlag?: boolean, queryNewFlag?: boolean) => {
    onSearch(loadingFlag, scrollFlag, queryNewFlag);
  },
  500
) as (
  loadingFlag?: boolean,
  scrollFlag?: boolean,
  queryNewFlag?: boolean
) => void;

const doSearchDebounce = debounce(
  (loadingFlag?: boolean, scrollFlag?: boolean, queryNewFlag?: boolean) => {
    onSearch(loadingFlag, scrollFlag, queryNewFlag);
  },
  300,
  true
) as (
  loadingFlag?: boolean,
  scrollFlag?: boolean,
  queryNewFlag?: boolean
) => void;

function handleScroll(event: Event) {
  const scrollerEl = event.target as HTMLElement;

  if (!scrollerEl) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollerEl;

  const distanceToBottom = scrollHeight - clientHeight - scrollTop;

  if (distanceToBottom <= 20 && !loading.value && hasMore) {
    doSearchDebounce(false, true, false);
  }
}

defineExpose({ updateLastContent, doSearchThrottle });

const props = defineProps<IImSessionProps>();

function handleLastContentInfoFun(sessionId?: string) {
  const findIndex = dataList.value.findIndex(
    item => item.sessionId === sessionId
  );

  if (findIndex === -1) {
    doSearchNewThrottle();

    return;
  }

  doSortDataListThrottle();
}

function updateLastContent(updateLastContentObjTemp: IUpdateLastContentObj) {
  if (!updateLastContentObjTemp) {
    return;
  }

  const findIndex = dataList.value.findIndex(
    item => item.sessionId === updateLastContentObjTemp.sessionId
  );

  if (findIndex === -1) {
    doSearchNewThrottle();

    return;
  }

  const item: BaseImSessionRefUserPageVO = dataList.value[findIndex];

  if (updateLastContentObjTemp.lastContent) {
    item.lastContent = updateLastContentObjTemp.lastContent;
  }

  if (updateLastContentObjTemp.lastReceiveTs) {
    item.lastReceiveTs = updateLastContentObjTemp.lastReceiveTs;
  }

  if (updateLastContentObjTemp.unReadCountAddNumber !== undefined) {
    if (updateLastContentObjTemp.unReadCountAddNumberUpdateFlag) {
      if (
        updateLastContentObjTemp.unReadCountAddNumber > item.unReadCount ||
        updateLastContentObjTemp.unReadCountAddNumberUpdateMustFlag
      ) {
        item.unReadCount = updateLastContentObjTemp.unReadCountAddNumber;
      }
    } else {
      item.unReadCount =
        (item.unReadCount || 0) + updateLastContentObjTemp.unReadCountAddNumber;
    }
  }

  handleLastContentInfoFun(updateLastContentObjTemp.sessionId);
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
            @contextmenu="e => handleContextmenu(e, item)"
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
                  {{ FormatTsForCurrentDay(item.lastReceiveTs, true) }}
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

    <el-dropdown
      ref="dropdownRef"
      :virtual-ref="triggerRef"
      :show-arrow="false"
      virtual-triggering
      trigger="contextmenu"
      placement="bottom-start"
    >
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="hiddenSession">隐藏会话</el-dropdown-item>
          <el-dropdown-item>清空聊天记录</el-dropdown-item>
          <el-dropdown-item>清空聊天记录并隐藏会话</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
