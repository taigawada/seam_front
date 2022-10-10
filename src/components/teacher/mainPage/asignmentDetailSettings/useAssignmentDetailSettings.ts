import {
  computed,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';
import { dayOfWeekStr } from '@simple-education-dev/components';
import { format, getHours, getMinutes, isPast, isValid } from 'date-fns';

import _ from 'lodash';
import { Store } from 'vuex';
import SimpleDate from '@/utilities/SimpleDate';

export interface CyclePeriod {
  weekIndex: number;
  dayOfWeekIndex: number;
}
export interface AssignmentDetailSettings {
  status?: 'draft' | 'active' | 'archived';
  releaseDate?: Date | null;
  assignedClasses?: string[];
  title?: string;
  description?: string;
  deadline?: Date;
  submissionMethod?: string;
  otherSubmissionMethod?: string;
  isRepeat?: boolean;
  submitOnHoliday?: boolean;
  cyclePeriod?: Array<CyclePeriod>;
  delayedSubmission?: boolean;
  delayedSubmissionDeadline?: Date | null;
}
export const useAssignmentDetailSettings = (
  initial: AssignmentDetailSettings = {},
  initialSubmissionMethods: string[],
  store: Store<any>
) => {
  const CyclePeriodTransitionRef = ref<HTMLElement | null>(null);
  const initialSettings = ref<AssignmentDetailSettings>(initial);
  const initialSubmissionMethod = () => {
    if (initial.submissionMethod) {
      if (initialSubmissionMethods.includes(initial.submissionMethod)) {
        return initial.submissionMethod;
      } else {
        return 'other';
      }
    } else {
      return '';
    }
  };
  const settings = reactive({
    status: initial.status ? initial.status : 'draft',
    releaseDate: isValid(initial.releaseDate) ? initial.releaseDate : null,
    assignedClasses: initial.assignedClasses ? initial.assignedClasses : [],
    title: initial.title ? initial.title : '',
    description: initial.description ? initial.description : '',
    deadline: isValid(initial.deadline) ? initial.deadline : undefined,
    submissionMethod: initialSubmissionMethod(),
    otherSubmissionMethod:
      initialSubmissionMethod() === 'other' ? initial.submissionMethod : '',
    isRepeat: initial.isRepeat === undefined ? false : initial.isRepeat,
    submitOnHoliday:
      initial.submitOnHoliday === undefined ? false : initial.submitOnHoliday,
    cyclePeriod: initial.cyclePeriod ? initial.cyclePeriod : [],
    delayedSubmission:
      initial.delayedSubmission === undefined
        ? false
        : initial.delayedSubmission,
    delayedSubmissionDeadline: isValid(initial.delayedSubmissionDeadline)
      ? initial.delayedSubmissionDeadline
      : null,
  });
  // 変更検知のため、マウント時に初期値としてコピー
  onMounted(() => {
    initialSettings.value = { ...settings };
  });
  const statuses = [
    { label: '下書き', value: 'draft' },
    { label: 'アクティブ', value: 'active' },
  ];
  const classesComboboxField = ref('');
  const classesComboboxOpen = ref(false);
  const classes = [
    '1年A組',
    '1年B組',
    '1年C組',
    '1年D組',
    '1年E組',
    '1年F組',
    '1年G組',
  ];
  const isReleseDateSet = ref(false);
  const releaseDateTemp = ref(new Date());
  const releaseDateInput = ref('');
  const releaseDateComputed = computed(() => {
    if (settings.releaseDate) {
      return format(settings.releaseDate, 'yyyy年MM月dd日 HH:mm');
    } else {
      return '';
    }
  });
  const deadlineDateInput = ref(
    initial.deadline === undefined ? '' : format(initial.deadline, 'MM月dd日')
  );
  const deadlineTimeInput = ref(
    initial.deadline === undefined ? '' : format(initial.deadline, 'HH:mm')
  );
  const deadlineTime = ref<Date | null>(
    initial.deadline ? initial.deadline : null
  );
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
  const delayedSubmissionDeadlineTime = reactive({
    meridiem: getHours(SimpleDate.now()) < 12 ? '午前' : '午後',
    hours:
      getHours(SimpleDate.now()) < 12
        ? getHours(SimpleDate.now())
        : getHours(SimpleDate.now()) % 12,
    minutes: getMinutes(SimpleDate.now()),
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
  const nowSaving = ref(false);
  const destructionModalOpen = ref(false);
  const validationErrors = ref<string[]>([]);
  const isValidatingStudentPreview = ref(false);
  const isValidatingOnsave = ref(false);
  const studentPreviewErrors = computed(() => {
    const errors = [];
    if (isValidatingStudentPreview.value) {
      if (!settings.title) errors.push('タイトルの入力は必須です。');
      if (!settings.isRepeat) {
        if (!deadlineDateInput.value) {
          errors.push('提出日を設定してください。');
        }
        if (settings.deadline ? isPast(settings.deadline) : false)
          errors.push('締め切りは未来の時間である必要があります。');
      } else {
        if (settings.cyclePeriod === undefined) {
          errors.push('繰り返す曜日を指定してください。');
        } else {
          if (!settings.cyclePeriod!.length)
            errors.push('繰り返す曜日を指定してください。');
        }
      }
      if (!deadlineTime.value) errors.push('締め切り時刻を指定してください。');
    }
    return errors;
  });
  const onSaveErrors = computed(() => {
    const errors = [];
    if (isValidatingOnsave.value) {
      errors.push(...studentPreviewErrors.value);
      if (!settings.submissionMethod) {
        errors.push('提出方法が設定されていません。');
      } else {
        if (settings.submissionMethod === 'other') {
          if (!settings.otherSubmissionMethod)
            errors.push('その他の提出方法を入力してください。');
        }
      }
      if (settings.assignedClasses.length < 1)
        errors.push('最低でも1つのクラスを割り当てる必要があります。');
    }
    return errors;
  });
  watch(studentPreviewErrors, () => {
    if (isValidatingStudentPreview.value) {
      validationErrors.value = studentPreviewErrors.value;
    } else {
      validationErrors.value = [];
    }
  });
  watch(onSaveErrors, () => {
    if (isValidatingOnsave.value) {
      validationErrors.value = onSaveErrors.value;
    } else {
      validationErrors.value = [];
    }
  });
  return {
    CyclePeriodTransitionRef,
    initialSettings,
    settings,
    statuses,

    classesComboboxField,
    classesComboboxOpen,
    classes,
    isReleseDateSet,
    releaseDateTemp,
    releaseDateInput,
    releaseDateComputed,

    deadlineDateInput,
    deadlineTimeInput,
    deadlineTime,
    cyclePeriodPreview,
    cyclePeriodNowSetting,
    isEachWeek,
    cylclePeriodSammarys,

    delayedSubmissionDeadlineTime,

    isChanged,
    nowSaving,
    destructionModalOpen,
    isValidatingStudentPreview,
    isValidatingOnsave,
    validationErrors,
    studentPreviewErrors,
    onSaveErrors,
  };
};
