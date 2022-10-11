<template>
  <div>
    <AssignmentDetailSettingsSkelton v-if="isExist === null" />
    <AssignmentDetailSettings
      v-else-if="isExist"
      :initialValue="initialValueRef"
      :submissionMethods="submissionMethods"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import { SimpleButton, SimpleToast } from '@simple-education-dev/components';
import router from '@/router';
import store from '@/store';
import JSONDecoder from '@/utilities/JSONDecoder';
import AssignmentDetailSettings from './AssignmentDetailSettings.vue';
import AssignmentDetailSettingsSkelton from './AssignmentDetailSettingsSkelton.vue';
import { AssignmentDetailSettings as AssignmentDetailSettingsType } from './useAssignmentDetailSettings';
import { SeamApiTeacher } from '@/api/endpoints';
import { isError } from 'lodash';

export default defineComponent({
  components: {
    AssignmentDetailSettings,
    AssignmentDetailSettingsSkelton,

    SimpleButton,
    SimpleToast,
  },
  props: {
    initialValue: {
      type: Object as PropType<AssignmentDetailSettingsType>,
      required: false,
    },
  },
  setup(props) {
    const isExist = ref<boolean | null>(null);
    const initialValueRef = ref<AssignmentDetailSettingsType | undefined>(
      props.initialValue ? props.initialValue : {}
    );
    const submissionMethods = ref<string[]>([]);
    const teacherId = store.getters.teacherId as number;
    (async () => {
      if (router.currentRoute.path === '/assignments/new') {
        const result = await SeamApiTeacher.getSubmissionMethods(teacherId);
        if (!isError(result)) {
          submissionMethods.value = result.data;
          isExist.value = true;
        } else {
          store.dispatch('setToast', {
            content:
              '提出方法の取得に失敗しました。時間をおいて再度お試しください。',
            isError: true,
          });
        }
      } else {
        const assignmentId = parseInt(router.currentRoute.params.assignmentId);
        const promises = [
          SeamApiTeacher.getAssignment(assignmentId),
          SeamApiTeacher.getSubmissionMethods(teacherId),
        ];
        const result = await Promise.all(promises);
        if (!result.some((res) => isError(res))) {
          initialValueRef.value =
            JSONDecoder.dateParse<AssignmentDetailSettingsType>(result[0].data);
          submissionMethods.value = result[1].data as string[];
          isExist.value = true;
        } else {
          store.dispatch('setToast', {
            content:
              '提出物、または提出方法の取得に失敗しました。時間をおいて再度お試しください。',
            isError: true,
          });
        }
      }
    })();
    return {
      isExist,
      initialValueRef,
      submissionMethods,
    };
  },
});
</script>
<style scoped lang="scss"></style>
