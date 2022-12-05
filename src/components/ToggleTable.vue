<template>
    <div class="table">
        <div class="row">
          <img class="inverted icon sync btn-blue-inv" v-on:click="refreshPins" alt="refresh pins" src="../assets/sync.svg"/>
          Last Sync: {{ lastSyncTime }}
        </div>
        <div class="items">
            <ToggleItem 
              v-for="pin in pins"
              v-bind:key="pin.id"
              v-bind:id="pin.id"
              v-bind:state="pin.state"
              v-on:pin="setPin"
            />
        </div>
    </div>
</template>

<script>
  import ToggleItem from './ToggleItem.vue'

  export default {
    name: 'ToggleTable',
    components: {ToggleItem},
    props: ['pins', 'lastSyncTime'],
    data() {
      return {
      }
    },
    methods: {
      setPin(pin) {
        this.$emit('pin', pin);
      },
      refreshPins() {
        this.$emit('refresh');
      }
    }
  }
</script>

<style scoped>
.row {
  width: 100%;
  align-items: center;
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
}

.sync {
  margin-right: 1rem;
}

.table {
  margin-top: 2rem;
  width: 100%;
}

@media (min-width: 1024px) {
  .table {
    margin-left: 2rem;
  }
}


h3 {
  font-size: 1.2rem;
  font-weight: 500;
  width: 9rem;
  margin-bottom: 0rem;
  color: var(--color-heading);
}

</style>

