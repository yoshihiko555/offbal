<template>
    <div id='karma'>
        <vs-navbar
            v-model="active"
            square
        >
            <template #left>
                <vs-navbar-item
                    v-for="(menu, i) in menus"
                    :key="i"
                    :active='active === menu.name'
                    :id='menu.name'
                    @click="changeView(menu.component)"
                >
                    {{ menu.title }}
                </vs-navbar-item>
            </template>
        </vs-navbar>
        <v-container class="mt-6 pa-0">
            <v-row>
                <v-col cols='12' class="pa-0">
                    <component :is='view'/>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    import KarmaResult from '@/components/common/KarmaResult'
    import Graph from '@/components/common/Graph'
    import Schedule from '@/components/common/Schedule'

    export default {
        name: 'Karma',
        components: {
            KarmaResult,
            Graph,
            Schedule,
        },
        data () {
            return {
                active: 'karmaResult',
                view: KarmaResult,
                menus: [
                    {
                        name: 'karmaResult',
                        title: 'カルマ',
                        component: KarmaResult,
                    },
                    {
                        name: 'graph',
                        title: 'グラフ',
                        component: Graph,
                    },
                    {
                        name: 'schedule',
                        title: 'スケジュール',
                        component: Schedule,
                    },
                ]
            }
        },
        methods: {
            changeView (view) {
                this.view = view
            }
        },
    }
</script>

<style lang="scss" scoped>
</style>
