<script setup lang="ts">
import { ref } from "vue";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import ReCol from "@/components/ReCol";
import { IFormUpdatePassword } from "@/views/base/user/types";
import { Validate } from "@/utils/ValidatorUtil";

const visible = ref<boolean>(false);
const form = ref<IFormUpdatePassword>({});
const formRef = ref();
const confirmLoading = ref<boolean>(false);

function getForm() {
  return form;
}

function open() {
  doOpen<IFormUpdatePassword>(formRef, form, visible, confirmLoading, {});
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
    title="批量修改密码"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="30%"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="auto"
      :rules="{
        newPassword: {
          trigger: 'blur',
          asyncValidator: Validate.password.canNullValidator
        }
      }"
    >
      <el-row>
        <re-col>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="form.newPassword"
              clearable
              placeholder="请输入新密码"
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
