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
        <SimpleButton primary>
          {{ $t('selfSubmitCheck') }}
        </SimpleButton>
      </div>
    </div>
    <p>締め切り{{ deadline }}</p>
    <div
      class="assignment-detail-description"
      v-html="$route.query.descriptionHTML"
    ></div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  getCurrentInstance,
  onBeforeMount,
  computed,
} from '@vue/composition-api';
import { useI18n } from 'vue-i18n-bridge';
import { format, isToday, isTomorrow } from 'date-fns';
import {
  useRemainingDays,
  CyclePeriod,
} from '../compositions/useRemainingDays';
import { SimpleButton } from '@simple-education-dev/components';
import { ArrowLeft } from '@simple-education-dev/icons';

interface Assignment {
  title: string;
  descriptionHTML: string;
  deadlineDate: Date | null;
  deadlineTime: Date | null;
}

export default defineComponent({
  components: {
    SimpleButton,
  },
  setup() {
    const instance = getCurrentInstance();
    const { t } = useI18n();
    const handlePrevious = () => {
      window.close();
    };
    const assignment = reactive<Assignment>({
      title: '',
      descriptionHTML: '',
      deadlineDate: null,
      deadlineTime: null,
    });
    onBeforeMount(() => {
      assignment.title = instance?.proxy.$route.query.title as string;
      assignment.descriptionHTML = instance?.proxy.$route.query
        .descriptionHTML as string;
      if (JSON.parse(instance?.proxy.$route.query.isRepeat as string)) {
        assignment.deadlineDate = useRemainingDays(
          JSON.parse(
            instance?.proxy.$route.query.cyclePeriod as string
          ) as CyclePeriod[]
        );
      } else {
        assignment.deadlineDate = new Date(
          instance?.proxy.$route.query.deadlineDate as string
        );
      }

      assignment.deadlineTime = new Date(
        instance?.proxy.$route.query.deadlineTime as string
      );
    });
    const deadline = computed(() => {
      const date = () => {
        if (assignment.deadlineDate) {
          if (isToday(assignment.deadlineDate)) return t('today');
          if (isTomorrow(assignment.deadlineDate)) return t('tommorow');
          return format(
            assignment.deadlineDate,
            `MM${t('month')}dd${t('date')}(${t(
              format(assignment.deadlineDate, 'eee')
            )}${t('day')})`
          );
        } else return '';
      };
      const time = () => {
        if (assignment.deadlineTime) {
          return format(
            assignment.deadlineTime,
            `HH${t('hours')}mm${t('minutes')}`
          );
        } else return '';
      };
      return date() + '  ' + time();
    });
    return {
      handlePrevious,
      assignment,
      deadline,
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
  align-items: center;
  justify-content: space-between;
}
.assignment-detail-main-header {
  display: flex;
  align-items: center;
}
.assignment-detail-sub-header {
  display: flex;
  align-items: center;
}
.assignment-detail-title {
  margin-left: $space-5;
  font-size: $font-size-10;
}
.assignment-detail-description {
  width: 80%;
  margin: 0 auto;
  text-align: left;
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
