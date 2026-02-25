<script setup lang="ts">
import { nextTick, ref } from "vue";
import { getDialogWidth } from "@/utils/MyLayoutUtil";
import { TabPaneName } from "element-plus";
import ContactGroupManageDialog from "@/views/im/imIndex/contactGroup/contactGroupManageDialog.vue";
import ContactGroupUserManageDialog from "@/views/im/imIndex/contactGroup/contactGroupUserManageDialog.vue";
import ContactGroupApplyDialogSend from "@/views/im/imIndex/contactGroup/contactGroupApplyDialogSend.vue";
import ContactGroupApplyDialogFromMe from "@/views/im/imIndex/contactGroup/contactGroupApplyDialogFromMe.vue";
import ContactGroupApplyDialogToMe from "@/views/im/imIndex/contactGroup/contactGroupApplyDialogToMe.vue";

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

function changeToGroupUserManage(groupId?: string) {
  tabsVal.value = contactGroupUserManageDialogStr;

  contactGroupUserManageDialogRef.value?.setGroupId(groupId);
}

function initGroupDictList() {
  contactGroupUserManageDialogRef.value?.initGroupDictList();
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="群聊管理"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="getDialogWidth()"
    destroy-on-close
    @close="searchContactGroup()"
  >
    <div class="flex flex-col px-5 py-3 bg-bg_color">
      <el-tabs v-model="tabsVal" type="border-card" @tab-change="tabChange">
        <el-tab-pane label="群聊管理" :name="contactGroupManageDialogStr">
          <contact-group-manage-dialog
            ref="contactGroupManageDialogRef"
            @searchContactGroup="searchContactGroup"
            @onlySessionSearch="onlySessionSearch"
            @refreshSearchContent="refreshSearchContent"
            @changeToGroupUserManage="changeToGroupUserManage"
            @initGroupDictList="initGroupDictList"
          />
        </el-tab-pane>
        <el-tab-pane
          label="群聊成员管理"
          :name="contactGroupUserManageDialogStr"
        >
          <contact-group-user-manage-dialog
            ref="contactGroupUserManageDialogRef"
          />
        </el-tab-pane>
        <el-tab-pane label="发起申请" :name="contactGroupApplyDialogSendStr">
          <contact-group-apply-dialog-send
            ref="contactGroupApplyDialogSendRef"
          />
        </el-tab-pane>
        <el-tab-pane label="我的申请" :name="contactGroupApplyDialogFromMeStr">
          <contact-group-apply-dialog-from-me
            ref="contactGroupApplyDialogFromMeRef"
          />
        </el-tab-pane>
        <el-tab-pane label="对我申请" :name="contactGroupApplyDialogToMeStr">
          <contact-group-apply-dialog-to-me
            ref="contactGroupApplyDialogToMeRef"
            @searchContactGroup="searchContactGroup"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
