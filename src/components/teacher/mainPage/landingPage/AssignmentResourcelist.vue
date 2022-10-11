<template>
  <div>
    <div class="assignments-resource-list-header">
      <SimpleStack distribution="spaceBetween" alignment="top">
        <SimpleStack
          distribution="spaceBetween"
          alignment="center"
          spacing="15px"
        >
          <span class="assignments-resource-list-title"> 提出物一覧 </span>
          <SimpleButton
            plain
            :disabled="loading"
            @click="handleTransitionAssignmentsList"
          >
            全て表示
          </SimpleButton>
        </SimpleStack>
        <div style="min-width: 160px">
          <SimpleActions
            :open="exportActionsOpen"
            :actions="exportWays"
            @click:activator="handleToggle"
            @close="handleClose"
          >
            エクスポート
          </SimpleActions>
        </div>
      </SimpleStack>
    </div>
    <SimpleResourceList
      :items="assignments"
      select
      :selectedItems="resourceListSelected"
      :weight="[1, 4, 2, 2, 1]"
      :onClickItem="onClickRow"
      @change="handleResourceListChange"
    >
      <template #header>
        <ResourceItem />
        <ResourceItem distribution="left"> タイトル </ResourceItem>
        <ResourceItem> 提出期限 </ResourceItem>
        <ResourceItem>ステータス</ResourceItem>
        <ResourceItem />
      </template>
      <template #headerActions>
        <SimpleButton
          criticalPlain
          :icon="GabbageBox"
          iconSide="left"
          @click="() => handleAssignmentDelete(resourceListSelected)"
        >
          削除する
        </SimpleButton>
      </template>
      <template #data="render">
        <ResourceItem>
          <component :is="render.item.title ? 'span' : 'SimpleSkeleton'">
            ICON
          </component>
        </ResourceItem>
        <ResourceItem :distribution="render.item.title ? 'left' : 'center'">
          <component
            :is="render.item.title ? 'span' : 'SimpleSkeleton'"
            type="text"
          >
            {{ render.item.title }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="render.item.deadline ? 'span' : 'SimpleSkeleton'"
            type="text"
          >
            {{ format(new Date(), 'MM月dd日') }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="render.item.status ? 'SimpleTag' : 'SimpleSkeleton'"
            :processing="render.item.status === 'active'"
            :success="render.item.status === 'draft'"
            :warn="render.item.status === 'closed'"
            :remove="false"
            type="text"
          >
            <span style="font-size: 0.825rem">{{
              statusTranslate(render.item.status, render.item.deadline)
            }}</span>
          </component>
        </ResourceItem>
        <ResourceItem
          :keyId="render.item.id"
          popoverMenu
          :popoverMenuOpen="popoverMenuOpen"
          @toggle="() => handlePopoverMenuOpen(render.item.id)"
          @close="handlePopoverMenuClose"
        >
          <div class="other-operation-actions-container">
            <div
              class="other-operation-action"
              @click.stop="handleTransitionDetailSettings(render.item.id)"
            >
              編集する
            </div>
            <div
              class="other-operation-action to-gabbage-text"
              @click.stop="handleAssignmentDelete([render.item.id])"
            >
              削除する
            </div>
          </div>
        </ResourceItem>
      </template>
    </SimpleResourceList>
    <SimpleModal
      :open="deleteWarningModalOpen"
      title="提出物を削除する"
      :mainAction="{
        text: '削除',
        isCritical: true,
        onAction: handleDeleteWarningMainAction,
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleDeleteWarningModalDestroy,
      }"
      @destroy="handleDeleteWarningModalDestroy"
    >
      <p style="text-align: left">この操作は取り消せません。</p>
    </SimpleModal>
    <SimpleModal
      :open="exportAssignmentsModalOpen"
      title="提出状況のエクスポート"
      :mainAction="{
        text: 'エクスポート',
        onAction: () => {
          exportAssignmentsModalOpen = false;
          $store.dispatch('setToast', {
            content: '保存しました',
          });
        },
      }"
      :subAction="{
        text: 'キャンセル',
        onAction: handleExportAssignmentsClose,
      }"
      @destroy="handleExportAssignmentsClose"
    >
      <div style="text-align: left">
        <SimpleSelector
          caption="エクスポートする提出物の選択"
          radio
          :items="exportMethods"
          :value="exportMethodSelect"
          @change="exportMethodSelectChange"
        />
      </div>
    </SimpleModal>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import {
  SimpleStack,
  SimpleButton,
  SimpleActions,
  SimpleResourceList,
  ResourceItem,
  SimplePagination,
  SimpleSkeleton,
  SimpleIcon,
  SimpleTag,
  SimplePopover,
  SimpleModal,
  SimpleSelector,
} from '@simple-education-dev/components';
import { GabbageBox } from '@simple-education-dev/icons';
import { format, isPast } from 'date-fns';
import router from '@/router';

export interface ResourceListAssignment {
  id: number;
  title: string;
  deadline: Date;
  status: 'active' | 'draft';
}
export const statusTranslate = (str: string, deadline: Date) => {
  if (str === 'draft') return '下書き';
  if (isPast(deadline)) return '締切済み';
  else if (str === 'active') return 'アクティブ';
};

export default defineComponent({
  components: {
    SimpleStack,
    SimpleButton,
    SimpleActions,
    SimpleResourceList,
    ResourceItem,
    SimplePagination,
    SimpleSkeleton,
    SimpleIcon,
    SimpleTag,
    SimplePopover,
    SimpleModal,
    SimpleSelector,
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    assignments: {
      type: Array as PropType<ResourceListAssignment[]>,
      required: true,
    },
  },
  setup(props, context) {
    const exportActionsOpen = ref(false);
    // assignments export modal
    const exportAssignmentsModalOpen = ref(false);
    const handleExportAssignmentsOpen = () => {
      exportActionsOpen.value = false;
      exportAssignmentsModalOpen.value = !exportAssignmentsModalOpen.value;
    };
    const handleExportAssignmentsClose = () => {
      exportAssignmentsModalOpen.value = false;
    };
    // export
    const exportWays = [
      {
        label: 'Excel形式でエクスポート',
        onAction: handleExportAssignmentsOpen,
      },
      {
        label: 'CSV形式でエクスポート',
        onAction: handleExportAssignmentsOpen,
      },
    ];
    const handleToggle = () => {
      exportActionsOpen.value = !exportActionsOpen.value;
    };
    const handleClose = () => {
      exportActionsOpen.value = false;
    };
    const handleTransitionAssignmentsList = () => {
      router.push({
        name: 'assignmentsList',
      });
    };
    const exportMethods = [
      { label: '現在のページ', value: 'current_page' },
      { label: '全ての提出物', value: 'all_assignments' },
      { label: '今学期', value: 'current_semester' },
      { label: '選択済み: 0件', value: 'selected_items', disabled: true },
    ];
    const exportMethodSelect = ref('current_page');
    const exportMethodSelectChange = (newValue: string) => {
      exportMethodSelect.value = newValue;
    };

    // resource list logics
    const resourceListSelected = ref<number[]>([]);
    const handleResourceListChange = (newArray: number[]) => {
      resourceListSelected.value = newArray;
    };
    const handleTransitionDetailSettings = (id: number) => {
      if (!props.loading) {
        router.push({
          name: 'assignmentDetailSettings',
          params: { assignmentId: String(id) },
        });
      }
    };
    const popoverMenuOpen = ref<number | null>(null);
    const handlePopoverMenuOpen = (id: number) => {
      if (popoverMenuOpen.value !== null) {
        popoverMenuOpen.value = null;
      } else {
        popoverMenuOpen.value = id;
      }
    };
    const handlePopoverMenuClose = () => {
      popoverMenuOpen.value = null;
    };
    const onClickRow = (index: number) => {
      if (props.assignments[index].status === 'draft') {
        handleTransitionDetailSettings(props.assignments[index].id);
      } else {
        router.push({
          name: 'submissionStatus',
          params: {
            assignmentId: String(props.assignments[index].id),
            previous: 'teacherLanding',
          },
        });
      }
    };

    // delete warning modal
    const deleteWarningModalWaiter = ref<null | Function>(null);
    const deleteWarningModalOpen = ref(false);
    const handleDeleteWarningMainAction = () => {
      if (deleteWarningModalWaiter.value) {
        deleteWarningModalWaiter.value(true);
      }
      deleteWarningModalOpen.value = false;
    };
    const handleDeleteWarningModalDestroy = () => {
      if (deleteWarningModalWaiter.value) {
        deleteWarningModalWaiter.value(false);
      }
      deleteWarningModalOpen.value = false;
    };
    const handleAssignmentDelete = async (ids: number[]) => {
      popoverMenuOpen.value = null;
      deleteWarningModalOpen.value = true;
      const result = await new Promise(
        (resolve) => (deleteWarningModalWaiter.value = resolve)
      );
      if (result) {
        context.emit('delete', ids);
      } else {
        return;
      }
    };
    return {
      format,
      exportActionsOpen,
      exportWays,
      handleToggle,
      handleClose,
      handleTransitionAssignmentsList,
      exportMethods,
      exportMethodSelect,
      exportMethodSelectChange,
      statusTranslate,
      resourceListSelected,
      handleResourceListChange,
      handleTransitionDetailSettings,
      handleAssignmentDelete,
      onClickRow,

      popoverMenuOpen,
      handlePopoverMenuOpen,
      handlePopoverMenuClose,

      deleteWarningModalOpen,
      handleDeleteWarningMainAction,
      handleDeleteWarningModalDestroy,

      exportAssignmentsModalOpen,
      handleExportAssignmentsOpen,
      handleExportAssignmentsClose,

      GabbageBox,
    };
  },
});
</script>
<style scoped lang="scss">
.assignments-resource-list-header {
  padding: var(--space-3);
}
.assignments-resource-list-title {
  margin-right: var(--space-2);
  font-size: var(--font-size-8);
}
.other-operation-actions-container {
  display: inline-block;
  width: max-content;
  padding: var(--space-1);
}
.other-operation-action {
  $action-height: 35px;
  height: $action-height;
  line-height: $action-height;
  padding: 0 var(--space-8);
  font-size: var(--font-size-3);
}
.other-operation-action:hover {
  background: var(--hovered);
}
.to-gabbage-text {
  color: var(--text-error);
}
</style>
