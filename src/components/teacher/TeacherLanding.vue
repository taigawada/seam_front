<template>
  <div>
    <SimpleModal
      :open="$store.getters.cantTransitionModalOpen"
      title="ページを離れますか?"
      :mainAction="{
        text: 'ページから移動',
        isCritical: true,
        onAction: pageTransitionClick,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: pageTransitionCancel,
      }"
      @destroy="handleTransitionWaningModalDestroy"
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
    <router-link to="/"></router-link>
    <router-link to="/home"></router-link>
    <router-link to="/settings"></router-link>
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { SimpleTabs, SimpleModal } from '@simple-education-dev/components';
import { useStore } from '../../store/useStore';
import router from '@/router';
import { useTransitionWarning } from './useTransitionWarning';
import MainPage from './mainPage/MainPage.vue';
import MainPageSkelton from './mainPage/MainPageSkelton.vue';
import SettingsPage from './settingsPage/SettingsPage.vue';
export default defineComponent({
  components: {
    SimpleTabs,
    MainPage,
    MainPageSkelton,
    SettingsPage,
    SimpleModal,
  },
  setup(_, context) {
    const store = useStore(context);
    const tabs = [
      {
        label: '提出物管理',
        id: '/home',
      },
      {
        label: '設定',
        id: '/settings',
      },
    ];
    const tabSelected = ref(0);
    (async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (router.currentRoute.path.match(/^\/$|^\/home$/) !== null) {
        router.push({ path: '/home' });
      }
    })();
    const handleTabSelect = async (select: number) => {
      useTransitionWarning(store, () => {
        tabSelected.value = select;
        router.push({ path: tabs[select].id });
      });
    };
    const pageTransitionClick = () => {
      store.dispatch('pageTransitionWaiterResolve');
    };
    const pageTransitionCancel = () => {
      store.dispatch('pageTransitionWaiterReject');
    };
    const handleTransitionWaningModalDestroy = () => {
      store.dispatch('cantTransitionModalClose');
      store.dispatch('pageTransitionWaiterReject');
    };
    return {
      pageTransitionClick,
      pageTransitionCancel,
      handleTransitionWaningModalDestroy,
      tabs,
      tabSelected,
      handleTabSelect,
    };
  },
});
</script>
<style lang="scss"></style>
