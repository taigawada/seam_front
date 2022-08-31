<template>
  <div class="settings-page-container">
    <div class="detail-settings"></div>
    <div class="general-settings"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.settings-page-container {
  margin: $space-6;
  display: grid;
  grid-template-rows: 100vh;
  grid-template-columns: 1fr 380px;
  // prettier-ignore
  grid-template-areas: 
    "detail  general"
}
.detail-settings {
  grid-area: detail;
  background: lightcoral;
}
.general-settings {
  grid-area: general;
  background: lightsalmon;
}
</style>
