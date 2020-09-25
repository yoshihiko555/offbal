<template>
    <v-container>
        <v-row>
            <v-col cols='12'>
                <h4>テーマ</h4>
            </v-col>
            <v-col cols='4'>
                <vs-card>
                    <template #title>
                        <h3>Default</h3>
                    </template>
                    <template #img>
                        <img src="@/assets/img/family.jpg" alt="">
                    </template>
                    <template #text>
                        <p></p>
                    </template>
                </vs-card>
            </v-col>
            <v-col cols='4'>
                <vs-card>
                    <template #title>
                        <h3>Dark</h3>
                    </template>
                    <template #img>
                        <img src="@/assets/img/work.jpg" alt="">
                    </template>
                    <template #text>
                        <p></p>
                    </template>
                </vs-card>
            </v-col>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col cols='12'>
                <vs-button>保存</vs-button>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: 'ThemeSetting',
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
</style>
