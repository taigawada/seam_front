<template>
  <div>
    <SimpleTabs
      :tabs="tabs"
      :selected="tabSelected"
      @change="handleTabSelect"
    />
    <components :is="currentPage" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { SimpleTabs } from '@simple-education-dev/components';
import MainPage from './mainPage/MainPage.vue';
import SettingsPage from './settingsPage/SettingsPage.vue';
export default defineComponent({
  components: {
    SimpleTabs,
    MainPage,
    SettingsPage,
  },
  setup() {
    const tabs = [
      {
        label: '提出物管理',
        id: 'MainPage',
      },
      {
        label: '設定',
        id: 'SettingsPage',
      },
    ];
    const tabSelected = ref(0);
    const handleTabSelect = (select: number) => {
      tabSelected.value = select;
    };
    const currentPage = computed(() => {
      return tabs[tabSelected.value].id;
    });
    return {
      tabs,
      tabSelected,
      handleTabSelect,
      currentPage,
    };
  },
});
</script>
<style lang="scss"></style>
