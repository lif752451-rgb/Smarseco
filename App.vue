<template>
  <el-config-provider :locale="locale">
    <router-view v-if="routerEnabled" />
  </el-config-provider>
</template>

<script lang="ts">
import zh_cn from "element-plus/es/locale/lang/zh-cn";
import zh_hk from "element-plus/es/locale/lang/zh-tw";
import en from "element-plus/es/locale/lang/en";
import { provide, ref, nextTick, computed } from "vue";
import { useLocaleStore } from "/@/store/modules/locale";

export default {
  name: "App",
  setup() {
    //刷新页面方法
    const routerEnabled = ref(true);
    async function reload() {
      routerEnabled.value = false;
      await nextTick();
      routerEnabled.value = true;
    }
    provide("fn:router.reload", reload);

    const localeStore = useLocaleStore();
    const localeMap = new Map([
      ["zh-cn", zh_cn],
      ["zh-hk", zh_hk],
      ["en", en]
    ]);
    const locale = computed(() => {
      return localeMap.get(localeStore.getLocale);
    });

    return {
      routerEnabled,
      locale
    };
  }
};
</script>
