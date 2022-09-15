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
@use '@simple-education-dev/tokens/styles' as *;
.student-main-page {
  margin: $space-10;
}
.student-main-page-title {
  text-align: left;
  font-size: $font-size-8;
}
</style>
