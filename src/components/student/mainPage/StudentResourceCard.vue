<template>
  <div class="student-resource-card" @click="handleCardClick">
    <div class="student-resource-card-icon">ICON</div>
    <div class="student-resource-card-infomations">
      <div class="student-resource-card-title">{{ title }}</div>
      <div class="student-resource-card-sub-info">
        {{ $t('deadline') }}:{{ formatDateInTranslate(deadline) }}
      </div>
    </div>
    <div
      class="student-resource-card-deadline-notification"
      :style="deadlineNotificationColor"
    >
      {{ deadlineNotification }}
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from '@vue/composition-api';
import { isSameDay, format } from 'date-fns';
import { useI18n } from 'vue-i18n-bridge';
import SimpleDate from '@/utilities/SimpleDate';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  setup(props, context) {
    const { t } = useI18n();
    const deadlineNotification = computed(() => {
      if (SimpleDate.isPast(props.deadline)) {
        return t('overdue');
      } else if (isSameDay(props.deadline, SimpleDate.now())) {
        return t('untilToday');
      } else if (SimpleDate.isTomorrow(props.deadline)) {
        return t('untilTomorrow');
      } else {
        return '';
      }
    });
    const deadlineNotificationColor = computed(() => {
      if (SimpleDate.isPast(props.deadline)) {
        return { color: 'rgba(196, 0, 0, 1)' };
      } else if (isSameDay(props.deadline, SimpleDate.now())) {
        return { color: 'rgba(60, 130, 214, 1)' };
      } else if (SimpleDate.isTomorrow(props.deadline)) {
        return { color: 'rgba(60, 130, 214, 1)' };
      } else {
        return '';
      }
    });
    const formatDateInTranslate = (date: Date) => {
      return format(
        date,
        `MM${t('month')}dd${t('date')}(${t(format(date, 'eee'))}${t(
          'day'
        )}) HH${t('hours')}mm${t('minutes')}`
      );
    };
    const handleCardClick = () => {
      context.emit('click');
    };
    return {
      deadlineNotificationColor,
      deadlineNotification,
      formatDateInTranslate,
      handleCardClick,
    };
  },
});
</script>
<style scoped lang="scss">
.student-resource-card {
  display: flex;
  align-items: center;
  justify-content: left;
  position: relative;
  margin: var(--space-2) 0;
  width: 100%;
  height: 80px;
  border-radius: var(--border-radius-1);
  background: var(--surface);
  box-shadow: var(--box-shadow-1);
  cursor: pointer;
}
.student-resource-card:hover {
  background: var(--hovered);
}
.student-resource-card-icon {
  margin: 0 0 0 var(--space-4);
}

.student-resource-card-infomations {
  display: inline-block;
  text-align: left;
  flex: 1;
  margin: 0 0 0 var(--space-4);
}
.student-resource-card-title {
  font-size: var(--font-size-7);
}
.student-resource-card-sub-info {
  font-size: var(--font-size-4);
}
.student-resource-card-deadline-notification {
  font-size: var(--font-size-6);
  color: var(--text-error);
  margin: 0 var(--space-4) 0 0;
}
</style>
