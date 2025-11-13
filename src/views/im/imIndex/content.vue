<script setup lang="ts">
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  BaseImSessionContentInsertTxtVO,
  IImContentProps,
  ISessionContentBO
} from "@/views/im/imIndex/types";
import {
  BaseImSessionContentRefUserPageVO,
  baseImSessionContentRefUserScroll,
  ScrollListDTO
} from "@/api/http/base/BaseImSessionContentRefUserController";
import { FormatTsForCurrentDay, GetServerTimestamp } from "@/utils/DateUtil";
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
import EpWarning from "~icons/ep/Warning";
import { throttle, useResizeObserver } from "@pureadmin/utils";
import {
  baseImSessionContentInsertTxt,
  BaseImSessionContentInsertTxtDTO,
  baseImSessionContentUpdateTargetInputFlag
} from "@/api/http/base/BaseImSessionContentController";
import { BaseImSessionContentTypeEnum } from "@/model/enum/im/BaseImSessionContentTypeEnum";
import type { IEnum } from "@/model/enum/base/CommonEnum";
import { BaseImTypeEnum } from "@/model/enum/im/BaseImTypeEnum";
import { useWebSocketStoreHook } from "@/store/modules/webSocket";
import {
  BASE_IM_SESSION_CONTENT_SEND,
  BASE_IM_SESSION_CONTENT_UPDATE_TARGET_INPUT_FLAG
} from "@/model/constant/websocket/WebSocketReceivePath";
import { storageLocal } from "@/store/utils";
import CommonConstant from "@/model/constant/CommonConstant";

const props = defineProps<IImContentProps>();

const sessionContentLoading = ref<boolean>(false);

const sessionContentShowList = ref<ISessionContentBO[]>([]);

let sessionContentCalcList: ISessionContentBO[] = [];

function getObjId(item?: BaseImSessionContentRefUserPageVO) {
  return `${item.createId}-${item.createTs}-${item.orderNo}`;
}

const objIdSet: Set<string> = new Set();

// key：objId
const todoSendMap = ref<Map<string, ISessionContentBO>>(new Map());

function setSessionContentList(sessionContentListTemp?: ISessionContentBO[]) {
  if (!sessionContentListTemp || !sessionContentListTemp.length) {
    return;
  }

  let addFlag = false;

  sessionContentListTemp.forEach(item => {
    let objId = item.objId;

    if (!objId) {
      objId = getObjId(item);
      item.objId = objId;
    }

    if (item.contentId) {
      setTodoSendMap(item, true); // 如果已经在后台处理过了，则在 map里面移除
    }

    if (objIdSet.has(objId)) {
      return;
    }

    objIdSet.add(objId);
    sessionContentCalcList.push(item);

    addFlag = true;
  });

  if (!addFlag) {
    return;
  }

  // 排序
  sessionContentCalcList.sort((a, b) => {
    const createTsOne = Number(a.createTs);

    const createTsTwo = Number(b.createTs);

    if (createTsOne === createTsTwo) {
      if (a.orderNo === b.orderNo) {
        if (a.contentId && b.contentId) {
          return Number(a.contentId) > Number(b.contentId) ? 1 : -1;
        } else {
          return Number(a.createId) > Number(b.createId) ? 1 : -1;
        }
      } else {
        return a.orderNo > b.orderNo ? 1 : -1;
      }
    } else {
      return createTsOne > createTsTwo ? 1 : -1;
    }
  });

  sessionContentShowList.value = [...sessionContentCalcList];
}

const IM_SESSION_CONTENT_TODO_SEND_MAP_KEY = "ImSessionContentTodoSendMap:";

function showTodoSendMap() {
  const todoSendMapTemp = storageLocal().getItem<
    Map<string, ISessionContentBO>
  >(IM_SESSION_CONTENT_TODO_SEND_MAP_KEY + props.session.sessionId);

  if (!todoSendMapTemp || !todoSendMapTemp.size) {
    return;
  }

  setSessionContentList([...todoSendMapTemp.values()]);
}

function setTodoSendMap(item: ISessionContentBO, removeFlag: boolean) {
  const objId = item.objId;

  if (removeFlag) {
    if (!todoSendMap.value.has(objId)) {
      return;
    }

    todoSendMap.value.delete(objId);
  } else {
    if (todoSendMap.value.has(objId)) {
      return;
    }

    todoSendMap.value.set(objId, item);
  }

  storageLocal().setItem<Map<string, ISessionContentBO>>(
    IM_SESSION_CONTENT_TODO_SEND_MAP_KEY + props.session.sessionId,
    todoSendMap.value
  );
}

const sessionContentRecycleScrollerRef = ref();

function textareaInputRefFocus() {
  textareaInputRef.value?.focus();
}

const doSearchThrottle = throttle(
  (
    form?: ScrollListDTO,
    loadingFlag?: boolean,
    scrollToItemFlag?: boolean,
    scrollFlag?: boolean
  ) => {
    doSearch(form, loadingFlag, scrollToItemFlag, scrollFlag);
  },
  1000
) as (
  form?: ScrollListDTO,
  loadingFlag?: boolean,
  scrollToItemFlag?: boolean,
  scrollFlag?: boolean
) => void;

function doSearch(
  form?: ScrollListDTO,
  loadingFlag?: boolean,
  scrollToItemFlag?: boolean,
  scrollFlag?: boolean
) {
  if (loadingFlag) {
    sessionContentLoading.value = true;
  }

  baseImSessionContentRefUserScroll({
    refId: form?.refId || props.session.sessionId,
    backwardFlag: form?.backwardFlag || false,
    containsCurrentIdFlag: form?.containsCurrentIdFlag || false,
    id: form?.id
  })
    .then(res => {
      setSessionContentList(res.data);

      hasMore.value = res.data.length === 20;

      nextTick(() => {
        if (scrollFlag) {
          scrollDoSearchSuf();
        } else if (form?.id && scrollToItemFlag) {
          scrollToItemByContentId(form.id);
        } else {
          if (shouldAutoScroll.value) {
            scrollToBottom();
          }
        }
      });
    })
    .finally(() => {
      sessionContentLoading.value = false;
    });
}

function scrollDoSearchSuf(contentId?: string) {
  console.log("滚动条下移", contentId);
  if (!contentId || !sessionContentRecycleScrollerRef.value) {
    return;
  }

  const findIndex = sessionContentCalcList.findIndex(
    item => item.contentId === contentId
  );

  if (findIndex !== -1 && findIndex >= 1) {
    sessionContentRecycleScrollerRef.value.scrollToItem(findIndex - 1);
    console.log("滚动条下移成功", contentId);
  }
}

function scrollToItemByContentId(contentId?: string) {
  console.log("滚动到元素", contentId);
  if (!contentId || !sessionContentRecycleScrollerRef.value) {
    return;
  }

  const findIndex = sessionContentCalcList.findIndex(
    item => item.contentId === contentId
  );

  if (findIndex !== -1) {
    sessionContentRecycleScrollerRef.value.scrollToItem(findIndex);
    console.log("滚动到元素成功", contentId);
  }
}

function scrollToBottom() {
  console.log("滚动到底部", sessionContentShowList.value.length - 1);
  if (!sessionContentRecycleScrollerRef.value) {
    return;
  }

  sessionContentRecycleScrollerRef.value.scrollToItem(
    sessionContentShowList.value.length - 1
  );
  console.log("滚动到底部成功", sessionContentShowList.value.length - 1);
}

function setShouldAutoScroll(shouldAutoScrollTemp?: boolean) {
  shouldAutoScroll.value = shouldAutoScrollTemp;
}

defineExpose({ doSearch, textareaInputRefFocus, setShouldAutoScroll });

const selfUserId = ref(useUserStoreHook().id || "");

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

const textarea = ref<string>("");

const textareaInputRef = ref();

const targetInputFlag = ref<boolean>(false);

function textareaInput(value: string) {
  textarea.value = value;

  if (props.session.targetType === BaseImTypeEnum.FRIEND.code) {
    updateTargetInputFlagThrottle();
  }
}

const updateTargetInputFlagThrottle = throttle(() => {
  updateTargetInputFlag();
}, 1000);

function updateTargetInputFlag() {
  if (props.session.targetType !== BaseImTypeEnum.FRIEND.code) {
    return;
  }

  baseImSessionContentUpdateTargetInputFlag(
    {
      sessionId: props.session.sessionId
    },
    {
      headers: {
        hiddenErrorMsg: true
      } as any
    }
  );
}

let timer: number | null = null;

onMounted(() => {
  showTodoSendMap();

  doSendTodoSendMap();

  timer = window.setInterval(() => {
    doSendTodoSendMap();
  }, 3000);
});

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer);
  }
});

function showSendFailFlag(item: ISessionContentBO) {
  const value = todoSendMap.value.get(item.objId);

  if (!value) {
    return false;
  }

  const checkTimestamp =
    GetServerTimestamp() - CommonConstant.SECOND_10_EXPIRE_TIME;

  if (Number(item.createTs) > checkTimestamp) {
    return false;
  }

  return true;
}

function doSendTodoSendMap() {
  const todoSendMapTemp = storageLocal().getItem<
    Map<string, ISessionContentBO>
  >(IM_SESSION_CONTENT_TODO_SEND_MAP_KEY + props.session.sessionId);

  if (!todoSendMapTemp || !todoSendMapTemp.size) {
    return;
  }

  const checkTimestamp =
    GetServerTimestamp() - CommonConstant.SECOND_10_EXPIRE_TIME;

  todoSendMapTemp.values().forEach(item => {
    if (Number(item.createTs) > checkTimestamp) {
      return;
    }

    const form: BaseImSessionContentInsertTxtDTO = {
      sessionId: item.sessionId,
      txt: item.content,
      createTs: item.createTs,
      orderNo: item.orderNo,
      type: item.type
    };

    doSendToServer(form);
  });
}

function sendClick() {
  const txt = textarea.value;

  if (!txt) {
    return;
  }

  doSendClick(txt, undefined, undefined, true);
}

function doSendClick(
  txt: string,
  refId?: string,
  type?: IEnum<number>,
  clearTxtFlag?: boolean
) {
  if (!props.session.sessionId) {
    return;
  }

  if (clearTxtFlag) {
    textarea.value = "";
  }

  if (!refId) {
    refId = "-1";
  }

  if (!type) {
    type = BaseImSessionContentTypeEnum.TEXT;
  }

  const sessionId = props.session.sessionId;

  const createTs = String(GetServerTimestamp());

  const orderNo = 0;

  const objId = getObjId({ createId: selfUserId.value, createTs, orderNo });

  const item: ISessionContentBO = {
    createId: selfUserId.value,
    createTs,
    orderNo,
    refId,
    sessionId,
    content: txt,
    type: type.code,
    objId
  };

  setTodoSendMap(item, false);

  setSessionContentList([item]);

  const form: BaseImSessionContentInsertTxtDTO = {
    sessionId,
    txt,
    createTs,
    orderNo,
    type: type.code
  };

  setShouldAutoScroll(true);

  doSendToServer(form);
}

function resendToServerClick(item: ISessionContentBO) {
  const form: BaseImSessionContentInsertTxtDTO = {
    sessionId: props.session.sessionId,
    txt: item.content,
    createTs: item.createTs,
    orderNo: item.orderNo,
    type: item.type
  };

  setShouldAutoScroll(true);

  doSendToServer(form);
}

function doSendToServer(form: BaseImSessionContentInsertTxtDTO) {
  baseImSessionContentInsertTxt(form, {
    headers: {
      hiddenErrorMsg: true
    } as any
  }).then(() => {
    const objId = getObjId({
      createId: selfUserId.value,
      createTs: form.createTs,
      orderNo: form.orderNo
    });

    setTodoSendMap({ objId: objId }, true);

    doSearchThrottle(
      {
        id: sessionContentShowList.value[
          sessionContentShowList.value.length - 1
        ]?.contentId,
        backwardFlag: true
      },
      false,
      false
    );
  });
}

let setTargetInputFlagFalseTimeout: number | null = null;

useWebSocketStoreHook().$subscribe((mutation, state) => {
  if (
    state.webSocketMessage.uri ===
    BASE_IM_SESSION_CONTENT_UPDATE_TARGET_INPUT_FLAG
  ) {
    const sessionId = state.webSocketMessage.data as string;

    if (props.session.sessionId === sessionId) {
      targetInputFlag.value = true;

      if (setTargetInputFlagFalseTimeout) {
        clearTimeout(setTargetInputFlagFalseTimeout);
      }
      setTargetInputFlagFalseTimeout = window.setTimeout(() => {
        targetInputFlag.value = false;
      }, 3000);
    }
  } else if (state.webSocketMessage.uri === BASE_IM_SESSION_CONTENT_SEND) {
    const baseImSessionContentInsertTxtVO = state.webSocketMessage
      .data as BaseImSessionContentInsertTxtVO;

    if (baseImSessionContentInsertTxtVO.sessionId === props.session.sessionId) {
      const objId = getObjId({
        createId: baseImSessionContentInsertTxtVO.createId,
        createTs: baseImSessionContentInsertTxtVO.createTs,
        orderNo: baseImSessionContentInsertTxtVO.orderNo
      });

      const item: ISessionContentBO = {
        createId: selfUserId.value,
        createTs: baseImSessionContentInsertTxtVO.createTs,
        orderNo: baseImSessionContentInsertTxtVO.orderNo,
        refId: baseImSessionContentInsertTxtVO.refId,
        sessionId: baseImSessionContentInsertTxtVO.sessionId,
        content: baseImSessionContentInsertTxtVO.txt,
        type: baseImSessionContentInsertTxtVO.type,
        objId
      };

      setSessionContentList([item]);

      doSearchThrottle(
        {
          id: sessionContentShowList.value[
            sessionContentShowList.value.length - 1
          ]?.contentId,
          backwardFlag: true
        },
        false,
        false
      );
    }
  }
});

const hasMore = ref<boolean>(true);

const shouldAutoScroll = ref<boolean>(true);

function handleScroll(event: Event) {
  const scrollerEl = event.target as HTMLElement;

  if (!scrollerEl) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollerEl;

  const distanceToBottom = scrollHeight - clientHeight - scrollTop;
  console.log("distanceToBottom", distanceToBottom);
  shouldAutoScroll.value = distanceToBottom <= 20;

  if (
    scrollTop <= CommonConstant.SCROLL_CHECK_HEIGHT &&
    !sessionContentLoading.value &&
    hasMore.value
  ) {
    doSearchThrottle(
      { id: sessionContentShowList.value[0]?.contentId, backwardFlag: false },
      true,
      false
    );
  }
}

function reset() {
  sessionContentCalcList = [];
  sessionContentShowList.value = [];
}

watch(
  () => props.session.sessionId,
  () => {
    reset();
  }
);
</script>

<template>
  <div class="bg-gray-50 w-full h-full">
    <div v-show="props.session.showName" class="flex flex-col w-full h-full">
      <div
        class="flex items-center justify-between bg-white w-full pl-4 h-13 border-b border-gray-200"
      >
        <div class="flex items-center">
          <div>
            <div class="text-sm">
              {{ props.session.showName }}
            </div>
            <div v-show="targetInputFlag" class="text-xs text-gray-400 h-4">
              正在输入...
            </div>
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
            v-if="false"
          />
          <component
            :is="
              useRenderIcon(FaVideoCamera, {
                class:
                  'text-gray-400 hover:text-gray-800 transition-colors w-[16px] h-[16px] cursor-pointer'
              })
            "
            v-if="false"
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
        <div
          v-loading="sessionContentLoading"
          class="overflow-auto"
          :style="`height: calc( ${scrollbarHeight}px - var(--spacing) * 12)`"
          @scroll="handleScroll"
        >
          <RecycleScroller
            v-show="sessionContentShowList.length"
            ref="sessionContentRecycleScrollerRef"
            :items="sessionContentShowList"
            :min-item-size="90"
            key-field="objId"
          >
            <template #default="{ item }">
              <div class="w-full pl-4 py-4">
                <div
                  v-if="item.createId === selfUserId"
                  class="w-full flex items-end justify-end pr-9 space-x-2 animate-fadeIn"
                >
                  <div class="text-xs text-gray-400 self-end">
                    {{ FormatTsForCurrentDay(item.createTs) }}
                  </div>
                  <div
                    class="bg-primary min-h-11 text-white p-3 message-bubble-right shadow-sm"
                  >
                    <div class="text-sm">{{ item.content }}</div>
                  </div>
                </div>

                <div
                  v-else
                  class="w-full min-h-11 flex items-end space-x-2 animate-fadeIn"
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
                  <div
                    v-if="showSendFailFlag(item)"
                    @click="resendToServerClick(item)"
                  >
                    <component
                      :is="
                        useRenderIcon(EpWarning, {
                          class: 'text-red-500 w-[20px] h-[20px] mr-[2px]'
                        })
                      "
                    />
                  </div>
                  <div
                    class="bg-white min-h-11 p-3 message-bubble-left shadow-sm"
                  >
                    <div class="text-sm">{{ item.content }}</div>
                  </div>
                  <div class="text-xs text-gray-400 self-end">
                    {{ FormatTsForCurrentDay(item.createTs) }}
                  </div>
                </div>
              </div>
            </template>
          </RecycleScroller>

          <div
            v-if="!sessionContentShowList.length && !sessionContentLoading"
            class="text-[15px] flex w-full h-full justify-center items-center text-gray-400"
          >
            暂无消息。
          </div>
        </div>
      </div>

      <div class="bg-white p-4 border-t border-gray-200 flex flex-col">
        <div class="flex items-center mb-4">
          <div v-if="false" class="p-2">
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
          <div v-if="false" class="p-2">
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
            @input="textareaInput"
          />
          <div
            class="ml-3 mr-5 bg-primary rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary/90 transition-colors transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            @click="sendClick()"
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
