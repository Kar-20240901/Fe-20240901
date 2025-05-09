import type { FormInstance, FormItemProp } from "element-plus";
import { clone } from "@pureadmin/utils";
import { ref } from "vue";
import type { R } from "@/model/vo/R";
import { ToastSuccess } from "@/utils/ToastUtil";

const isDisabled2 = ref(false);
const timer2 = ref(null);
const text2 = ref("");

export const useVerifyCode2 = () => {
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
      isDisabled2.value = true;
      sendCodeFun()
        .then(res => {
          ToastSuccess(res.msg);
          clearInterval(timer2.value);
          text2.value = `${time}`;
          timer2.value = setInterval(() => {
            if (time > 0) {
              time -= 1;
              text2.value = `${time}`;
            } else {
              text2.value = "";
              isDisabled2.value = false;
              clearInterval(timer2.value);
              time = initTime;
            }
          }, 1000);
        })
        .catch(() => {
          isDisabled2.value = false;
        });
    });
  };

  const end = () => {
    text2.value = "";
    isDisabled2.value = false;
    clearInterval(timer2.value);
  };

  return {
    isDisabled2,
    timer2,
    text2,
    start,
    end
  };
};
