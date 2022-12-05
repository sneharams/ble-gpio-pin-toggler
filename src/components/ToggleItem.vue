
<template>
  <div class="row">
    <img class="inverted" src="../assets/pin.svg"/>
    <h3>
      {{ id }}
    </h3>
    <ToggleButton
     :value="state" 
     :sync="syncing" 
     color="#50e6ff" 
     :labels="true"
     v-on:change="setPin"/>
  </div>
</template>

<script>
  import { ToggleButton } from 'vue-js-toggle-button';
  export default {
    name: 'ToggleItem',
    components: {ToggleButton},
    props: ['id', 'state'],
    data() {
      return {
        syncing: true
      }
    },
    methods: {
      setPin() {
        const pin = {
          id: this.id,
          state: !this.state
        };
        this.$emit('pin', pin);
      }
    }
  }
</script>

<style scoped>
.row {
  background-color: var(--color-background-soft);
  padding: 0 1rem 0 1rem;
}

h3 {
  flex-grow: 1;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0rem;
  padding-left: 1rem;
  color: var(--color-heading);
}
</style>
