<template>
  <div class="student-previrew">
    <MainPage />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useStore } from '../../store/useStore';
import MainPage from './mainPage/MainPage.vue';
export default defineComponent({
  components: { MainPage },
  props: {},
  setup(_, context) {
    const store = useStore(context);
    store.dispatch('getHolidays');
  },
});
</script>
<style lang="scss">
.student-previrew {
  width: 70%;
  margin: 0 auto;
  text-align: center;
}
</style>
