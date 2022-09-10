<template>
  <div class="student-previrew">
    <div v-html="$route.query.descriptionHTML"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  props: {},
  setup(_, ctx) {
    const descriptionHTML = ctx.root.$route.query.descriptionHTML;
    return {
      descriptionHTML,
    };
  },
});
</script>
<style lang="scss">
.student-previrew {
  width: 70%;
  margin: 0 auto;
  text-align: left;
}
</style>
