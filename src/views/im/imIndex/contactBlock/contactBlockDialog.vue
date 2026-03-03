<script setup lang="ts">
import { nextTick, ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import { TabPaneName } from "element-plus";
import ContactBlockDialogGroup from "@/views/im/imIndex/contactBlock/contactBlockDialogGroup.vue";
import ContactBlockDialogFriend from "@/views/im/imIndex/contactBlock/contactBlockDialogFriend.vue";

const visible = ref<boolean>(false);

function open() {
  visible.value = true;
}

defineExpose({
  open
});

const contactBlockDialogFriendRef = ref();
const contactBlockDialogGroupRef = ref();

function tabChange(name: TabPaneName) {
  tabsVal.value = name as unknown as string;

  nextTick(() => {
    if (name === contactBlockDialogFriendStr) {
      contactBlockDialogFriendRef.value?.onSearch();
    } else if (name === contactBlockDialogGroupStr) {
      contactBlockDialogGroupRef.value?.initGroupDictList();
      contactBlockDialogGroupRef.value?.onSearch();
    }
  });
}

const contactBlockDialogFriendStr = "contactGroupManageDialog";
const contactBlockDialogGroupStr = "contactGroupUserManageDialog";

const tabsVal = ref<string>(contactBlockDialogFriendStr);
</script>

<template>
  <el-dialog
    v-model="visible"
    title="黑名单管理"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="getDialogWidth()"
    destroy-on-close
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs v-model="tabsVal" type="border-card" @tab-change="tabChange">
        <el-tab-pane label="好友" :name="contactBlockDialogFriendStr">
          <contact-block-dialog-friend ref="contactBlockDialogFriendRef" />
        </el-tab-pane>
        <el-tab-pane label="群聊" :name="contactBlockDialogGroupStr">
          <contact-block-dialog-group ref="contactBlockDialogGroupRef" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
