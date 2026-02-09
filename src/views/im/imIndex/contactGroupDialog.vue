<script setup lang="ts">
import { nextTick, ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import { TabPaneName } from "element-plus";

const visible = ref<boolean>(false);

function open() {
  visible.value = true;
}

defineExpose({
  open
});

const contactGroupManageDialogRef = ref();
const contactGroupUserManageDialogRef = ref();
const contactGroupApplyDialogSendRef = ref();
const contactGroupApplyDialogFromMeRef = ref();
const contactGroupApplyDialogToMeRef = ref();

function tabChange(name: TabPaneName) {
  tabsVal.value = name as unknown as string;

  nextTick(() => {
    if (name === contactGroupManageDialog) {
      contactGroupManageDialogRef.value?.onSearch();
    } else if (name === contactGroupUserManageDialog) {
      contactGroupUserManageDialogRef.value?.onSearch();
    } else if (name === contactGroupApplyDialogSend) {
      contactGroupApplyDialogSendRef.value?.onSearch();
    } else if (name === contactGroupApplyDialogFromMe) {
      contactGroupApplyDialogFromMeRef.value?.onSearch();
    } else if (name === contactGroupApplyDialogToMe) {
      contactGroupApplyDialogToMeRef.value?.onSearch();
    }
  });
}

const contactGroupManageDialog = "contactGroupManageDialog";
const contactGroupUserManageDialog = "contactGroupUserManageDialog";
const contactGroupApplyDialogSend = "contactGroupApplyDialogSend";
const contactGroupApplyDialogFromMe = "contactGroupApplyDialogFromMe";
const contactGroupApplyDialogToMe = "contactGroupApplyDialogToMe";

const tabsVal = ref<string>(contactGroupManageDialog);

const emit = defineEmits<{
  (e: "searchContactGroup"): void;
}>();

function searchContactGroup() {
  emit("searchContactGroup");
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="群组管理"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="getDialogWidth()"
    destroy-on-close
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs v-model="tabsVal" type="border-card" @tab-change="tabChange">
        <el-tab-pane label="群组管理" :name="contactGroupManageDialog" />
        <el-tab-pane
          label="群组成员管理"
          :name="contactGroupUserManageDialog"
        />
        <el-tab-pane label="发起申请" :name="contactGroupApplyDialogSend" />
        <el-tab-pane label="我的申请" :name="contactGroupApplyDialogFromMe" />
        <el-tab-pane label="对我申请" :name="contactGroupApplyDialogToMe" />
      </el-tabs>
    </div>
  </el-dialog>
</template>
