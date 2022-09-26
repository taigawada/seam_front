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
      :selected="$store.getters.currentTeacherTabIndex"
      @change="handleTabSelect"
    />
    <router-link to="/"></router-link>
    <router-link to="/assignments"></router-link>
    <router-link to="/assignments/detail"></router-link>
    <router-link to="/settings"></router-link>
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SimpleTabs, SimpleModal } from '@simple-education-dev/components';
import { useStore } from '../../store/useStore';
import router from '@/router';
import { useTransitionWarning } from './compositions/useTransitionWarning';
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
        id: 'teacherLanding',
      },
      {
        label: '設定',
        id: 'userSettings',
      },
    ];
    (async () => {
      store.dispatch('getHolidays');
    })();
    const handleTabSelect = async (select: number) => {
      useTransitionWarning(store, async () => {
        await store.dispatch('teacherTabSelect', select);
        router.push({ name: tabs[select].id });
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
      handleTabSelect,
    };
  },
});
</script>
<style lang="scss"></style>
