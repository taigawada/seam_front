<template>
  <div class="student">
    <MainPageSkelton v-if="assignmentsList === null" />
    <MainPageEmpty v-else-if="assignmentsList.length === 0" />
    <MainPage v-else :assignmentsList="assignmentsList" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useStore } from '../../store/useStore';
import { SeamApiStudent } from '@/api/endpoints';
import MainPage from './mainPage/MainPage.vue';
import MainPageEmpty from './mainPage/MainPageEmptyState.vue';
import MainPageSkelton from './mainPage/MainPageSkelton.vue';

export interface AssignmentList {
  id: number;
  icon?: string;
  title: string;
  deadline: string;
  author: string;
}

export default defineComponent({
  components: { MainPage, MainPageSkelton, MainPageEmpty },
  props: {},
  setup(_, context) {
    const store = useStore(context);
    const isFailed = ref(false);
    const assignmentsList = ref<AssignmentList[] | null>(null);
    (async () => {
      const result = await Promise.all([
        store.dispatch('getHolidays'),
        SeamApiStudent.getAllAssignments(123),
      ]).catch(() => {
        isFailed.value = true;
      });
      console.log(result![1].data);
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
