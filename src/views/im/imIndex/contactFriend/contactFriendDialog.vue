<script setup lang="ts">
import { nextTick, ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import ContactFriendManageDialog from "@/views/im/imIndex/contactFriend/contactFriendManageDialog.vue";
import ContactFriendApplyDialogToMe from "@/views/im/imIndex/contactFriend/contactFriendApplyDialogToMe.vue";
import ContactFriendApplyDialogFromMe from "@/views/im/imIndex/contactFriend/contactFriendApplyDialogFromMe.vue";
import ContactFriendApplyDialogSend from "@/views/im/imIndex/contactFriend/contactFriendApplyDialogSend.vue";
import { TabPaneName } from "element-plus";

const visible = ref<boolean>(false);

function open() {
  visible.value = true;
}

defineExpose({
  open
});

const contactFriendManageDialogRef = ref();
const contactFriendApplyDialogSendRef = ref();
const contactFriendApplyDialogFromMeRef = ref();
const contactFriendApplyDialogToMeRef = ref();

function tabChange(name: TabPaneName) {
  tabsVal.value = name as unknown as string;

  nextTick(() => {
    if (name === contactFriendManageDialogStr) {
      contactFriendManageDialogRef.value?.onSearch();
    } else if (name === contactFriendApplyDialogSendStr) {
      contactFriendApplyDialogSendRef.value?.onSearch();
    } else if (name === contactFriendApplyDialogFromMeStr) {
      contactFriendApplyDialogFromMeRef.value?.onSearch();
    } else if (name === contactFriendApplyDialogToMeStr) {
      contactFriendApplyDialogToMeRef.value?.onSearch();
    }
  });
}

const contactFriendManageDialogStr = "contactFriendManageDialog";
const contactFriendApplyDialogSendStr = "contactFriendApplyDialogSend";
const contactFriendApplyDialogFromMeStr = "contactFriendApplyDialogFromMe";
const contactFriendApplyDialogToMeStr = "contactFriendApplyDialogToMe";

const tabsVal = ref<string>(contactFriendManageDialogStr);

const emit = defineEmits<{
  (e: "searchContactFriend"): void;
  (e: "onlySessionSearch"): void;
  (
    e: "refreshSearchContent",
    sessionIdArr?: string[],
    removeSessionFlag?: boolean
  ): void;
}>();

function refreshSearchContent(
  sessionIdArr?: string[],
  removeSessionFlag?: boolean
) {
  emit("refreshSearchContent", sessionIdArr, removeSessionFlag);
}

function onlySessionSearch() {
  emit("onlySessionSearch");
}

function searchContactFriend() {
  emit("searchContactFriend");
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="好友管理"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="getDialogWidth()"
    destroy-on-close
    @close="searchContactFriend()"
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs v-model="tabsVal" type="border-card" @tab-change="tabChange">
        <el-tab-pane label="好友管理" :name="contactFriendManageDialogStr">
          <contact-friend-manage-dialog
            ref="contactFriendManageDialogRef"
            @searchContactFriend="searchContactFriend"
            @onlySessionSearch="onlySessionSearch"
            @refreshSearchContent="refreshSearchContent"
          />
        </el-tab-pane>
        <el-tab-pane label="发起申请" :name="contactFriendApplyDialogSendStr">
          <contact-friend-apply-dialog-send
            ref="contactFriendApplyDialogSendRef"
          />
        </el-tab-pane>
        <el-tab-pane label="我的申请" :name="contactFriendApplyDialogFromMeStr">
          <contact-friend-apply-dialog-from-me
            ref="contactFriendApplyDialogFromMeRef"
          />
        </el-tab-pane>
        <el-tab-pane label="对我申请" :name="contactFriendApplyDialogToMeStr">
          <contact-friend-apply-dialog-to-me
            ref="contactFriendApplyDialogToMeRef"
            @searchContactFriend="searchContactFriend"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
