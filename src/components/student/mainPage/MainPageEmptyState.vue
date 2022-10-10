<template>
  <div class="student-main-page">
    <div class="student-main-page-title">{{ $t('assignmentsList') }}</div>
    <h1>Empty</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({});
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
