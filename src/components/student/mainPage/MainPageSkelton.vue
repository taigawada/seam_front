<template>
  <div class="student-main-page">
    <div class="student-main-page-title">{{ $t('assignmentsList') }}</div>
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
    <SimpleSkeleton
      :size="{ width: '100%', height: '80px' }"
      style="margin: 4px 0"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SimpleSkeleton } from '@simple-education-dev/components';

export default defineComponent({
  components: {
    SimpleSkeleton,
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
