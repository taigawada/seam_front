<template>
  <div class="main-page-empty-state">
    <div class="info-cards-container">
      <SimpleIcon :source="ArrowLeft" clickable />
      <SimpleCard width="90%">
        <h1>info</h1>
      </SimpleCard>
      <SimpleIcon :source="ArrowRight" clickable />
    </div>
    <InfoCardsPagination
      class="info-cards-pagination"
      :length="4"
      :current="1"
    />
    <div>
      <img src="/src/assets/emptyState1.png" class="empty-state-img" />
      <h2>追加済みの課題がありません</h2>
      <p>課題を追加すると、ここに一覧表示されます。</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { SimpleCard, SimpleIcon } from '@simple-education-dev/components';
import { ArrowLeft, ArrowRight } from '@simple-education-dev/icons';
import InfoCardsPagination from './InfoCardsPagination.vue';

export default defineComponent({
  components: {
    SimpleCard,
    SimpleIcon,
    InfoCardsPagination,
  },
  setup() {
    return {
      ArrowLeft,
      ArrowRight,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
h2 {
  font-family: Arial, Helvetica, sans-serif;
}
.empty-state-img {
  margin-top: $space-10;
  width: 300px;
}
.info-cards-container {
  margin-top: $space-5;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.info-cards-pagination {
  margin-top: $space-4;
}
</style>
