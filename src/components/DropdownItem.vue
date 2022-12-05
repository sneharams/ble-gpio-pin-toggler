<template>
  <div class="item" v-on:click="clickHandler">
    <h3> {{ name }} </h3>
    <h4> {{ id }} </h4>
  </div>
</template>

<script>
  export default {
    name: 'DropdownItem',
    props: ['id', 'name'],
    methods: {
      clickHandler() {
        this.$emit('option', this.name, this.id);
      }
    }
  }
</script>


<style scoped>
  .item {
    z-index: 1;
    height: 64px;
    padding:  8px;
    transition: .25s;
  }

  .item:hover {
    background-color: var(--ms-c-blue-tl);
  }

</style>