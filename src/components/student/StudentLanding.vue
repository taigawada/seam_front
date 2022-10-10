<template>
  <div class="student">
    <MainPageSkelton v-if="assignmentsList === null" />
    <MainPageEmpty v-else-if="assignmentsList.length === 0" />
    <MainPage v-else :assignmentsList="assignmentsList" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { defineComponent, ref } from '@vue/composition-api';
import { SeamApiStudent } from '@/api/endpoints';
import MainPage from './mainPage/MainPage.vue';
import MainPageEmpty from './mainPage/MainPageEmptyState.vue';
import MainPageSkelton from './mainPage/MainPageSkelton.vue';
import store from '@/store';

export interface AssignmentList extends Vue {
  id: number;
  icon?: string;
  title: string;
  deadline: string;
  author: string;
}

export default defineComponent({
  components: { MainPage, MainPageSkelton, MainPageEmpty },
  props: {},
  setup() {
    const isFailed = ref(false);
    const assignmentsList = ref<AssignmentList[] | null>(null);
    (async () => {
      store.dispatch('setStudentId', 1);
      const studentId: number = store.getters.studentId;
      const result = await Promise.all([
        store.dispatch('getHolidays'),
        SeamApiStudent.getAllAssignments(studentId),
      ]).catch(() => {
        isFailed.value = true;
      });
      assignmentsList.value = result![1].data;
    })();
    return {
      isFailed,
      assignmentsList,
    };
  },
});
</script>
<style lang="scss" scoped></style>
