<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { onMounted, onUnmounted, ref } from "vue";
import {
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserScroll
} from "@/api/http/base/BaseImSessionRefUserController";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { IImSessionProps, IImShowInfoMap } from "@/views/im/imIndex/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormatTsForCurrentDay } from "@/utils/DateUtil";
import FaSearch from "~icons/fa/search";
import Avatar from "@/assets/user.png";
import { DevFlag } from "@/utils/SysUtil";
import { throttle, useResizeObserver } from "@pureadmin/utils";

const loading = ref<boolean>(false);
const dataList = ref<BaseImSessionRefUserPageVO[]>([]);

const emit = defineEmits<{
  (e: "searchClick"): void;
  (e: "sessionClick", item: BaseImSessionRefUserPageVO): void;

  (e: "updateSessionUserMap", item: IImShowInfoMap): void;

  (e: "doUpdateAvatarAndNickname", sessionIdArr: string[]): void;
}>();

function searchClick() {
  emit("searchClick");
}

function sessionClick(item: BaseImSessionRefUserPageVO) {
  emit("sessionClick", item);
}

const pageSize = 20;

function reset() {
  dataList.value = [];

  hasMore = true;
}

function onSearch(loadingFlag?: boolean, scrollFlag?: boolean) {
  if (loadingFlag) {
    loading.value = true;
  }

  let sessionId = undefined;

  if (scrollFlag) {
    sessionId = dataList.value.length
      ? dataList.value[dataList.value.length - 1].sessionId
      : undefined;
  }

  baseImSessionRefUserScroll({
    id: sessionId,
    pageSize: String(pageSize)
  })
    .then(res => {
      dataList.value = res.data;

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
    onSearch(loadingFlag, scrollFlag);
  },
  300
) as (loadingFlag?: boolean, scrollFlag?: boolean) => void;

function loadMore() {
  if (!loading.value && hasMore) {
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
  unReadCountAddNumberUpdateFlag?: boolean
) {
  const findIndex = dataList.value.findIndex(
    item => item.sessionId === sessionId
  );

  if (findIndex === -1) {
    return;
  }

  dataList.value[findIndex].lastContent = lastContent;
  dataList.value[findIndex].lastContentCreateTs = lastContentCreateTs;

  if (unReadCountAddNumber) {
    if (unReadCountAddNumberUpdateFlag) {
      dataList.value[findIndex].unReadCount = unReadCountAddNumber;
    } else {
      dataList.value[findIndex].unReadCount =
        dataList.value[findIndex].unReadCount + unReadCountAddNumber;
    }
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      class="shrink-0 w-full flex p-4 border-b border-gray-200 cursor-default"
      @click="searchClick"
    >
      <div
        class="w-full py-2 justify-center items-center flex rounded-full bg-gray-100"
      >
        <component
          :is="
            useRenderIcon(FaSearch, {
              class: 'text-gray-400 w-[14px] h-[14px]'
            })
          "
        />
        <div class="ml-2 text-gray-400 text-sm">搜索</div>
      </div>
    </div>

    <div ref="scrollbarParentDiv" class="flex-1">
      <el-scrollbar
        v-loading="loading"
        :height="scrollbarHeight"
        :distance="20"
        @end-reached="loadMore"
      >
        <DynamicScroller
          v-show="dataList.length"
          :items="dataList"
          :min-item-size="80"
          key-field="sessionId"
        >
          <template #default="{ item, index, active }">
            <DynamicScrollerItem :item="item" :active="active" :index="index">
              <div
                :class="`h-[80px] flex items-center p-4 border-b border-l-4 ${props.session.sessionId === item.sessionId ? 'bg-secondary border-b-secondary  border-l-primary hover:bg-secondary/70 hover:border-b-secondary/70' : 'hover:bg-gray-50 hover:border-l-gray-50 border-l-white border-b-gray-100'} cursor-pointer transition-colors`"
                @click="sessionClick(item)"
              >
                <div>
                  <el-badge
                    :value="item.unReadCount"
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
                <div class="ml-4 flex-1">
                  <div class="flex justify-between items-center">
                    <div class="text-sm truncate pr-1">
                      {{ item.sessionName }}
                    </div>
                    <div class="text-xs text-gray-400 shrink-0">
                      {{
                        FormatTsForCurrentDay(item.lastContentCreateTs, true)
                      }}
                    </div>
                  </div>
                  <div class="text-xs text-gray-400 truncate mt-1">
                    {{ item.lastContent }}
                  </div>
                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>

        <div
          v-if="!dataList.length && !loading"
          class="flex text-[15px] flex w-full h-full justify-center items-center text-gray-400"
        >
          暂无会话。
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
