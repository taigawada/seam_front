<template>
  <div class="main-page-container">
    <div class="landing-page-content">
      <SimpleSkelton body width="90%" height="120px"></SimpleSkelton>
      <SimpleSkelton body width="30%" height="10px"></SimpleSkelton>
      <div>
        <SimpleSkelton heading></SimpleSkelton>
        <SimpleSkelton text :line="10"></SimpleSkelton>
      </div>
    </div>
    <div class="main-page-buttons">
      <ActionsButton :onClick="transitionToAddAssignmentPage" />
    </div>
    <div class="quick-assignment-add-card">
      <SimpleCard
        :mainAction="{ label: '追加', disabled: true }"
        :subAction="{ label: '詳細設定', disabled: true }"
      >
        <div style="margin: 40px">
          <SimpleSkelton text :line="2"></SimpleSkelton>
          <SimpleSkelton text :line="2"></SimpleSkelton>
          <SimpleSkelton text :line="2"></SimpleSkelton>
          <SimpleSkelton text :line="2"></SimpleSkelton>
        </div>
      </SimpleCard>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import {
  SimpleSkelton,
  SimpleCard,
  SimpleStack,
} from '@simple-education-dev/components';
import ActionsButton from './landingPage/ActionsButton.vue';

export default defineComponent({
  components: {
    SimpleSkelton,
    SimpleCard,
    SimpleStack,
    ActionsButton,
  },
  setup(_, context) {
    const transitionToAddAssignmentPage = () => {
      context.emit('toDetailSettings');
    };
    return {
      transitionToAddAssignmentPage,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.main-page-container {
  height: 100vh;
  margin: 0 $space-6 $space-6 $space-6;
  display: grid;
  grid-template-rows: 80px 1fr;
  grid-template-columns: 1fr 380px;
  // prettier-ignore
  grid-template-areas: 
    "content   buttons"
    "content    card"
}
.main-page-buttons {
  margin-top: $space-8;
  grid-area: buttons;
  align-self: center;
}
.landing-page-content {
  grid-area: content;
  padding: $space-4 $space-10;
}
.quick-assignment-add-card {
  margin-top: $space-8;
  grid-area: card;
}
</style>
