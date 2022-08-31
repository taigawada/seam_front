<template>
  <div class="assignments-resource-list-header">
    <SimpleStack distribution="spaceBetween" alignment="top">
      <SimpleStack
        distribution="spaceBetween"
        alignment="center"
        spacing="15px"
      >
        <template #default="style">
          <span class="assignments-resource-list-title" :style="style.spacing">
            提出物一覧
          </span>
          <div :style="style.spacing">
            <SimpleButton plain> 期限を過ぎた提出物を含めて表示 </SimpleButton>
          </div>
        </template>
      </SimpleStack>
      <SimpleActions
        :open="exportActionsOpen"
        :actions="exportWays"
        @click:activator="handleToggle"
        @close="handleClose"
      >
        エクスポート
      </SimpleActions>
    </SimpleStack>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import {
  SimpleStack,
  SimpleButton,
  SimpleActions,
} from '@simple-education-dev/components';

export default defineComponent({
  components: {
    SimpleStack,
    SimpleButton,
    SimpleActions,
  },
  setup() {
    const exportActionsOpen = ref(false);
    const exportWays = [
      {
        label: 'Excel形式でエクスポート',
        onAction: () => console.log('todo -> excel'),
      },
      {
        label: 'CSV形式でエクスポート',
        onAction: () => console.log('todo -> csv'),
      },
    ];
    const handleToggle = () => {
      exportActionsOpen.value = !exportActionsOpen.value;
    };
    const handleClose = () => {
      exportActionsOpen.value = false;
    };
    return {
      exportActionsOpen,
      exportWays,
      handleToggle,
      handleClose,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.assignments-resource-list-header {
  padding: $space-3;
}
.assignments-resource-list-title {
  font-size: $font-size-8;
}
</style>
