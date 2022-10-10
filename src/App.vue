<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent, watch } from '@vue/composition-api';
import { usePreferredDark } from '@vueuse/core';
export default defineComponent({
  setup(_, context) {
    const isDark = usePreferredDark();
    watch(isDark, () => {
      // @ts-ignore
      context.root.$switchTheme(isDark.value ? 'dark' : 'light');
    });
  },
});
</script>
<style lang="scss">
body {
  background-color: var(--global-background);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: var(--text);
}
</style>
