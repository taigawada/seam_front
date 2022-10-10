<template>
  <SimpleCard
    class="quick-add-assigment-card"
    :mainAction="{
      label: '追加',
      disabled: cantAdd,
    }"
    :subAction="{
      label: '詳細設定',
      onAction: toDetailSettings,
    }"
  >
    <div class="quick-add-assigment-card-content">
      <SimpleInput
        :value="title"
        :maxlength="title.length < 40 ? undefined : 50"
        caption="提出物タイトル"
        @change="handleTitleChange"
      />
      <SimpleDateTimePicker
        caption="提出期限"
        :inputValue="deadlineInputValue"
        @change="handleDeadlineChange"
      />
      <SimpleSelector
        caption="提出方法"
        :value="submitMethod"
        :items="methods"
        @change="handleMethodChange"
      />
      <TipTapEditor
        caption="説明"
        placeholder="説明を入力..."
        :value="discription"
        @change:editor="handleDiscriptionChange"
      />
    </div>
  </SimpleCard>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useQuickAddAssignment } from './useQuickAddAssignment';
import TipTapEditor from '../../../TipTapEditor/TipTapEditor.vue';
import {
  SimpleCard,
  SimpleInput,
  SimpleDateTimePicker,
  SimpleSelector,
} from '@simple-education-dev/components';
import { format } from 'date-fns';

export default defineComponent({
  components: {
    SimpleCard,
    SimpleInput,
    SimpleDateTimePicker,
    SimpleSelector,
    TipTapEditor,
  },
  setup(_, context) {
    const { title, deadline, deadlineInputValue, submitMethod, cantAdd } =
      useQuickAddAssignment();
    const methods = [
      {
        label: '朝のHRまでに回収',
        value: '朝のHRまでに回収',
      },
      {
        label: '帰りのHRで回収',
        value: '帰りのHRで回収',
      },
    ];
    const handleTitleChange = (newValue: string) => {
      title.value = newValue;
    };
    const handleDeadlineChange = (newValue: Date) => {
      deadline.value = newValue;
      deadlineInputValue.value = format(newValue, 'yyyy年MM月dd日HH時mm分');
    };
    const handleMethodChange = (newValue: string) => {
      submitMethod.value = newValue;
    };
    const discription = ref<object | null>(null);
    const handleDiscriptionChange = (newValue: object) => {
      discription.value = newValue;
    };
    const toDetailSettings = () => {
      context.emit('toDetailSettings', {
        status: 'draft',
        title: title.value,
        description: discription.value,
        deadline: deadline.value,
        submitMethod: submitMethod.value,
      });
    };

    return {
      title,
      deadline,
      deadlineInputValue,
      handleDeadlineChange,
      submitMethod,
      methods,
      handleMethodChange,
      handleTitleChange,
      discription,
      handleDiscriptionChange,
      cantAdd,
      toDetailSettings,
    };
  },
});
</script>
<style scoped lang="scss">
.quick-add-assigment-card {
  margin-top: var(--space-3);
  text-align: left;
}
.quick-add-assigment-card-content {
  padding: var(--space-10) var(--space-10) var(--space-5) var(--space-10);
}
</style>
