import { ref, computed } from '@vue/composition-api';
import { isPast, isValid } from 'date-fns';

export const useQuickAddAsignment = () => {
  const title = ref('');
  const deadlineInputValue = ref('');
  const deadline = ref<Date>();
  const method = ref('');
  const methods = [
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
  const otherMethods = ref('');
  const cantAdd = computed(() => {
    if (title.value.length === 0) return true;
    if (!isValid(deadline.value) && isPast(deadline.value!)) return true;
    if (method.value !== '') {
      if (method.value === 'other') {
        if (otherMethods.value.length !== 0) return true;
      }
    } else {
      return true;
    }
    return false;
  });
  return {
    title,
    deadline,
    deadlineInputValue,
    method,
    methods,
    otherMethods,
    cantAdd,
  };
};
