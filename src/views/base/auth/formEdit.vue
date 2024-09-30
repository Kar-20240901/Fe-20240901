<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { formEditRule } from "@/views/base/auth/formEditRule";
import { BaseAuthInsertOrUpdateDTO } from "@/api/http/base/BaseAuthController";
import { IAuthDialogFormProps } from "@/views/base/auth/types";

const form = ref<BaseAuthInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseAuthInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
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

const props = defineProps<IAuthDialogFormProps>();

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
      :rules="formEditRule"
      label-width="auto"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item prop="name">
            <template #label>
              <div
                v-tippy="{ content: '例如：基础:菜单:新增修改' }"
                v-copy:click="'基础:菜单:新增修改'"
              >
                权限名称
              </div>
            </template>
            <el-input
              v-model="form.name"
              clearable
              placeholder="请输入权限名称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="权限值" prop="auth">
            <template #label>
              <div
                v-tippy="{ content: '例如：baseMenu:insertOrUpdate' }"
                v-copy:click="'baseMenu:insertOrUpdate'"
              >
                权限值
              </div>
            </template>
            <el-input
              v-model="form.auth"
              clearable
              placeholder="请输入权限值"
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

        <re-col>
          <el-form-item label="关联角色" prop="roleIdSet">
            <el-select
              v-model="form.roleIdSet"
              placeholder="请选择"
              class="w-full"
              clearable
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in props.roleDictList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-option>
            </el-select>
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
