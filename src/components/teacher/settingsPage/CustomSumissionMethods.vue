<template>
  <div
    ref="customSubmissionMethodsContainer"
    class="custom-submission-methods-container"
  >
    <div
      v-for="(methodInput, index) in settings.submissionMethods"
      :key="index"
    >
      <div
        ref="hoveredElements"
        class="custom-submission-methods-elements"
        :style="isDragging === index ? draggableStyle : {}"
      >
        <div
          :style="{
            cursor: isDragging ? 'grabbing' : 'grab',
          }"
          class="drag-icon-container"
          @pointerdown="(event) => handleDragStart(index, event)"
        >
          <SimpleIcon
            :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
            :source="DndHandler"
            size="20px"
          />
        </div>
        <SimpleInput
          ref="testRef"
          style="width: 90%"
          :captionHidden="true"
          placeholder="値を空白にすることはできません。"
          :value="Array.isArray(methodInput) ? methodInput[0] : methodInput"
          :autofocus="
            index === settings.submissionMethods.length - 1 ? isFocus : false
          "
          @focusout="isFocus = false"
          @change="(newValue) => handleMethodChange(newValue, index)"
        />
        <SimpleIcon
          class="delete-icon"
          :source="DeleteCross"
          size="20px"
          clickable
          @click="handleMethodDelete(index)"
        />
      </div>
      <div
        v-if="Array.isArray(methodInput)"
        class="custom-submission-methods-elements"
      >
        <div class="hovered-fill-element"></div>
      </div>
    </div>
    <div class="custom-submission-methods-elements">
      <div
        :style="{
          cursor: isDragging ? 'grabbing' : 'grab',
        }"
        class="drag-icon-container"
      >
        <SimpleIcon
          :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
          :source="DndHandler"
          size="20px"
        />
      </div>

      <SimpleInput
        style="width: 90%"
        :captionHidden="true"
        placeholder="別の値を追加..."
        :value="newValue"
        @focusout="isFocus = false"
        @change="handleNewValueChange"
      />
      <SimpleIcon
        class="delete-icon"
        :source="DeleteCross"
        style="opacity: 0; pointer-events: none"
        size="20px"
      />
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  PropType,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import {
  SimpleInput,
  SimpleButton,
  SimpleIcon,
} from '@simple-education-dev/components';
import { DndHandler, DeleteCross } from '@simple-education-dev/icons';
import {
  useMouse,
  useEventListener,
  useWindowScroll,
  useScrollLock,
} from '@vueuse/core';
import { UserSettings } from './SettingsPage.vue';

export default defineComponent({
  components: {
    SimpleInput,
    SimpleButton,
    SimpleIcon,
  },
  props: {
    settings: {
      type: Object as PropType<UserSettings>,
      required: true,
    },
  },
  setup(props, context) {
    const isFocus = ref(false);
    const newValue = ref('');
    const handleNewValueChange = (newString: string) => {
      if (props.settings.submissionMethods.length < 7) {
        context.emit('change', [
          ...props.settings.submissionMethods,
          newString,
        ]);
        isFocus.value = true;
        // 直接 空文字を入力しようとすると反映されず、nextTickを2回噛ませることで回避
        nextTick(() => {
          newValue.value = '_';
          nextTick(() => {
            newValue.value = '';
          });
        });
      } else {
        newValue.value = newString;
      }
    };
    onMounted(async () => {
      await new Promise((re) => setTimeout(re, 10000));
      newValue.value = '';
    });

    const handleMethodChange = (value: string, index: number) => {
      const copyArray = [...props.settings.submissionMethods];
      copyArray.splice(index, 1, value);
      context.emit('change', copyArray);
    };
    const handleMethodDelete = (index: number) => {
      const copyArray = [...props.settings.submissionMethods];
      copyArray.splice(index, 1);
      context.emit('change', copyArray);
    };
    const customSubmissionMethodsContainer = ref<HTMLElement | null>(null);
    const isLocked = useScrollLock(customSubmissionMethodsContainer);
    const hoveredElements = ref<HTMLElement[] | null>(null);
    const isDragging = ref<number | null>(null);
    const currentHoverRef = computed(() =>
      isDragging.value !== null
        ? hoveredElements.value
          ? hoveredElements.value[isDragging.value]
          : null
        : null
    );
    const mousePosition = useMouse();
    const draggingElement = reactive({
      x: 0,
      y: 0,
    });
    const windowScroll = useWindowScroll(window);
    const offset = ref(0);
    const changeIndex = ref(0);
    watch(mousePosition.y, () => {
      if (isDragging.value !== null) {
        const amount =
          mousePosition.y.value - windowScroll.y.value - offset.value;
        draggingElement.y = amount;
        if (hoveredElements.value) {
          const positionsArray = hoveredElements.value.map((elm) => {
            return elm.getBoundingClientRect().top;
          });
          positionsArray.splice(isDragging.value, 1);
          positionsArray.push(amount);
          positionsArray.sort();
          const resultIndex = positionsArray.findIndex((top) => top === amount);
          if (resultIndex < props.settings.submissionMethods.length)
            changeIndex.value = resultIndex;
        }
      } else {
        draggingElement.y = 0;
      }
    });
    watch(changeIndex, () => {
      if (isDragging.value !== null) {
        const copyElement = props.settings.submissionMethods[isDragging.value];
        const copyArray = [...props.settings.submissionMethods];
        copyArray.splice(isDragging.value, 1);
        isDragging.value = changeIndex.value;
        copyArray.splice(isDragging.value, 0, copyElement);
        context.emit('change', copyArray);
      }
    });

    const draggableStyle = computed(() => ({
      position: isDragging.value !== null ? 'fixed' : 'initial',
      // prettier-ignore
      top: isDragging.value !== null
        ? `${draggingElement.y ? draggingElement.y : currentHoverRef.value?.getBoundingClientRect().top!}px`
        : '0',
      width: `${
        customSubmissionMethodsContainer.value?.getBoundingClientRect().width
      }px`,
      'z-index': isDragging.value !== null ? '100' : '0',
    }));
    const cleanupfunc = ref<(() => void) | null>(null);
    const handleDragEnd = () => {
      isLocked.value = false;
      if (cleanupfunc.value !== null) {
        cleanupfunc.value();
        cleanupfunc.value = null;
      }
      context.emit(
        'change',
        [...props.settings.submissionMethods].flat().filter((el) => el !== '')
      );
      isDragging.value = null;
    };
    const handleDragStart = (index: number, event: MouseEvent) => {
      isLocked.value = true;
      if (props.settings.submissionMethods[index] !== '') {
        changeIndex.value = index;
        const cleanup = useEventListener(window, 'pointerup', () =>
          handleDragEnd()
        );
        cleanupfunc.value = cleanup;
        // @ts-ignore
        const currentOffset = event.offsetY;
        offset.value = currentOffset;
        const copyArray = [...props.settings.submissionMethods];
        copyArray.splice(index, 1, [copyArray[index]]);
        context.emit('change', copyArray);
        isDragging.value = index;
      }
    };

    return {
      customSubmissionMethodsContainer,
      hoveredElements,
      currentHoverRef,
      draggableStyle,
      isDragging,
      handleDragStart,
      handleDragEnd,

      handleMethodChange,
      handleMethodDelete,
      newValue,
      handleNewValueChange,
      DndHandler,
      DeleteCross,

      isFocus,
    };
  },
});
</script>
<style scoped lang="scss">
.custom-submission-methods-container {
  user-select: none;
  -webkit-user-select: none;
  padding: var(--space-6) 0;
}
.custom-submission-methods-elements {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.hovered-fill-element {
  background: var(--hovered);
  border-radius: var(--border-radius-1);
  height: 70px;
  width: 100%;
}
.drag-icon-container {
  height: 20px;
}
.delete-icon {
  padding-right: var(--space-2);
}
</style>
