import type { FormInstance, FormItemProp } from "element-plus";
import { clone } from "@pureadmin/utils";
import { ref } from "vue";
import type { R } from "@/model/vo/R";
import { ToastSuccess } from "@/utils/ToastUtil";

export const useVerifyCode = () => {
  const isDisabled = ref(false);
  const timer = ref(null);
  const text = ref("");

  const start = async (
    formEl: FormInstance | undefined,
    props: FormItemProp,
    sendCodeFun: () => Promise<R<any>>,
    time = 60
  ) => {
    if (!formEl) return;
    const initTime = clone(time, true);
    await formEl.validateField(props, isValid => {
      if (!isValid) {
        return;
      }
      isDisabled.value = true;
      sendCodeFun()
        .then(res => {
          ToastSuccess(res.msg);
          clearInterval(timer.value);
          text.value = `${time}`;
          timer.value = setInterval(() => {
            if (time > 0) {
              time -= 1;
              text.value = `${time}`;
            } else {
              text.value = "";
              isDisabled.value = false;
              clearInterval(timer.value);
              time = initTime;
            }
          }, 1000);
        })
        .catch(() => {
          isDisabled.value = false;
        });
    });
  };

  const end = () => {
    text.value = "";
    isDisabled.value = false;
    clearInterval(timer.value);
  };

  return {
    isDisabled,
    timer,
    text,
    start,
    end
  };
};
