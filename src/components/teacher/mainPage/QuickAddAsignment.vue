<template>
  <SimpleCard
    class="quick-add-asigment-card"
    :mainAction="{
      label: '追加',
      disabled: cantAdd,
    }"
    :subAction="{
      label: '詳細設定',
    }"
  >
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
    <TipTapEditor
      caption="説明"
      placeholder="説明を入力..."
      :value="discription"
      @change:editor="handleQuillEditorChange"
    />
  </SimpleCard>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useQuickAddAsignment } from '../compositions/mainPage/useQuickAddAsignment';
import TipTapEditor from '../../TipTapEditor/TipTapEditor.vue';
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
    } = useQuickAddAsignment();
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
.quick-add-asigment-card {
  margin-top: $space-3;
  text-align: left;
}
</style>
