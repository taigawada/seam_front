<template>
  <div class="settings-page-container">
    <div class="detail-settings-container">
      <SimpleButton
        normal
        :icon="ArrowLeft"
        iconSide="left"
        @click="handlePreviousPage"
      >
        戻る
      </SimpleButton>
      <div class="detail-settings">
        <SimpleSkelton heading />
        <SimpleSkelton body width="100%" height="20px" />
        <SimpleSkelton body width="100%" height="100px" />
        <SimpleSkelton heading />
        <div>
          <SimpleSkelton text :line="5"></SimpleSkelton>
        </div>
        <SimpleSkelton text :line="5"></SimpleSkelton>
      </div>
    </div>
    <div class="general-settings">
      <SimpleStack distribution="center" class="detail-settings-save-buttons">
        <SimpleButton normal disabled> 生徒画面プレビュー </SimpleButton>
        <SimpleButton primary disabled>保存</SimpleButton>
      </SimpleStack>
      <SimpleCard>
        <div class="general-settings-card">
          <SimpleSkelton text :line="2" />
          <SimpleSkelton text :line="2" />
        </div>
      </SimpleCard>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import {
  SimpleSkelton,
  SimpleButton,
  SimpleCard,
  SimpleStack,
} from '@simple-education-dev/components';
import { ArrowLeft } from '@simple-education-dev/icons';
export default defineComponent({
  components: {
    SimpleButton,
    SimpleCard,
    SimpleSkelton,
    SimpleStack,
  },
  setup(_, context) {
    const handlePreviousPage = () => {
      context.emit('previous');
    };
    return { ArrowLeft, handlePreviousPage };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
.settings-page-container {
  margin: $space-6;
  display: grid;
  grid-template-rows: 100vh;
  grid-template-columns: 1fr 380px;
  // prettier-ignore
  grid-template-areas:
    "detail  general"
}
.detail-settings-save-buttons {
  margin-bottom: $space-6;
  margin-right: $space-4;
}
.detail-settings-container {
  padding-top: $space-5;
  grid-area: detail;
  text-align: left;
}
.detail-settings {
  max-width: 80%;
  margin: $space-5 auto;
}
.submit-on-holiday-checkbox-container {
  margin-left: $space-1;
}
.detail-settings-preview-calender {
  text-align: center;
  margin-bottom: $space-4;
}
.cylcle-period-sammary {
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.cylcle-period-sammary-badges-container {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
}
.cylcle-period-sammary-badges {
  margin: $space-2 $space-2;
}
.general-settings {
  padding-top: $space-5;
  grid-area: general;
}
.general-settings-card {
  padding: $space-5;
}
</style>
