<template>
  <div class="main-page-container">
    <div class="landing-page-content">
      <NotificationBanners :asignments="asignments" />
      <AsignmentResourcelist />
      <div class="asignments-resource-list">resource-list</div>
    </div>
    <div class="main-page-buttons">
      <ActionsButton :onClick="handleAddAsignment" />
    </div>
    <div class="quick-assignment-add-card">
      <QuickAddAsignment />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SimpleStack, SimpleButton } from '@simple-education-dev/components';
import NotificationBanners from './NotificationBanners.vue';
import AsignmentResourcelist from './AsignmentResourcelist.vue';
import QuickAddAsignment from './QuickAddAsignment.vue';
import ActionsButton from './ActionsButton.vue';

export default defineComponent({
  components: {
    SimpleStack,
    SimpleButton,
    NotificationBanners,
    AsignmentResourcelist,
    ActionsButton,
    QuickAddAsignment,
  },
  setup() {
    const asignments = ['宿題1', '宿題2', '宿題3', '宿題4'];
    const handleAddAsignment = () => {
      console.log('提出物追加');
    };
    return {
      asignments,
      handleAddAsignment,
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
  grid-area: buttons;
  align-self: center;
}
.landing-page-content {
  grid-area: content;
  padding: $space-4;
}
.asignments-resource-list {
  background: lightcoral;
  height: 80vh;
}
.quick-assignment-add-card {
  grid-area: card;
}
</style>
