<script setup lang="ts">
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { IImContentProps } from "@/views/im/imIndex/types";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll,
  ScrollListDTO
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { FormatTsForCurrentDay } from "@/utils/DateUtil";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useUserStoreHook } from "@/store/modules/user";
import Avatar from "@/assets/user.png";
import FaPhone from "~icons/fa/phone";
import FaVideoCamera from "~icons/fa/video-camera";
import FaEllipsisV from "~icons/fa/ellipsis-v";
import FaSearch from "~icons/fa/search";

const props = defineProps<IImContentProps>();

const sessionContentLoading = ref<boolean>(false);

const sessionContentList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const sessionContentRecycleScrollerRef = ref();

function doSearch(form?: ScrollListDTO) {
  sessionContentLoading.value = true;

  baseImSessionContentRefUserScroll({
    refId: form?.refId || props.session.sessionId,
    id: form?.id
  })
    .then(res => {
      sessionContentList.value = res.data;

      if (form?.id) {
        nextTick(() => {
          sessionContentRecycleScrollerRef.value.scrollToItem(form.id);
        });
      }
    })
    .finally(() => {
      sessionContentLoading.value = false;
    });
}

defineExpose({ doSearch });

const selfUserId = ref(useUserStoreHook().id || "");

const scrollbarParentDiv = ref<HTMLElement | null>(null);

const scrollbarHeight = ref<number>(0);

let resizeObserver: ResizeObserver | null = null;

const syncHeight = () => {
  if (scrollbarParentDiv.value) {
    scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;
  }
};

onMounted(() => {
  // 监听 ref 直到元素加载完成
  const stopWatch = watch(
    () => scrollbarParentDiv.value,
    newVal => {
      if (newVal) {
        syncHeight();
        stopWatch();
      }
    }
  );
});

onUnmounted(() => {
  if (resizeObserver && scrollbarParentDiv.value) {
    resizeObserver.unobserve(scrollbarParentDiv.value);
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <div class="bg-gray-50 w-full h-full">
    <div v-if="props.session.showName" class="flex flex-col w-full h-full">
      <div
        class="flex items-center justify-between bg-white w-full pl-4 py-5 border-b border-gray-200"
      >
        <div class="flex items-center">
          <div>
            <div class="text-sm font-semibold">
              {{ props.session.showName }}
            </div>
            <!--          <div class="text-xs text-gray-400">正在输入...</div>-->
          </div>
        </div>

        <div class="flex items-center space-x-4 mr-8">
          <component
            :is="
              useRenderIcon(FaSearch, {
                class:
                  'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
          <component
            :is="
              useRenderIcon(FaPhone, {
                class:
                  'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
          <component
            :is="
              useRenderIcon(FaVideoCamera, {
                class:
                  'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
          <component
            :is="
              useRenderIcon(FaEllipsisV, {
                class:
                  'text-gray-400 hover:text-primary transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
        </div>
      </div>

      <div ref="scrollbarParentDiv" class="flex-1">
        <el-scrollbar
          v-loading="sessionContentLoading"
          view-class="flex flex-col h-full"
          :height="'calc(' + scrollbarHeight + 'px - var(--spacing) * 13)'"
        >
          <RecycleScroller
            v-if="sessionContentList.length"
            ref="sessionContentRecycleScrollerRef"
            :items="sessionContentList"
            :min-item-size="90"
            key-field="contentId"
          >
            <template #default="{ item }">
              <div class="w-full pl-4 py-4">
                <div
                  v-if="item.createId === selfUserId"
                  class="w-full flex items-end justify-end pr-10 space-x-2 animate-fadeIn"
                >
                  <div class="text-xs text-gray-400 self-end">
                    {{ FormatTsForCurrentDay(item.createTs) }}
                  </div>
                  <div
                    class="bg-primary text-white p-3 message-bubble-right shadow-sm"
                  >
                    <p class="text-sm">{{ item.content }}</p>
                  </div>
                </div>

                <div
                  v-else
                  class="w-full flex items-end space-x-2 animate-fadeIn"
                >
                  <el-image
                    :src="props.sessionUserMap[item.createId]?.avatarUrl"
                    fit="cover"
                    class="w-8 h-8 rounded-full"
                  >
                    <template #error>
                      <el-image
                        :src="Avatar"
                        fit="cover"
                        class="w-8 h-8 rounded-full"
                      />
                    </template>
                  </el-image>
                  <div class="bg-white p-3 message-bubble-left shadow-sm">
                    <p class="text-sm">{{ item.content }}</p>
                  </div>
                  <div class="text-xs text-gray-400 self-end">
                    {{ FormatTsForCurrentDay(item.createTs) }}
                  </div>
                </div>
              </div>
            </template>
          </RecycleScroller>

          <div
            v-else
            class="text-[15px] flex w-full h-full justify-center items-center"
          >
            暂无消息。
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div
      v-else
      class="text-[15px] flex w-full h-full justify-center items-center"
    >
      请选择会话。
    </div>
  </div>
</template>

<style scoped lang="scss">
.message-bubble-left {
  border-radius: 18px 18px 18px 0;
}

.message-bubble-right {
  border-radius: 18px 18px 0;
}
</style>
