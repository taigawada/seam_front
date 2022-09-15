<template>
  <div class="main-page-container">
    <div class="landing-page-content">
      <NotificationCards :assignments="assignments" />
      <div v-if="allAssignments.length !== 0">
        <MainPageEmptyState />
      </div>
      <div v-else>
        <AssignmentResourcelist />
        <div class="assignments-resource-list">resource-list</div>
      </div>
    </div>
    <div class="main-page-buttons">
      <ActionsButton :onClick="transitionToAssignmentDetailSettingsPage" />
    </div>
    <div class="quick-assignment-add-card">
      <QuickAddAssignment @toDetailSettings="handleToDetailSettings" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useStore } from '../../../store/useStore';
import router from '@/router';
import { SimpleStack, SimpleButton } from '@simple-education-dev/components';

import { AssignmentDetailSettings as AssignmentDetailSettingsTypes } from './asignmentDetailSettings/useAssignmentDetailSettings';

// mainPage
import NotificationCards from './landingPage/NotificationCards.vue';
import AssignmentResourcelist from './landingPage/AssignmentResourcelist.vue';
import QuickAddAssignment from './landingPage/QuickAddAssignment.vue';
import ActionsButton from './landingPage/ActionsButton.vue';
import MainPageEmptyState from './landingPage/ResourcelistEmptyState.vue';

import AssignmentDetailSettings from './asignmentDetailSettings/AssignmentDetailSettings.vue';

// Skelton
import MainPageSkelton from './MainPageSkelton.vue';
import AssignmentDetailSettingsSkelton from './asignmentDetailSettings/AssignmentDetailSettingsSkelton.vue';

export default defineComponent({
  components: {
    SimpleStack,
    SimpleButton,
    MainPageSkelton,
    NotificationCards,
    AssignmentResourcelist,
    ActionsButton,
    QuickAddAssignment,
    MainPageEmptyState,
    AssignmentDetailSettings,
    AssignmentDetailSettingsSkelton,
  },
  setup(_, context) {
    const store = useStore(context);
    const initialValue = ref<AssignmentDetailSettingsTypes | null>({});
    store.dispatch('getHolidays');
    const allAssignments: [] = [];
    const assignments = ['宿題1', '宿題2', '宿題3', '宿題4'];
    const transitionToAssignmentDetailSettingsPage = () => {
      router.push({
        path: '/assignments/new',
      });
    };
    const transitionToMainPage = () => {
      // nowPage.value = 'mainPage';
    };
    const handleToDetailSettings = (
      currentSettings: AssignmentDetailSettingsTypes
    ) => {
      initialValue.value = currentSettings;
      router.push({
        name: 'newAssignmentDetailSettings',
        params: { initialValue: initialValue.value as string },
      });
    };
    return {
      allAssignments,
      assignments,
      transitionToAssignmentDetailSettingsPage,
      transitionToMainPage,
      initialValue,
      handleToDetailSettings,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.main-page-container {
  margin: 0 $space-6 $space-6 $space-6;
  display: grid;
  grid-template-rows: 80px 1fr;
  grid-template-columns: 1fr 380px;
  // prettier-ignore
  grid-template-areas: 
    "content   buttons"
    "content    card"
}
.main-page-buttons {
  margin-top: $space-8;
  grid-area: buttons;
  align-self: center;
}
.landing-page-content {
  grid-area: content;
  padding: $space-4;
}
.assignments-resource-list {
  background: lightcoral;
  height: 80vh;
}
.quick-assignment-add-card {
  grid-area: card;
}
</style>
