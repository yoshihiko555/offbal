<template>
    <vs-button
        icon
        relief
        @click='sort'
    >
        <i class='bx bx-slider-alt'></i>
    </vs-button>
</template>

<script>
    export default {
        name: 'SortBtn',
        data: () => ({
        }),
        methods: {
        	sort () {
        		console.log('sort')
        	}
        }
    }
</script>

<style lang='scss'>
</style>
