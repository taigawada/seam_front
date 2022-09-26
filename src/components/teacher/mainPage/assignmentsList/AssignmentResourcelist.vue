<template>
  <SimpleResourceList
    :items="
      resources.slice(currentSelectPage * 30, (currentSelectPage + 1) * 30)
    "
    select
    :loading="loading"
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
        <component :is="render.item.title ? 'span' : 'SimpleSkelton'">
          ICON
        </component>
      </ResourceItem>
      <ResourceItem distribution="left">
        <component
          :is="render.item.title ? 'span' : 'SimpleSkelton'"
          body
          width="200px"
          height="10px"
        >
          {{ render.item.title }}
        </component>
      </ResourceItem>
      <ResourceItem>
        <component
          :is="render.item.deadline ? 'span' : 'SimpleSkelton'"
          body
          width="50%"
          height="10px"
        >
          {{ format(new Date(), 'MM月dd日') }}
        </component>
      </ResourceItem>
      <ResourceItem>
        <component
          :is="render.item.status ? 'SimpleTag' : 'SimpleSkelton'"
          :processing="render.item.status === 'active'"
          :success="render.item.status === 'draft'"
          :warn="render.item.status === 'closed'"
          :remove="false"
          body
          width="50%"
          height="10px"
        >
          <span style="font-size: 0.825rem">{{
            status(render.item.status)
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
    <template #pagination>
      <SimplePagination
        v-show="pageLength > 1"
        :length="pageLength"
        :current="currentSelectPage"
        @next="handleNext"
        @previous="handlePrevious"
        @change="handlePageChange"
      ></SimplePagination>
    </template>
  </SimpleResourceList>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from '@vue/composition-api';
import {
  SimpleButton,
  SimpleResourceList,
  ResourceItem,
  SimplePagination,
  SimpleSkelton,
} from '@simple-education-dev/components';
import { GabbageBox } from '@simple-education-dev/icons';
import router from '@/router';
import { format } from 'date-fns';

export default defineComponent({
  components: {
    SimpleButton,
    SimpleResourceList,
    ResourceItem,
    SimplePagination,
    SimpleSkelton,
  },
  props: {
    loading: {
      type: Boolean,
    },
    resources: {
      type: Array as PropType<{ id: unknown }[]>,
      required: true,
    },
  },
  setup(props, context) {
    const exportActionsOpen = ref(false);
    const exportWays = [
      {
        label: 'Excel形式でエクスポート',
        onAction: () => console.log('todo -> excel'),
      },
      {
        label: 'CSV形式でエクスポート',
        onAction: () => console.log('todo -> csv'),
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

    // status translate
    const status = (str: string) => {
      if (str === 'draft') return '下書き';
      else if (str === 'active') return 'アクティブ';
    };

    // resource list logics
    const resourceListSelected = ref<number[]>([]);
    const handleResourceListChange = (newArray: number[]) => {
      resourceListSelected.value = newArray;
    };
    const handleTransitionDetailSettings = (id: number) => {
      router.push({
        name: 'assignmentDetailSettings',
        params: { assignmentId: String(id) },
      });
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
      router.push({
        name: 'submissionStatus',
        params: {
          assignmentId: String(props.resources[index].id),
          previous: 'teacherLanding',
        },
      });
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

    // pagination
    const pageLength = computed(() => Math.floor(props.resources.length / 30));
    const currentSelectPage = ref(0);
    const handleNext = () => currentSelectPage.value++;
    const handlePrevious = () => currentSelectPage.value--;
    const handlePageChange = (index: number) => {
      currentSelectPage.value = index;
    };

    return {
      format,
      exportActionsOpen,
      exportWays,
      handleToggle,
      handleClose,
      handleTransitionAssignmentsList,
      status,
      resourceListSelected,
      handleResourceListChange,
      handleTransitionDetailSettings,
      handleAssignmentDelete,
      pageLength,
      currentSelectPage,
      handleNext,
      handlePrevious,
      handlePageChange,
      onClickRow,

      popoverMenuOpen,
      handlePopoverMenuOpen,
      handlePopoverMenuClose,

      deleteWarningModalOpen,
      handleDeleteWarningMainAction,
      handleDeleteWarningModalDestroy,

      GabbageBox,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
</style>
