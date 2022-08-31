<template>
  <SimpleCard
    class="quick-add-assigment-card"
    :mainAction="{
      label: '追加',
      disabled: cantAdd,
    }"
    :subAction="{
      label: '詳細設定',
    }"
  >
    <div class="quick-add-assigment-card-content">
      <SimpleInput
        :value="title"
        caption="提出物タイトル"
        @change:value="handleTitleChange"
      />
      <SimpleDateTimePicker
        caption="提出期限"
        :inputValue="deadlineInputValue"
        @change:datetime="handleDeadlineChange"
      />
      <SimpleSelector
        caption="提出方法"
        :value="method"
        :items="methods"
        @change:select="handleMethodChange"
      />
      <SimpleInput
        v-show="method === 'other'"
        captionHidden
        placeholder="その他..."
        :value="otherMethods"
        @change:value="handleOtherMethodsChange"
      />
      <p>{{ discription }}</p>
      <TipTapEditor
        caption="説明"
        placeholder="説明を入力..."
        :value="discription"
        @change:editor="handleQuillEditorChange"
      />
    </div>
  </SimpleCard>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useQuickAddAssignment } from '../../compositions/mainPage/useQuickAddAssignment';
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
  setup() {
    const {
      title,
      deadline,
      deadlineInputValue,
      method,
      methods,
      otherMethods,
      cantAdd,
    } = useQuickAddAssignment();
    const handleTitleChange = (newValue: string) => {
      title.value = newValue;
    };
    const handleDeadlineChange = (newValue: Date) => {
      deadline.value = newValue;
      deadlineInputValue.value = format(newValue, 'yyyy年MM月dd日HH時mm分');
    };
    const handleMethodChange = (newValue: string) => {
      method.value = newValue;
    };
    const handleOtherMethodsChange = (newValue: string) => {
      otherMethods.value = newValue;
    };
    const discription = ref<object | null>(null);
    const handleQuillEditorChange = (newValue: object) => {
      discription.value = newValue;
    };
    return {
      title,
      deadline,
      deadlineInputValue,
      handleDeadlineChange,
      method,
      methods,
      otherMethods,
      handleOtherMethodsChange,
      handleMethodChange,
      handleTitleChange,
      discription,
      handleQuillEditorChange,
      cantAdd,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.quick-add-assigment-card {
  margin-top: $space-3;
  text-align: left;
}
.quick-add-assigment-card-content {
  padding: $space-10 $space-10 $space-5 $space-10;
}
</style>
