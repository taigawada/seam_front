<template>
  <div>
    <SimpleModal
      :open="pageTransitionWarningModalOpen"
      title="ページを離れますか?"
      :mainAction="{
        text: 'ページから移動',
        onAction: pageTransitionClick,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: pageTransitionCancel,
      }"
      @destroy="pageTransitionCancel"
    >
      <p style="text-align: left">
        このページを離れると、保存されていないすべての変更が削除されます。
      </p>
    </SimpleModal>
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
import { SimpleTabs, SimpleModal } from '@simple-education-dev/components';
import { useStore } from '../../store/useStore';
import MainPage from './mainPage/MainPage.vue';
import SettingsPage from './settingsPage/SettingsPage.vue';
export default defineComponent({
  components: {
    SimpleTabs,
    MainPage,
    SettingsPage,
    SimpleModal,
  },
  setup(_, context) {
    const store = useStore(context);
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
    const pageTransitionWarningModalOpen = ref(false);
    const pageTransition = ref<((arg0: boolean) => void) | null>(null);
    const pageTransitionPromise = () =>
      new Promise((resolve) => {
        pageTransition.value = resolve;
      });
    const handleTabSelect = async (select: number) => {
      // if (store.getters.cantTransition) {
      pageTransitionWarningModalOpen.value = true;
      const result = await pageTransitionPromise();
      if (result) {
        tabSelected.value = select;
      }
      pageTransitionWarningModalOpen.value = false;
      pageTransition.value = null;
      // } else {
      //   tabSelected.value = select;
      // }
    };
    const pageTransitionClick = () => {
      if (pageTransition.value !== null) {
        pageTransition.value(true);
      }
    };
    const pageTransitionCancel = () => {
      if (pageTransition.value !== null) {
        pageTransition.value(false);
      }
    };
    const currentPage = computed(() => {
      return tabs[tabSelected.value].id;
    });
    return {
      pageTransitionWarningModalOpen,
      pageTransitionClick,
      pageTransitionCancel,
      tabs,
      tabSelected,
      handleTabSelect,
      currentPage,
    };
  },
});
</script>
<style lang="scss"></style>
