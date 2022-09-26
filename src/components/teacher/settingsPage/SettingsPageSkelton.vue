<template>
  <div style="text-align: left">
    <SimpleSkelton heading width="30%" height="20px" />
    <SimpleSkelton body width="100%" height="20px" />

    <SimpleSkelton text :line="6"></SimpleSkelton>
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
</style>
