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
import router from '@/router';
import JSONDecoder from '@/utilities/JSONDecoder';
import AssignmentDetailSettings from './AssignmentDetailSettings.vue';
import AssignmentDetailSettingsSkelton from './AssignmentDetailSettingsSkelton.vue';
import { AssignmentDetailSettings as AssignmentDetailSettingsType } from './useAssignmentDetailSettings';
import { SeamApiTeacher } from '@/api/endpoints';

export default defineComponent({
  components: {
    AssignmentDetailSettings,
    AssignmentDetailSettingsSkelton,
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
    const teacherId = 123;
    (async () => {
      if (router.currentRoute.path === '/assignments/new') {
        const result = await SeamApiTeacher.getSubmissionMethods(teacherId);
        submissionMethods.value = result.data;
        isExist.value = true;
      } else {
        const assignmentId = parseInt(router.currentRoute.params.assignmentId);

        const promises = [
          SeamApiTeacher.getAssignment(assignmentId),
          SeamApiTeacher.getSubmissionMethods(teacherId),
        ];
        const result = await Promise.all(promises);
        if (result) {
          initialValueRef.value = JSONDecoder.dateParse(result[0].data);
          submissionMethods.value = result[1].data as string[];
          isExist.value = true;
        } else {
          isExist.value = false;
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
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
</style>
