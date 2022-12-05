
<template>
  <main>
    <div :class="{dropdown: focused}" v-on:click="closeDropdown" id="hubsbg"></div>
    <header>
      <img alt="Pin logo" class="logo" src="./assets/logo.png" width="125" height="125" />
      <h1 class="blue center">{{ header }}</h1>
      <br>
      <!-- <h3 class="center greeting"> {{ socketMessage }} </h3> -->
      <div v-if="hub.isConnected == false" class="search-bar">
        <input 
          v-model="hub.name" 
          v-on:click="toggleDropdown" 
          type="button" 
          list="hubs" 
          class="dropButton center"
        />
        <div :class="{dropdown: focused}" id="hubs">
          <LoaderOverlay 
            v-if="refresh" 
            class="dropLoad"
            v-bind:loaderType="'dots'" 
            v-bind:isLoading="refresh"/>
          <img 
            alt="refresh icon" 
            class="refreshHub icon inverted" 
            v-on:click="refreshHubs"
            src="./assets/sync.svg"/>
          <DropdownItem 
            v-for="hub in hubs" 
            v-bind:key="hub.id" 
            v-bind:id="hub.id"
            v-bind:name="hub.name"
            v-on:option="selectOption"/>
        </div>
        <img v-on:click="connectHub" class="connectButton" src="./assets/enter.svg"/>
      </div>
      <div>
        <input 
        class="btn-blue btn-txt disconnect" 
        v-if="hub.isConnected" 
        type="button" 
        v-on:click="diconnect" 
        value="Disconnect"
      />
      </div>
    </header>
    <div class="bottom">
      <LoaderOverlay 
        v-bind:loaderType="'spinner'" 
        v-bind:isLoading="pinging"
        class="hubLoader"
      />
      <ToggleTable 
        v-bind:pins="pins" v-bind:lastSyncTime="lastSyncTime" 
        v-on:refresh="connectHub" v-on:pin="setPin" 
        v-if="hub.isConnected == true"/>
    </div>
  </main>
</template>

<script>
  import SocketioService from './services/socketio.service.js';

  import ToggleTable from './components/ToggleTable.vue';
  import LoaderOverlay from './components/LoaderOverlay.vue';
  import DropdownItem from './components/DropdownItem.vue';

  export default {
    name: 'app',
    components: { LoaderOverlay, ToggleTable, DropdownItem },
    data() {
      return {
        isConnected: false,
        // socketMessage: "hi",
        hub: {
          isConnected: false,
          name: '',
          id: '',
        },
        pins: [],
        hubs: [],
        pinging: false,
        focused: false,
        refresh: false,
        lastSyncTime: ''
      }
    },
    computed: {
      message: function() {
        if (this.hub.isConnected) {
          return "View and toggle your GPIO pin states.";
        }
        return "Type in your hub's url to get started.";
      },
      header: function() {
        if (this.hub.isConnected) {
          return this.hub.name + " {ID: " + this.hub.id + "}";
        }
        return "Welcome!";
      }
    },
    mounted() {
      // SocketioService.getHubs();
    },
    created() {
      this.connect();
    },
    beforeUnmount() {
      SocketioService.disconnect();
    },
    methods: {
      connectHub() {
        this.pinging = true;
        SocketioService.getHub(this.hub.id);
        setTimeout(() => {
            this.pinging = false;
        }, 10000);
      },
      pingCB() {
        return;
      },
      refreshHubs() {
        SocketioService.getHubs();
        this.refresh = true;
        setTimeout(() => {
          this.refresh = false;
        }, 10000);
      },
      diconnect() {
        let id = this.hub.id + '';
        let name = this.hub.name + '';
        this.hubs.unshift({
          'id': id,
          'name': name
        });
        this.hub.isConnected = false;
        this.hub.name = '';
        this.hub.id = '';
      },
      selectOption(name, id) {
        this.hub.name = name;
        this.hub.id = id;
        this.closeDropdown();
      },
      closeDropdown() {
        this.focused = false;
      },
      toggleDropdown() {
        this.focused = !this.focused;
      },
      connect() {
        SocketioService.setupSocketConnection();
        SocketioService.subscribeToHubs(this.updateHubs);
        SocketioService.subscribeToPins(this.updatePins);
      },
      updateHubs(hubs) {
        this.hubs = [];
        let hubFound = false;
        Object.entries(hubs).forEach(entry => {
          let [key, value] = entry;
          if (key == this.hub.id) {
            hubFound = true;
          }
          this.hubs.push({name: value, id: key});
        });
        if (!hubFound) {
          this.hub.isConnected = false;
          this.hub.name = '';
          this.hub.id = '';
        }
        this.refresh = false;
      },
      updatePins(data) {
        this.pins = [];
        if (this.hub.id == data.id) {
          console.log('hi');
          Object.entries(data.pins).forEach(entry => {
            let [key, value] = entry;
            this.pins.push({state: value, id: key});
          });
          console.log(this.pins);
          this.hub.isConnected = true;
          this.pinging = false;
          this.updateSync();
        }
      },
      setPin(pin) {
        this.pinging = true;
        SocketioService.setPin(this.hub.id, pin.id, pin.state);
        setTimeout(() => {
            this.pinging = false;
        }, 10000);
      },
      updateSync() {
        let ts = Date.now();
        let date_ob = new Date(ts);
        // date
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        // time
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        // format datetime
        this.lastSyncTime = `${month}-${date}-${year} at ${hours}:${minutes}:${seconds}`;

      }
    }
  }
</script>

<style scoped>

.logo {
  display: block;
  margin: 0 auto 2rem;
  justify-self: flex-start;
}

header {
  width: 100%;
  height: fit-content;
  line-height: 1.5;
  padding-bottom: 2rem;
  border-bottom: solid 1px var(--ms-c-gray-light);
  display: flex;
  flex-direction: column;
}

main {
  width: 100%;
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
}

.refreshHub {
  position: absolute;
  left: calc(100% - 37px);
  top: 5px;
  z-index: 2;
}

.refreshHub:hover {
  background-color: var(--ms-c-blue-inv) !important;
}

.search-bar {
  display: inline-flex;
  height: 32px;
  width: 100%;
}

.dropButton {
  z-index: 3;
}

.dropLoad {
  position: absolute;
  width: 100%;
  height: 100%;
}

.disconnect {
  height: 32px;
  width: 100%;
  font-weight: bold;
  color: var(--ms-c-gray);
}

.disconnect:hover {
  color: var(--ms-c-gray-dark);
}

.search-bar input {
  width: 100%;
  padding-right: 32px;
  margin-right: -32px;
  text-align: left;
}

#hubs {
  margin-top: 2px;
  position: absolute;
  top: 32px;
  width: 100%;
  overflow: auto;
  height: 0px;
  transition: .4s;
  z-index: 3;
}

#hubsbg {
  position: fixed;
  background-color: var(--ms-c-gray-mid-tl);
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  transition: .4s;
  visibility: hidden;
}

#hubsbg.dropdown {
  visibility: visible;
}

#hubs.dropdown {
  position: absolute;
  top: 32px;
  width: 100%;
  overflow: auto;
  background-color: var(--color-background-soft);
  min-height: 42px;
  height: fit-content;
  max-height: 160px;
  border-radius: 0 0 4px  4px;
  transition: .4s;
}

.search-bar img {
  width: 32px;
  padding-left: 4px;
  padding-right: 4px;
  transition: .2s;
}

.search-bar img:hover {
  background-color: var(--ms-c-blue-tl);
}

.greeting {
  margin: 1rem;
}

.connectButton {
  z-index: 3;
}

.center {
  text-align: center;
  justify-self: center;
}

.bottom {
  width:100%;
  height: 100%;
}

.hubLoader {
  position: absolute;
  height: 100%;
  width: 100%;
}

@media (min-width: 1024px) {
  header {
    padding-right: 2rem;
    width: 40%;
    height: 100%;
    border-bottom: none;
    border-right: solid 1px var(--color-background-mute);
    justify-content: center;
    padding-bottom: 4rem;
  }
  main {
    flex-direction: row;
  }
}
</style>
