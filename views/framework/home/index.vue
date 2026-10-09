<template>
  <fs-page></fs-page>
</template>

<script setup lang="ts">
import { reqDict } from "/@/api/common";
import { onMounted } from "vue";
import router from "/@/router";

onMounted(async () => {
  const data = await reqDict("home_url");
  await router.replace(data[0].dictValue);
});
</script>
