<script setup lang="ts">
import { computed, ref } from "vue";
import ReCol from "@/components/ReCol";
import { BaseDictInsertOrUpdateDTO } from "@/api/http/base/BaseDictController";
import { R } from "@/model/vo/R";
import CommonConstant from "@/model/constant/CommonConstant";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { IDictDialogFormProps } from "@/views/base/dict/types";
import { dictTypeOptions } from "@/views/base/dict/enums";

const form = ref<BaseDictInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseDictInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
      orderNo: CommonConstant.DEFAULT_ORDER_NO,
      enableFlag: true,
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

const props = defineProps<IDictDialogFormProps>();

function confirmClick() {
  doConfirmClick(formRef, props, visible, confirmLoading);
}

const dictFlag = computed(() => {
  return form.value.type === dictTypeOptions[0].value;
});
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
            label="字典key"
            prop="dictKey"
            :rules="
              dictFlag
                ? [
                    {
                      required: true,
                      message: '字典key为必填项',
                      trigger: 'blur'
                    }
                  ]
                : undefined
            "
          >
            <el-input
              v-model="form.dictKey"
              clearable
              placeholder="请输入字典key"
              :disabled="!dictFlag"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            :label="dictFlag ? '字典名称' : '字典项名称'"
            prop="name"
            :rules="[
              {
                required: true,
                message: `${dictFlag ? '字典名称' : '字典项名称'}为必填项`,
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.name"
              clearable
              :placeholder="dictFlag ? '请输入字典名称' : '请输入字典项名称'"
            />
          </el-form-item>
        </re-col>

        <re-col v-if="!dictFlag" :value="12" :xs="24" :sm="24">
          <el-form-item
            label="字典项value"
            prop="value"
            :rules="[
              {
                required: true,
                message: '字典项value为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="form.value"
              clearable
              placeholder="请输入字典项value"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="唯一标识" prop="uuid">
            <el-input
              v-model="form.uuid"
              clearable
              placeholder="请输入唯一标识"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="排序" prop="orderNo">
            <el-input-number
              v-model="form.orderNo"
              class="!w-full"
              :step="100"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="启用" prop="enableFlag">
            <re-segmented
              :modelValue="form.enableFlag ? 0 : 1"
              :options="enableFlagOptions"
              @change="
                ({ option: { value } }) => {
                  form.enableFlag = value;
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
