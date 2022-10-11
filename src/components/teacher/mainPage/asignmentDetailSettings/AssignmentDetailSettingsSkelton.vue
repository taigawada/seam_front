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
        <SimpleSkeleton
          :size="{ width: '50%', height: '20px' }"
          distribution="left"
        />
        <SimpleSkeleton
          style="margin: var(--space-4) 0"
          :size="{ width: '100%', height: '30px' }"
        />
        <SimpleSkeleton
          style="margin: var(--space-4) 0"
          :size="{ width: '100%', height: '160px' }"
        />
        <SimpleSkeleton
          :size="{ width: '50%', height: '20px' }"
          distribution="left"
        />
        <SimpleSkeleton type="text" :lines="3"></SimpleSkeleton>
        <SimpleSkeleton type="text" :lines="3"></SimpleSkeleton>
      </div>
    </div>
    <div class="general-settings">
      <SimpleStack distribution="right" class="detail-settings-save-buttons">
        <SimpleButton normal disabled> 複製 </SimpleButton>
        <SimpleButton normal disabled>プレビュー</SimpleButton>
      </SimpleStack>
      <SimpleCard>
        <div class="general-settings-card">
          <SimpleSkeleton type="text" :lines="2" />
          <SimpleSkeleton
            style="margin: var(--space-8) 0"
            :size="{ width: '100%', height: '30px' }"
          />
        </div>
      </SimpleCard>
      <SimpleCard>
        <div class="general-settings-card">
          <SimpleSkeleton type="text" :lines="2" />
          <SimpleSkeleton
            style="margin: var(--space-8) 0"
            :size="{ width: '100%', height: '30px' }"
          />
          <SimpleSkeleton type="text" :lines="2" />
        </div>
      </SimpleCard>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import {
  SimpleSkeleton,
  SimpleButton,
  SimpleCard,
  SimpleStack,
} from '@simple-education-dev/components';
import { ArrowLeft } from '@simple-education-dev/icons';
import router from '@/router';
export default defineComponent({
  components: {
    SimpleButton,
    SimpleCard,
    SimpleSkeleton,
    SimpleStack,
  },
  setup(_) {
    const handlePreviousPage = () => {
      router.push({ name: 'teacherLanding' });
    };
    return { ArrowLeft, handlePreviousPage };
  },
});
</script>
<style scoped lang="scss">
.settings-page-container {
  margin: var(--space-6);
  display: grid;
  grid-template-rows: 100vh;
  grid-template-columns: 1fr 380px;
  // prettier-ignore
  grid-template-areas:
    "detail  general"
}
.detail-settings-save-buttons {
  margin-bottom: var(--space-6);
  margin-right: var(--space-4);
}
.detail-settings-container {
  padding-top: var(--space-5);
  grid-area: detail;
  text-align: left;
}
.detail-settings {
  max-width: 80%;
  margin: var(--space-5) auto;
}
.submit-on-holiday-checkbox-container {
  margin-left: var(--space-1);
}
.detail-settings-preview-calender {
  text-align: center;
  margin-bottom: var(--space-4);
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
  margin: var(--space-2) var(--space-2);
}
.general-settings {
  padding-top: var(--space-5);
  grid-area: general;
}
.general-settings-card {
  padding: var(--space-5);
}
</style>
