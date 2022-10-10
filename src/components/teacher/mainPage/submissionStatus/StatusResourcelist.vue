<template>
  <div>
    <SimpleResourceList
      :items="loading ? loadingResources : resources"
      select
      :selectedItems="resourceListSelected"
      :weight="[1, 1, 6, 6]"
      @change="handleResourceListChange"
    >
      <template #header>
        <ResourceItem>クラス</ResourceItem>
        <ResourceItem>出席番号</ResourceItem>
        <ResourceItem distribution="left"> 氏名 </ResourceItem>
        <ResourceItem>提出日時</ResourceItem>
        <ResourceItem></ResourceItem>
      </template>
      <template #data="render">
        <ResourceItem>
          <component
            :is="render.item.room ? 'span' : 'SimpleSkeleton'"
            type="text"
          >
            {{ render.item.room }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="render.item.syussekiNo ? 'span' : 'SimpleSkeleton'"
            type="text"
          >
            {{ render.item.syussekiNo }}
          </component>
        </ResourceItem>
        <ResourceItem distribution="left">
          <component
            :is="render.item.name ? 'span' : 'SimpleSkeleton'"
            type="text"
          >
            {{ render.item.name }}
          </component>
        </ResourceItem>
        <ResourceItem>
          <component
            :is="render.item.submittedAt ? 'span' : 'SimpleSkeleton'"
            type="text"
          >
            {{ format(new Date(), 'yyyy年MM月dd日HH時mm分') }}
          </component>
        </ResourceItem>
        <!-- <ResourceItem>
          <component
            :is="render.item.status ? 'SimpleTag' : 'SimpleSkeleton'"
            :processing="render.item.status === 'active'"
            :success="render.item.status === 'draft'"
            :warn="render.item.status === 'closed'"
            :remove="false"
            type="text"
          >
            <span style="font-size: 0.825rem">{{ render.item.status }}</span>
          </component>
        </ResourceItem> -->
      </template>
    </SimpleResourceList>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from '@vue/composition-api';
import {
  SimpleButton,
  SimpleTabs,
  SimpleResourceList,
  ResourceItem,
  SimpleSkeleton,
} from '@simple-education-dev/components';
import { format } from 'date-fns';

export interface AssignmentStatus {
  studentId: number;
  grade: number;
  room: string;
  name: string;
  syussekiNo: number;
  submittedAt: string;
}

export default defineComponent({
  components: {
    SimpleButton,
    SimpleTabs,
    SimpleResourceList,
    ResourceItem,
    SimpleSkeleton,
  },
  props: {
    loading: {
      type: Boolean,
    },
    resources: {
      type: Array as PropType<AssignmentStatus[]>,
      required: true,
    },
    classes: {
      type: Array as PropType<{ id: string; label: string }[]>,
      required: true,
    },
  },
  setup() {
    const loadingResources = ref(new Array(30).fill({}));
    const currentClassesTabs = ref(0);
    const resourceListSelected = ref<number[]>([]);
    const handleResourceListChange = (newSelected: number[]) => {
      resourceListSelected.value = newSelected;
    };
    return {
      currentClassesTabs,
      handleResourceListChange,

      loadingResources,
      resourceListSelected,
      format,
    };
  },
});
</script>
<style scoped lang="scss"></style>
