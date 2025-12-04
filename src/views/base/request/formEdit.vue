<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import {
  IBaseRequestFullInfoDO,
  IRequestDialogFormProps
} from "@/views/base/request/types";
import { yesOrNoOptions } from "@/model/enum/base/yesOrNoEnum";

const form = ref<IBaseRequestFullInfoDO>({});
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
          <el-form-item label="请求方式" prop="method">
            <el-input v-model="form.method" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求路径" prop="uri">
            <el-input v-model="form.uri" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求名称" prop="name">
            <el-input v-model="form.name" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求地点" prop="region">
            <el-input v-model="form.region" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求终端" prop="categoryName">
            <el-input v-model="form.categoryName" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求类型" prop="type">
            <el-input v-model="form.type" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求用户" prop="createName">
            <el-input v-model="form.createName" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="成功" prop="successFlag">
            <el-segmented
              v-model="form.successFlag"
              :options="yesOrNoOptions"
              disabled
            >
              <template #default="scope">
                <div>{{ scope.item.label }}</div>
              </template>
            </el-segmented>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="请求时间" prop="createTime">
            <el-input v-model="form.createTime" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="耗时" prop="costMs">
            <el-input v-model="form.costMs" readonly />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="请求头" prop="requestHeader">
            <el-input
              v-model="form.requestHeader"
              readonly
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="请求值" prop="requestParam">
            <el-input
              v-model="form.requestParam"
              readonly
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="返回头" prop="responseHeader">
            <el-input
              v-model="form.responseHeader"
              readonly
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="返回值" prop="responseValue">
            <el-input
              v-model="form.responseValue"
              readonly
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }"
            />
          </el-form-item>
        </re-col>

        <re-col :value="24" :xs="24" :sm="24">
          <el-form-item label="失败信息" prop="errorMsg">
            <el-input
              v-model="form.errorMsg"
              readonly
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 2 }"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
