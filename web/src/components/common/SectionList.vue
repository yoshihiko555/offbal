<template>
    <v-expansion-panels
        flat
        tile
        hover
        accordion
    >
        <v-expansion-panel
            v-for="section in detailCategory.sections"
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
                <TaskList
                    :tasks=section.tasks
                />
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
    import TaskList from '@/components/common/TaskList'
    import SectionMenuBtn from '@/components/parts/SectionMenuBtn'
    import { mapGetters } from 'vuex'

    export default {
        name: 'SectionList',
        components: {
            SectionMenuBtn,
            TaskList,
        },
        data: () => ({
        }),
    	computed: {
    		...mapGetters([
                'detailCategory',
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
