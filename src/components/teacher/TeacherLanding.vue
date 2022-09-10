<template>
  <div>
    <SimpleModal
      :open="$store.getters.cantTransitionModalOpen"
      title="ページを離れますか?"
      :mainAction="{
        text: 'ページから移動',
        isError: true,
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
import { useTransitionWarning } from './useTransitionWarning';
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
    const handleTabSelect = async (select: number) => {
      useTransitionWarning(store, () => {
        tabSelected.value = select;
      });
    };
    const pageTransitionClick = () => {
      store.dispatch('pageTransitionWaiterResolve');
    };
    const pageTransitionCancel = () => {
      store.dispatch('pageTransitionWaiterReject');
    };
    const currentPage = computed(() => {
      return tabs[tabSelected.value].id;
    });
    return {
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
