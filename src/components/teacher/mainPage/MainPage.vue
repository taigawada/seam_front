<template>
  <div v-if="isMainPage" class="main-page-container">
    <div class="landing-page-content">
      <div v-if="allAssignments.length === 0">
        <MainPageEmptyState />
      </div>
      <div v-else>
        <NotificationBanners :assignments="assignments" />
        <AssignmentResourcelist />
        <div class="assignments-resource-list">resource-list</div>
      </div>
    </div>
    <div class="main-page-buttons">
      <ActionsButton :onClick="handleAddAssignment" />
    </div>
    <div class="quick-assignment-add-card">
      <QuickAddAssignment />
    </div>
  </div>
  <div v-else>
    <assignmentDetailSettings />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { SimpleStack, SimpleButton } from '@simple-education-dev/components';

// mainPage
import NotificationBanners from './landingPage/NotificationBanners.vue';
import AssignmentResourcelist from './landingPage/AssignmentResourcelist.vue';
import QuickAddAssignment from './landingPage/QuickAddAssignment.vue';
import ActionsButton from './landingPage/ActionsButton.vue';
import MainPageEmptyState from './landingPage/MainPageEmptyState.vue';

import assignmentDetailSettings from './asignmentDetailSettings/assignmentDetailSettings.vue';

export default defineComponent({
  components: {
    SimpleStack,
    SimpleButton,
    NotificationBanners,
    AssignmentResourcelist,
    ActionsButton,
    QuickAddAssignment,
    MainPageEmptyState,
    assignmentDetailSettings,
  },
  setup() {
    const isMainPage = ref(true);
    const allAssignments: [] = [];
    const assignments = ['宿題1', '宿題2', '宿題3', '宿題4'];
    const handleAddAssignment = () => {
      isMainPage.value = false;
    };
    return {
      allAssignments,
      assignments,
      isMainPage,
      handleAddAssignment,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.main-page-container {
  height: 100vh;
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
