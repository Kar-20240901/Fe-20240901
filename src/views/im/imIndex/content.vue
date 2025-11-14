<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
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
import LocalStorageKey from "@/model/constant/LocalStorageKey";

const props = defineProps<IImContentProps>();

const sessionContentLoading = ref<boolean>(false);

const sessionContentShowList = ref<ISessionContentBO[]>([]);

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
    sessionContentShowList.value.push(item);

    addFlag = true;
  });

  if (!addFlag) {
    return;
  }

  // 排序
  sessionContentShowList.value.sort((a, b) => {
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
}

function showTodoSendMap() {
  const todoSendObj = storageLocal().getItem<Record<string, ISessionContentBO>>(
    LocalStorageKey.IM_SESSION_CONTENT_TODO_SEND_OBJ + props.session.sessionId
  );

  if (!todoSendObj || !Object.keys(todoSendObj).length) {
    return;
  }

  todoSendMap.value = new Map(Object.entries(todoSendObj));

  setSessionContentList([...todoSendMap.value.values()]);
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

  storageLocal().setItem<Record<string, ISessionContentBO>>(
    LocalStorageKey.IM_SESSION_CONTENT_TODO_SEND_OBJ + props.session.sessionId,
    Object.fromEntries(todoSendMap.value)
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
    scrollType?: "up" | "down"
  ) => {
    doSearch(form, loadingFlag, scrollToItemFlag, scrollType);
  },
  300
) as (
  form?: ScrollListDTO,
  loadingFlag?: boolean,
  scrollToItemFlag?: boolean,
  scrollType?: "up" | "down"
) => void;

function doSearch(
  form?: ScrollListDTO,
  loadingFlag?: boolean,
  scrollToItemFlag?: boolean,
  scrollType?: "up" | "down"
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

      if (scrollType === "up") {
        hasLess = res.data.length === 20;
      }

      nextTick(() => {
        if (scrollType) {
          scrollSearchSuf(form?.id, scrollType);
        } else if (form?.id && scrollToItemFlag) {
          scrollToItemByContentId(form.id);
        } else {
          if (shouldAutoScroll) {
            setTimeout(() => {
              scrollToBottom();

              nextTick(() => {
                setTimeout(() => {
                  scrollToBottom();
                }, CommonConstant.SHORT_DELAY);
              });
            }, CommonConstant.SHORT_DELAY);
          }
        }
      });
    })
    .finally(() => {
      sessionContentLoading.value = false;
    });
}

function scrollSearchSuf(contentId?: string, scrollType?: "up" | "down") {
  if (!contentId || !sessionContentRecycleScrollerRef.value) {
    return;
  }

  const findIndex = sessionContentShowList.value.findIndex(
    item => item.contentId === contentId
  );

  if (findIndex === -1) {
    return;
  }

  if (scrollType === "up") {
    let index = findIndex - 2;

    if (index < 0) {
      index = 0;
    }

    sessionContentRecycleScrollerRef.value.scrollToItem(index);
  } else if (scrollType === "down") {
    if (findIndex === sessionContentShowList.value.length - 1) {
      return;
    }

    let index = findIndex + 2;

    if (index > sessionContentShowList.value.length - 1) {
      index = sessionContentShowList.value.length - 1;
    }

    sessionContentRecycleScrollerRef.value.scrollToItem(index);
  }
}

function scrollToItemByContentId(contentId?: string) {
  if (!contentId || !sessionContentRecycleScrollerRef.value) {
    return;
  }

  const findIndex = sessionContentShowList.value.findIndex(
    item => item.contentId === contentId
  );

  if (findIndex !== -1) {
    sessionContentRecycleScrollerRef.value.scrollToItem(findIndex);
  }
}

let scrollToBottomStopSearchFlag = false;

function scrollToBottom() {
  if (!sessionContentRecycleScrollerRef.value) {
    return;
  }

  sessionContentRecycleScrollerRef.value.scrollToItem(
    sessionContentShowList.value.length - 1
  );

  scrollToBottomStopSearchFlag = true;
}

function setScrollToBottomStopSearchFlag(
  scrollToBottomStopSearchFlagTemp?: boolean
) {
  scrollToBottomStopSearchFlag = scrollToBottomStopSearchFlagTemp;
}

function setShouldAutoScroll(shouldAutoScrollTemp?: boolean) {
  shouldAutoScroll = shouldAutoScrollTemp;
}

defineExpose({
  doSearch,
  textareaInputRefFocus,
  setShouldAutoScroll,
  setScrollToBottomStopSearchFlag
});

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

function handleTextareaInputKeydown(e: KeyboardEvent) {
  const isEnter = e.key === "Enter" || e.key === "NumpadEnter";

  if (isEnter && !e.shiftKey) {
    e.preventDefault();
    sendClick();
  }
}

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
  }, 5000);
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
    GetServerTimestamp() - CommonConstant.SECOND_5_EXPIRE_TIME;

  return Number(item.createTs) <= checkTimestamp;
}

function doSendTodoSendMap() {
  if (!props.session.sessionId) {
    return;
  }

  const todoSendObj = storageLocal().getItem<Record<string, ISessionContentBO>>(
    LocalStorageKey.IM_SESSION_CONTENT_TODO_SEND_OBJ + props.session.sessionId
  );

  if (!todoSendObj) {
    return;
  }

  const keyArr = Object.keys(todoSendObj);

  if (!keyArr.length) {
    return;
  }

  const checkTimestamp =
    GetServerTimestamp() - CommonConstant.SECOND_10_EXPIRE_TIME;

  const valueArr = [];

  keyArr.forEach(key => {
    const item = todoSendObj[key];

    if (Number(item.createTs) > checkTimestamp) {
      return;
    }

    valueArr.push(item);
  });

  if (!valueArr.length) {
    return;
  }

  sortContentSimple(valueArr);

  valueArr.forEach(item => {
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

function sortContentSimple(itemArr?: ISessionContentBO[]) {
  itemArr.sort((a, b) => {
    const createTsOne = Number(a.createTs);

    const createTsTwo = Number(b.createTs);

    if (createTsOne === createTsTwo) {
      return a.orderNo > b.orderNo ? 1 : -1;
    } else {
      return createTsOne > createTsTwo ? 1 : -1;
    }
  });
}

function sendClick() {
  const txt = textarea.value;

  if (!txt) {
    return;
  }

  textareaInputRefFocus();

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

  nextTick(() => {
    scrollToBottom();
  });

  doSendToServer(form);
}

function getLastContentId() {
  let lastContentId = undefined;
  for (let i = sessionContentShowList.value.length - 1; i >= 0; i--) {
    const item = sessionContentShowList.value[i];
    if (item.contentId) {
      lastContentId = item.contentId;
      break;
    }
  }

  return lastContentId;
}

function getFirstContentId() {
  let firstContentId = undefined;
  for (let i = 0; i < sessionContentShowList.value.length; i++) {
    const item = sessionContentShowList.value[i];
    if (item.contentId) {
      firstContentId = item.contentId;
      break;
    }
  }

  return firstContentId;
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
        id: getLastContentId(),
        backwardFlag: true
      },
      false,
      false,
      undefined
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
        createId: baseImSessionContentInsertTxtVO.createId,
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
          id: getLastContentId(),
          backwardFlag: true
        },
        false,
        false,
        undefined
      );
    }
  }
});

let hasLess: boolean = true;

let shouldAutoScroll: boolean = true;

function handleScroll(event: Event) {
  const scrollerEl = event.target as HTMLElement;

  if (!scrollerEl) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollerEl;

  const distanceToBottom = scrollHeight - clientHeight - scrollTop;

  shouldAutoScroll = distanceToBottom <= 20;

  if (
    scrollTop <= CommonConstant.SCROLL_CHECK_HEIGHT &&
    !sessionContentLoading.value &&
    hasLess
  ) {
    doSearchThrottle(
      { id: getFirstContentId(), backwardFlag: false },
      false,
      false,
      "up"
    );
  } else if (
    distanceToBottom <= 20 &&
    !sessionContentLoading.value &&
    !scrollToBottomStopSearchFlag
  ) {
    doSearchThrottle(
      {
        id: getLastContentId(),
        backwardFlag: true
      },
      false,
      false,
      "down"
    );
  }

  if (scrollToBottomStopSearchFlag) {
    scrollToBottomStopSearchFlag = false;
  }
}

function reset() {
  sessionContentShowList.value = [];
  objIdSet.clear();
  shouldAutoScroll = true;

  showTodoSendMap();
}

watch(
  () => props.session.sessionId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      reset();
    }
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
        <el-scrollbar
          v-loading="sessionContentLoading"
          view-class="flex flex-col h-full"
          :height="'calc(' + scrollbarHeight + 'px - var(--spacing) * 12)'"
        >
          <DynamicScroller
            v-show="sessionContentShowList.length"
            ref="sessionContentRecycleScrollerRef"
            :items="sessionContentShowList"
            :min-item-size="84"
            key-field="objId"
            @scroll="handleScroll"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem :item="item" :active="active" :index="index">
                <div class="w-full pl-4 py-5">
                  <div
                    v-if="item.createId === selfUserId"
                    class="w-full flex items-end justify-end pr-9 space-x-2 animate-fadeIn"
                  >
                    <div
                      v-if="showSendFailFlag(item)"
                      class="cursor-pointer"
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
                    <div class="text-xs text-gray-400 self-end">
                      {{ FormatTsForCurrentDay(item.createTs, true) }}
                    </div>
                    <div
                      class="bg-primary min-h-11 text-white p-3 message-bubble-right shadow-sm"
                    >
                      <div class="text-sm whitespace-pre-wrap">
                        {{ item.content }}
                      </div>
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
                      class="bg-white min-h-11 p-3 message-bubble-left shadow-sm"
                    >
                      <div class="text-sm whitespace-pre-wrap">
                        {{ item.content }}
                      </div>
                    </div>
                    <div class="text-xs text-gray-400 self-end">
                      {{ FormatTsForCurrentDay(item.createTs, true) }}
                    </div>
                  </div>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>

          <div
            v-if="!sessionContentShowList.length && !sessionContentLoading"
            class="text-[15px] flex w-full h-full justify-center items-center text-gray-400"
          >
            暂无消息。
          </div>
        </el-scrollbar>
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
            @keydown="handleTextareaInputKeydown"
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
