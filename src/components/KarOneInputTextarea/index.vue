<script setup lang="ts">
import { ref } from "vue";
import {
  doConfirmClick,
  doOpen,
  IDialogFormOneInputDTO,
  IDialogFormOneInputProps
} from "@/model/types/IDialogFormProps";
import ReCol from "@/components/ReCol";
import { getMinDialogWidth } from "@/utils/MyLayoutUtil";

defineOptions({
  name: "KarOneInputTextarea"
});

const visible = ref<boolean>(false);
const form = ref<IDialogFormOneInputDTO>({});
const formRef = ref();
const confirmLoading = ref<boolean>(false);

function getForm() {
  return form;
}

function open() {
  doOpen<IDialogFormOneInputDTO>(formRef, form, visible, confirmLoading, {
    inputValue: ""
  });
}

defineExpose({
  open,
  getForm
});

const props = defineProps<IDialogFormOneInputProps>();

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
    :width="props.width || getMinDialogWidth()"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-row>
        <re-col>
          <el-form-item
            :label="props.label"
            prop="inputValue"
            :rules="[
              {
                required: true,
                message: `${props.label}为必填项`,
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.inputValue"
              :rows="2"
              type="textarea"
              :placeholder="`请输入${props.label}`"
              show-word-limit
              :maxlength="300"
              resize="none"
              class="!w-full"
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
