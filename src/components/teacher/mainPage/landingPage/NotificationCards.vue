<template>
  <div class="main-page-empty-state">
    <div
      class="notification-cards-wrapper"
      @mouseenter="pause()"
      @mouseleave="resume()"
    >
      <div
        ref="notificationCardsContainer"
        class="notification-cards-container"
        :style="transformWidth"
        @pointerdown="handleDragStart"
      >
        <SimpleCard
          v-for="(i, index) in numberOfCards"
          :key="index"
          class="notification-card"
        >
          <h1>info card{{ i }}</h1>
        </SimpleCard>
      </div>
    </div>
    <InfoCardsPagination
      ref="paginationRef"
      class="notification-cards-pagination"
      :length="numberOfCards"
      :current="currentInfoCard"
      @change="handlePageChange"
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  watchEffect,
} from '@vue/composition-api';
import { SimpleCard, SimpleIcon } from '@simple-education-dev/components';
import {
  useElementBounding,
  useMousePressed,
  useMouse,
  useIntervalFn,
} from '@vueuse/core';
import InfoCardsPagination from './InfoCardsPagination.vue';

import SubmissionSammary from './notificationCards/SubmissionSammary.vue';

export default defineComponent({
  components: {
    SimpleCard,
    SimpleIcon,
    InfoCardsPagination,

    SubmissionSammary,
  },
  setup() {
    const numberOfCards = 3;
    const currentInfoCard = ref(0);
    const handleNextPage = () => {
      if (currentInfoCard.value === numberOfCards - 1) {
        currentInfoCard.value = 0;
      } else {
        currentInfoCard.value++;
      }
    };
    const handlePreviousPage = () => {
      if (currentInfoCard.value === 0) {
        currentInfoCard.value = numberOfCards - 1;
      } else {
        currentInfoCard.value--;
      }
    };
    const { pause, resume } = useIntervalFn(() => {
      handleNextPage();
    }, 4000);
    const handlePageChange = (index: number) => {
      resume();
      currentInfoCard.value = index;
    };
    const notificationCardsContainer = ref<HTMLElement | null>(null);
    const cardsContainerRect = useElementBounding(notificationCardsContainer);
    const { pressed } = useMousePressed({ target: notificationCardsContainer });
    const { x } = useMouse();
    const mousePositionXDragStart = ref<number | null>(null);
    const amountMousePositionX = ref<number>(0);

    watchEffect(() => {
      if (pressed.value) {
        pause();
        if (mousePositionXDragStart.value !== null) {
          const amountX = x.value - mousePositionXDragStart.value;
          if (amountX > cardsContainerRect.width.value / 4) {
            mousePositionXDragStart.value = null;
            amountMousePositionX.value = 0;
            handlePreviousPage();
          } else if (amountX < -cardsContainerRect.width.value / 4) {
            mousePositionXDragStart.value = null;
            amountMousePositionX.value = 0;
            handleNextPage();
          }
          amountMousePositionX.value = amountX;
        }
      } else {
        resume();
        mousePositionXDragStart.value = null;
        amountMousePositionX.value = 0;
      }
    });
    const handleDragStart = () => {
      mousePositionXDragStart.value = x.value;
    };
    const transformWidth = computed(() => ({
      '--transformX': `${
        -cardsContainerRect.width.value * currentInfoCard.value +
        amountMousePositionX.value
      }px`,
    }));
    return {
      pause,
      resume,
      numberOfCards,
      currentInfoCard,
      handleNextPage,
      handlePreviousPage,
      handlePageChange,
      notificationCardsContainer,
      cardsContainerRect,
      handleDragStart,
      mousePositionXDragStart,
      amountMousePositionX,
      transformWidth,
    };
  },
});
</script>
<style scoped lang="scss">
.notification-cards-wrapper {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
}
.notification-cards-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: unset;
  transform: translateX(var(--transformX));
  transition: transform 0.5s;
  backface-visibility: hidden;
}
.notification-card {
  flex-shrink: 0;
  margin: var(--space-5) 25px;
  width: calc(100% - 50px);
  height: 120px;
}
.notification-cards-pagination {
  margin-top: var(--space-2);
}
</style>
