<template>
  <div>
    <transition>
      <div
        v-show="open"
        class="tiptap-editor-palette"
        @mouseenter="handleMouseenter"
        @mouseleave="handleMouseleave"
        @click.prevent
      >
        <span
          class="tiptap-editor-palette__actions"
          :class="{
            'tiptap-editor-palette__is-active': editor?.isActive('heading', {
              level: 1,
            }),
          }"
          @click="handleHeading"
        >
          見出し
        </span>
        <span
          class="tiptap-editor-palette__actions"
          :class="{
            'tiptap-editor-palette__is-active': editor?.isActive('heading', {
              level: 3,
            }),
          }"
          @click="handleSubHeading"
        >
          小見出し
        </span>
        <span
          class="tiptap-editor-palette__actions"
          :class="{
            'tiptap-editor-palette__is-active': editor?.isActive('paragraph'),
          }"
          @click="handleParagraph"
        >
          本文
        </span>
        <div
          ref="colorPaletteActivator"
          class="tiptap-editor-palette__actions"
          style="display: inline-block"
          @click="handleUnlink"
          @mouseenter="handleColorPickerMouseenter"
          @mouseleave="handleColorPickerMouseleave"
        >
          <SimpleIcon
            class="tiptap-editor-palette__action-icons"
            :source="TextColor"
            size="18px"
            clickable
          />
          <TipTapColorPicker
            :editor="editor"
            :open="colorPickerEntered"
            @change:color="handleColorSelect"
            @color:unset="handleColorUnset"
          />
        </div>

        <span
          title="リンクを挿入"
          class="tiptap-editor-palette__actions"
          @click="handleUrlModalOpen"
        >
          <SimpleIcon
            class="tiptap-editor-palette__action-icons"
            :source="LinkChain"
            size="18px"
            clickable
          />
        </span>
        <span
          title="リンク解除"
          class="tiptap-editor-palette__actions"
          @click="handleUnlink"
        >
          <SimpleIcon
            class="tiptap-editor-palette__action-icons"
            :source="LinkUnChain"
            size="18px"
            clickable
          />
        </span>
      </div>
    </transition>
    <SimpleModal
      :open="urlModalOpen"
      title="リンクを挿入"
      :mainAction="{
        text: '挿入',
        onAction: () => handleLink,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: () => handleUrlModalDestroy,
      }"
      @destroy="handleUrlModalDestroy"
      @mainAction="handleLink"
      @subAction="handleUrlModalDestroy"
    >
      <div class="tiptap-editor-palette__url-modal-content">
        <SimpleInput
          class="tiptap-editor-palette__url-input"
          caption="URL"
          placeholder="https://"
          :value="urlInput"
          @change:value="handleUrlInputChange"
        />
        <SimpleSelector
          :value="urlTarget"
          :items="urlTargets"
          caption="リンクの開き方"
          @change:select="handleUrlTargetChange"
        />
      </div>
    </SimpleModal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from '@vue/composition-api';
import {
  SimpleModal,
  SimpleInput,
  SimpleSelector,
  SimpleIcon,
} from '@simple-education-dev/components';
import TipTapColorPicker from './TipTapColorPicker.vue';
import { TextColor, LinkChain, LinkUnChain } from '@simple-education-dev/icons';
import { Editor } from '@tiptap/vue-2';

export default defineComponent({
  components: {
    TipTapColorPicker,
    SimpleModal,
    SimpleInput,
    SimpleSelector,
    SimpleIcon,
  },
  props: {
    editor: {
      type: Object as PropType<Editor>,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    const handleMouseenter = () => {
      context.emit('enter');
    };
    const handleMouseleave = () => {
      context.emit('leave');
    };
    const handleHeading = () => {
      context.emit('heading');
    };
    const handleSubHeading = () => {
      context.emit('subHeading');
    };
    const handleParagraph = () => {
      context.emit('paragraph');
    };
    const colorPickerEntered = ref(false);
    let colorPickerHoverTimerId: any = null;
    const handleColorPickerMouseenter = () => {
      if (colorPickerHoverTimerId) {
        clearTimeout(colorPickerHoverTimerId);
      }
      colorPickerEntered.value = true;
    };
    const handleColorPickerMouseleave = () => {
      colorPickerHoverTimerId = setTimeout(() => {
        colorPickerEntered.value = false;
      }, 400);
    };
    const handleColorSelect = (color: string) => {
      context.emit('change:color', color);
    };
    const handleColorUnset = () => {
      context.emit('color:unset');
    };
    const urlTarget = ref('_blank');
    const urlTargets = [
      {
        label: '別のタブで開く',
        value: '_blank',
      },
      {
        label: '同じタブで開く',
        value: '_self',
      },
    ];
    const handleUrlTargetChange = (newValue: string) => {
      urlTarget.value = newValue;
    };
    const urlModalOpen = ref(false);
    const urlInput = ref('');
    const handleUrlInputChange = (newValue: string) => {
      urlInput.value = newValue;
    };
    const handleUrlModalOpen = () => {
      const target = props.editor?.getAttributes('link').target;
      if (target) urlTarget.value = target;
      const url = props.editor?.getAttributes('link').href;
      if (url) urlInput.value = url;
      urlModalOpen.value = !urlModalOpen.value;
    };
    const handleUrlModalDestroy = () => {
      urlModalOpen.value = false;
    };
    const handleLink = () => {
      const url = urlInput.value;
      const target = urlTarget.value;
      handleUrlModalDestroy();
      context.emit('link', url, target);
    };
    const handleUnlink = () => {
      context.emit('unlink');
    };
    return {
      handleMouseenter,
      handleMouseleave,
      handleHeading,
      handleSubHeading,
      handleParagraph,
      colorPickerEntered,
      handleColorPickerMouseenter,
      handleColorPickerMouseleave,
      handleColorSelect,
      handleColorUnset,
      urlTarget,
      urlTargets,
      handleUrlTargetChange,
      urlInput,
      handleUrlInputChange,
      urlModalOpen,
      handleUrlModalOpen,
      handleUrlModalDestroy,
      handleLink,
      handleUnlink,
      TextColor,
      LinkChain,
      LinkUnChain,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/tokens/styles' as *;
.tiptap-editor-palette {
  display: flex;
  justify-content: space-between;
  position: absolute;
  padding: $space-1 $space-1;
  height: 30px;
  width: 90%;
  border-radius: $border-radius-05;
  box-shadow: $box-shadow-1;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 10;
}
.tiptap-editor-palette__actions:hover {
  background: $hovered;
  border-radius: $border-radius-05;
}
.tiptap-editor-palette__actions {
  display: inline-block;
  line-height: 22px;
  padding: $space-1 $space-1;
  font-size: $font-size-3;
  cursor: pointer;
}
.tiptap-editor-palette__action-icons {
  padding-top: 2px;
}
.tiptap-editor-palette__is-active {
  background: $selected !important;
  border-radius: $border-radius-05;
  color: $surface !important;
}
.tiptap-editor-palette__url-modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tiptap-editor-palette__url-input {
  width: 100%;
}
.v-enter {
  opacity: 0;
}
.v-enter-to {
  opacity: 1;
}
.v-enter-active {
  transition: all 0.2s ease-in-out;
}
.v-leave {
  opacity: 1;
}
.v-leave-to {
  opacity: 0;
}
.v-leave-active {
  transition: all 500ms;
}
</style>
