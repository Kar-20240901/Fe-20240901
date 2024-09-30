<script setup lang="ts">
import { ref } from "vue";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import ReCol from "@/components/ReCol";
import { IFormBatch } from "@/views/base/auth/types";

const visible = ref<boolean>(false);
const form = ref<IFormBatch>({});
const formRef = ref();
const confirmLoading = ref<boolean>(false);

function getForm() {
  return form;
}

function open() {
  doOpen<IFormBatch>(formRef, form, visible, confirmLoading, {});
}

defineExpose({
  open,
  getForm
});

const props = defineProps<IDialogFormProps>();

function confirmClick() {
  doConfirmClick(formRef, props, visible, confirmLoading);
}
</script>

<template>
  <el-dialog
    v-model="visible"
    title="批量新增"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="45%"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      :rules="{
        namePre: {
          required: true,
          message: '名称前缀为必填项',
          trigger: 'blur'
        },
        authPre: {
          required: true,
          message: '权限前缀为必填项',
          trigger: 'blur'
        }
      }"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="名称前缀" prop="namePre">
            <el-input
              v-model="form.namePre"
              clearable
              placeholder="请输入名称前缀"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="权限前缀" prop="authPre">
            <el-input
              v-model="form.authPre"
              clearable
              placeholder="请输入权限前缀"
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
