<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { BaseLiveRoomSelfInsertOrUpdateDTO } from "@/api/http/base/BaseLiveRoomSelfController";
import { ILiveRoomSelfDialogFormProps } from "@/views/live/self/liveRoomSelf/types";

const form = ref<BaseLiveRoomSelfInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseLiveRoomSelfInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
      ...formTemp
    },
    dialogLoading
  );
}

function editOpen(fun: Promise<R<any>>) {
  dialogLoading.value = true;
  confirmLoading.value = false;
  visible.value = true;
  form.value = {};
  formRef.value?.clearValidate();
  fun.then(res => {
    form.value = res.data;
    dialogLoading.value = false;
  });
}

defineExpose({
  getForm,
  addOpen,
  editOpen
});

const props = defineProps<ILiveRoomSelfDialogFormProps>();

function confirmClick() {
  doConfirmClick(formRef, props, visible, confirmLoading);
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="props.title"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="45%"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      v-loading="dialogLoading"
      :model="form"
      label-width="auto"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="名称"
            prop="name"
            :rules="[
              {
                required: true,
                message: '名称为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-input v-model="form.name" clearable placeholder="请输入名称" />
          </el-form-item>
        </re-col>

        <re-col v-if="!form.id" :value="12" :xs="24" :sm="24">
          <el-form-item label="加入验证" prop="codeFlag">
            <re-segmented
              :modelValue="form.codeFlag ? 0 : 1"
              :options="enableFlagOptions"
              @change="
                ({ option: { value } }) => {
                  form.codeFlag = value;
                }
              "
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>

    <template #footer>
      <div>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          :loading="confirmLoading"
          type="primary"
          @click="confirmClick"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
