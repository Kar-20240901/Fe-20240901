<script setup lang="ts">
import { ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import ContactFriendApplyDialogToMe from "@/views/im/imIndex/contactFriendApplyDialogToMe.vue";
import ContactFriendApplyDialogFromMe from "@/views/im/imIndex/contactFriendApplyDialogFromMe.vue";
import ContactFriendApplyDialogSend from "@/views/im/imIndex/contactFriendApplyDialogSend.vue";

const visible = ref<boolean>(false);

function open() {
  visible.value = true;
}

defineExpose({
  open
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="`好友申请`"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="getDialogWidth()"
    destroy-on-close
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs type="border-card">
        <el-tab-pane label="发起申请">
          <contact-friend-apply-dialog-send />
        </el-tab-pane>
        <el-tab-pane label="我的申请">
          <contact-friend-apply-dialog-from-me />
        </el-tab-pane>
        <el-tab-pane label="对我申请">
          <contact-friend-apply-dialog-to-me />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
