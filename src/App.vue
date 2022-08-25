<template>
    <div id="app">
        <h1>HelloWorld</h1>
    </div>
</template>
<script lang="ts">
import HelloWorld from '@/components/HelloWorld.vue';
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
    components: {
        HelloWorld,
    },
});
</script>
<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
