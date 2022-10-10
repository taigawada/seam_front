<template>
  <div class="assignment-detail-container">
    <div class="assignment-detail-header">
      <div>
        <SimpleButton
          normal
          :icon="ArrowLeft"
          iconSide="left"
          @click="handlePrevious"
        >
          {{ $t('back') }}
        </SimpleButton>
      </div>
      <div class="assignment-detail-submit-button">
        <SubmitButton
          :isSubmitted="isSubmitted"
          :onSubmit="handleOnSubmit"
          :onSubmitCancel="handleOnSubmitCancel"
          @success="handleSubmitSuccess"
          @failed="handleSubmitFailed"
        />
        <span class="assignment-detail-submit-date">
          {{ isSubmitted ? submittedDate : '' }}
        </span>
      </div>
    </div>
    <div class="assignment-detail-title-container">
      <div class="assignment-detail-icon">ICON</div>
      <div class="assignment-detail-title">
        <component
          :is="isLoading ? 'SimpleSkeleton' : 'span'"
          body
          width="400px"
          height="15px"
        >
          {{ assignment.title }}
        </component>
      </div>
    </div>
    <div class="assignment-detail-deadline-container">
      <div class="assignment-detail-deadline">
        <div style="white-space: nowrap; margin-right: var(--space-4)">
          {{ $t('deadline') }}:
        </div>
        <component
          :is="isLoading ? 'SimpleSkeleton' : 'div'"
          body
          width="400px"
          height="15px"
        >
          {{ deadline }}
        </component>
      </div>
    </div>
    <div class="assignment-detail-content">
      <div
        style="
          box-sizing: border-box;
          height: 1px;
          border: 0.5px solid var(--text);
          margin: 10px 0;
        "
      ></div>
      <div
        v-if="!isLoading"
        class="assignment-detail-description"
        v-html="assignment.descriptionHTML"
      ></div>
      <SimpleSkeleton v-show="isLoading" text :line="8" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
// import { useStore } from '../../../store/useStore';
import { useAssignmentDetailPage } from './useAssignmentDetailPage';
import { useI18n } from 'vue-i18n-bridge';
import SimpleDate from '@/utilities/SimpleDate';
import { SimpleButton, SimpleSkeleton } from '@simple-education-dev/components';
import SubmitButton from './submitButton/SubmitButton.vue';
import { ArrowLeft } from '@simple-education-dev/icons';
import { format } from 'date-fns';
import router from '@/router';

export default defineComponent({
  components: {
    SimpleButton,
    SubmitButton,
    SimpleSkeleton,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    deadlineDate: {
      type: Date,
      required: false,
    },
    deadlineTime: {
      type: Date,
      required: false,
    },
    descriptionHTML: {
      type: String,
      default: '<p></p>',
      required: false,
    },
  },
  setup(_) {
    const { t } = useI18n();
    const {
      assignment,
      deadline,
      isPreview,
      isLoading,
      isSubmitted,
      submittedDate,
    } = useAssignmentDetailPage();
    const handlePrevious = () => {
      if (isPreview.value) {
        window.close();
      } else {
        router.push({ name: 'student' });
      }
    };
    const handleOnSubmit = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return JSON.stringify(SimpleDate.now);
    };
    const handleOnSubmitCancel = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return JSON.stringify(SimpleDate.now);
    };
    const handleSubmitSuccess = (time: string) => {
      isSubmitted.value = !isSubmitted.value;
      const submittedAt = new Date(JSON.parse(time));
      submittedDate.value = format(
        submittedAt,
        `MM${t('month')}dd${t('date')}(${t(format(submittedAt, 'eee'))}${t(
          'day'
        )})HH${t('hours')}mm${t('minutes')}${t('submittedIn')}`
      );
    };
    const handleSubmitFailed = (error: string) => {
      isSubmitted.value = false;
      console.error(error);
    };
    return {
      handlePrevious,
      isLoading,
      assignment,
      deadline,
      handleOnSubmit,
      handleOnSubmitCancel,
      isSubmitted,
      submittedDate,
      handleSubmitSuccess,
      handleSubmitFailed,
      ArrowLeft,
    };
  },
});
</script>
<style scoped lang="scss">
.assignment-detail-container {
  margin: var(--space-16) var(--space-6) var(--space-6) var(--space-6);
}
.assignment-detail-header {
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 71px;
}
.assignment-detail-submit-button {
  text-align: end;
  display: block;
}
.assignment-detail-title-container {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
}
.assignment-detail-deadline-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-deadline {
  display: inline-flex;
  align-items: center;
}
.assignment-detail-icon {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin-right: var(--space-4);
}
.assignment-detail-title {
  font-size: var(--font-size-10);
  text-align: left;
}
.assignment-detail-submit-date {
  color: rgba(53, 146, 185, 1);
  font-size: var(--font-size-4);
}
.assignment-detail-content {
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-description {
  ::v-deep h1 {
    font-size: var(--font-size-8);
    font-weight: 530;
  }
  ::v-deep h3 {
    margin: var(--space-2) 0;
    font-size: var(--font-size-7);
    font-weight: 500;
  }
  ::v-deep p {
    margin: var(--space-2) 0;
    font-size: var(--font-size-5);
  }
}
</style>
