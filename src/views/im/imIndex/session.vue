<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { onMounted, onUnmounted, ref } from "vue";
import {
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserScroll
} from "@/api/http/base/BaseImSessionRefUserController";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { IImShowInfoMap } from "@/views/im/imIndex/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import FaSearch from "~icons/fa/search";
import Avatar from "@/assets/user.png";

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

const activeSessionId = ref<string>("");

function sessionClick(item: BaseImSessionRefUserPageVO) {
  emit("sessionClick", item);

  activeSessionId.value = item.sessionId;
}

function onSearch(loadingFlag?: boolean) {
  if (loadingFlag) {
    loading.value = true;
  }

  baseImSessionRefUserScroll({
    id: dataList.value.length
      ? dataList.value[dataList.value.length - 1].sessionId
      : undefined,
    pageSize: "20"
  })
    .then(res => {
      dataList.value = res.data;

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
  onSearch(false);

  // timer = window.setInterval(() => {
  //   onSearch(true);
  // }, 2000);
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});

defineExpose({ onSearch });
</script>

<template>
  <div class="flex flex-col">
    <div
      class="w-full flex p-4 border-b border-gray-200 cursor-default"
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

    <div class="flex-1">
      <el-scrollbar v-loading="loading" view-class="flex flex-col h-full">
        <DynamicScroller
          v-show="dataList.length"
          :items="dataList"
          :min-item-size="80"
          key-field="sessionId"
        >
          <template #default="{ item, index, active }">
            <DynamicScrollerItem :item="item" :active="active" :index="index">
              <div
                :class="`h-[80px] flex items-center p-4 border-b border-l-4 ${activeSessionId === item.sessionId ? 'bg-secondary border-b-secondary  border-l-primary hover:bg-secondary/70 hover:border-b-secondary/70' : 'hover:bg-gray-50 hover:border-l-gray-50 border-l-white border-b-gray-100'} cursor-pointer transition-colors`"
                @click="sessionClick(item)"
              >
                <div>
                  <el-badge
                    :value="item.unReadCount"
                    :max="999"
                    :show-zero="false"
                    badge-class="mt-1 mr-1"
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
                        FormatDateTimeForCurrentDay(
                          new Date(item.lastContentCreateTime)
                        )
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
          class="text-[15px] flex w-full justify-center text-gray-400"
        >
          暂无会话。
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
