<script setup lang="ts">
import { nextTick, ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import ContactFriendApplyDialogToMe from "@/views/im/imIndex/contactFriendApplyDialogToMe.vue";
import ContactFriendApplyDialogFromMe from "@/views/im/imIndex/contactFriendApplyDialogFromMe.vue";
import ContactFriendApplyDialogSend from "@/views/im/imIndex/contactFriendApplyDialogSend.vue";
import { TabPaneName } from "element-plus";

const visible = ref<boolean>(false);

function open() {
  visible.value = true;
}

defineExpose({
  open
});

const contactFriendApplyDialogSendRef = ref();
const contactFriendApplyDialogFromMeRef = ref();
const contactFriendApplyDialogToMeRef = ref();

function tabChange(name: TabPaneName) {
  tabsVal.value = name as unknown as string;

  nextTick(() => {
    if (name === contactFriendApplyDialogSend) {
      contactFriendApplyDialogSendRef.value?.onSearch();
    } else if (name === contactFriendApplyDialogFromMe) {
      contactFriendApplyDialogFromMeRef.value?.onSearch();
    } else if (name === contactFriendApplyDialogToMe) {
      contactFriendApplyDialogToMeRef.value?.onSearch();
    }
  });
}

const contactFriendApplyDialogSend = "contactFriendApplyDialogSend";
const contactFriendApplyDialogFromMe = "contactFriendApplyDialogFromMe";
const contactFriendApplyDialogToMe = "contactFriendApplyDialogToMe";

const tabsVal = ref<string>(contactFriendApplyDialogSend);

const emit = defineEmits<{
  (e: "searchContactFriend"): void;
}>();

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
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs v-model="tabsVal" type="border-card" @tab-change="tabChange">
        <el-tab-pane label="发起申请" :name="contactFriendApplyDialogSend">
          <contact-friend-apply-dialog-send
            ref="contactFriendApplyDialogSendRef"
          />
        </el-tab-pane>
        <el-tab-pane label="我的申请" :name="contactFriendApplyDialogFromMe">
          <contact-friend-apply-dialog-from-me
            ref="contactFriendApplyDialogFromMeRef"
          />
        </el-tab-pane>
        <el-tab-pane label="对我申请" :name="contactFriendApplyDialogToMe">
          <contact-friend-apply-dialog-to-me
            ref="contactFriendApplyDialogToMeRef"
            @searchContactFriend="searchContactFriend()"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
