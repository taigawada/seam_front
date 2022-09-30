<template>
  <div class="assignment-list-container">
    <div class="submittion-status-header">
      <div class="right-side-elements">
        <SimpleButton
          normal
          :icon="ArrowLeft"
          iconSide="left"
          @click="handlePreviousPage"
        >
          戻る
        </SimpleButton>
        <div class="submittion-status-header-text">課題管理</div>
      </div>
    </div>
    <div class="status-tab-base">
      <SimpleTabs
        :tabs="statusTabs"
        :selected="statusTabs.findIndex((tab) => querys.status === tab.id)"
        @change="handleStatusTabSelect"
      />
    </div>
    <div class="query-field-container">
      <div class="query-field">
        <SimpleInput
          style="flex-grow: 1"
          placeholder="提出物を検索..."
          :value="querys.query"
          remove
          :icon="SearchGlass"
          @change:value="handleSearchFieldChange"
          @remove="handleSearchFieldRemove"
        />
        <div ref="sortOptionsRef" class="sort-options-activator">
          <SimpleButton normal @click="handleSortOptionsOpen">
            並び替え
          </SimpleButton>
          <SimplePopover
            :open="sortOptionsOpen"
            :activatorRect="sortOptionsRect"
            @close="handleSortOptionsClose"
          >
            <div class="sort-options">
              <div class="sort-methods">
                <SimpleSelector
                  radio
                  :value="querys.order"
                  :items="sortMethods"
                  caption="並び替え"
                  @change:select="handleSortMethodChange"
                />
              </div>
              <div class="order-select" @click="handleOrderChange('ASC')">
                <SimpleIcon
                  :source="ArrowUp"
                  clickable
                  :fill="orderSelectedColor('ASC').color"
                />
                <div
                  style="padding-left: 10px"
                  :style="orderSelectedColor('ASC')"
                >
                  昇順
                </div>
              </div>
              <div class="order-select" @click="handleOrderChange('DESC')">
                <SimpleIcon
                  :source="ArrowDown"
                  clickable
                  :fill="orderSelectedColor('DESC').color"
                />
                <div
                  style="padding-left: 10px"
                  :style="orderSelectedColor('DESC')"
                >
                  降順
                </div>
              </div>
            </div>
          </SimplePopover>
        </div>
      </div>
    </div>
    <AssignmentResourcelist
      style="margin-top: -20px"
      :loading="isLoading"
      :resources="resources"
    />
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import {
  SimpleInput,
  SimpleTabs,
  SimpleIcon,
  SimpleButton,
  SimplePopover,
  SimpleSelector,
} from '@simple-education-dev/components';
import {
  SearchGlass,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
} from '@simple-education-dev/icons';
import URLparams from '@/utilities/paramsRemoveFalsy';
import router from '@/router';
import { Dictionary } from 'vue-router/types/router';
import { SeamApiTeacher } from '@/api/endpoints';
import axios, { CancelTokenSource } from 'axios';
import { useElementBounding } from '@vueuse/core';
import AssignmentResourcelist from './AssignmentResourcelist.vue';

export interface AssignmentAllResourcelist {
  id: number;
  title: string;
  deadline: Date;
  status: string;
}

interface QueryParams {
  status: string;
  query: string;
  order: string;
  orderDirection: 'ASC' | 'DESC';
}

export default defineComponent({
  components: {
    SimpleInput,
    SimpleTabs,
    SimpleIcon,
    SimpleButton,
    SimplePopover,
    SimpleSelector,
    AssignmentResourcelist,
  },
  beforeRouteUpdate(to, from, next) {
    if (this.isLoading) {
      this.currentCancelToken?.cancel();
    }
    this.search();
    next();
  },
  setup() {
    const handlePreviousPage = () => {
      router.push({
        name: 'teacherLanding',
      });
    };
    const statusTabs = [
      {
        label: '全て',
        id: 'all',
      },
      {
        label: 'アクティブ',
        id: 'active',
      },
      {
        label: '締切済み',
        id: 'closed',
      },
      {
        label: '下書き',
        id: 'draft',
      },
    ];
    const initialStatus: string = router.currentRoute.query.status
      ? (router.currentRoute.query.status as string)
      : 'all';
    const initialQuery: string = router.currentRoute.query.query
      ? (router.currentRoute.query.query as string)
      : '';
    const querys = reactive<QueryParams>({
      status: initialStatus,
      query: initialQuery,
      orderDirection: 'ASC',
      order: 'UPDATED_AT',
    });
    watch(querys, () => {
      const QueryParams = URLparams.removeFalsy(querys);
      router.push(
        {
          path: router.currentRoute.path,
          query: QueryParams as Dictionary<string>,
        },
        () => {}
      );
    });
    const resources = ref<AssignmentAllResourcelist[]>(new Array(50).fill({}));
    const teacherId = 1;
    (async () => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      const result = await SeamApiTeacher.searchAssignments(
        teacherId,
        URLparams.removeFalsy(querys),
        source.token
      );
      resources.value = result.data;
    })();
    const isLoading = ref(false);
    const currentCancelToken = ref<CancelTokenSource | null>(null);
    const search = async () => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      currentCancelToken.value = source;
      isLoading.value = true;
      try {
        console.log(URLparams.removeFalsy(querys));
        const result = await SeamApiTeacher.searchAssignments(
          teacherId,
          URLparams.removeFalsy(querys),
          source.token
        );
        resources.value = result.data;
        isLoading.value = false;
        return;
      } catch (e) {
        if (axios.isCancel(e)) {
          return;
        }
        throw e;
      }
    };
    const handleStatusTabSelect = (select: number) => {
      querys.status = statusTabs[select].id;
    };
    const handleSearchFieldChange = (newValue: string) => {
      querys.query = newValue;
    };
    const handleSearchFieldRemove = () => {
      querys.query = '';
    };
    const sortOptionsRef = ref<HTMLElement | null>(null);
    const sortOptionsRect = useElementBounding(sortOptionsRef);
    const sortOptionsOpen = ref(false);
    const handleSortOptionsOpen = () => {
      sortOptionsOpen.value = !sortOptionsOpen.value;
    };
    const handleSortOptionsClose = () => {
      sortOptionsOpen.value = false;
    };
    const sortMethods = [
      {
        value: 'TITLE',
        label: 'タイトル',
      },
      {
        value: 'DEADLINE',
        label: '提出期限',
      },
      {
        value: 'CYCLE_SUBMIT',
        label: '繰り返し提出',
      },
      {
        value: 'SUBMISSION_METHOD',
        label: '提出方法',
      },
      {
        value: 'CREATED_AT',
        label: '作成日',
      },
      {
        value: 'UPDATED_AT',
        label: '更新日',
      },
    ];
    const handleSortMethodChange = (newValue: string) => {
      querys.order = newValue;
    };
    const handleOrderChange = (newValue: 'ASC' | 'DESC') => {
      querys.orderDirection = newValue;
    };
    // prettier-ignore
    const orderSelectedColor = computed(() => (order: 'ASC'|'DESC') => order === querys.orderDirection ? ({
      'color' : 'rgba(60, 130, 214, 1)'
    }) : ({
      'color' : 'rgba(44, 62, 80, 1)'
    }))
    return {
      handlePreviousPage,

      querys,
      statusTabs,
      handleStatusTabSelect,
      currentCancelToken,
      isLoading,
      search,

      handleSearchFieldChange,
      handleSearchFieldRemove,
      resources,

      sortOptionsRef,
      sortOptionsRect,
      sortOptionsOpen,
      handleSortOptionsOpen,
      handleSortOptionsClose,
      sortMethods,
      handleSortMethodChange,
      handleOrderChange,
      orderSelectedColor,

      SearchGlass,
      ArrowLeft,
      ArrowDown,
      ArrowUp,
    };
  },
});
</script>
<style scoped lang="scss">
@use '@simple-education-dev/components/globalStyles' as *;
.assignment-list-container {
  padding: 0 $space-6 $space-6 $space-6;
}
.submittion-status-header {
  padding: $space-4 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.right-side-elements {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.submittion-status-header-text {
  font-size: $font-size-8;
  margin-left: $space-4;
}
.query-field-container {
  width: 100%;
  background: rgb(245, 250, 255);
  border-bottom-left-radius: $border-radius-1;
  border-bottom-right-radius: $border-radius-1;
  border-bottom: 20px solid rgb(245, 250, 255);
  .query-field {
    margin: 0 auto;
    width: 90%;
    display: flex;
    align-items: flex-end;
    padding: $space-2;
  }
}
.status-tab-base {
  position: relative;
  background: $surface;
  padding-right: 70%;
  border-top-left-radius: $border-radius-1;
  border-top-right-radius: $border-radius-1;
  z-index: 0;
}
.status-tab-base::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  display: block;
  border-bottom: 1px solid $border;
  z-index: -1;
}
.sort-options-activator {
  margin-bottom: 10px;
  display: inline-flex;
}
.sort-options {
  padding: $space-3;
}
.sort-methods {
  margin: 0 $space-4 $space-4 $space-2;
  text-align: left;
  width: 150px;
  height: 150px;
  overflow: scroll;
}
.order-select {
  margin: $space-2 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
