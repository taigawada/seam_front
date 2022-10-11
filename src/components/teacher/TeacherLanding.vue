<template>
  <div>
    <!-- どのコンポーネントからでも呼び出せるように、状態をStoreで管理 -->
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
    <SimpleToast
      v-for="toast in $store.getters.toasts"
      :key="toast.key"
      :active="toast.active"
      :content="toast.content"
      :action="toast.action"
      :error="toast.isError"
      :duration="toast.duration"
      @dismiss="$store.dispatch('dismissToast', toast)"
    />
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import {
  SimpleTabs,
  SimpleModal,
  SimpleToast,
} from '@simple-education-dev/components';
import store from '@/store';
import router from '@/router';
import { useTransitionWarning } from './compositions/useTransitionWarning';
import MainPage from './mainPage/MainPage.vue';
import SettingsPage from './settingsPage/SettingsPage.vue';
import { SeamApiTeacher } from '@/api/endpoints';
import { isError } from 'lodash';
export default defineComponent({
  components: {
    SimpleTabs,
    MainPage,
    SettingsPage,
    SimpleModal,
    SimpleToast,
  },
  async beforeRouteEnter(to, from, next) {
    let teacherId = store.getters.teacherId;
    if (!teacherId) {
      await store.dispatch('setTeacherId');
      teacherId = store.getters.teacherId;
    }
    if (from.name === 'initialSettingsPage') {
      next();
    } else {
      const result = await SeamApiTeacher.getUserSettings(teacherId);
      if (!isError(result) && Object.keys(result.data).length < 1) {
        router.push({ name: 'initialSettingsPage' });
      } else {
        next();
      }
    }
  },
  setup(_) {
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
