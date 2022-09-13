import {
  reactive,
  getCurrentInstance,
  computed,
  ref,
} from '@vue/composition-api';
// import { useStore } from '../../../store/useStore';
import { useI18n } from 'vue-i18n-bridge';
import { format, isToday, isTomorrow } from 'date-fns';
import {
  useRemainingDays,
  CyclePeriod,
} from '../compositions/useRemainingDays';

interface Assignment {
  title: string;
  descriptionHTML: string;
  deadlineDate: Date | null;
  deadlineTime: Date | null;
  submitOnHoliday: boolean;
}

export const useAssignmentDetailPage = () => {
  const instance = getCurrentInstance();
  const { t } = useI18n();
  const assignment = reactive<Assignment>({
    title: '',
    descriptionHTML: '',
    deadlineDate: null,
    deadlineTime: null,
    submitOnHoliday: false,
  });
  const isPreview = ref(false);
  (async () => {
    if (Object.keys(instance?.proxy.$route.query as object).length > 0) {
      isPreview.value = true;
      assignment.title = String(instance?.proxy.$route.query.title);
      assignment.descriptionHTML = String(
        instance?.proxy.$route.query.descriptionHTM
      );
      assignment.deadlineTime = new Date(
        String(instance?.proxy.$route.query.deadlineTime)
      );
      if (JSON.parse(String(instance?.proxy.$route.query.isRepeat))) {
        assignment.deadlineDate = await useRemainingDays(
          JSON.parse(
            String(instance?.proxy.$route.query.cyclePeriod)
          ) as CyclePeriod[],
          assignment.deadlineTime,
          JSON.parse(String(instance?.proxy.$route.query.submitOnHoliday))
        );
      } else {
        assignment.deadlineDate = new Date(
          String(instance?.proxy.$route.query.deadlineDate)
        );
      }
    }
  })();
  const formatDayInTranslate = (date: Date) => {
    return format(
      date,
      `MM${t('month')}dd${t('date')}(${t(format(date, 'eee'))}${t('day')})`
    );
  };
  const formatTimeInTranslate = (date: Date) => {
    return format(date, `HH${t('hours')}mm${t('minutes')}`);
  };
  const deadline = computed(() => {
    const date = () => {
      if (assignment.deadlineDate) {
        if (isToday(assignment.deadlineDate)) return t('today');
        if (isTomorrow(assignment.deadlineDate)) return t('tommorow');
        return formatDayInTranslate(assignment.deadlineDate);
      } else return '';
    };
    const time = () => {
      if (assignment.deadlineTime) {
        return formatTimeInTranslate(assignment.deadlineTime);
      } else return '';
    };
    return date() + '  ' + time();
  });
  const isSubmitted = ref(false);
  const submittedDate = ref('');
  return { isPreview, assignment, deadline, isSubmitted, submittedDate };
};
