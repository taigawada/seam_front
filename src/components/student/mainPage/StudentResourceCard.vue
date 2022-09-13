<template>
  <div class="student-resource-card"></div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.student-resource-card {
  margin: $space-2 0;
  width: 100%;
  height: 80px;
  border-radius: $border-radius-1;
  background: $surface;
  box-shadow: $box-shadow-1;
}
</style>
