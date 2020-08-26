<template>
    <vs-button
        icon
        relief
        @click='filter'
    >
        <i class='bx bx-filter' ></i>
    </vs-button>
</template>

<script>
    export default {
        name: 'FilterBtn',
        data: () => ({
        }),
        methods: {
            filter () {
                console.log('filter')
            }
        }
    }
</script>

<style lang='scss'>
</style>