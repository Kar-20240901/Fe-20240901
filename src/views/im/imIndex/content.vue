<script setup lang="ts">
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, ref } from "vue";
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
import FaSmileO from "~icons/fa/smile-o";
import FaPaperclip from "~icons/fa/paperclip";
import FaPictureO from "~icons/fa/picture-o";
import FaMicrophone from "~icons/fa/microphone";
import FaPaperPlane from "~icons/fa/paper-plane";
import { useResizeObserver } from "@pureadmin/utils";

const props = defineProps<IImContentProps>();

const sessionContentLoading = ref<boolean>(false);

const sessionContentList = ref<BaseImSessionContentRefUserPageVO[]>([]);

const sessionContentRecycleScrollerRef = ref();

function doSearch(form?: ScrollListDTO) {
  textareaInputRef.value?.focus();

  sessionContentLoading.value = true;

  baseImSessionContentRefUserScroll({
    refId: form?.refId || props.session.sessionId,
    backwardFlag: form?.backwardFlag || false,
    containsCurrentIdFlag: form?.containsCurrentIdFlag || false,
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

const scrollbarParentDiv = ref();

const scrollbarHeight = ref<number>(0);

const syncHeight = () => {
  if (scrollbarParentDiv.value) {
    scrollbarHeight.value = scrollbarParentDiv.value.offsetHeight;
  }
};

useResizeObserver(scrollbarParentDiv, () => {
  syncHeight();
});

const textarea = ref<string>("");

const textareaInputRef = ref();
</script>

<template>
  <div class="bg-gray-50 w-full h-full">
    <div v-show="props.session.showName" class="flex flex-col w-full h-full">
      <div
        class="flex items-center justify-between bg-white w-full pl-4 py-4 border-b border-gray-200"
      >
        <div class="flex items-center">
          <div>
            <div class="text-sm">
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
                  'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
          <component
            :is="
              useRenderIcon(FaPhone, {
                class:
                  'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
          <component
            :is="
              useRenderIcon(FaVideoCamera, {
                class:
                  'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
          <component
            :is="
              useRenderIcon(FaEllipsisV, {
                class:
                  'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
          />
        </div>
      </div>

      <div ref="scrollbarParentDiv" class="flex-1">
        <el-scrollbar
          v-loading="sessionContentLoading"
          view-class="flex flex-col h-full"
          :height="'calc(' + scrollbarHeight + 'px - var(--spacing) * 12)'"
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
            v-if="!sessionContentList.length && !sessionContentLoading"
            class="text-[15px] flex w-full h-full justify-center items-center text-gray-400"
          >
            暂无消息。
          </div>
        </el-scrollbar>
      </div>

      <div class="bg-white p-4 border-t border-gray-200 flex flex-col">
        <div class="flex items-center mb-4">
          <div class="p-2">
            <component
              :is="
                useRenderIcon(FaSmileO, {
                  class:
                    'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
                })
              "
            />
          </div>
          <div class="p-2">
            <component
              :is="
                useRenderIcon(FaPaperclip, {
                  class:
                    'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
                })
              "
            />
          </div>
          <div class="p-2">
            <component
              :is="
                useRenderIcon(FaPictureO, {
                  class:
                    'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
                })
              "
            />
          </div>
          <div class="p-2">
            <component
              :is="
                useRenderIcon(FaMicrophone, {
                  class:
                    'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
                })
              "
            />
          </div>
        </div>
        <div class="flex items-center">
          <el-input
            ref="textareaInputRef"
            v-model="textarea"
            :rows="2"
            type="textarea"
            placeholder="输入消息..."
            show-word-limit
            :maxlength="1000"
            resize="none"
            input-style="padding-top: 0.75rem;padding-bottom: 0.75rem;padding-left: 1rem;padding-right: 1rem;border-radius: 9999px;"
          />
          <div
            class="ml-3 mr-5 bg-primary rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary/90 transition-colors transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <component
              :is="
                useRenderIcon(FaPaperPlane, {
                  class: 'text-white w-[20px] h-[20px] mr-[2px]'
                })
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!props.session.showName"
      class="text-[15px] flex w-full h-full justify-center items-center text-gray-400"
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
