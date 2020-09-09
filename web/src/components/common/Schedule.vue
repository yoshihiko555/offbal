<template>
    <v-container fluid class='pa-0'>
        <v-row height='100%'>
            <v-col cols='12'>
                <v-calendar/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'Schedule',
        components: {
        },
        data: () => ({
        }),
        created () {
        },
    	computed: {
    	},
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
    .container::v-deep {
        height: calc(100vh - 170px);

        .row {
            height: 100%;
        }
    }
</style>
