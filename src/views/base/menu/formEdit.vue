<script setup lang="ts">
import { ref } from "vue";
import ReCol from "@/components/ReCol";
import { BaseMenuInsertOrUpdateDTO } from "@/api/http/base/BaseMenuController";
import { R } from "@/model/vo/R";
import CommonConstant from "@/model/constant/CommonConstant";
import { IconSelect } from "@/components/ReIcon";
import { showFlagOptions } from "@/views/base/menu/enums";
import ReSegmented from "@/components/ReSegmented/src";
import { doConfirmClick, doOpen } from "@/model/types/IDialogFormProps";
import { enableFlagOptions } from "@/model/enum/enableFlagEnum";
import { IMenuDialogTreeFormProps } from "@/views/base/menu/types";

const form = ref<BaseMenuInsertOrUpdateDTO>({});
const formRef = ref();
const dialogLoading = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);
const visible = ref<boolean>(false);

function getForm() {
  return form;
}

function addOpen(formTemp?: BaseMenuInsertOrUpdateDTO) {
  doOpen(
    formRef,
    form,
    visible,
    confirmLoading,
    {
      orderNo: CommonConstant.DEFAULT_ORDER_NO,
      showFlag: true,
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

const props = defineProps<IMenuDialogTreeFormProps>();

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
        <re-col>
          <el-form-item label="上级菜单" prop="pid">
            <el-cascader
              v-model="form.pid"
              class="w-full"
              :options="props.parentOptions as any"
              :props="{
                value: 'id',
                label: 'name',
                emitPath: false,
                checkStrictly: true
              }"
              clearable
              filterable
              placeholder="请选择上级菜单"
            >
              <template #default="{ node, data }">
                <span>{{ data.name }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="菜单名称"
            prop="name"
            :rules="[
              { required: true, message: '菜单名称为必填项', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="form.name"
              clearable
              placeholder="请输入菜单名称"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item
            label="菜单路径"
            prop="path"
            :rules="[
              { required: true, message: '菜单路径为必填项', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model="form.path"
              clearable
              placeholder="请输入菜单路径"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="路由路径" prop="router">
            <el-input
              v-model="form.router"
              clearable
              placeholder="请输入路由路径"
            />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="重定向" prop="redirect">
            <el-input
              v-model="form.redirect"
              clearable
              placeholder="请输入重定向"
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
          <el-form-item label="菜单图标" prop="icon">
            <IconSelect v-model="form.icon" class="w-full" />
          </el-form-item>
        </re-col>

        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="显示" prop="showFlag">
            <re-segmented
              :modelValue="form.showFlag ? 0 : 1"
              :options="showFlagOptions"
              @change="
                ({ option: { value } }) => {
                  form.showFlag = value;
                }
              "
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
