<template>
  <div>
    <h1>Hello world</h1>
    <p>{{ count }}</p>
    <button @click="increment">Count Up</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
    setup() {
        const count = ref(0);
        const increment = () => {
            return count.value++
        }
        return {
            count, increment,
        };
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
   display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
