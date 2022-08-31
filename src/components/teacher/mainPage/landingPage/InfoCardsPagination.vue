<template>
  <div class="simple-pagination_container">
    <SimpleStack spacing="10px">
      <template #default="style">
        <!-- <SimpleIcon
          :style="style.spacing"
          :source="ArrowLeft"
          size="14px"
          clickable
          @click="handlePreviousPage"
        ></SimpleIcon> -->
        <div
          v-for="index in length"
          v-show="length < 8"
          :key="'index' + index"
          class="simple-pagination_dot-base"
          :class="{
            selected: isSelected(index - 1),
          }"
          :style="style.spacing"
          @click="handleChange(index - 1)"
        ></div>
        <div
          v-for="firstthreeIndex in 3"
          v-show="length >= 8"
          :key="'indexFirstThree' + firstthreeIndex"
          class="simple-pagination_dot-base"
          :class="{
            selected: isSelected(firstthreeIndex - 1),
          }"
          :style="style.spacing"
          @click="handleChange(firstthreeIndex - 1)"
        ></div>
        <SimpleIcon
          v-show="length >= 8"
          :style="style.spacing"
          :class="{
            intermediateSelected: isIntermediateSelected(),
          }"
          :source="ThreePointLeader"
          size="18px"
          clickable
          @click="handleNextPage"
        ></SimpleIcon>
        <div
          v-for="lastThreeIndex in 3"
          v-show="length >= 8"
          :key="'indexLastThree' + lastThreeIndex"
          class="simple-pagination_dot-base"
          :class="{
            selected: isSelected(length + lastThreeIndex - 4),
          }"
          :style="style.spacing"
          @click="handleChange(length + lastThreeIndex - 4)"
        ></div>
        <!-- <SimpleIcon
          :style="style.spacing"
          :source="ArrowRight"
          size="14px"
          clickable
          @click="handleNextPage"
        ></SimpleIcon> -->
      </template>
    </SimpleStack>
    <!-- <div>{{ current + 1 }}{{ suffix }} / {{ length }}{{ suffix }}</div> -->
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import {
  ArrowLeft,
  ArrowRight,
  ThreePointLeader,
} from '@simple-education-dev/icons';
import { SimpleStack, SimpleIcon } from '@simple-education-dev/components';

export default defineComponent({
  components: {
    SimpleStack,
    SimpleIcon,
  },
  props: {
    length: {
      type: Number,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    suffix: {
      type: String,
      default: undefined,
      required: false,
    },
  },
  setup(props, context) {
    const handlePreviousPage = () => {
      if (props.current > 0) {
        context.emit('previous');
      }
    };
    const handleNextPage = () => {
      if (props.current < props.length - 1) {
        context.emit('next');
      }
    };
    const handleChange = (index: number) => {
      context.emit('change', index);
    };
    const isSelected = (index: number) => {
      return props.current === index;
    };
    const isIntermediateSelected = () => {
      return 2 < props.current && props.current < props.length - 3;
    };
    return {
      ArrowLeft,
      ArrowRight,
      ThreePointLeader,
      handlePreviousPage,
      handleNextPage,
      handleChange,
      isSelected,
      isIntermediateSelected,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.simple-pagination_container {
  width: 100%;
}
.simple-pagination_dot-base {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 0.1px solid $surface-black;
  cursor: pointer;
}
.selected {
  background: $selected;
}
.intermediateSelected {
  fill: $selected;
}
</style>
