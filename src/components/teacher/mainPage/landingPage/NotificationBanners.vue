<template>
  <div>
    <SimpleBanner
      v-for="assignment in showAssignments"
      :key="assignment"
      class="simple-banner"
      title="今日までの提出物"
      :buttonLabel="'確認'"
    >
      <span class="simple-banner-inner-text">{{ assignment }}</span>
    </SimpleBanner>
    <SimpleStack v-show="surplusAssignments > 0" distribution="right">
      <span>その他 {{ surplusAssignments }}件</span>
      <SimpleButton plain @click="handleShowAllDeadline">
        {{ showAllDeadline ? '元に戻す' : '全て確認' }}
      </SimpleButton>
    </SimpleStack>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import {
  SimpleBanner,
  SimpleStack,
  SimpleButton,
} from '@simple-education-dev/components';

export default defineComponent({
  components: {
    SimpleBanner,
    SimpleStack,
    SimpleButton,
  },
  props: {
    assignments: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup(props) {
    const showAssignments = computed(() => props.assignments.splice(0, 3));
    const surplusAssignments = computed(() => {
      return props.assignments.length - 3;
    });
    surplusAssignments.value;
    const showAllDeadline = ref(false);
    const handleShowAllDeadline = () => {
      showAllDeadline.value = !showAllDeadline.value;
    };
    return {
      showAssignments,
      surplusAssignments,
      showAllDeadline,
      handleShowAllDeadline,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.simple-banner {
  margin: $space-2 0;
}
.simple-banner-inner-text {
  font-size: $font-size-6;
  font-weight: 500;
}
</style>
