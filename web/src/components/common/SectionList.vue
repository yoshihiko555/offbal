<template>
    <v-expansion-panels
        flat
        tile
        hover
        accordion
    >
        <v-expansion-panel
            v-for="section in detailProject.sections"
            v-show="!section.archived"
            :key="section.id"
        >
            <v-expansion-panel-header hide-actions>
                <v-icon>mdi-chevron-right</v-icon>
                {{ section.name }}
                <v-spacer/>
                <SectionMenuBtn
                    :section='section'
                />
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-list>
                    <v-list-item v-for="task in tasks" :key="task.id">
                        <v-list-item-title>{{ task.name }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
    import SectionMenuBtn from '@/components/parts/SectionMenuBtn'
    import { mapGetters } from 'vuex'

    export default {
        name: 'SectionList',
        components: {
            SectionMenuBtn,
        },
        data: () => ({
            // テスト用
            tasks: [
                {
                    id: 1,
                    name: 'task1'
                },
                {
                    id: 2,
                    name: 'task2'
                },
                {
                    id: 3,
                    name: 'task3'
                },
            ]
        }),
    	computed: {
    		...mapGetters([
                'detailProject',
    		])
    	},
        methods: {
        },
    }
</script>

<style lang="scss" scoped>
    .v-expansion-panel-header > *:not(.v-expansion-panel-header__icon) {
        flex: initial;
    }
    .v-expansion-panel-header--active::v-deep {
        &>.v-icon {
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
        }
    }
</style>