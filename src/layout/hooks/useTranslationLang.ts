import { useNav } from "./useNav";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { onBeforeMount, type Ref, watch } from "vue";
import dayjs from "dayjs";

export function useTranslationLang(ref?: Ref) {
  const { $storage, changeTitle, handleResize } = useNav();
  const { locale, t } = useI18n();
  const route = useRoute();

  function translationCh() {
    $storage.locale = { locale: "zh" };
    locale.value = "zh";
    ref && handleResize(ref.value);
    dayjs.locale("zh-cn");
  }

  function translationEn() {
    $storage.locale = { locale: "en" };
    locale.value = "en";
    ref && handleResize(ref.value);
    dayjs.locale("en");
  }

  watch(
    () => locale.value,
    () => {
      changeTitle(route.meta);
    }
  );

  onBeforeMount(() => {
    locale.value = $storage.locale?.locale ?? "zh";

    if (locale.value === "zh") {
      dayjs.locale("zh-cn");
    } else {
      dayjs.locale("en");
    }
  });

  return {
    t,
    route,
    locale,
    translationCh,
    translationEn
  };
}
