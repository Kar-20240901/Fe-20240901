<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import {
  BaseLiveRoomUserAddUserDTO,
  ILiveRoomSelfDialogFormProps
} from "@/views/live/self/liveRoomSelf/types";

const form = ref<BaseLiveRoomUserAddUserDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function open(formTemp?: BaseLiveRoomUserAddUserDTO) {
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

defineExpose({
  open,
  getForm
});

const props = defineProps<ILiveRoomSelfDialogFormProps>();

function confirmClick() {
  doConfirmClick(formRef, props, visible, confirmLoading);
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="加入房间"
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
            label="房间编号"
            prop="id"
            :rules="[
              {
                required: true,
                message: '房间编号为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.id"
              clearable
              placeholder="请输入房间编号"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="房间验证码" prop="code">
            <el-input
              v-model="form.id"
              clearable
              placeholder="如果不需要验证码，则不需要填写"
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
