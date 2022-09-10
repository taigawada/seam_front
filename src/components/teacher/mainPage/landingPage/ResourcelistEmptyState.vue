<template>
  <div>
    <img src="/src/assets/emptyState1.png" class="empty-state-img" />
    <h2>追加済みの課題がありません</h2>
    <p>課題を追加すると、ここに表示されます。</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.empty-state-img {
  margin-top: $space-10;
  width: 300px;
  filter: drop-shadow(0px 5px 20px rgba(42, 49, 57, 0.2));
}
h2 {
  font-weight: 500;
}
</style>
