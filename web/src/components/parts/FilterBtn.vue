<template>
    <v-menu
        offset-y
        transition="slide-y-transition"
    >
        <template #activator="{ attrs, on }">
            <vs-button
                icon
                relief
                v-bind="attrs"
                v-on="on"
            >
                <i class='bx bx-filter' ></i>
            </vs-button>
        </template>
        <v-card>
            フィルター設定
        </v-card>
    </v-menu>
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
