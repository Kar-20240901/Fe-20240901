<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import {
  baseImSessionRefUserAddNotDisturb,
  baseImSessionRefUserDeleteNotDisturb,
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
import { ExecConfirm, ToastSuccess } from "@/utils/ToastUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import MuteNotification from "~icons/ep/MuteNotification";
import {
  baseImSessionContentRefUserDeleteSessionContentRefUser,
  baseImSessionContentRefUserDeleteSessionContentRefUserAndHiddenSession
} from "@/api/http/base/BaseImSessionContentRefUserController";

function hiddenSession() {
  if (!dropdownItemRef.value.sessionId) {
    return;
  }

  baseImSessionRefUserHidden({ idSet: [dropdownItemRef.value.sessionId] }).then(
    res => {
      refreshSearchContent([dropdownItemRef.value.sessionId], true);
      ToastSuccess(res.msg);
      onSearch(true, false, false);
    }
  );
}

function addNotDisturb() {
  if (!dropdownItemRef.value.sessionId) {
    return;
  }

  baseImSessionRefUserAddNotDisturb({
    sessionIdSet: [dropdownItemRef.value.sessionId]
  }).then(res => {
    ToastSuccess(res.msg);
    onSearch(true, false, false);
  });
}

function deleteNotDisturb() {
  if (!dropdownItemRef.value.sessionId) {
    return;
  }

  baseImSessionRefUserDeleteNotDisturb({
    sessionIdSet: [dropdownItemRef.value.sessionId]
  }).then(res => {
    ToastSuccess(res.msg);
    onSearch(true, false, false);
  });
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
  (e: "updateSessionGroupMap", item: IImShowInfoMap): void;

  (e: "doUpdateAvatarAndNickname", sessionIdArr: string[]): void;

  (
    e: "refreshSearchContent",
    sessionIdArr: string[],
    removeSessionFlag?: boolean
  ): void;
}>();

function refreshSearchContent(
  sessionIdArr?: string[],
  removeSessionFlag?: boolean
) {
  emit("refreshSearchContent", sessionIdArr, removeSessionFlag);
}

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

const dataListRemoveSessionIdSet: Set<string> = new Set();

// key：sessionId，value：index
const dataListIndexMap: Map<string, number> = new Map();

function handleDataList(
  tempDataList?: BaseImSessionRefUserPageVO[],
  refreshFlag?: boolean
) {
  if (!tempDataList || !tempDataList.length) {
    return;
  }

  let addFlag = false;

  if (refreshFlag && dataListIndexMap.size) {
    dataListRemoveSessionIdSet.clear();

    const existSessionIdSet: Set<string> = new Set();

    tempDataList.forEach(item => {
      existSessionIdSet.add(item.sessionId);
    });

    dataListIndexMap.forEach((value, key) => {
      if (!existSessionIdSet.has(key)) {
        dataListRemoveSessionIdSet.add(key);
      }
    });
  }

  tempDataList.forEach(item => {
    const sessionId = item.sessionId;

    if (!sessionId) {
      return;
    }

    if (dataListIndexMap.has(sessionId)) {
      updateDataListItem(sessionId, item);

      return;
    }

    dataListIndexMap.set(sessionId, dataList.value.length);

    dataList.value.push(item);

    addFlag = true;
  });

  deleteDataList();

  if (!addFlag) {
    return;
  }

  doSortDataListThrottle();
}

function updateDataListItem(
  sessionId: string,
  item: BaseImSessionRefUserPageVO
) {
  const index = dataListIndexMap.get(sessionId);

  if (index === undefined) {
    return;
  }

  const element = dataList.value[index];

  if (!element) {
    return;
  }

  if (element.sessionId !== sessionId) {
    return;
  }

  element.notDisturbFlag = item.notDisturbFlag;
  element.avatarUrl = item.avatarUrl;
  element.sessionName = item.sessionName;
}

// 移除会话
function deleteDataList() {
  if (!dataListRemoveSessionIdSet.size) {
    return;
  }

  dataList.value = dataList.value.filter(item => {
    const removeFlag = dataListRemoveSessionIdSet.has(item.sessionId);

    if (removeFlag) {
      dataListIndexMap.delete(item.sessionId);
    }

    return !removeFlag;
  });

  dataListRemoveSessionIdSet.clear();

  handleDataListIndexMap();
}

function handleDataListIndexMap() {
  dataListIndexMap.clear();

  dataList.value.forEach((item, index) => {
    dataListIndexMap.set(item.sessionId, index);
  });
}

// 排序
function sortDataList() {
  dataList.value.sort((a, b) => {
    const lastReceiveTsOne = Number(a.lastReceiveTs);

    const lastReceiveTsTwo = Number(b.lastReceiveTs);

    if (lastReceiveTsOne === lastReceiveTsTwo) {
      return a.sessionId < b.sessionId ? 1 : -1;
    } else {
      return lastReceiveTsOne < lastReceiveTsTwo ? 1 : -1;
    }
  });

  handleDataListIndexMap();
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
    refIdSet = [...dataListIndexMap.keys()];
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
          emit("updateSessionGroupMap", sessionUserMapItem);
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
  const findIndex = dataListIndexMap.get(sessionId);

  if (findIndex === undefined) {
    doSearchNewThrottle();

    return;
  }

  doSortDataListThrottle();
}

function updateLastContent(updateLastContentObjTemp: IUpdateLastContentObj) {
  if (!updateLastContentObjTemp) {
    return;
  }

  const findIndex = dataListIndexMap.get(updateLastContentObjTemp.sessionId);

  if (findIndex === undefined) {
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

function deleteSessionContentRefUserClick() {
  if (!dropdownItemRef.value.sessionId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImSessionContentRefUserDeleteSessionContentRefUser({
        idSet: [dropdownItemRef.value.sessionId]
      }).then(res => {
        refreshSearchContent([dropdownItemRef.value.sessionId]);
        ToastSuccess(res.msg);
        onSearch(true, false, false);
      });
    },
    undefined,
    `确定清空【${dropdownItemRef.value.sessionName}】的聊天记录吗？`
  );
}

function deleteSessionContentRefUserAndHiddenSessionClick() {
  if (!dropdownItemRef.value.sessionId) {
    return;
  }

  ExecConfirm(
    async () => {
      await baseImSessionContentRefUserDeleteSessionContentRefUserAndHiddenSession(
        {
          idSet: [dropdownItemRef.value.sessionId]
        }
      ).then(res => {
        refreshSearchContent([dropdownItemRef.value.sessionId], true);
        ToastSuccess(res.msg);
        onSearch(true, false, false);
      });
    },
    undefined,
    `确定清空【${dropdownItemRef.value.sessionName}】的聊天记录并隐藏会话吗？`
  );
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
                  :src="
                    item.targetType === BaseImTypeEnum.FRIEND.code
                      ? props.sessionUserMap[item.targetId]?.avatarUrl
                      : props.sessionGroupMap[item.targetId]?.avatarUrl
                  "
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
                  {{ FormatTsForCurrentDay(item.lastReceiveTs, true, true) }}
                </div>
              </div>

              <div class="flex justify-between items-center mt-1">
                <div
                  class="text-xs text-gray-400 truncate flex-1"
                  :title="item.lastContent"
                >
                  {{ item.lastContent }}
                </div>
                <div v-if="item.notDisturbFlag" class="shrink-0">
                  <component
                    :is="
                      useRenderIcon(MuteNotification, {
                        class: 'text-gray-400 w-3 h-3'
                      })
                    "
                  />
                </div>
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
          <el-dropdown-item
            v-if="dropdownItemRef.notDisturbFlag"
            @click="deleteNotDisturb"
          >
            取消免打扰
          </el-dropdown-item>
          <el-dropdown-item v-else @click="addNotDisturb"
            >免打扰
          </el-dropdown-item>
          <el-dropdown-item @click="hiddenSession">隐藏会话</el-dropdown-item>
          <el-dropdown-item @click="deleteSessionContentRefUserClick"
            >清空聊天记录
          </el-dropdown-item>
          <el-dropdown-item
            @click="deleteSessionContentRefUserAndHiddenSessionClick"
          >
            清空聊天记录并隐藏会话
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
