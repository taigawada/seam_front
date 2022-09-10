import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';
import { dayOfWeekStr } from '@simple-education-dev/components';
import { format, isPast } from 'date-fns';

import _ from 'lodash';
import { Store } from 'vuex';

export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}
export interface AssignmentDetailSettings {
  title?: string;
  description?: string;
  deadline?: Date;
  submitMethod?: string;
  otherSubmitMethod?: string;
  isRepeat?: boolean;
  submitOnHoliday?: boolean;
  cyclePeriod?: Array<CyclePeriod>;
}
export const useAssignmentDetailSettings = (
  initial: AssignmentDetailSettings = {},
  store: Store<any>
) => {
  const CyclePeriodTransitionRef = ref<HTMLElement | null>(null);
  const initialSettings = ref(initial);
  const settings = reactive({
    title: initial.title ? initial.title : '',
    description: initial.description ? initial.description : '',
    deadline: initial.deadline,
    submitMethod: initial.submitMethod ? initial.submitMethod : '',
    otherSubmitMethod: initial.otherSubmitMethod
      ? initial.otherSubmitMethod
      : '',
    isRepeat: initial.isRepeat === undefined ? false : initial.isRepeat,
    submitOnHoliday:
      initial.submitOnHoliday === undefined ? false : initial.submitOnHoliday,
    cyclePeriod: initial.cyclePeriod ? initial.cyclePeriod : [],
  });
  // 変更検知のため、マウント時に初期値としてコピー
  onMounted(() => {
    initialSettings.value = { ...settings };
  });
  const deadlineDateInput = ref(
    initial.deadline === undefined ? '' : format(initial.deadline, 'MM月dd日')
  );
  const deadlineTimeInput = ref(
    initial.deadline === undefined ? '' : format(initial.deadline, 'HH:mm')
  );
  const deadlineTime = ref<Date | null>(null);
  const cyclePeriodPreview = ref(false);
  const cyclePeriodNowSetting = ref<boolean | null>(null);
  const isEachWeek = ref(true);
  const cylclePeriodSammarys = computed(() => {
    if (isEachWeek.value) {
      const result: { label: string; value: CyclePeriod }[] = [];
      settings.cyclePeriod!.map((cycle) => {
        result.push({
          label: `毎週${dayOfWeekStr(0, cycle.dayOfWeekIndex)}曜日`,
          value: cycle,
        });
      });
      return result.filter((elm, index, self) => {
        return self.map((el) => el.label).indexOf(elm.label) === index;
      });
    } else {
      const result: { label: string; value: CyclePeriod }[] = [];
      settings.cyclePeriod!.map((cycle) => {
        result.push({
          label: `第${cycle.weekIndex + 1}${dayOfWeekStr(
            0,
            cycle.dayOfWeekIndex
          )}曜日`,
          value: cycle,
        });
      });
      return result;
    }
  });
  const { isRepeat } = toRefs(settings);
  watch(isRepeat, () => {
    if (settings.isRepeat) {
      deadlineDateInput.value = '';
    }
  });
  const isChanged = ref(false);
  watch(settings, () => {
    if (
      !_.isEqual(
        _.omit(initialSettings.value, ['__ob__']),
        _.omit(settings, ['__ob__'])
      )
    ) {
      store.dispatch('toCantTransitionTrue');
      isChanged.value = true;
    } else {
      store.dispatch('toCantTransitionFalse');
      isChanged.value = false;
    }
  });
  const destructionModalOpen = ref(false);
  const validationErrors = ref<string[]>([]);
  const isValidating = ref(false);
  const studentPreviewErrors = computed(() => {
    const errors = [];
    if (isValidating.value) {
      if (!settings.title) errors.push('タイトルの入力は必須です。');
      if (!settings.isRepeat) {
        if (!deadlineDateInput.value) {
          errors.push('提出日を設定してください。');
        }
      } else {
        if (settings.cyclePeriod === undefined) {
          errors.push('繰り返す曜日を指定してください。');
        } else {
          if (!settings.cyclePeriod!.length)
            errors.push('繰り返す曜日を指定してください。');
        }
      }
      if (!deadlineTime.value) errors.push('締め切り時刻を指定してください。');
      if (settings.deadline ? isPast(settings.deadline) : false)
        errors.push('締め切りは未来の時間である必要があります。');
    }
    return errors;
  });
  const onSaveErrors = computed(() => {
    const errors = [];
    if (studentPreviewErrors.value.length) {
      errors.push(studentPreviewErrors.value);
      if (!settings.submitMethod) {
        errors.push('提出方法が設定されていません。');
      } else {
        if (settings.submitMethod === 'other') {
          if (!settings.otherSubmitMethod)
            errors.push('その他の提出方法を入力してください。');
        }
      }
    }
    return errors;
  });
  watch(studentPreviewErrors, () => {
    if (isValidating.value) {
      validationErrors.value = studentPreviewErrors.value;
    } else {
      validationErrors.value = [];
    }
  });
  return {
    CyclePeriodTransitionRef,
    initialSettings,
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
    isValidating,
    validationErrors,
    studentPreviewErrors,
    onSaveErrors,
  };
};
