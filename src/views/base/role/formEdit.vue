<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { R } from "@/model/vo/R";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/base/enableFlagEnum";
import { BaseRoleInsertOrUpdateDTO } from "@/api/http/base/BaseRoleController";
import { IRoleDialogFormProps } from "@/views/base/role/types";
import { yesOrNoOptions } from "@/model/enum/base/yesOrNoEnum";

const form = ref<BaseRoleInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseRoleInsertOrUpdateDTO) {
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

const props = defineProps<IRoleDialogFormProps>();

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
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="角色名称"
            prop="name"
            :rules="[
              { required: true, message: '角色名称为必填项', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="form.name"
              clearable
              placeholder="请输入角色名称"
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

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="默认角色" prop="defaultFlag">
            <re-segmented
              :modelValue="form.defaultFlag ? 0 : 1"
              :options="yesOrNoOptions"
              @change="
                ({ option: { value } }) => {
                  form.defaultFlag = value;
                }
              "
            />
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="关联用户" prop="userIdSet">
            <el-select
              v-model="form.userIdSet"
              placeholder="请选择"
              class="w-full"
              clearable
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in props.userDictList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="关联权限" prop="authIdSet">
            <el-select
              v-model="form.authIdSet"
              placeholder="请选择"
              class="w-full"
              clearable
              multiple
              filterable
              collapse-tags
              collapse-tags-tooltip
            >
              <el-option
                v-for="item in props.authDictList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
        </re-col>

        <re-col>
          <el-form-item label="关联菜单" prop="menuIdSet">
            <el-cascader
              v-model="form.menuIdSet"
              class="w-full"
              :options="props.menuDictList as any"
              :props="{
                value: 'id',
                label: 'name',
                emitPath: false,
                multiple: true,
                checkStrictly: true
              }"
              clearable
              filterable
              placeholder="请选择"
              collapse-tags
              collapse-tags-tooltip
            >
              <template #default="{ node, data }">
                <span>{{ data.name }}</span>
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
