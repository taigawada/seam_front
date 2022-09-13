<template>
  <div class="assignment-detail-container">
    <div class="assignment-detail-header">
      <div class="assignment-detail-main-header">
        <SimpleButton
          normal
          :icon="ArrowLeft"
          iconSide="left"
          @click="handlePrevious"
        >
          {{ $t('back') }}
        </SimpleButton>
        <span class="assignment-detail-title">{{ assignment.title }}</span>
      </div>
      <div class="assignment-detail-sub-header">
        <SubmitButton
          :isSubmitted="isSubmitted"
          :onSubmit="handleOnSubmit"
          :onSubmitCancel="handleOnSubmitCancel"
          @success="handleSubmitSuccess"
          @failed="handleSubmitFailed"
        />
        <span style="color: rgba(53, 146, 185, 1)">
          {{ isSubmitted ? submittedDate : '' }}
        </span>
      </div>
    </div>
    <div class="assignment-detail-content">
      <p>
        {{ $t('deadline') }}:
        {{ deadline }}
      </p>
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
  height: 70px;
}
.assignment-detail-main-header {
  display: flex;
  align-items: center;
}
.assignment-detail-sub-header {
  text-align: end;
  display: block;
}
.assignment-detail-title {
  margin-left: $space-5;
  font-size: $font-size-10;
}
.assignment-detail-content {
  width: 80%;
  margin: 0 auto;
  text-align: left;
}
.assignment-detail-description {
  ::v-deep h1 {
    font-size: $font-size-8;
    font-weight: 600;
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
