<template>
  <div style="text-align: left">
    <SimpleSkeleton
      style="margin: var(--space-4) 0"
      :size="{ width: '30%', height: '30px' }"
      distribution="left"
    />
    <SimpleSkeleton
      :size="{ width: '80%', height: '20px' }"
      distribution="left"
    />

    <SimpleSkeleton type="text" :lines="6"></SimpleSkeleton>
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
<style scoped lang="scss"></style>
