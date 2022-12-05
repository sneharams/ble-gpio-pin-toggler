<script>
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
        props: ['isLoading', 'loaderType'],
        data() {
            return {
                fullPage: false,
            }
        },
        components: {
            Loading
        },
        watching: {

        },
        methods: {
            onCancel() {
                console.log('User cancelled the loader.')
            }
        }
    }
</script>

<template>
    <div id="loader" :class="{isLoading: isLoading}" class="vld-parent loader">
        <loading   
                :active="isLoading"
                :on-cancel="onCancel"
                color="#50e6ff"
                backgroundColor="#50e6ff33"
                transition="fade"
                blur="2px"
                :loader="loaderType"
                :is-full-page="fullPage"/>
    </div>
</template>

<style scoped>
    .loader {
        height: 100%;
        width: 100%;
        transition: 2s;
    }

    /* @media (min-width: 1024px) {
        .loader {
            width: 100%;
            transition: 2s;
    }
    } */
    

    #loader {
        /* opacity: 0; */
        transition: 1s;
    }

    #loader.isLoading {
        opacity: 1;
    }
</style>