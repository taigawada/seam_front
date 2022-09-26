<template>
  <div class="student-main-page">
    <div class="student-main-page-title">{{ $t('assignmentsList') }}</div>
    <SimpleSkelton body width="100%" height="80px" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SimpleSkelton } from '@simple-education-dev/components';

export default defineComponent({
  components: {
    SimpleSkelton,
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
.student-main-page {
  margin: $space-10;
}
.student-main-page-title {
  text-align: left;
  font-size: $font-size-8;
}
</style>
