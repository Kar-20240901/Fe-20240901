<script setup lang="ts">
import { nextTick, ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import { TabPaneName } from "element-plus";
import ContactGroupManageDialog from "@/views/im/imIndex/contactGroup/contactGroupManageDialog.vue";

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
    if (name === contactGroupManageDialogStr) {
      contactGroupManageDialogRef.value?.onSearch();
    } else if (name === contactGroupUserManageDialogStr) {
      contactGroupUserManageDialogRef.value?.onSearch();
    } else if (name === contactGroupApplyDialogSendStr) {
      contactGroupApplyDialogSendRef.value?.onSearch();
    } else if (name === contactGroupApplyDialogFromMeStr) {
      contactGroupApplyDialogFromMeRef.value?.onSearch();
    } else if (name === contactGroupApplyDialogToMeStr) {
      contactGroupApplyDialogToMeRef.value?.onSearch();
    }
  });
}

const contactGroupManageDialogStr = "contactGroupManageDialogName";
const contactGroupUserManageDialogStr = "contactGroupUserManageDialog";
const contactGroupApplyDialogSendStr = "contactGroupApplyDialogSend";
const contactGroupApplyDialogFromMeStr = "contactGroupApplyDialogFromMe";
const contactGroupApplyDialogToMeStr = "contactGroupApplyDialogToMe";

const tabsVal = ref<string>(contactGroupManageDialogStr);

const emit = defineEmits<{
  (e: "searchContactGroup"): void;

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
    @close="searchContactGroup()"
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs v-model="tabsVal" type="border-card" @tab-change="tabChange">
        <el-tab-pane label="群组管理" :name="contactGroupManageDialogStr">
          <contact-group-manage-dialog
            ref="contactGroupManageDialogRef"
            @searchContactGroup="searchContactGroup"
            @onlySessionSearch="onlySessionSearch"
            @refreshSearchContent="refreshSearchContent"
          />
        </el-tab-pane>
        <el-tab-pane
          label="群组成员管理"
          :name="contactGroupUserManageDialogStr"
        />
        <el-tab-pane label="发起申请" :name="contactGroupApplyDialogSendStr" />
        <el-tab-pane
          label="我的申请"
          :name="contactGroupApplyDialogFromMeStr"
        />
        <el-tab-pane label="对我申请" :name="contactGroupApplyDialogToMeStr" />
      </el-tabs>
    </div>
  </el-dialog>
</template>
