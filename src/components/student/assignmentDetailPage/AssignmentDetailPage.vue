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
        {{ assignment.title }}
      </div>
    </div>
    <p class="assignment-detail-deadline">
      {{ $t('deadline') }}:
      {{ deadline }}
    </p>
    <div class="assignment-detail-content">
      <div
        style="
          box-sizing: border-box;
          height: 1px;
          border: 0.5px solid rgba(0, 0, 0, 0.3);
          margin: 10px 0;
        "
      ></div>
      <div
        class="assignment-detail-description"
        v-html="$route.query.descriptionHTML"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
// import { useStore } from '../../../store/useStore';
import { useAssignmentDetailPage } from './useAssignmentDetailPage';
import { useI18n } from 'vue-i18n-bridge';
import { nowDateInJST } from '../compositions/useRemainingDays';
import { SimpleButton } from '@simple-education-dev/components';
import SubmitButton from './submitButton/SubmitButton.vue';
import { ArrowLeft } from '@simple-education-dev/icons';
import { format } from 'date-fns';

export default defineComponent({
  components: {
    SimpleButton,
    SubmitButton,
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
    const { assignment, deadline, isPreview, isSubmitted, submittedDate } =
      useAssignmentDetailPage();
    const handlePrevious = () => {
      if (isPreview.value) {
        window.close();
      }
    };
    const handleOnSubmit = async () => {
      await new Promise((reresolve) => setTimeout(reresolve, 2000));
      return '提出';
    };
    const handleOnSubmitCancel = async () => {
      await new Promise((reresolve) => setTimeout(reresolve, 500));
      return '取り消し';
    };
    const handleSubmitSuccess = (result: string) => {
      isSubmitted.value = !isSubmitted.value;
      submittedDate.value = format(
        nowDateInJST,
        `MM${t('month')}dd${t('date')}(${t(format(nowDateInJST, 'eee'))}${t(
          'day'
        )})HH${t('hours')}mm${t('minutes')}${t('submittedIn')}`
      );
      console.log(result);
    };
    const handleSubmitFailed = (error: string) => {
      isSubmitted.value = false;
      console.error(error);
    };
    return {
      handlePrevious,
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
@use '@simple-education-dev/tokens/styles' as *;
.assignment-detail-container {
  margin: $space-16 $space-6 $space-6 $space-6;
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
}
.assignment-detail-deadline {
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-icon {
  width: 40px;
  height: 40px;
}
.assignment-detail-title {
  font-size: $font-size-10;
  text-align: left;
}
.assignment-detail-submit-date {
  color: rgba(53, 146, 185, 1);
  font-size: $font-size-4;
}
.assignment-detail-content {
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-description {
  ::v-deep h1 {
    font-size: $font-size-8;
    font-weight: 530;
  }
  ::v-deep h3 {
    margin: $space-2 0;
    font-size: $font-size-7;
    font-weight: 500;
  }
  ::v-deep p {
    margin: $space-2 0;
    font-size: $font-size-5;
  }
}
</style>
