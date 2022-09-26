<template>
  <div class="submittion-status-container">
    <div class="submittion-status-header">
      <div class="right-side-elements">
        <SimpleButton
          normal
          :icon="ArrowLeft"
          iconSide="left"
          @click="handlePreviousPage"
        >
          戻る
        </SimpleButton>
        <div class="submittion-status-header-text">サンプル課題1</div>
      </div>
      <SimpleButton primary> 一括で評価する </SimpleButton>
    </div>

    <div class="submittion-status-summary-container">
      <div class="class-tab-base" :style="tabWidthStyle">
        <SimpleTabs
          :tabs="classes"
          :selected="currentClassesTabs"
          color="rgba(44, 62, 80, 1)"
          @change="handleClassesTabSelect"
        ></SimpleTabs>
      </div>
      <div class="submittion-status-summary">
        <div class="submittion-status-summary-box">
          <div class="status-summary-header">未提出</div>
          <div class="summary-result-container">
            <div
              class="summary-result"
              style="font-size: 18px; margin-right: 16px"
            >
              4人
            </div>
            <SimpleIcon
              :source="isOnlyLate ? SearchFilterSlash : SearchFilter"
              size="18px"
              clickable
              @click="() => (isOnlyLate = !isOnlyLate)"
            />
          </div>
        </div>
        <div class="submittion-status-summary-box">
          <div class="status-summary-header">提出率</div>
          <div class="summary-result-container">
            <div class="summary-result">85%</div>
          </div>
        </div>
        <div class="submittion-status-summary-box">
          <div class="status-summary-header">全体平均提出率</div>
          <div class="summary-result-container">
            <div class="summary-result">82%</div>
          </div>
        </div>
        <div class="submittion-status-summary-box">
          <div class="status-summary-header">累積平均提出率</div>
          <div class="summary-result-container">
            <div class="summary-result" style="margin-right: 16px">72.1%</div>
            <div :style="cumulativeAvgColor">
              {{ Math.abs(cumulativeAvg) }}%
            </div>
            <SimpleIcon
              :source="cumulativeAvg < 0 ? ArrowTrendDown : ArrowTrendUp"
              :fill="cumulativeAvgColor.color"
            />
          </div>
        </div>
      </div>
    </div>
    <SubmissionStatus
      :loading="isLoading"
      :resources="currentResources"
      :classes="classes"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import {
  SimpleButton,
  SimpleTabs,
  SimpleIcon,
} from '@simple-education-dev/components';
import {
  ArrowLeft,
  SearchFilter,
  SearchFilterSlash,
  ArrowTrendDown,
  ArrowTrendUp,
} from '@simple-education-dev/icons';
import SubmissionStatus from './StatusResourcelist.vue';
import { SeamApiTeacher } from '@/api/endpoints';
import JSONDecoder from '@/utilities/JSONDecoder';
import { AssignmentStatus } from './StatusResourcelist.vue';
import router from '@/router';

export default defineComponent({
  components: {
    SimpleButton,
    SimpleTabs,
    SubmissionStatus,
    SimpleIcon,
  },
  props: {
    previous: {
      type: String as PropType<'teacherLanding' | 'assignmentsList'>,
      default: 'teacherLanding',
      required: false,
    },
  },
  setup(props) {
    const handlePreviousPage = () => {
      router.push({ name: props.previous });
    };
    const isLoading = ref(true);
    const resources = ref<AssignmentStatus[]>([]);
    const classes = ref([{ label: '-', id: '' }]);
    const currentClassesTabs = ref(0);
    const currentResources = computed(() =>
      resources.value.filter(
        (data) => data.room === classes.value[currentClassesTabs.value].id
      )
    );

    (async () => {
      isLoading.value = true;
      const assignmentId = parseInt(router.currentRoute.params.assignmentId);
      const result = await SeamApiTeacher.getStatus(assignmentId);
      resources.value = JSONDecoder.dateParse(
        result.data
      ) as AssignmentStatus[];
      classes.value = [...new Set(result.data.map((data) => data.room))].map(
        (room) => ({ id: room, label: room })
      );
      isLoading.value = false;
    })();
    const handleClassesTabSelect = (select: number) => {
      currentClassesTabs.value = select;
    };
    const tabWidthStyle = computed(() => ({
      '--tab-width': `calc(100% - ${classes.value.length} * 100px)`,
    }));
    const isOnlyLate = ref(false);
    const cumulativeAvg = computed(() => 0.1);
    const cumulativeAvgColor = computed(() => {
      if (cumulativeAvg.value < 0) {
        return { color: 'rgba(196, 0, 0, 1)' };
      } else {
        return { color: 'rgba(0, 128, 96, 1)' };
      }
    });
    return {
      handlePreviousPage,
      isLoading,
      resources,
      classes,
      currentClassesTabs,
      currentResources,

      handleClassesTabSelect,
      tabWidthStyle,

      isOnlyLate,
      cumulativeAvg,
      cumulativeAvgColor,

      ArrowLeft,
      SearchFilter,
      SearchFilterSlash,
      ArrowTrendDown,
      ArrowTrendUp,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
.submittion-status-container {
  padding: 0 $space-6 $space-6 $space-6;
}
.submittion-status-header {
  padding: $space-4 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.right-side-elements {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.submittion-status-header-text {
  font-size: $font-size-8;
  margin-left: $space-4;
}
.class-tab-base {
  position: relative;
  padding-right: var(--tab-width);
  z-index: 0;
}
.class-tab-base::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  display: block;
  border-bottom: 1px solid $border;
  z-index: -1;
}
.submittion-status-summary-container {
  border-radius: $border-radius-1;
  margin-bottom: $space-4;
  background-image: linear-gradient(
    135deg,
    rgb(219, 229, 255),
    rgb(234, 255, 238)
  );
}
.submittion-status-summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.submittion-status-summary-box {
  padding: $space-4 0;
  color: #000000;
}
.status-summary-header {
  font-size: $font-size-4;
}
.status-sammary-content {
  font-size: $font-size-6;
}
.summary-result-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-result {
  font-size: $font-size-7;
}
</style>
