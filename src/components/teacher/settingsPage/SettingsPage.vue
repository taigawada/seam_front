<template>
  <div class="settings-page-container">
    <SimpleSaveBar
      :open="isChanged"
      :saveButton="{
        label: '保存',
        loading: nowSaving,
        onAction: handleOnSave,
      }"
      :discardButton="{
        label: '変更を破棄',
        onAction: handleDestructionModalOpen,
      }"
    />
    <SimpleModal
      :open="destructionModalOpen"
      title="全ての変更を破棄"
      :mainAction="{
        text: '破棄',
        isCritical: true,
        onAction: handleSettingsDestrunction,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleDestructionModalDestroy,
      }"
      @destroy="handleDestructionModalDestroy"
    >
      <p style="text-align: left">
        全ての変更が破棄され、元に戻すことはできません。
      </p>
    </SimpleModal>
    <div class="detail-settings">
      <div
        v-for="settingsElement in menus"
        :key="settingsElement.label"
        class="detail-settings-container"
      >
        <div ref="elementRefs">
          <div class="description-container">
            {{ settingsElement.label }}
            <p>
              {{ settingsElement.description }}
            </p>
          </div>
          <component
            :is="isLoading ? 'SettingsPageSkelton' : settingsElement.component"
            :settings="settings"
            @change="handleSettingsChange"
          ></component>
        </div>
      </div>
      <div style="height: 100vh"></div>
    </div>
    <div class="settings-menu">
      <div
        v-for="(settingsElement, index) in menus"
        :key="settingsElement.label"
        class="settings-header"
        @click="() => handleScrollTo(index)"
      >
        {{ settingsElement.label }}
        <div
          :class="{
            'current-highlight': currentMenuStyle(index),
          }"
        ></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from '@vue/composition-api';
import {
  SimpleInput,
  SimpleSaveBar,
  SimpleModal,
} from '@simple-education-dev/components';
import { useScroll, useWindowScroll, useWindowSize } from '@vueuse/core';
import _ from 'lodash';

import store from '@/store';
import SettingsPageSkelton from './SettingsPageSkelton.vue';
import CustomSumissionMethods from './CustomSumissionMethods.vue';
import { SeamApiTeacher } from '@/api/endpoints';

export interface UserSettings {
  submissionMethods: string[];
  defaultIcon: string;
}
interface Menu {
  label: string;
  description: string;
  component: string;
}

export default defineComponent({
  components: {
    SimpleInput,
    SimpleSaveBar,
    SimpleModal,
    SettingsPageSkelton,
    CustomSumissionMethods,
  },
  setup() {
    const isLoading = ref(true);
    const settings = reactive<UserSettings>({
      submissionMethods: [],
      defaultIcon: 'default_icon',
    });
    const initialSettings = ref<UserSettings | null>(null);
    (async () => {
      const teacherId = 1234;
      const result = await SeamApiTeacher.getUserSettings(teacherId);
      settings.submissionMethods = result.data.submissionMethods;
      initialSettings.value = { ...settings };
      isLoading.value = false;
    })();
    const handleSettingsChange = (newSettings: string[]) => {
      console.log(newSettings);
      settings.submissionMethods = newSettings;
    };
    const isChanged = ref(false);
    watch(settings, () => {
      if (
        !_.isEqual(
          _.omit(initialSettings.value, ['__ob__']),
          _.omit(settings, ['__ob__'])
        )
      ) {
        store.dispatch('toCantTransitionTrue');
        isChanged.value = true;
      } else {
        store.dispatch('toCantTransitionFalse');
        isChanged.value = false;
      }
    });

    const nowSaving = ref(false);
    const handleOnSave = async () => {
      nowSaving.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      nowSaving.value = false;
    };
    const destructionModalOpen = ref(false);
    const handleDestructionModalOpen = () => {
      destructionModalOpen.value = true;
    };
    const handleDestructionModalDestroy = () => {
      destructionModalOpen.value = false;
    };
    const handleSettingsDestrunction = () => {
      Object.assign(settings, { ...initialSettings.value });
      destructionModalOpen.value = false;
    };
    const menus: Menu[] = [
      {
        label: 'カスタム提出方法',
        description:
          '生徒の端末上に表示する提出方法をカスタマイズできます。最大7個まで登録可能です。',
        component: 'CustomSumissionMethods',
      },
      {
        label: 'デフォルトアイコン設定',
        description:
          '提出物設定で初期値として選択されるアイコンです。メインページ右側から提出物を追加した時のアイコンにもなります。',
        component: 'SettingsPageSkelton',
      },
    ];

    const { height } = useWindowSize(window);
    const { y } = useWindowScroll(window);
    const currentMenu = ref(0);
    const elementRefs = ref<HTMLElement[]>([]);
    const scroll = useScroll(window);
    watch(scroll.y, () => {
      let closest = 0;
      // prettier-ignore
      elementRefs.value?.reduce(
        (prev, ref, index) => {
          const currentTop = ref.getBoundingClientRect().top;
          prev[index] = Math.abs(currentTop);
          if (prev[index] < prev[closest]) closest = index;
          return prev;
        },[0]);
      currentMenu.value = closest;
    });
    const handleScrollTo = async (index: number) => {
      const anchor = elementRefs.value[index].getBoundingClientRect().y;
      let scrollQuantity = y.value + anchor - height.value / 8;
      if (index === 0) scrollQuantity = 0;
      window.scrollTo({ top: scrollQuantity, behavior: 'smooth' });
    };

    const currentMenuStyle = (index: number) =>
      currentMenu.value === index
        ? { '--is-current-menu': 'rgba(255, 194, 85, 1)' }
        : undefined;

    return {
      settings,
      menus,
      handleSettingsChange,
      isChanged,
      nowSaving,
      handleOnSave,
      destructionModalOpen,
      handleDestructionModalOpen,
      handleDestructionModalDestroy,
      handleSettingsDestrunction,

      currentMenu,
      handleScrollTo,
      currentMenuStyle,
      elementRefs,
      isLoading,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
.settings-page-container {
  margin: 0 $space-6 $space-6 $space-6;
  display: grid;
  grid-template-rows: 100vh;
  grid-template-columns: 320px 1fr;
  // prettier-ignore
  grid-template-areas:
    "menu detail"
}
.detail-settings {
  padding-top: 80px;
  height: 100%;
  grid-area: detail;
}
.detail-settings-container {
  margin: 0 auto;
  width: 80%;
}
.description-container {
  text-align: left;
  font-size: $font-size-7;
  & p {
    font-size: $font-size-3;
  }
}
.settings-menu {
  position: fixed;
  grid-area: menu;
  display: inline-flex;
  flex-flow: column;
  align-items: baseline;
  padding: $space-4 $space-16;
  height: 100vh;
  box-shadow: 32px 0 30px -30px rgba(15, 26, 38, 0.08);
  box-sizing: border-box;
}
.settings-header {
  position: relative;
  display: inline-block;
  width: 100%;
  text-align: left;
  color: $surface-black;
  font-size: $font-size-5;
  text-decoration: none;
  margin: 20px 0;
  cursor: pointer;
}
.current-highlight {
  display: block;
  position: absolute;
  width: 3px;
  height: 150%;
  right: -$space-16;
  top: 50%;
  transform: translateY(-50%);
  border-radius: $border-radius-05;
  background: orange; //var(--is-current-menu);
  transition: background 0.2s;
}
</style>
