import { reactive, computed, ref } from '@vue/composition-api';
import { useI18n } from 'vue-i18n-bridge';
import { format } from 'date-fns';
import {
  useRemainingDays,
  CyclePeriod,
} from '../compositions/useRemainingDays';
import SimpleDate from '@/utilities/SimpleDate';
import router from '@/router';
import { SeamApiStudent } from '@/api/endpoints';
import { isError } from 'lodash';
import store from '@/store';

export interface StudentAssignment {
  title: string;
  descriptionHTML: string;
  deadlineDate: Date | null;
  deadlineTime: Date | null;
}

export const useAssignmentDetailPage = () => {
  const { t } = useI18n();
  const assignment = reactive<StudentAssignment>({
    title: '',
    descriptionHTML: '',
    deadlineDate: null,
    deadlineTime: null,
  });
  const isPreview = ref(false);
  const isLoading = ref(true);
  (async () => {
    const assignmentId = router.currentRoute.params.assignmentId;
    console.log(assignmentId);
    if (assignmentId !== undefined) {
      const studentId: number = store.getters.studentId;

      const result = await SeamApiStudent.getAssignments(
        parseInt(assignmentId),
        studentId
      );
      console.log(result.data);
      if (!isError(result)) {
        assignment.title = result.data.title;
        assignment.deadlineDate = result.data.deadline;
        assignment.deadlineTime = new Date(String(result.data.deadline));
        if (result.data.isRepeat) {
          assignment.deadlineDate = await useRemainingDays(
            result.data.cyclePeriod,
            result.data.deadline,
            result.data.submitOnHoliday
          );
        } else {
          assignment.deadlineDate = new Date(result.data.deadline);
        }
        assignment.descriptionHTML = result.data.descriptionHTML;
        isLoading.value = false;
      } else {
        /* エラーハンドリング */
      }
    } else {
      isLoading.value = false;
      const query = router.currentRoute.query;
      isPreview.value = true;
      assignment.title = String(query.title);
      assignment.descriptionHTML = String(query.descriptionHTM);
      assignment.deadlineTime = new Date(String(query.deadlineTime));
      if (JSON.parse(String(query.isRepeat))) {
        assignment.deadlineDate = await useRemainingDays(
          JSON.parse(String(query.cyclePeriod)) as CyclePeriod[],
          assignment.deadlineTime,
          JSON.parse(String(query.submitOnHoliday))
        );
      } else {
        assignment.deadlineDate = new Date(String(query.deadlineDate));
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
        if (SimpleDate.isToday(assignment.deadlineDate)) return t('today');
        if (SimpleDate.isTomorrow(assignment.deadlineDate))
          return t('tommorow');
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
  return {
    isPreview,
    isLoading,
    assignment,
    deadline,
    isSubmitted,
    submittedDate,
  };
};
