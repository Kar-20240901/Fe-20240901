<script setup lang="ts">
import { ChangeNumberDTO } from "@/api/http/base/BaseMenuController";
import { ref } from "vue";
import {
  doConfirmClick,
  doOpen,
  IDialogFormProps
} from "@/model/types/IDialogFormProps";
import { formRules } from "@/components/KarAddOrderNo/formRule";
import ReCol from "@/components/ReCol";

defineOptions({
  name: "KarAddOrderNo"
});

const visible = ref<boolean>(false);
const form = ref<ChangeNumberDTO>({});
const formRef = ref();
const confirmLoading = ref<boolean>(false);

function getForm() {
  return form;
}

function open() {
  doOpen<ChangeNumberDTO>(formRef, form, visible, confirmLoading, {
    number: 100 as unknown as string
  });
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
    title="累加排序号"
    draggable
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="30%"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" label-width="auto" :rules="formRules">
      <el-row>
        <re-col>
          <el-form-item label="累加的值" prop="number">
            <el-input-number
              v-model="form.number as unknown as number"
              class="!w-full"
              :step="100"
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
