<template>
  <SimpleButton primary fill @click="onClick"> 提出物を追加 </SimpleButton>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SimpleButton } from '@simple-education-dev/components';

export default defineComponent({
  components: {
    SimpleButton,
  },
  props: {
    onClick: {
      type: Function,
      required: true,
    },
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.simple-banner {
  margin: $space-2 0;
}
</style>
