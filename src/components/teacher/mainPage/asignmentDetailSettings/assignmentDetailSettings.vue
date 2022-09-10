<template>
  <AssignmentDetailSettingsSkelton
    v-if="initialValue === null"
    @previous="handlePreviousPage"
  />
  <div v-else class="settings-page-container">
    <SimpleSaveBar
      :open="isChanged"
      :saveButton="{
        label: '保存',
        loading: false,
        disabled: false,
      }"
      :discardButton="{
        label: '変更を破棄',
        onAction: handleDestructionModalOpen,
      }"
    />
    <SimpleModal
      :open="destructionModalOpen"
      title="全ての変更を破棄"
      :mainAction="{
        text: '破棄',
        isError: true,
        onAction: handleSettingsdestrunction,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleDestructionModalDestroy,
      }"
      @destroy="handleDestructionModalDestroy"
    >
      <p style="text-align: left">
        全ての変更が破棄され、元に戻すことはできません。
      </p>
    </SimpleModal>
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
        <div v-show="validationErrors.length > 0" class="valudation-banner">
          <SimpleStack class="validation-error-header" distribution="left">
            <SimpleIcon
              :source="ExclamationMark"
              fill="rgba(255, 121, 121, 1)"
            />
            <span class="validation-error-text">
              この提出物には{{ validationErrors.length }}個のエラーがあります。
            </span>
          </SimpleStack>
          <ul class="validation-error-list">
            <li v-for="error in validationErrors" :key="error">
              <span> {{ error }} </span>
            </li>
          </ul>
        </div>
        <SimpleInput
          caption="提出物タイトル"
          :value="settings.title ? settings.title : ''"
          :error="
            validationErrors.filter(
              (error) => error === 'タイトルの入力は必須です。'
            )[0]
          "
          @change:value="handleTitleChange"
        />
        <TipTapEditor
          caption="説明"
          placeholder="説明を入力..."
          :initialValue="settings.description"
          :value="settings.description"
          @change:editor="handleDescriptionChange"
        />
        <SimpleCheckbox
          label="繰り返し提出"
          :value="settings.isRepeat"
          @change="handleIsRepeatChange"
        />
        <Transition
          class="cycle-period-container"
          name="accordion"
          @enter="accordionEnter"
          @after-enter="accordionAfterEnter"
          @leave="accordionLeave"
          @after-leave="accordionAfterLeave"
        >
          <div
            v-if="cyclePeriodNowSetting"
            key="edit"
            class="cycle-period-accordion"
          >
            <div class="submit-on-holiday-checkbox-container">
              <SimpleCheckbox
                label="祝日は提出しない"
                :value="settings.submitOnHoliday"
                @change="handleSubmitOnHolidayChange"
              />
            </div>
            <WeeklySelector
              :isEachWeek="isEachWeek"
              :weekValue="settings.cyclePeriod"
              @change:week="handleCyclePeriodChange"
              @changeEach:day="handleChangeEachDay"
              @changeEach:week="handleChangeEachWeek"
            />
            <div class="detail-settings-preview-calender">
              <SimpleCalender
                :highLights="settings.cyclePeriod"
                :holidays="store.getters.holidays"
                :hiddenHighLightInHolidays="settings.submitOnHoliday"
              />
            </div>
            <SimpleButton
              normal
              :disabled="
                settings.cyclePeriod ? settings.cyclePeriod.length === 0 : true
              "
              @click="handleCyclePeriodSettingDone"
            >
              完了
            </SimpleButton>
          </div>

          <div v-else-if="cyclePeriodNowSetting === false" key="endEdit">
            <span>提出日</span>
            <div class="cylcle-period-sammary">
              <div class="cylcle-period-sammary-badges-container">
                <TransitionGroup name="badges">
                  <SimpleTag
                    v-for="sammary in cylclePeriodSammarys"
                    :key="sammary.label"
                    class="cylcle-period-sammary-badges"
                    @remove="handleCyclePeriodDelete(sammary.value)"
                  >
                    {{ sammary.label }}
                  </SimpleTag>
                </TransitionGroup>
              </div>
              <SimpleButton
                class="cylcle-period-edit-button"
                normal
                @click="handleCyclePeriodEdit"
              >
                編集
              </SimpleButton>
            </div>
            <p class="holiday-submit-status">
              {{
                settings.submitOnHoliday
                  ? '※ 祝日は提出しない'
                  : '※ 祝日も提出する'
              }}
            </p>
          </div>
        </Transition>
        <div style="height: 800px"></div>
      </div>
    </div>
    <div class="general-settings">
      <SimpleStack distribution="right" class="detail-settings-save-buttons">
        <SimpleButton normal @click="handleStudentPagePreview">
          生徒画面プレビュー
        </SimpleButton>
      </SimpleStack>
      <SimpleCard>
        <div class="general-settings-card">
          <SimpleDatePicker
            caption="提出日"
            :initialDate="settings.deadline"
            :disabled="settings.isRepeat"
            :inputValue="deadlineDateInput"
            :error="
              validationErrors.filter(
                (error) => error === '提出日を設定してください。'
              )[0]
            "
            @change:date="handleDeadlineDateChange"
          />
          <SimpleTimePicker
            caption="締め切り"
            :initialTime="settings.deadline"
            :inputValue="deadlineTimeInput"
            :error="
              validationErrors.filter(
                (error) =>
                  error === '締め切り時刻を指定してください。' ||
                  error === '締め切りは未来の時間である必要があります。'
              )[0]
            "
            @change:time="handleDeadlineTimeChange"
          />
          <div style="text-align: left; margin: 0.25rem 0">
            <SimpleSelector
              caption="提出方法"
              :value="settings.submitMethod"
              :items="submitMethod"
              @change:select="handleSubmitMethodChange"
            />
          </div>
          <SimpleInput
            v-show="settings.submitMethod === 'other'"
            captionHidden
            placeholder="提出方法"
            :value="settings.otherSubmitMethod"
            @change:value="handleOtherSubmitMethodChange"
          />
        </div>
      </SimpleCard>
    </div>
  </div>
</template>
<script lang="ts">
import router from '../../../../router';
import { defineComponent, PropType } from '@vue/composition-api';
import AssignmentDetailSettingsSkelton from './AssignmentDetailSettingsSkelton.vue';
import {
  useAssignmentDetailSettings,
  AssignmentDetailSettings,
  CyclePeriod,
} from './useAssignmentDetailSettings';
import { useAccordionAnimation } from '../../compositions/useAccordionAnimation/useAccordionAnimation';
import {
  SimpleSaveBar,
  SimpleButton,
  SimpleCard,
  SimpleInput,
  SimpleCheckbox,
  SimpleTimePicker,
  SimpleDatePicker,
  SimpleSelector,
  SimpleStack,
  WeeklySelector,
  SimpleCalender,
  SimpleIcon,
  SimpleTag,
  SimpleModal,
} from '@simple-education-dev/components';
import { useStore } from '../../../../store/useStore';
import TipTapEditor from '@/components/TipTapEditor/TipTapEditor.vue';
import {
  ArrowLeft,
  ArrowDown,
  ExclamationMark,
} from '@simple-education-dev/icons';
import {
  format,
  getDate,
  getHours,
  getMinutes,
  getMonth,
  getYear,
  set,
} from 'date-fns';

export default defineComponent({
  components: {
    AssignmentDetailSettingsSkelton,
    SimpleButton,
    SimpleCard,
    SimpleInput,
    TipTapEditor,
    SimpleCheckbox,
    WeeklySelector,
    SimpleStack,
    SimpleCalender,
    SimpleTimePicker,
    SimpleDatePicker,
    SimpleSelector,
    SimpleIcon,
    SimpleTag,
    SimpleSaveBar,
    SimpleModal,
  },
  props: {
    initialValue: {
      type: Object as PropType<AssignmentDetailSettings>,
      default: null,
      required: false,
    },
  },
  setup(props, context) {
    const store = useStore(context);
    const {
      settings,
      deadlineDateInput,
      deadlineTimeInput,
      deadlineTime,
      cyclePeriodPreview,
      cyclePeriodNowSetting,
      isEachWeek,
      cylclePeriodSammarys,
      isChanged,

      destructionModalOpen,
      initialSettings,
      isValidating,
      studentPreviewErrors,
      validationErrors,
    } = useAssignmentDetailSettings(props.initialValue, store);
    const handlePreviousPage = () => {
      context.emit('previous');
    };
    const handleStudentPagePreview = () => {
      isValidating.value = true;
      if (studentPreviewErrors.value.length === 0) {
        const previewPage = router.resolve({
          name: 'student-preview',
          query: {
            title: settings.title,
            descriptionHTML: settings.description,
            cyclePeriod: JSON.stringify(settings.cyclePeriod),
            isRepeat: JSON.stringify(settings.isRepeat),
            deadlineDate: settings.deadline?.toString(),
            deadlineTime: deadlineTime.value?.toString(),
          },
        });
        window.open(previewPage.href, '_blank');
        isValidating.value = false;
      }
    };
    const handleTitleChange = (newValue: string) => {
      settings.title = newValue;
    };
    const handleDescriptionChange = (newValue: string) => {
      settings.description = newValue;
    };

    // cycle period settings
    const handleIsRepeatChange = (newBoolean: boolean) => {
      if (newBoolean) cyclePeriodNowSetting.value = newBoolean;
      else cyclePeriodNowSetting.value = null;
      settings.isRepeat = newBoolean;
    };
    const handleSubmitOnHolidayChange = (newBoolean: boolean) => {
      settings.submitOnHoliday = newBoolean;
    };
    const handleCyclePeriodChange = (newValue: CyclePeriod[]) => {
      settings.cyclePeriod = newValue;
    };
    const handleChangeEachDay = () => {
      isEachWeek.value = false;
    };
    const handleChangeEachWeek = () => {
      isEachWeek.value = true;
    };
    const handleCyclePeriodSettingDone = () => {
      cyclePeriodNowSetting.value = false;
    };
    const handleCyclePeriodDelete = (cyclePeriod: CyclePeriod) => {
      if (isEachWeek.value) {
        settings.cyclePeriod = settings.cyclePeriod!.filter(
          (cycle) => cycle.dayOfWeekIndex !== cyclePeriod.dayOfWeekIndex
        );
      } else {
        settings.cyclePeriod = settings.cyclePeriod!.filter(
          (cycle) =>
            !(
              cycle.weekIndex === cyclePeriod.weekIndex &&
              cycle.dayOfWeekIndex === cyclePeriod.dayOfWeekIndex
            )
        );
      }
    };
    const handleCyclePeriodEdit = () => {
      cyclePeriodNowSetting.value = true;
    };

    // general settings
    const handleDeadlineDateChange = (newDate: Date) => {
      deadlineDateInput.value = format(newDate, 'MM月dd日');
      settings.deadline = set(
        settings.deadline
          ? settings.deadline
          : set(new Date(), { seconds: 0, milliseconds: 0 }),
        {
          year: getYear(newDate),
          month: getMonth(newDate),
          date: getDate(newDate),
        }
      );
    };
    const handleDeadlineTimeChange = (newTime: Date) => {
      deadlineTimeInput.value = format(newTime, 'HH:mm');
      deadlineTime.value = newTime;
      settings.deadline = set(
        settings.deadline
          ? settings.deadline
          : set(new Date(), { seconds: 0, milliseconds: 0 }),
        {
          hours: getHours(newTime),
          minutes: getMinutes(newTime),
        }
      );
    };
    const submitMethod = [
      {
        label: '朝のHRまでに回収',
        value: '朝のHRまでに回収',
      },
      {
        label: '帰りのHRで回収',
        value: '帰りのHRで回収',
      },
      {
        label: 'その他',
        value: 'other',
      },
    ];
    const handleSubmitMethodChange = (newValue: string) => {
      settings.submitMethod = newValue;
    };
    const handleOtherSubmitMethodChange = (newValue: string) => {
      settings.otherSubmitMethod = newValue;
    };
    const handleDestructionModalOpen = () => {
      destructionModalOpen.value = true;
    };
    const handleDestructionModalDestroy = () => {
      destructionModalOpen.value = false;
    };
    const handleSettingsdestrunction = () => {
      Object.assign(settings, { ...initialSettings.value });
      if (!initialSettings.value.isRepeat) {
        cyclePeriodNowSetting.value = null;
      }
      destructionModalOpen.value = false;
    };
    const {
      accordionEnter,
      accordionLeave,
      accordionAfterEnter,
      accordionAfterLeave,
    } = useAccordionAnimation();
    return {
      // core
      store,
      handlePreviousPage,
      isChanged,
      settings,

      // savebar
      destructionModalOpen,
      handleDestructionModalOpen,
      handleDestructionModalDestroy,
      handleSettingsdestrunction,

      // cycle period settings
      cyclePeriodPreview,
      cyclePeriodNowSetting,
      isEachWeek,
      cylclePeriodSammarys,

      // cycle period methods
      handleIsRepeatChange,
      handleSubmitOnHolidayChange,
      handleCyclePeriodChange,
      handleChangeEachDay,
      handleChangeEachWeek,
      handleCyclePeriodSettingDone,
      handleCyclePeriodDelete,
      handleCyclePeriodEdit,

      // detail settings
      handleTitleChange,
      handleDescriptionChange,

      // actions
      handleStudentPagePreview,

      // general settings
      deadlineDateInput,
      deadlineTimeInput,
      handleDeadlineDateChange,
      handleDeadlineTimeChange,
      submitMethod,
      handleSubmitMethodChange,
      handleOtherSubmitMethodChange,

      // animation
      accordionEnter,
      accordionLeave,
      accordionAfterEnter,
      accordionAfterLeave,

      // icons
      ArrowLeft,
      ArrowDown,
      ExclamationMark,
      validationErrors,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
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
  margin-right: $space-4;
  margin-bottom: $space-6;
}
.valudation-banner {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid $border-error;
  padding: $space-3 $space-2;
  border-radius: $border-radius-1;
  background: $surface-error-alpha;
  margin-bottom: $space-6;
}
.validation-error-header {
  margin-left: $space-2;
}
.validation-error-text {
  font-weight: 500;
  padding-top: 2px;
}
.validation-error-list {
  margin: $space-2 0;
  list-style-type: disc;
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

// cycle period
.cycle-period-container {
  margin: $space-4 0;
  border-top: 1px solid $surface-black;
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
  margin: $space-2;
}
.holiday-submit-status {
  margin-left: $space-3;
}
.badges-enter-active,
.badges-leave-active {
  position: absolute;
  transition: all 500ms;
}
.badges-enter,
.badges-leave-to {
  opacity: 0;
}
.badges-move {
  transition: all 200ms;
}

.general-settings {
  padding-top: $space-5;
  grid-area: general;
}
.general-settings-card {
  padding: $space-10 $space-10 $space-5 $space-10;
}
</style>
