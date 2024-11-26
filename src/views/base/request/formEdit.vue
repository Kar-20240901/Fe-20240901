<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import { IRequestDialogFormProps } from "@/views/base/request/types";
import { BaseRequestInfoDO } from "@/api/http/base/BaseRequestInfoController";
import { yesOrNoOptions } from "@/model/enum/yesOrNoEnum";

const form = ref<BaseRequestInfoDO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function editOpen(fun: Promise<R<any>>) {
  dialogLoading.value = true;
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
  editOpen
});

const props = defineProps<IRequestDialogFormProps>();
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
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求路径" prop="uri">
            <el-input v-model="form.uri" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="成功" prop="successFlag">
            <el-select v-model="form.successFlag" class="w-full" disabled>
              <el-option
                v-for="(item, index) in yesOrNoOptions"
                :key="index"
                :value="item.value"
                :label="item.label as string"
              >
                {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="耗时" prop="costMs">
            <el-input v-model="form.costMs" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="请求值" prop="requestParam">
            <el-input
              v-model="form.requestParam"
              readonly
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="返回值" prop="responseValue">
            <el-input
              v-model="form.responseValue"
              readonly
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="失败信息" prop="errorMsg">
            <el-input
              v-model="form.errorMsg"
              readonly
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 5 }"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
