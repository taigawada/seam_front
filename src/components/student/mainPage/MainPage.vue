<template>
  <div>
    <p>{{ $t('allAssignments') }}</p>
    <StudentResourceCard />
    <StudentResourceCard />
    <StudentResourceCard />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import StudentResourceCard from './StudentResourceCard.vue';

export default defineComponent({
  components: {
    StudentResourceCard,
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
</style>
