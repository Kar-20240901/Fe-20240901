<script setup lang="ts">
import { FormatDateTimeForCurrentDay } from "@/utils/DateUtil";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { onMounted, ref } from "vue";
import {
  BaseImSessionRefUserPageVO,
  baseImSessionRefUserScroll
} from "@/api/http/base/BaseImSessionRefUserController";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { IImShowInfoMap } from "@/views/im/imIndex/types";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import RiFile2Line from "~icons/ri/file-2-line";

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

const pageSize = "20";

function onSearch() {
  loading.value = true;

  baseImSessionRefUserScroll({
    id: dataList.value.length
      ? dataList.value[dataList.value.length - 1].sessionId
      : undefined,
    pageSize
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

onMounted(() => {
  onSearch();
});
</script>

<template>
  <div class="flex flex-col">
    <div
      class="w-full rounded flex justify-center items-center"
      @click="searchClick"
    >
      <IconifyIconOffline width="22" :icon="'ri/search-line'" />
      <div class="ml-1">搜索</div>
    </div>
    <div class="flex-1">
      <el-scrollbar v-loading="loading" view-class="flex flex-col h-full">
        <RecycleScroller
          v-if="dataList.length"
          :items="dataList"
          :min-item-size="90"
          key-field="sessionId"
        >
          <template #default="{ item }">
            <div class="flex" @click="sessionClick(item)">
              <div>
                <el-badge :value="item.unReadCount" :max="99">
                  <el-image
                    :src="item.avatarUrl"
                    fit="cover"
                    class="w-[45px] h-[45px] mb-[5px]"
                  >
                    <template #error>
                      <component
                        :is="
                          useRenderIcon(RiFile2Line, {
                            width: '50px',
                            height: '50px'
                          })
                        "
                      />
                    </template>
                  </el-image>
                </el-badge>
              </div>
              <div class="flex flex-col">
                <div class="flex justify-around">
                  <div>{{ item.sessionName }}</div>
                  <div>
                    {{
                      FormatDateTimeForCurrentDay(
                        new Date(item.lastContentCreateTime)
                      )
                    }}
                  </div>
                </div>
                <div class="flex h-[90px]">
                  <div>{{ item.lastContent }}</div>
                </div>
              </div>
            </div>
          </template>
        </RecycleScroller>
        <div v-else class="text-[15px] flex w-full justify-center">
          暂无消息。
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
