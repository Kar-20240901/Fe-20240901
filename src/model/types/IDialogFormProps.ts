import type { R } from "@/model/vo/R";
import type { Ref } from "vue";

export interface IDialogFormDefineExpose {
  open: () => void;
}

export interface IOneInputDialogFormDefineExpose<T> {
  open: () => void;
  getForm: () => Ref<T>;
}

export interface IDialogFormOneInputDTO {
  inputValue?: string; // 输入框的值，是否必传：true
}

export interface IDialogFormOneInputProps extends IDialogFormProps {
  label?: string;
  width?: string;
  nonRequiredFlag?: boolean;
}

export interface IDialogFormProps {
  title?: string;
  confirmFun?: () => Promise<R<any>>;
  confirmAfterFun?: (res: R<any>, done: () => void) => void;
}

export interface IDialogTreeFormProps<T> extends IDialogFormProps {
  parentOptions?: T[];
}

export function doOpen<T>(
  formRef: Ref<any>,
  form: Ref<T>,
  visible: Ref<boolean>,
  confirmLoading: Ref<boolean>,
  formTemp?: T,
  dialogLoading?: Ref<boolean>
) {
  if (dialogLoading) {
    dialogLoading.value = false;
  }
  confirmLoading.value = false;
  form.value = formTemp;
  formRef.value?.clearValidate();
  visible.value = true;
}

export function doConfirmClick(
  formRef: Ref<any>,
  props: IDialogFormProps,
  visible: Ref<boolean>,
  confirmLoading: Ref<boolean>
) {
  formRef.value.validate().then((valid: boolean) => {
    if (!valid) {
      return;
    }

    if (!props.confirmFun) {
      visible.value = false;
      return;
    }

    confirmLoading.value = true;

    props
      .confirmFun()
      .then(res => {
        function done() {
          confirmLoading.value = false;
          visible.value = false;
        }

        if (props.confirmAfterFun) {
          props.confirmAfterFun(res, done);
        } else {
          done();
        }
      })
      .catch(() => {
        confirmLoading.value = false;
      });
  });
}
