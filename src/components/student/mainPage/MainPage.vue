<template>
  <div class="student-main-page">
    <div class="student-main-page-title">{{ $t('assignmentsList') }}</div>
    <StudentResourceCard
      v-for="assignment in assignmentsList"
      :key="assignment.id"
      :title="assignment.title"
      :deadline="new Date(assignment.deadline)"
      :author="assignment.author"
      @click="() => handleTransitionToAssignmentDetail(assignment.id)"
    />
  </div>
</template>
<script lang="ts">
import router from '@/router';
import { defineComponent, PropType } from '@vue/composition-api';
import { AssignmentList } from '../StudentLanding.vue';
import StudentResourceCard from './StudentResourceCard.vue';

export default defineComponent({
  components: {
    StudentResourceCard,
  },
  props: {
    assignmentsList: {
      type: Array as PropType<AssignmentList[]>,
      default: {},
      required: true,
    },
  },
  setup() {
    const handleTransitionToAssignmentDetail = (assignmentId: number) => {
      router.push({
        name: 'asiignmentDetailStudent',
        params: { assignmentId: String(assignmentId) },
      });
    };
    return {
      handleTransitionToAssignmentDetail,
    };
  },
});
</script>
<style scoped lang="scss">
.student-main-page {
  margin: var(--space-10);
}
.student-main-page-title {
  text-align: left;
  font-size: var(--font-size-8);
}
</style>
