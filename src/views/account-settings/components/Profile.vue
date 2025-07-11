<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { FormInstance, FormRules, UploadFile } from "element-plus";
import { deviceDetection } from "@pureadmin/utils";
import uploadLine from "~icons/ri/upload-line";
import {
  baseUserSelfInfo,
  BaseUserSelfInfoVO,
  baseUserSelfUpdateInfo
} from "@/api/http/base/BaseUserController";
import { ToastError, ToastSuccess } from "@/utils/ToastUtil";
import ReCropperPreview from "@/components/ReCropperPreview/src/index.vue";
import {
  BaseFileUpload,
  CheckAvatarFileType,
  CheckFileSize
} from "@/utils/FileUtil";
import CommonConstant from "@/model/constant/CommonConstant";
import { handleAvatarFileId, setUserKey } from "@/utils/UserUtil";
import Avatar from "@/assets/user.png";
import { useUserStoreHook } from "@/store/modules/user";
import { Validate } from "@/utils/ValidatorUtil";

defineOptions({
  name: "Profile"
});

const imgSrc = ref("");
const cropperBlob = ref();
const cropRef = ref();
const uploadRef = ref();
const isShow = ref(false);
const userInfoFormRef = ref<FormInstance>();

const userInfo = ref<BaseUserSelfInfoVO>({});

const rules: FormRules<BaseUserSelfInfoVO> = {
  nickname: [{ required: true, message: "昵称为必填项", trigger: "blur" }]
};

const userAvatarUrl = ref(useUserStoreHook().avatar || "");

const submitLoadingFlag = ref<boolean>(true);

onMounted(() => {
  baseUserSelfInfo()
    .then(res => {
      userInfo.value = res.data;

      setUserKey({
        nickname: res.data.nickname,
        username: res.data.username,
        createTime: res.data.createTime,
        passwordFlag: res.data.passwordFlag,
        email: res.data.email,
        id: res.data.id
      });

      const avatarFileId = res.data.avatarFileId!;

      handleAvatarFileId(avatarFileId, url => (userAvatarUrl.value = url)); // 处理：头像文件 id
    })
    .finally(() => {
      submitLoadingFlag.value = false;
    });
});

const onChange = (uploadFile: UploadFile) => {
  if (!CheckAvatarFileType(uploadFile.raw.type)) {
    ToastError("暂不支持此文件类型：" + uploadFile.raw.type + "，请重新选择");
    uploadRef.value.clearFiles();
    return;
  }

  if (!CheckFileSize(uploadFile.size!, 2097152)) {
    ToastError("图片大于 2MB，请重新选择");
    uploadRef.value.clearFiles();
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    imgSrc.value = e.target.result as string;
    isShow.value = true;
  };
  reader.readAsDataURL(uploadFile.raw);
};

const handleClose = () => {
  cropRef.value.hidePopover();
  uploadRef.value.clearFiles();
  cropperBlob.value = undefined;
  isShow.value = false;
};

const onCropper = ({ blob }) => (cropperBlob.value = blob);

const handleSubmitImage = () => {
  BaseFileUpload(new File([cropperBlob.value], "avatar"), "AVATAR").then(
    res => {
      handleAvatarFileId(res.data, url => (userAvatarUrl.value = url));
      ToastSuccess(res.msg);
      handleClose();
    }
  );
};

// 更新信息
const onSubmit = async () => {
  await userInfoFormRef.value.validate(valid => {
    if (!valid) {
      return;
    }
    submitLoadingFlag.value = true;

    baseUserSelfUpdateInfo({ ...userInfo.value })
      .then(res => {
        setUserKey({
          nickname: userInfo.value.nickname,
          username: userInfo.value.username
        });
        ToastSuccess(res.msg);
      })
      .finally(() => {
        submitLoadingFlag.value = false;
      });
  });
};
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">个人信息</h3>
    <el-form
      ref="userInfoFormRef"
      label-position="top"
      :rules="rules"
      :model="userInfo"
    >
      <el-form-item label="头像">
        <el-avatar :size="80" :src="userAvatarUrl || Avatar" />
        <el-upload
          ref="uploadRef"
          :accept="CommonConstant.IMAGE_FILE_ACCEPT_TYPE"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onChange"
        >
          <el-button plain class="ml-4">
            <IconifyIconOffline :icon="uploadLine" />
            <span class="ml-2">更新头像</span>
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="昵称"
        prop="nickname"
        :rules="[
          {
            required: true,
            trigger: 'blur',
            asyncValidator: Validate.nickname.validator
          }
        ]"
      >
        <el-input
          v-model="userInfo.nickname"
          placeholder="请输入昵称"
          :maxlength="Validate.nickname.maxLength"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="简介" prop="bio">
        <el-input
          v-model="userInfo.bio"
          placeholder="请输入简介"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          :maxlength="CommonConstant.BIO_MAX_LENGTH"
          show-word-limit
        />
      </el-form-item>
      <el-button :loading="submitLoadingFlag" type="primary" @click="onSubmit">
        更新信息
      </el-button>
    </el-form>
    <el-dialog
      v-model="isShow"
      width="40%"
      title="编辑头像"
      destroy-on-close
      :closeOnClickModal="false"
      :before-close="handleClose"
      :fullscreen="deviceDetection()"
    >
      <ReCropperPreview ref="cropRef" :imgSrc="imgSrc" @cropper="onCropper" />
      <template #footer>
        <div class="dialog-footer">
          <el-button bg text @click="handleClose">取消</el-button>
          <el-button bg text type="primary" @click="handleSubmitImage">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
