<template>
  <div class="main-page-container">
    <div class="landing-page-content">
      <NotificationCards :assignments="assignments" />
      <div v-if="(isLoading ? loadingResource : assignments).length === 0">
        <img src="/src/public/emptyState1.png" class="empty-state-img" />
        <h2 class="empty-state-header">追加済みの課題がありません</h2>
        <p>課題を追加すると、ここに表示されます。</p>
      </div>
      <div v-else>
        <div class="assignments-resource-list">
          <AssignmentResourcelist
            :loading="isLoading"
            :assignments="isLoading ? loadingResource : assignments"
            @delete="handleAssignmentDelete"
          />
        </div>
      </div>
    </div>
    <div class="main-page-buttons">
      <SimpleButton
        primary
        fill
        @click="transitionToAssignmentDetailSettingsPage"
      >
        提出物を追加
      </SimpleButton>
    </div>
    <div class="quick-assignment-add-card">
      <QuickAddAssignment @toDetailSettings="handleToDetailSettings" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import router from '@/router';
import { SimpleStack, SimpleButton } from '@simple-education-dev/components';

import { AssignmentDetailSettings as AssignmentDetailSettingsTypes } from './asignmentDetailSettings/useAssignmentDetailSettings';

// mainPage
import NotificationCards from './landingPage/NotificationCards.vue';
import AssignmentResourcelist, {
  ResourceListAssignment,
} from './landingPage/AssignmentResourcelist.vue';
import QuickAddAssignment from './landingPage/QuickAddAssignment.vue';

import AssignmentDetailSettings from './asignmentDetailSettings/AssignmentDetailSettings.vue';

import { SeamApiTeacher } from '@/api/endpoints';
import JSONDecoder from '@/utilities/JSONDecoder';
import store from '@/store';

export default defineComponent({
  components: {
    SimpleStack,
    SimpleButton,
    NotificationCards,
    AssignmentResourcelist,
    QuickAddAssignment,
    AssignmentDetailSettings,
  },
  setup() {
    const loadingResource = [...new Array(6).fill({})];
    const isLoading = ref(false);
    const assignments = ref<ResourceListAssignment[]>([]);
    (async () => {
      isLoading.value = true;
      const result = await SeamApiTeacher.getAssignments(
        store.getters.teacherId as number
      );
      assignments.value = JSONDecoder.dateParse(result.data);
      isLoading.value = false;
    })();

    const transitionToAssignmentDetailSettingsPage = () => {
      router.push({
        name: 'newAssignmentDetailSettings',
        params: { initialValue: {} as string },
      });
    };
    const handleToDetailSettings = (
      currentSettings: AssignmentDetailSettingsTypes
    ) => {
      router.push({
        name: 'newAssignmentDetailSettings',
        params: { initialValue: currentSettings as string },
      });
    };
    const handleAssignmentDelete = async (ids: number[]) => {
      isLoading.value = true;
      const result = await SeamApiTeacher.deleteAssignment(ids);
      assignments.value = result.data;
      isLoading.value = false;
    };
    return {
      loadingResource,
      isLoading,
      assignments,
      transitionToAssignmentDetailSettingsPage,
      handleToDetailSettings,
      handleAssignmentDelete,
    };
  },
});
</script>
<style scoped lang="scss">
.main-page-container {
  margin: 0 var(--space-6) var(--space-6) var(--space-6);
  display: grid;
  grid-template-rows: 80px 1fr;
  grid-template-columns: 1fr 380px;
  // prettier-ignore
  grid-template-areas: 
    "content   buttons"
    "content    card"
}
.main-page-buttons {
  margin-top: var(--space-8);
  grid-area: buttons;
  align-self: center;
}
.landing-page-content {
  grid-area: content;
  padding: var(--space-4);
}
.empty-state-img {
  margin-top: var(--space-10);
  width: 300px;
  filter: drop-shadow(0px 5px 20px rgba(42, 49, 57, 0.2));
}
.empty-state-header {
  font-size: var(--font-size-7);
  font-weight: 500;
}
.assignments-resource-list {
  width: 95%;
  margin: 0 auto;
}
.quick-assignment-add-card {
  grid-area: card;
}
</style>
