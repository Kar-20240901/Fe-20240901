<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { doConfirmClick } from "@/model/types/IDialogFormProps";
import { BaseFileCopySelfDTO } from "@/api/http/base/BaseFileController";
import { IFileTreeDialogFormProps } from "@/views/file/fileSystem/types";

const form = ref<BaseFileCopySelfDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function open() {
  dialogLoading.value = false;
  confirmLoading.value = false;
  visible.value = true;
  form.value = {};
  formRef.value?.clearValidate();
}

defineExpose({
  getForm,
  open
});

const props = defineProps<IFileTreeDialogFormProps>();

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
        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item
            label="文件夹"
            prop="pid"
            :rules="[
              {
                required: true,
                message: '文件夹为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-cascader
              v-model="form.pid"
              class="w-full"
              :options="props.tree as any"
              :props="{
                value: 'id',
                label: 'showFileName',
                emitPath: false,
                checkStrictly: true
              }"
              clearable
              filterable
              placeholder="请选择文件夹"
            >
              <template #default="{ node, data }">
                <span>{{ data.showFileName }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
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
