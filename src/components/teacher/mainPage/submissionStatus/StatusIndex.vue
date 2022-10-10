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
        <div class="submittion-status-header-text">
          {{ currentAssignment?.title }}
        </div>
        <SimpleTag v-show="!isLoading" success :remove="false">
          <span style="font-size: 0.825rem">{{ status }}</span>
        </SimpleTag>
      </div>
      <SimpleButton primary @click="handleConnectModalOpen">
        一括で評価する
      </SimpleButton>
    </div>
    <div class="submittion-status-summary-container">
      <div class="class-tab-base" :style="tabWidthStyle">
        <SimpleTabs
          :tabs="classes"
          :selected="currentClassesTabs"
          color="rgba(44, 62, 80, 1)"
          textColor="rgba(44, 62, 80, 1)"
          @change="handleClassesTabSelect"
        ></SimpleTabs>
      </div>
      <div class="submittion-status-summary">
        <div class="submittion-status-summary-box">
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'span'"
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            未提出
          </component>
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
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
          </component>
        </div>
        <div class="submittion-status-summary-box">
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'span'"
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            提出率
          </component>
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div class="summary-result">85%</div>
          </component>
        </div>
        <div class="submittion-status-summary-box">
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'span'"
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            全体平均提出率
          </component>
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div class="summary-result">82%</div>
          </component>
        </div>
        <div class="submittion-status-summary-box">
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'span'"
            class="status-summary-header"
            :size="{
              width: '40px',
              height: '10px',
            }"
          >
            累積平均提出率
          </component>
          <component
            :is="isLoading ? 'SimpleSkeleton' : 'div'"
            class="summary-result-container"
            :size="{
              width: '120px',
              height: '27px',
            }"
          >
            <div class="summary-result" style="margin-right: 16px">72.1%</div>
            <div :style="cumulativeAvgColor">
              {{ Math.abs(cumulativeAvg) }}%
            </div>
            <SimpleIcon
              :source="cumulativeAvg <= 0 ? ArrowTrendDown : ArrowTrendUp"
              :fill="cumulativeAvgColor.color"
            />
          </component>
        </div>
      </div>
    </div>
    <SimpleModal
      :open="connectModalOpen"
      title="外部プラグインに接続"
      :mainAction="{
        text: '完了',
        onAction: handlePreviousPage,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleConnectModalClose,
      }"
      @destroy="handleConnectModalClose"
    >
      <p style="text-align: left">aaa</p>
      <SimpleSelector
        radio
        :items="[
          { label: '1', id: 0 },
          { label: '2', id: 1 },
          { label: '3', id: 2 },
        ]"
        :value="'1'"
      />
    </SimpleModal>
    <SubmissionStatus
      v-if="!isEmpty"
      :loading="isLoading"
      :resources="currentResources"
      :classes="classes"
    />
    <div v-else>
      <img src="/src/public/emptyState1.png" class="empty-state-img" />
      <h2 class="empty-state-header">課題が提出されていません</h2>
      <p>提出状況は、ここに表示されます。</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import {
  SimpleButton,
  SimpleTabs,
  SimpleModal,
  SimpleSelector,
  SimpleIcon,
  SimpleTag,
  SimpleSkeleton,
} from '@simple-education-dev/components';
import {
  ArrowLeft,
  SearchFilter,
  SearchFilterSlash,
  ArrowTrendDown,
  ArrowTrendUp,
} from '@simple-education-dev/icons';
import { statusTranslate } from '../landingPage/AssignmentResourcelist.vue';
import SubmissionStatus from './StatusResourcelist.vue';
import { SeamApiTeacher } from '@/api/endpoints';
import JSONDecoder from '@/utilities/JSONDecoder';
import { AssignmentStatus } from './StatusResourcelist.vue';
import router from '@/router';
import { isError } from 'lodash';
import { ResourceListAssignment } from '../landingPage/AssignmentResourcelist.vue';
import { AxiosResponse } from 'axios';

export default defineComponent({
  components: {
    SimpleButton,
    SimpleTabs,
    SimpleModal,
    SimpleSelector,
    SubmissionStatus,
    SimpleTag,
    SimpleIcon,
    SimpleSkeleton,
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
    const currentAssignment = ref<ResourceListAssignment>();
    const resources = ref<AssignmentStatus[]>([]);
    const classes = ref([{ id: '', label: '-' }]);
    const currentClassesTabs = ref(0);
    const currentResources = computed(() =>
      resources.value.filter(
        (data) => data.room === classes.value[currentClassesTabs.value].id
      )
    );
    const isEmpty = ref(false);
    (async () => {
      isLoading.value = true;
      const assignmentId = parseInt(router.currentRoute.params.assignmentId);
      const promises = [
        SeamApiTeacher.getStatus(assignmentId),
        SeamApiTeacher.getAssignment(assignmentId),
      ];
      const result = await Promise.all(promises);
      const statuses = result[0] as AxiosResponse<AssignmentStatus[]>;
      const assignment = result[1] as AxiosResponse<ResourceListAssignment>;
      if (statuses.data.length) {
        resources.value = JSONDecoder.dateParse(
          statuses.data
        ) as AssignmentStatus[];
        classes.value = [
          ...new Set(statuses.data.map((data) => data.room)),
        ].map((room) => ({ id: room, label: room }));
        isLoading.value = false;
      } else {
        isEmpty.value = true;
      }
      if (!isError(assignment)) {
        currentAssignment.value = assignment.data;
      }
    })();
    const status = computed(() =>
      statusTranslate(
        currentAssignment.value?.status!,
        currentAssignment.value?.deadline!
      )
    );
    const handleClassesTabSelect = (select: number) => {
      currentClassesTabs.value = select;
    };
    const tabWidthStyle = computed(() => ({
      '--tab-width': `calc(100% - ${classes.value.length} * 100px)`,
    }));
    const isOnlyLate = ref(false);
    const cumulativeAvg = computed(() => 0);
    const cumulativeAvgColor = computed(() => {
      if (cumulativeAvg.value < 0) {
        return { color: 'rgba(196, 0, 0, 1)' };
      } else {
        return { color: 'rgba(0, 128, 96, 1)' };
      }
    });

    const connectModalOpen = ref(false);
    const handleConnectModalOpen = () => {
      connectModalOpen.value = !connectModalOpen.value;
    };
    const handleConnectModalClose = () => {
      connectModalOpen.value = false;
    };
    return {
      handlePreviousPage,
      isLoading,
      isEmpty,
      currentAssignment,
      resources,
      classes,
      currentClassesTabs,
      currentResources,
      status,

      handleClassesTabSelect,
      tabWidthStyle,

      isOnlyLate,
      cumulativeAvg,
      cumulativeAvgColor,

      connectModalOpen,
      handleConnectModalOpen,
      handleConnectModalClose,

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
.submittion-status-container {
  padding: 0 var(--space-6) var(--space-6) var(--space-6);
}
.submittion-status-header {
  padding: var(--space-4) 0;
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
  font-size: var(--font-size-8);
  margin-left: var(--space-4);
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
  border-bottom: 1px solid var(--border);
  z-index: -1;
}
.submittion-status-summary-container {
  border-radius: var(--border-radius-1);
  margin-bottom: var(--space-4);
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
  padding: var(--space-4) 0;
  color: #000000;
}
.status-summary-header {
  font-size: var(--font-size-4);
  margin-bottom: 10px;
}
.status-sammary-content {
  font-size: var(--font-size-6);
}
.summary-result-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary-result {
  font-size: var(--font-size-7);
}
.empty-state-img {
  margin-top: var(--space-10);
  width: 300px;
  filter: drop-shadow(0px 5px 20px rgba(42, 49, 57, 0.2));
}
</style>
